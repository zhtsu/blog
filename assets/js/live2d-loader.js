/* ============================================================
   看板娘加载器
   原站 temp/web/live2d/autoload.js 的行为：
     screen.width >= 768 时从 jsdelivr 拉 waifu.css / live2d.min.js /
     waifu-tips.js，再 initWidget({waifuPath, cdnPath})。

   这里的改进：
   1. 资源默认走本地 /live2d/（已 vendor），不必依赖第三方 CDN 可用性；
   2. 阈值来自 params.live2d.minWidth，不再是硬编码 768；
   3. 尊重 prefers-reduced-motion；
   4. 用户可通过浮动按钮关闭，选择记在 localStorage；
   5. 加载失败静默降级，不阻塞页面其它脚本。
   ============================================================ */
(function () {
  'use strict';

  var cfgEl = document.getElementById('live2d-config');
  if (!cfgEl) return;

  var base = cfgEl.dataset.base || '/live2d/';
  var tips = cfgEl.dataset.tips || base + 'waifu-tips.json';
  var modelApi = cfgEl.dataset.modelApi || '';
  var minWidth = parseInt(cfgEl.dataset.minWidth, 10) || 768;
  var STORAGE_KEY = 'live2d-enabled';

  var toggleBtn = document.getElementById('live2d-toggle');
  var loaded = false;

  function userDisabled() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'off';
    } catch (e) {
      return false;
    }
  }

  function setDisabled(off) {
    try {
      if (off) localStorage.setItem(STORAGE_KEY, 'off');
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function loadCSS(href) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = function () {
        resolve(href);
      };
      link.onerror = function () {
        reject(new Error('css failed: ' + href));
      };
      document.head.appendChild(link);
    });
  }

  function loadJS(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function () {
        resolve(src);
      };
      s.onerror = function () {
        reject(new Error('js failed: ' + src));
      };
      document.head.appendChild(s);
    });
  }

  function boot() {
    if (loaded) return;
    loaded = true;

    Promise.all([loadCSS(base + 'waifu.css'), loadJS(base + 'live2d.min.js'), loadJS(base + 'waifu-tips.js')])
      .then(function () {
        if (typeof window.initWidget !== 'function') return;
        var opts = { waifuPath: tips };
        if (modelApi) opts.cdnPath = modelApi;
        window.initWidget(opts);
        // 原站的初始化会把模型元素插到 body，这里补一个标记位
        document.documentElement.setAttribute('data-live2d', 'on');
        if (toggleBtn) toggleBtn.classList.add('active');
      })
      .catch(function () {
        // 静默降级：看板娘加载不出来也不影响阅读
        document.documentElement.setAttribute('data-live2d', 'failed');
      });
  }

  function teardown() {
    var nodes = document.querySelectorAll('#live2dcanvas, .waifu, #waifu');
    Array.prototype.forEach.call(nodes, function (n) {
      n.parentNode && n.parentNode.removeChild(n);
    });
    document.documentElement.setAttribute('data-live2d', 'off');
    if (toggleBtn) toggleBtn.classList.remove('active');
  }

  // ---- 浮动按钮：开 / 关 ----
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var isOn = document.documentElement.getAttribute('data-live2d') === 'on';
      if (isOn) {
        setDisabled(true);
        teardown();
      } else {
        setDisabled(false);
        loaded = false;
        boot();
      }
    });
  }

  // ---- 小屏 / 减少动效：不加载 ----
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.innerWidth < minWidth || reduceMotion || userDisabled()) {
    if (toggleBtn) toggleBtn.hidden = window.innerWidth < minWidth;
    return;
  }

  // 等主内容渲染完再加载，避免和首屏抢带宽
  if (document.readyState === 'complete') {
    window.setTimeout(boot, 600);
  } else {
    window.addEventListener('load', function () {
      window.setTimeout(boot, 600);
    });
  }
})();
