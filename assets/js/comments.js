/* ============================================================
   评论区主题联动
   giscus 渲染在与页面同源的 iframe 里，无法继承 CSS 变量，
   主题只能靠 postMessage 告知。本站有手动明暗切换按钮，
   所以必须跟随 <html data-theme>，否则会出现
   「站点是暗的、评论区是白的」这种割裂。

   为什么要隐藏 iframe 再显示：
   client.js 会先用 data-theme 属性里的主题渲染一次，
   我们要等 postMessage 生效后才让它亮相，
   避免用户看到一次主题闪变（浅色 → 深色）。

   主题名由 partials/comments.html 通过 #comments-theme 传入。
   ============================================================ */
(function () {
  'use strict';

  var cfg = document.getElementById('comments-theme');
  if (!cfg) return;

  var light = cfg.dataset.light || 'light';
  var dark = cfg.dataset.dark || 'dark';
  var frame = null;
  var revealed = false;

  function siteTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? dark : light;
  }

  function push() {
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: siteTheme() } } },
      'https://giscus.app'
    );
    if (!revealed) {
      revealed = true;
      // 让 postMessage 先落地，再显示，避免看到主题切换的那一帧
      window.requestAnimationFrame(function () {
        frame.style.visibility = 'visible';
        frame.style.minHeight = '';
      });
    }
  }

  function findFrame() {
    var f = document.querySelector('iframe.giscus-frame');
    if (!f || f === frame) return;
    frame = f;
    // 脚本加载期先藏起来，等主题设对了再显示
    frame.style.visibility = 'hidden';
    push();
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

  // 兜底：脚本比 iframe 先就绪时轮询若干次
  var tries = 0;
  var timer = window.setInterval(function () {
    findFrame();
    if ((frame && revealed) || ++tries > 24) window.clearInterval(timer);
  }, 400);
})();
