/* =========================================================
   陕西美食 · 三秦味道
   脚本文件：js/main.js
   功能：① 分类筛选 ② 详情弹窗 ③ 添加美食 ④ 导航高亮
   说明：纯原生 JS，不依赖任何框架，双击 index.html 即可运行。
   ========================================================= */
(function () {
  'use strict';

  var CAT_LABELS = { mian: '面食', mo: '馍类', snack: '小吃' };

  // 访客添加的菜存本机浏览器里，刷新后还在
  var STORAGE_KEY = 'shaanxi-food-user-dishes-v1';

  function loadUserDishes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (err) {
      return [];
    }
  }

  function saveUserDishes() {
    var items = getCards()
      .filter(function (card) { return card.dataset.user === '1'; })
      .map(function (card) {
        return {
          name: card.dataset.name,
          cat: card.dataset.cat,
          desc: card.dataset.desc,
          meta: card.querySelector('.dish-meta').textContent,
          img: card.querySelector('.dish-photo').src
        };
      });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('本地保存失败，可能是图片太大：', err);
    }
  }

  // 把图片压到最长边 900px 的 JPEG，避免撑爆 localStorage
  function readImage(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var scale = Math.min(1, 900 / Math.max(img.width, img.height));
          var canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

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
    card.dataset.name = dish.name;
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

    // 自己加的卡片可以删掉
    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'dish-del';
    del.setAttribute('aria-label', '删除「' + dish.name + '」');
    del.textContent = '×';
    del.addEventListener('click', function (event) {
      event.stopPropagation();
      card.remove();
      saveUserDishes();
      filterDishes(currentFilter);
    });
    card.appendChild(del);

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

    readImage(file).then(function (dataUrl) {
      var card = createUserCard({
        name: name,
        cat: addCat.value,
        desc: addDesc.value.trim(),
        meta: addMeta.value.trim() || '访客添加',
        img: dataUrl
      });

      grid.appendChild(card);
      saveUserDishes();

      addDialog.close();
      filterDishes('all');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.querySelector('.dish-open').focus();
    }).catch(function () {
      alert('图片读不出来，换一张试试（建议 JPG / PNG）。');
    });
  });

  // 页面打开时，把之前添加过的卡片放回网格
  loadUserDishes().forEach(function (dish) {
    grid.appendChild(createUserCard(dish));
  });
  filterDishes('all');

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

  /* ---------- ⑤ 注册 Service Worker（离线可用 / 添加到主屏幕） ---------- */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {
        // file:// 或隐私模式下注册失败，不影响页面本身
      });
    });
  }

  /* ---------- ⑥ 安装到手机 / 桌面 ---------- */
  var installBtn = document.getElementById('installBtn');
  var installDialog = document.getElementById('installDialog');
  var deferredPrompt = null;

  // 支持一键安装的浏览器会抛这个事件，先存下来，点按钮时再弹系统框
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredPrompt = event;
  });

  var ua = navigator.userAgent;
  var isIOS = /iphone|ipad|ipod/i.test(ua);
  var isWeChat = /micromessenger/i.test(ua);
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                     window.navigator.standalone === true;

  // 已经装成 App 了，就不必再显示按钮
  if (isStandalone) installBtn.hidden = true;

  // 点到按钮但没法一键安装时，按平台给对应步骤
  function openInstallHelp() {
    installDialog.querySelectorAll('[data-platform]').forEach(function (block) {
      block.hidden = true;
    });

    var key = isWeChat ? 'wechat' : (isIOS ? 'ios' : 'android');
    var target = installDialog.querySelector('[data-platform="' + key + '"]');
    if (target) target.hidden = false;

    installDialog.showModal();
  }

  installBtn.addEventListener('click', function () {
    if (isWeChat || !deferredPrompt) {
      openInstallHelp();
      return;
    }

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function () {
      deferredPrompt = null;
      installBtn.hidden = true;
    });
  });

  document.querySelectorAll('[data-close="install"]').forEach(function (btn) {
    btn.addEventListener('click', function () { installDialog.close(); });
  });

  installDialog.addEventListener('click', function (event) {
    if (event.target === installDialog) installDialog.close();
  });

  window.addEventListener('appinstalled', function () {
    installBtn.hidden = true;
  });
})();
