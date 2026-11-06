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
})();
