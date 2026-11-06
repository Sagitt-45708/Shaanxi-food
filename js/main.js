/* =========================================================
   陕西美食 · 三秦味道
   脚本文件：js/main.js
   功能：① 分类筛选 ② 详情弹窗 ③ 添加美食 ④ 导航高亮
   说明：纯原生 JS，不依赖任何框架，双击 index.html 即可运行。
   ========================================================= */
(function () {
  'use strict';

  var CAT_LABELS = { mian: '面食', mo: '馍类', snack: '小吃' };

  // 每次现查：因为用户可以随时往网格里加卡片
  function getCards() {
    return Array.prototype.slice.call(document.querySelectorAll('.dish-card'));
  }

  /* ---------- ① 分类筛选 ---------- */
  var filterButtons = document.querySelectorAll('.filter');
  var countLabel = document.getElementById('filterCount');
  var currentFilter = 'all';

  function filterDishes(category) {
    currentFilter = category;
    var shown = 0;

    getCards().forEach(function (card) {
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
  var grid = document.getElementById('dishGrid');

  // 事件委托：静态卡片和后来添加的卡片都能点开
  grid.addEventListener('click', function (event) {
    var trigger = event.target.closest('.dish-open');
    if (!trigger) return;

    var card = trigger.closest('.dish-card');
    var template = card.querySelector('.dish-detail');

    dialogTitle.textContent = trigger.dataset.name || trigger.textContent;
    dialogBody.innerHTML = '';

    if (template) {
      dialogBody.appendChild(template.content.cloneNode(true));
    } else {
      var lead = document.createElement('p');
      lead.className = 'detail-lead';
      lead.textContent = card.dataset.desc || '这道菜还没有详细介绍。';
      dialogBody.appendChild(lead);

      var tip = document.createElement('p');
      tip.className = 'detail-tip';
      tip.textContent = '这张卡片是后来添加的，刷新页面后仍然保留（保存在本机浏览器里）。';
      dialogBody.appendChild(tip);
    }

    dialog.showModal();
  });

  dialog.querySelector('.dialog-close').addEventListener('click', function () {
    dialog.close();
  });

  // 点击遮罩关闭：只有点在 dialog 本身（而不是内容区）时才算
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });

  /* ---------- ③ 添加美食 ---------- */
  var addDialog = document.getElementById('addDialog');
  var addForm = document.getElementById('addForm');
  var addName = document.getElementById('addName');
  var addCat = document.getElementById('addCat');
  var addDesc = document.getElementById('addDesc');
  var addMeta = document.getElementById('addMeta');
  var addFile = document.getElementById('addFile');
  var addPreview = document.getElementById('addPreview');

  // 根据数据生成一张卡片，结构跟静态卡片保持一致
  function createUserCard(dish) {
    var card = document.createElement('article');
    card.className = 'dish-card';
    card.dataset.cat = dish.cat;
    card.dataset.user = '1';
    card.dataset.desc = dish.desc || '';

    var img = document.createElement('img');
    img.className = 'dish-photo';
    img.src = dish.img;
    img.alt = dish.name;
    card.appendChild(img);

    var chip = document.createElement('span');
    chip.className = 'dish-chip';
    chip.textContent = CAT_LABELS[dish.cat] || '其他';
    card.appendChild(chip);

    var h3 = document.createElement('h3');
    h3.className = 'dish-name';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dish-open';
    btn.dataset.name = dish.name;
    btn.textContent = dish.name;
    h3.appendChild(btn);
    card.appendChild(h3);

    var meta = document.createElement('p');
    meta.className = 'dish-meta';
    meta.textContent = dish.meta || '访客添加';
    card.appendChild(meta);

    var summary = document.createElement('p');
    summary.className = 'dish-summary';
    summary.textContent = dish.desc || '';
    card.appendChild(summary);

    var arrow = document.createElement('span');
    arrow.className = 'dish-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    card.appendChild(arrow);

    return card;
  }

  document.getElementById('openAdd').addEventListener('click', function () {
    addForm.reset();
    addPreview.hidden = true;
    addPreview.removeAttribute('src');
    addDialog.showModal();
    addName.focus();
  });

  document.querySelectorAll('[data-close="add"]').forEach(function (btn) {
    btn.addEventListener('click', function () { addDialog.close(); });
  });

  addDialog.addEventListener('click', function (event) {
    if (event.target === addDialog) addDialog.close();
  });

  // 选完图片先给个预览
  addFile.addEventListener('change', function () {
    var file = addFile.files && addFile.files[0];
    if (!file) return;
    addPreview.src = URL.createObjectURL(file);
    addPreview.hidden = false;
  });

  addForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var file = addFile.files[0];
    var name = addName.value.trim();

    if (!file) { addFile.focus(); return; }
    if (!name) { addName.focus(); return; }

    var card = createUserCard({
      name: name,
      cat: addCat.value,
      desc: addDesc.value.trim(),
      meta: addMeta.value.trim() || '访客添加',
      img: URL.createObjectURL(file)
    });

    grid.appendChild(card);
    addDialog.close();
    filterDishes('all');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.querySelector('.dish-open').focus();
  });

  /* ---------- ④ 滚动时高亮当前导航 ---------- */
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
