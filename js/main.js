/* =========================================================
   Flavors of Sanqin · Shaanxi Food
   Script: js/main.js
   Features: ① filter ② dish dialog ③ add a dish ④ nav highlight
             ⑤ service worker ⑥ install prompt
   Vanilla JS only — no framework, no build step.
   ========================================================= */
(function () {
  'use strict';

  var CAT_LABELS = { mian: 'Noodles', mo: 'Buns', snack: 'Snacks' };

  // Dishes added by a visitor live in this browser's storage
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
      console.warn('Could not save locally — the image may be too large:', err);
    }
  }

  // Downscale to a 900px JPEG so it fits inside localStorage
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

  // Query every time — visitors can add cards at any moment
  function getCards() {
    return Array.prototype.slice.call(document.querySelectorAll('.dish-card'));
  }

  /* ---------- ① Filter ---------- */
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

    // Sync the pressed state for screen readers
    filterButtons.forEach(function (btn) {
      var active = btn.dataset.filter === category;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    countLabel.textContent = shown + (shown === 1 ? ' dish' : ' dishes');
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterDishes(btn.dataset.filter);
    });
  });

  /* ---------- ② Dish dialog ---------- */
  var dialog = document.getElementById('dishDialog');
  var dialogTitle = document.getElementById('dishDialogTitle');
  var dialogBody = document.getElementById('dishDialogBody');
  var grid = document.getElementById('dishGrid');

  // Event delegation: static cards and visitor-added cards behave the same
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
      lead.textContent = card.dataset.desc || 'No description for this dish yet.';
      dialogBody.appendChild(lead);

      var tip = document.createElement('p');
      tip.className = 'detail-tip';
      tip.textContent = 'This card was added on this device and is saved in this browser.';
      dialogBody.appendChild(tip);
    }

    dialog.showModal();
  });

  dialog.querySelector('.dialog-close').addEventListener('click', function () {
    dialog.close();
  });

  // Close on backdrop click only — clicks inside the dialog bubble up too
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });

  /* ---------- ③ Add a dish ---------- */
  var addDialog = document.getElementById('addDialog');
  var addForm = document.getElementById('addForm');
  var addName = document.getElementById('addName');
  var addCat = document.getElementById('addCat');
  var addDesc = document.getElementById('addDesc');
  var addMeta = document.getElementById('addMeta');
  var addFile = document.getElementById('addFile');
  var addPreview = document.getElementById('addPreview');

  // Build a card with the same markup as the static ones
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
    chip.textContent = CAT_LABELS[dish.cat] || 'Other';
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
    meta.textContent = dish.meta || 'Added by a visitor';
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

    // A card you added yourself can be removed again
    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'dish-del';
    del.setAttribute('aria-label', 'Remove ' + dish.name);
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

  // Preview the chosen photo before uploading
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
        meta: addMeta.value.trim() || 'Added by a visitor',
        img: dataUrl
      });

      grid.appendChild(card);
      saveUserDishes();

      addDialog.close();
      filterDishes('all');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.querySelector('.dish-open').focus();
    }).catch(function () {
      alert('That image could not be read. Try a JPG or PNG.');
    });
  });

  // Put any previously added cards back into the grid on load
  loadUserDishes().forEach(function (dish) {
    grid.appendChild(createUserCard(dish));
  });
  filterDishes('all');

  /* ---------- ④ Highlight the nav item in view ---------- */
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

  /* ---------- ⑤ Service worker (offline / installable) ---------- */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {
        // file:// or private mode — the page itself still works
      });
    });
  }

  /* ---------- ⑥ Install on phone / desktop ---------- */
  var installBtn = document.getElementById('installBtn');
  var installDialog = document.getElementById('installDialog');
  var deferredPrompt = null;

  // Browsers that support one-tap install fire this; stash it for the button
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredPrompt = event;
  });

  var ua = navigator.userAgent;
  var isIOS = /iphone|ipad|ipod/i.test(ua);
  var isWeChat = /micromessenger/i.test(ua);
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                     window.navigator.standalone === true;

  // Already installed — no need for the button
  if (isStandalone) installBtn.hidden = true;

  // No one-tap install available: show steps for the right platform
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
