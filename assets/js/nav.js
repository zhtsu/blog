/* ============================================================
   导航交互
   - 移动端汉堡菜单开合
   - 滚动后导航收拢（阴影与底色加深，提示已离开页首）
   - Esc 关闭 / 视口变化复位
   - 回到顶部按钮的显隐
   ============================================================ */
(function () {
  'use strict';

  var nav = document.querySelector('.site-nav');
  var toggle = document.getElementById('nav-toggle');
  var collapse = document.getElementById('top-nav');

  // ---- 汉堡菜单 ----
  if (toggle && collapse) {
    toggle.addEventListener('click', function () {
      var open = collapse.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '收起菜单' : '展开菜单');
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (toggle && collapse && collapse.classList.contains('open')) {
      collapse.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  // 视口放大回桌面尺寸时，清掉移动端残留状态
  var mq = window.matchMedia('(max-width: 768px)');
  var reset = function () {
    if (!mq.matches && collapse) {
      collapse.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  };
  if (mq.addEventListener) mq.addEventListener('change', reset);
  else if (mq.addListener) mq.addListener(reset);

  // ---- 滚动状态 + 回到顶部 ----
  var topBtn = document.getElementById('back-to-top');
  var ticking = false;

  function onScrollFrame() {
    ticking = false;
    var y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 8);
    if (topBtn) topBtn.hidden = y < 320;
  }

  function requestScrollCheck() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScrollFrame);
  }

  window.addEventListener('scroll', requestScrollCheck, { passive: true });
  onScrollFrame();

  if (topBtn) {
    topBtn.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
})();
