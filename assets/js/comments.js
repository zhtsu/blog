/* ============================================================
   评论区主题联动
   giscus 渲染在与页面同源的 iframe 里，无法直接继承 CSS 变量，
   主题要靠 postMessage 告知；站点切换明暗时必须同步，
   否则会出现「站点是暗的、评论区是白的」这种割裂。

   主题名由 partials/comments.html 通过 #comments-theme 传入。
   ============================================================ */
(function () {
  'use strict';

  var cfg = document.getElementById('comments-theme');
  if (!cfg) return;

  var light = cfg.dataset.light || 'light';
  var dark = cfg.dataset.dark || 'dark';
  var frame = null;

  function siteTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? dark : light;
  }

  function push() {
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: siteTheme() } } },
      'https://giscus.app'
    );
  }

  function findFrame() {
    // giscus 自己插入 iframe，加 loading="lazy" 后可能晚于本脚本出现
    var f = document.querySelector('iframe.giscus-frame');
    if (f) {
      frame = f;
      push();
    }
  }

  // giscus 加载完成后会广播一条 message，用它作为「已就绪」信号
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://giscus.app') return;
    if (!(e.data && e.data.giscus)) return;
    findFrame();
    push();
  });

  // 站点主题变化时同步（theme.js 改的是 <html data-theme>）
  var root = document.documentElement;
  if (window.MutationObserver) {
    new MutationObserver(push).observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  // 兜底：脚本比 iframe 先就绪时轮询几次
  var tries = 0;
  var timer = window.setInterval(function () {
    findFrame();
    if (frame || ++tries > 20) window.clearInterval(timer);
  }, 500);
})();
