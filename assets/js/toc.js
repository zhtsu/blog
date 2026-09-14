/* ============================================================
   正文目录：滚动高亮 + 折叠（扩展功能）
   依赖 Hugo 的 .TableOfContents（layouts/partials/toc.html）
   ============================================================ */
(function () {
  'use strict';

  var body = document.getElementById('toc-body');
  var toggle = document.getElementById('toc-toggle');
  var card = document.querySelector('.toc-card');
  if (!body || !card) return;

  var links = Array.prototype.slice.call(body.querySelectorAll('a[href^="#"]'));
  if (!links.length) {
    card.parentNode && card.parentNode.removeChild(card);
    return;
  }

  // ---- 折叠 ----
  if (toggle) {
    toggle.addEventListener('click', function () {
      var collapsed = body.classList.toggle('collapsed');
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggle.textContent = collapsed ? '展开' : '收起';
    });
  }

  // ---- 滚动高亮 ----
  var targets = links
    .map(function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      var el = document.getElementById(id);
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  if (!targets.length) return;

  var ticking = false;

  function update() {
    ticking = false;
    var offset = 90; // 固定导航栏高度 + 余量
    var active = targets[0];

    for (var i = 0; i < targets.length; i++) {
      if (targets[i].el.getBoundingClientRect().top - offset <= 0) active = targets[i];
      else break;
    }

    targets.forEach(function (t) {
      t.link.classList.toggle('active', t === active);
    });
  }

  window.addEventListener(
    'scroll',
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    },
    { passive: true }
  );

  update();
})();
