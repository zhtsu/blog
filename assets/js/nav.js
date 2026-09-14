/* ============================================================
   导航交互（扩展功能）
   - 移动端汉堡菜单开合
   - 「其他」下拉菜单
   - 点击外部 / Esc 关闭
   - 窗口放大回桌面尺寸时复位
   - 回到顶部按钮的显隐
   ============================================================ */
(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var collapse = document.getElementById('top-nav');

  if (toggle && collapse) {
    toggle.addEventListener('click', function () {
      var open = collapse.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '收起菜单' : '展开菜单');
    });
  }

  // ---- 下拉菜单 ----
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll('.nav-dropdown'));

  dropdowns.forEach(function (dd) {
    var trigger = dd.querySelector('.dropdown-toggle');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !dd.classList.contains('open');
      closeAllDropdowns();
      dd.classList.toggle('open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  function closeAllDropdowns() {
    dropdowns.forEach(function (dd) {
      dd.classList.remove('open');
      var t = dd.querySelector('.dropdown-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.nav-dropdown')) closeAllDropdowns();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeAllDropdowns();
    if (toggle && collapse && collapse.classList.contains('open')) {
      collapse.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  // 视口放大回桌面尺寸时，清掉移动端残留状态
  var mq = window.matchMedia('(max-width: 768px)');
  var reset = function () {
    if (!mq.matches) {
      closeAllDropdowns();
      if (collapse) collapse.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  };
  if (mq.addEventListener) mq.addEventListener('change', reset);
  else if (mq.addListener) mq.addListener(reset);

  // ---- 回到顶部 ----
  var topBtn = document.getElementById('back-to-top');
  if (topBtn) {
    var onScroll = function () {
      topBtn.hidden = window.scrollY < 320;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
