/* ============================================================
   全文搜索（扩展功能）
   原站搜索框是死表单，没有任何后端。
   这里改用 Hugo 构建期生成的 /search.json 索引，纯前端检索：
   - 无需第三方服务、无网络请求依赖
   - 标题命中权重最高，其次标签/分类，最后正文
   - 支持多关键词（空格分隔，全部命中才算匹配）
   ============================================================ */
(function () {
  'use strict';

  var cfg = window.__BLOG__ || {};
  var form = document.getElementById('search-form');
  var input = document.getElementById('search-input');
  var status = document.getElementById('search-status');
  var results = document.getElementById('search-results');
  if (!form || !input || !results) return;

  var index = null;
  var loading = false;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function highlight(text, terms) {
    var out = esc(text);
    terms.forEach(function (t) {
      if (!t) return;
      var safe = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out.replace(new RegExp('(' + safe + ')', 'gi'), '<mark>$1</mark>');
    });
    return out;
  }

  function load() {
    if (index || loading) return Promise.resolve(index);
    loading = true;
    return fetch(cfg.searchIndex || '/search.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        index = data;
        return index;
      })
      .catch(function (err) {
        setStatus('搜索索引加载失败：' + err.message);
        index = [];
        return index;
      })
      .finally(function () {
        loading = false;
      });
  }

  function setStatus(msg) {
    if (status) status.textContent = msg;
  }

  function score(item, terms) {
    var title = (item.title || '').toLowerCase();
    var tags = (item.tags || []).join(' ').toLowerCase();
    var cats = (item.categories || []).join(' ').toLowerCase();
    var body = (item.content || '').toLowerCase();
    var total = 0;

    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (!t) continue;
      if (title.indexOf(t) === -1 && tags.indexOf(t) === -1 && cats.indexOf(t) === -1 && body.indexOf(t) === -1) {
        return -1; // 有词没命中，整体淘汰
      }
      if (title.indexOf(t) !== -1) total += 10;
      if (tags.indexOf(t) !== -1) total += 4;
      if (cats.indexOf(t) !== -1) total += 2;
      if (body.indexOf(t) !== -1) total += 1;
    }
    return total;
  }

  function render(items, terms) {
    if (!items.length) {
      results.innerHTML = '';
      setStatus('没有找到匹配「' + terms.join(' ') + '」的文章。');
      return;
    }

    var html = items
      .map(function (it) {
        var cat = (it.categories || []).length ? it.categories[0] : '';
        var tags = (it.tags || [])
          .slice(0, 3)
          .map(function (t) {
            return '<span class="tag-chip">' + esc(t) + '</span>';
          })
          .join('');

        return (
          '<article class="post-card search-hit">' +
          '<div class="post-card-body">' +
          '<div class="post-card-top">' +
          (cat ? '<span class="post-card-cat">' + esc(cat) + '</span>' : '') +
          '<time class="post-card-date">' + esc(it.date) + '</time>' +
          '</div>' +
          '<h2 class="post-card-title"><a href="' + esc(it.url) + '">' + highlight(it.title, terms) + '</a></h2>' +
          '<p class="post-card-summary">' + highlight(it.summary || '', terms) + '</p>' +
          '<div class="post-card-foot">' +
          (tags ? '<span class="post-card-tags">' + tags + '</span>' : '') +
          '<span class="post-card-arrow" aria-hidden="true">' +
          '<svg class="icon icon-xs"><use href="#i-chevron-right"></use></svg>' +
          '</span>' +
          '</div>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');

    results.innerHTML = html;
    setStatus('找到 ' + items.length + ' 篇与「' + terms.join(' ') + '」相关的文章。');
  }

  function run(q) {
    var terms = String(q || '')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (!terms.length) {
      results.innerHTML = '';
      setStatus('输入关键词开始搜索，多个关键词用空格分隔。');
      return;
    }

    setStatus('搜索中…');
    load().then(function (data) {
      var scored = (data || [])
        .map(function (it) {
          return { it: it, s: score(it, terms) };
        })
        .filter(function (x) {
          return x.s >= 0;
        })
        .sort(function (a, b) {
          return b.s - a.s;
        });

      render(
        scored.map(function (x) {
          return x.it;
        }),
        terms
      );
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    var url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url.toString());
    run(q);
  });

  // 输入防抖，边打边搜
  var timer = null;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      run(input.value.trim());
    }, 220);
  });

  // 支持从导航栏搜索框跳转过来：/search/?q=xxx
  var initial = new URL(window.location.href).searchParams.get('q');
  if (initial) {
    input.value = initial;
    run(initial);
  } else {
    setStatus('输入关键词开始搜索，多个关键词用空格分隔。');
  }
})();
