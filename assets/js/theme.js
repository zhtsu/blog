/* ============================================================
   暗色模式切换（扩展功能）
   首屏防闪由 baseof.html 里的内联脚本完成，这里只管交互与持久化。
   优先级：localStorage > 系统偏好（auto）
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'color-scheme';
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  if (!btn) return;

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function apply(mode) {
    var dark = mode === 'dark' || (mode === 'auto' && mq.matches);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.title = dark ? '切换到浅色' : '切换到深色';
  }

  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
    apply(next);
  });

  // 用户没手动选过时，跟随系统变化
  var onChange = function () {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    if (!stored || stored === 'auto') apply('auto');
  };

  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);

  apply(current() === 'dark' ? 'dark' : (function () {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    return stored || 'auto';
  })());
})();
