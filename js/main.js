/* =========================================================
   陕西美食 · 三秦味道
   脚本文件：js/main.js
   说明：纯原生 JS，不依赖任何框架，双击 index.html 即可运行。
   ========================================================= */
(function () {
  'use strict';

  /* ---------- ① 分类筛选 ---------- */
  var filterButtons = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('.dish-card');
  var countLabel = document.getElementById('filterCount');

  function filterDishes(category) {
    var shown = 0;

    cards.forEach(function (card) {
      var match = category === 'all' || card.dataset.cat === category;
      card.classList.toggle('is-hide', !match);
      if (match) shown += 1;
    });

    // 更新按钮的选中状态（无障碍：aria-pressed）
    filterButtons.forEach(function (btn) {
      var active = btn.dataset.filter === category;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    countLabel.textContent = '共 ' + shown + ' 道';
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterDishes(btn.dataset.filter);
    });
  });

  /* ---------- ② 详情弹窗 ---------- */
  var dialog = document.getElementById('dishDialog');
  var dialogTitle = document.getElementById('dishDialogTitle');
  var dialogBody = document.getElementById('dishDialogBody');

  document.querySelectorAll('.dish-open').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.dish-card');
      var template = card.querySelector('.dish-detail');

      dialogTitle.textContent = btn.dataset.name;
      dialogBody.innerHTML = '';
      dialogBody.appendChild(template.content.cloneNode(true));
      dialog.showModal();
    });
  });

  // 关闭按钮
  dialog.querySelector('.dialog-close').addEventListener('click', function () {
    dialog.close();
  });

  // 点击遮罩关闭：只有点在 dialog 本身（而不是内容区）时才算
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });

  /* ---------- ③ 滚动时高亮当前导航 ---------- */
  var navLinks = document.querySelectorAll('.site-nav a[data-nav]');
  var sections = ['foods', 'culture', 'plan']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.dataset.nav === entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }
})();
