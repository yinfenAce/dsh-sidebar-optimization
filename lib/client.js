/**
 * Browser half of dsh-sidebar-optimization.
 *
 * 与随包插件 dsh-mobile-adapt 解耦：只做“覆盖层”，不改它的文件。
 *  - 抽屉宽度 68%，点右侧空白关闭（遮罩强制显示，压过内联 display:none）
 *  - 侧栏整列自由上下滚动（解开会话列表的内层滚动）
 *  - 长会话 content-visibility，键盘弹起时只重排可见消息
 *  - visualViewport 跟随键盘，根节点高度即时收缩
 *
 * 总开关跟随 mobile-adapt：它禁用样式时，我们的覆盖也一起失效。
 */
window.__ModuleLoader__.load({
  id: 'dsh-sidebar-optimization',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    exports.name = 'mobile-tweaks';
    exports.inject = [];

    var STYLE_ID = 'dsh-mobile-tweaks-style';

    var CSS = [
      '@media (max-width: 1024px) {',
      '  html #root { height: var(--dsh-mobile-vh, 100dvh) !important; }',

      '  /* 抽屉宽度：压过随包插件的 100% */',
      '  html [class*="frame"][data-sidebar-collapsed] [class*="sidebarCol"],',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] {',
      '    width: var(--dsh-drawer-w, 60%) !important;',
      '    transition: width .18s ease, transform .25s var(--ds-ease-in-out, ease);',
      '  }',

      '  /* 遮罩：随包插件用内联 display:none，只有 !important 能压过它。',
      '     显示出来后，点右侧空白就会走它自带的 toggleSidebar。 */',
      '  body.dsh-mobile-drawer-open .dsh-mobile-backdrop {',
      '    display: block !important;',
      '    -webkit-tap-highlight-color: transparent;',
      '  }',
      '  body.dsh-mobile-drawer-open { overflow: hidden !important; }',

      '  /* 自由整体滚动：root 是唯一滚动容器，会话列表不再单独内滚 */',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] > [class*="root"],',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] > * > [class*="root"] {',
      '    width: 100% !important;',
      '    max-width: none !important;',
      '    height: 100% !important;',
      '    overflow-y: auto !important;',
      '    overscroll-behavior: contain;',
      '    -webkit-overflow-scrolling: touch;',
      '  }',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] [class*="regionArea"],',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] [class*="listArea"],',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] [class*="regionArea"] > [class*="root"],',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] [class*="regionArea"] > * > [class*="root"] {',
      '    flex: 0 0 auto !important;',
      '    min-height: 0 !important;',
      '    overflow: visible !important;',
      '  }',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] [class*="listArea"] > [class*="list"] {',
      '    flex: 0 0 auto !important;',
      '    height: auto !important;',
      '    max-height: none !important;',
      '    overflow-y: visible !important;',
      '    scrollbar-gutter: auto;',
      '  }',

      '  /* 底部设置/脚注吸底：整列很长时也不用滑到底才能点到 */',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] [class*="footArea"] {',
      '    position: sticky;',
      '    bottom: 0;',
      '    z-index: 6;',
      '    background: var(--dsw-specific-sidebar-fill, var(--dsw-alias-bg-base, #fff));',
      '    padding-bottom: env(safe-area-inset-bottom, 0px);',
      '  }',

      '  /* 触屏手感：锁纵向手势、加高面板行、底部安全区 */',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] > [class*="root"] {',
      '    touch-action: pan-y;',
      '    padding-bottom: env(safe-area-inset-bottom, 0px);',
      '  }',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] [class*="panelRow"] {',
      '    min-height: 42px;',
      '  }',

      '  /* 长会话性能：屏幕外的 turn 跳过布局/绘制 */',
      '  [data-chat-turn] {',
      '    content-visibility: auto;',
      '    contain-intrinsic-size: auto 320px;',
      '  }',

      '  /* 主页排版设置卡片 */',
      '  #dsh-tweaks-layout-row { display:flex; align-items:center; justify-content:space-between; width:100%; box-sizing:border-box; padding:10px 8px; margin:0 0 4px; border:none; border-radius:10px; background:transparent; color:var(--dsw-alias-label-secondary,#666); font:inherit; font-size:13px; line-height:18px; text-align:left; }',
      '  #dsh-tweaks-layout-row:active { background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.05)); }',
      '  .dsh-tweaks-overlay { position:fixed; inset:0; z-index:1400; background:rgba(0,0,0,.32); display:flex; align-items:center; justify-content:center; padding:18px; }',
      '  .dsh-tweaks-card { width:min(340px,92vw); height:min(460px,72vh); max-height:72vh; box-sizing:border-box; border-radius:18px; background:var(--dsw-alias-bg-layer-1,#fff); color:var(--dsw-alias-label-primary,#111); box-shadow:0 18px 60px rgba(0,0,0,.35); padding:0; display:flex; flex-direction:column; overflow:hidden; }',
      '  .dsh-tweaks-card-body { padding:0 18px 18px; overflow-y:auto; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; min-height:0; flex:1 1 auto; }',
      '  .dsh-tweaks-card-head { display:flex; align-items:center; justify-content:space-between; padding:16px 18px 6px; flex:none; }',
      '  .dsh-tweaks-card-title { font-size:16px; font-weight:600; }',
      '  .dsh-tweaks-card-value { margin-left:auto; margin-right:10px; font-size:13px; color:var(--dsw-alias-label-secondary,#666); }',
      '  .dsh-tweaks-card-close { border:none; background:transparent; color:var(--dsw-alias-label-secondary,#666); font-size:20px; line-height:1; padding:4px 6px; cursor:pointer; }',
      '  .dsh-tweaks-card-sub { font-size:12px; line-height:18px; color:var(--dsw-alias-label-secondary,#666); margin:2px 0 12px; }',
      '  .dsh-tweaks-preview { position:relative; height:92px; border-radius:12px; overflow:hidden; background:var(--dsw-alias-bg-layer-2,rgba(128,128,128,.1)); margin-bottom:14px; }',
      '  .dsh-tweaks-preview-side { position:absolute; left:0; top:0; bottom:0; width:60%; background:var(--dsw-alias-label-primary,#fff); opacity:.2; transition:width .18s ease; }',
      '  .dsh-tweaks-preview-label { position:absolute; left:10px; bottom:8px; font-size:11px; line-height:14px; color:var(--dsw-alias-label-primary,#111); }',
      '  .dsh-tweaks-chips { display:flex; gap:8px; margin-bottom:14px; }',
      '  .dsh-tweaks-chip { flex:1; height:34px; border-radius:9px; border:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.12)); background:transparent; color:var(--dsw-alias-label-primary,#111); font-size:13px; cursor:pointer; }',
      '  .dsh-tweaks-chip.active { border-color:var(--dsw-alias-label-primary,#111); background:rgba(128,128,128,.18); color:var(--dsw-alias-label-primary,#111); }',
      '  .dsh-tweaks-slider { padding:4px 0 0; }',
      '  .dsh-tweaks-track { position:relative; height:3px; margin:12px 0 8px; border-radius:2px; background:var(--dsw-alias-border-l2,rgba(128,128,128,.28)); touch-action:none; cursor:pointer; }',
      '  .dsh-tweaks-track::before { content:""; position:absolute; left:0; right:0; top:-14px; bottom:-14px; }',
      '  .dsh-tweaks-fill { position:absolute; left:0; top:0; bottom:0; border-radius:2px; background:var(--dsw-alias-label-primary,#fff); opacity:.82; width:60%; }',
      '  .dsh-tweaks-thumb { position:absolute; top:50%; left:60%; width:16px; height:16px; transform:translate(-50%,-50%); border-radius:50%; background:var(--dsw-alias-bg-layer-1,#fff); border:1.5px solid var(--dsw-alias-label-secondary,#888); box-shadow:0 1px 4px rgba(0,0,0,.25); }',
      '  .dsh-tweaks-scale { display:flex; justify-content:space-between; font-size:11px; color:var(--dsw-alias-label-secondary,#666); margin:8px 0 14px; }',
      '  .dsh-tweaks-switch { display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:13px; color:var(--dsw-alias-label-primary,#111); }',
      '  .dsh-tweaks-switch + .dsh-tweaks-switch { margin-top:12px; }',
      '  .dsh-tweaks-field { margin-top:14px; padding-top:12px; border-top:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.18)); }',
      '  .dsh-tweaks-field-row { display:flex; gap:8px; align-items:center; }',
      '  .dsh-tweaks-input { flex:1; min-width:0; height:34px; box-sizing:border-box; padding:0 10px; border-radius:9px; border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.24)); background:transparent; color:var(--dsw-alias-label-primary,#111); font:inherit; font-size:13px; outline:none; }',
      '  .dsh-tweaks-save { height:34px; padding:0 14px; border-radius:9px; border:none; background:var(--dsw-alias-label-primary,#111); color:var(--dsw-alias-bg-layer-1,#fff); font-size:13px; cursor:pointer; }',
      '  .dsh-tweaks-tip { margin-top:6px; font-size:11px; line-height:16px; color:var(--dsw-alias-label-secondary,#666); }',
      '  #dsh-sidebar-balance { display:none; max-width:calc(100% - 48px); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:2px 4px 6px; font-size:12px; line-height:18px; color:var(--dsw-alias-label-secondary,#666); font-variant-numeric:tabular-nums; }',
      '  html.dsh-hide-brand.dsh-show-balance [class*="sidebarCol"] [class*="logoRow"] + #dsh-sidebar-balance { display:block; margin-top:-36px; margin-bottom:8px; font-size:16px; font-weight:600; color:var(--dsw-alias-label-primary,#111); }',
      '  html [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] { z-index:1200 !important; }',
      '  #dsh-mobile-menu.dsh-menu-dragging { transition:none !important; transform:scale(1.08); box-shadow:0 6px 18px rgba(0,0,0,.35); opacity:.92; }',
      '  body.dsh-mobile-drawer-open .dsh-mobile-backdrop { z-index:1190 !important; }',
      '  html.dsh-hide-brand [class*="sidebarCol"] [class*="logoRow"] [class*="brand"],',
      '  html.dsh-hide-brand [class*="sidebarCol"] [class*="logoRow"] [class*="brandIdentity"] { display:none !important; }',
      '  .dsh-tweaks-switch input { -webkit-appearance:none; appearance:none; width:40px; height:22px; border-radius:11px; background:var(--dsw-alias-border-l2,rgba(0,0,0,.2)); position:relative; margin:0; transition:background .18s ease; }',
      '  .dsh-tweaks-switch input::after { content:""; position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:50%; background:var(--dsw-alias-bg-layer-1,#fff); box-shadow:0 1px 2px rgba(0,0,0,.25); transition:transform .18s ease; }',
      '  .dsh-tweaks-switch input:checked { background:var(--dsw-alias-label-primary,#111); }',
      '  .dsh-tweaks-switch input:checked::after { transform:translateX(18px); }',
      '  /* 触屏细节：点按不要焦点蓝框，键盘操作时恢复 */',
      '  html.dsh-touch-mode *:focus,',
      '  html.dsh-touch-mode *:focus-visible { outline: none !important; }',
      '  html.dsh-touch-mode, html.dsh-touch-mode * { -webkit-tap-highlight-color: transparent; }',
      '  #dsh-mobile-menu, .dsh-mobile-backdrop,',
      '  html.dsh-touch-mode button, html.dsh-touch-mode [role="button"] {',
      '    -webkit-user-select: none; user-select: none; -webkit-touch-callout: none;',
      '  }',
      '  #dsh-mobile-menu, .dsh-mobile-backdrop { -webkit-tap-highlight-color: transparent; }',
      '}',
    ].join('\n');

    function maStyle() {
      return document.querySelector('style[data-plugin="@local/dsh-mobile-adapt"]');
    }
    function enabledNow() {
      var s = maStyle();
      if (s) return !s.disabled;
      try { return localStorage.getItem('dsh-mobile-enabled') !== '0'; } catch (e) { return true; }
    }

    exports.apply = function apply(ctx) {
      try {
        if (window.__dshMobileTweaksInstalled) return;
        window.__dshMobileTweaksInstalled = true;

        var style = document.getElementById(STYLE_ID);
        if (style === null) {
          style = document.createElement('style');
          style.id = STYLE_ID;
          (document.head || document.documentElement).appendChild(style);
        }
        style.textContent = CSS;

        // 触屏模式：点按按钮不留焦点蓝框；接上键盘时恢复焦点环
        try {
          document.documentElement.classList.add('dsh-touch-mode');
          document.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'touch' || e.pointerType === 'pen') {
              document.documentElement.classList.add('dsh-touch-mode');
            } else if (e.pointerType === 'mouse') {
              document.documentElement.classList.remove('dsh-touch-mode');
            }
          }, true);
          document.addEventListener('keydown', function () {
            document.documentElement.classList.remove('dsh-touch-mode');
          }, true);
        } catch (e) { /* noop */ }

        // 侧栏宽度：预设 50/60/70，自定义 45–80（太小放不下内容）
        var WIDTHS = [50, 60, 70];
        var WIDTH_MIN = 45, WIDTH_MAX = 80, WIDTH_DEFAULT = 60;
        var WIDTH_VERSION = 'v3';
        function clampWidth(n) {
          n = parseInt(n, 10);
          if (!isFinite(n)) n = WIDTH_DEFAULT;
          return Math.max(WIDTH_MIN, Math.min(WIDTH_MAX, n));
        }
        function storedWidth() {
          try {
            // 旧版本默认 58%，升级后没选过宽度的用户回到 50%
            if (localStorage.getItem('dsh-drawer-width-version') !== WIDTH_VERSION) return WIDTH_DEFAULT;
            return clampWidth(localStorage.getItem('dsh-mobile-drawer-width'));
          } catch (e) { return WIDTH_DEFAULT; }
        }
        function applyWidth(w) {
          w = clampWidth(w);
          try { document.documentElement.style.setProperty('--dsh-drawer-w', w + '%'); } catch (e) { /* noop */ }
          try { localStorage.setItem('dsh-mobile-drawer-width', String(w)); } catch (e) { /* noop */ }
          try { localStorage.setItem('dsh-drawer-width-version', WIDTH_VERSION); } catch (e) { /* noop */ }
        }
        function toast(text) {
          try {
            var el = document.getElementById('dsh-tweaks-toast');
            if (el === null) {
              el = document.createElement('div');
              el.id = 'dsh-tweaks-toast';
              el.style.cssText = 'position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 96px);transform:translateX(-50%);z-index:1300;padding:8px 14px;border-radius:10px;font-size:13px;line-height:18px;color:#fff;background:rgba(0,0,0,.78);pointer-events:none;opacity:0;transition:opacity .18s ease';
              document.body.appendChild(el);
            }
            el.textContent = text;
            el.style.opacity = '1';
            clearTimeout(el.__t);
            el.__t = setTimeout(function () { el.style.opacity = '0'; }, 1400);
          } catch (e) { /* noop */ }
        }
        applyWidth(storedWidth());
        applyBrandPref();
        setInterval(installBalance, 1500);
        installBalance();
        setTimeout(refreshBalance, 800);
        watchBalanceOpen();
        setInterval(function () {
          var f = document.querySelector('[class*="frame"]');
          if (!f) return;
          var open = !f.hasAttribute('data-sidebar-collapsed');
          if (balanceLastOpen === null) balanceLastOpen = open;
          if (open !== balanceLastOpen) {
            balanceLastOpen = open;
            if (open) setTimeout(function () { refreshBalance(true); }, 180);
          } else if (open && Date.now() - balanceLastFetch > 30000) {
            refreshBalance(true);
          }
        }, 600);
        try {
          if (ctx && typeof ctx.inject === 'function') {
            ctx.inject(['remote', 'remote.account'], function (rctx) {
              try {
                balanceApi = rctx['remote.account'] || (rctx.remote && rctx.remote.account) || (rctx.get && rctx.get('remote.account'));
              } catch (e) { /* noop */ }
              if (balanceApi && brandHidden() && balanceOn()) refreshBalance();
            });
          }
        } catch (e) { /* noop */ }
        setInterval(installMenuDrag, 1500);
        installMenuDrag();
        // 首次使用提示一次，避免“装了不知道能调宽度”
        try {
          if (!localStorage.getItem('dsh-tweaks-hint-v1')) {
            localStorage.setItem('dsh-tweaks-hint-v1', '1');
            setTimeout(function () { toast('侧栏底部「主页排版设置」可调宽度与手势'); }, 1800);
          }
        } catch (e) { /* noop */ }

        function gesturesEnabled() {
          try { return localStorage.getItem('dsh-tweaks-gesture') !== '0'; } catch (e) { return true; }
        }
        var layoutUI = { row: null };
        function getLayout() {
          try {
            return (ctx && ctx.layout) || (ctx && typeof ctx.get === 'function' ? ctx.get('layout') : null);
          } catch (e) { return null; }
        }
        function setDrawer(open) {
          var f = document.querySelector('[class*="frame"]');
          if (!f) return;
          var collapsed = f.hasAttribute('data-sidebar-collapsed');
          if (open === !collapsed) return;
          var l = getLayout();
          if (l && typeof l.toggleSidebar === 'function') {
            try { l.toggleSidebar(); return; } catch (e) { /* noop */ }
          }
          if (open) {
            var m = document.getElementById('dsh-mobile-menu');
            if (m) { try { m.click(); } catch (e) { /* noop */ } }
          } else {
            var b = document.querySelector('.dsh-mobile-backdrop');
            if (b) { try { b.click(); } catch (e) { /* noop */ } }
          }
        }
        function refreshRow() {
          if (layoutUI.row) layoutUI.row.textContent = '主页排版设置 · ' + storedWidth() + '%';
        }
        function brandHidden() {
          try { return localStorage.getItem('dsh-hide-brand') === '1'; } catch (e) { return false; }
        }
        function balanceOn() {
          try { return localStorage.getItem('dsh-show-balance') !== '0'; } catch (e) { return true; }
        }
        function applyBrandPref() {
          try {
            document.documentElement.classList.toggle('dsh-hide-brand', brandHidden());
            document.documentElement.classList.toggle('dsh-show-balance', balanceOn());
          } catch (e) { /* noop */ }
        }

        // 侧栏余额：呼出侧栏时向 account remote 取一次
        var balanceApi = null;
        var balanceFetching = false, balanceLastFetch = 0, balanceLastOpen = null;
        var balanceLabelText = '余额';
        try { balanceLabelText = localStorage.getItem('dsh-balance-label') || '余额'; } catch (e) { /* noop */ }
        function refreshBalance(force) {
          if (!brandHidden() || !balanceOn()) return;
          var frame = document.querySelector('[class*="frame"]');
          if (frame && frame.hasAttribute('data-sidebar-collapsed')) return;
          if (balanceFetching) return;
          var now = Date.now();
          if (!force && now - balanceLastFetch < 1500) return;
          var el = document.getElementById('dsh-sidebar-balance');
          if (!el) return;
          balanceFetching = true;
          balanceLastFetch = now;
          el.textContent = '余额 …';
          var account = balanceApi;
          if (!account) {
            var remote = null;
            try { remote = (ctx && ctx.remote) || (ctx && typeof ctx.get === 'function' ? ctx.get('remote') : null); } catch (e) { /* noop */ }
            account = remote && remote.account;
            if (account) balanceApi = account;
          }
          if (!account || typeof account.getBalance !== 'function') { el.textContent = '余额 --'; balanceFetching = false; return; }
          var locale = 'zh-CN';
          try { locale = navigator.language || 'zh-CN'; } catch (e) { /* noop */ }
          var meta = {
            version: '0.2.1-rc.5',
            locale: locale,
            timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
          };
          Promise.resolve(account.getBalance(meta)).then(function (res) {
            balanceFetching = false;
            var el2 = document.getElementById('dsh-sidebar-balance');
            if (!el2) return;
            if (!res || !res.ok || !res.value || res.value.status !== 'ready') { el2.textContent = '余额 --'; return; }
            var wallets = res.value.value || [];
            var main = null;
            for (var i = 0; i < wallets.length; i++) {
              if (wallets[i].currency === 'CNY') { main = wallets[i]; break; }
              if (!main) main = wallets[i];
            }
            if (!main) { el2.textContent = '余额 --'; return; }
            var symbol = main.currency === 'CNY' ? '¥' : (main.currency === 'USD' ? '$' : '');
            var amount = Number(main.balance);
            amount = isFinite(amount) ? amount.toFixed(2) : main.balance;
            el2.textContent = balanceLabelText + '：' + symbol + amount;
          }).catch(function () {
            balanceFetching = false;
            var el3 = document.getElementById('dsh-sidebar-balance');
            if (el3) el3.textContent = '余额 --';
          });
        }
        function installBalance() {
          var sb = document.querySelector('[class*="sidebarCol"]');
          if (!sb) return false;
          var logo = sb.querySelector('[class*="logoRow"]');
          if (!logo) return false;
          var el = document.getElementById('dsh-sidebar-balance');
          var created = false;
          if (!el) {
            el = document.createElement('div');
            el.id = 'dsh-sidebar-balance';
            el.textContent = '余额 --';
            created = true;
          }
          if (el.previousElementSibling !== logo) logo.parentNode.insertBefore(el, logo.nextSibling);
          if (created) setTimeout(function () { refreshBalance(true); }, 120);
          return true;
        }
        function watchBalanceOpen() {
          var f = document.querySelector('[class*="frame"]');
          if (!f) { setTimeout(watchBalanceOpen, 500); return; }
          var collapsed = f.hasAttribute('data-sidebar-collapsed');
          new MutationObserver(function () {
            var now = f.hasAttribute('data-sidebar-collapsed');
            if (now === collapsed) return;
            collapsed = now;
            if (!now) setTimeout(refreshBalance, 160);
          }).observe(f, { attributes: true, attributeFilter: ['data-sidebar-collapsed'] });
        }

        function installMenuDrag() {
          var menu = document.getElementById('dsh-mobile-menu');
          if (!menu) return false;
          if (menu.__dshDragBound) return true;
          menu.__dshDragBound = true;
          var pressTimer = 0, dragging = false, startX = 0, startY = 0, offX = 0, offY = 0, lastEnd = 0;
          function clampY(y) {
            var min = 80, max = (window.innerHeight || 800) - 60;
            return Math.min(Math.max(Number(y) || min, min), max);
          }
          function applyPos(side, y) {
            menu.style.top = clampY(y) + 'px';
            if (side === 'right') { menu.style.left = 'auto'; menu.style.right = '6px'; }
            else { menu.style.left = '6px'; menu.style.right = 'auto'; }
          }
          function saved() {
            try { return JSON.parse(localStorage.getItem('dsh-menu-pos') || 'null'); } catch (e) { return null; }
          }
          var initial = saved();
          if (initial && (initial.side === 'left' || initial.side === 'right')) applyPos(initial.side, initial.y);
          window.addEventListener('resize', function () {
            var v = saved();
            if (v && (v.side === 'left' || v.side === 'right')) applyPos(v.side, v.y);
          });
          function cancel() { if (pressTimer) { clearTimeout(pressTimer); pressTimer = 0; } }
          menu.addEventListener('touchstart', function (e) {
            var t = e.touches && e.touches[0];
            if (!t) return;
            startX = t.clientX;
            startY = t.clientY;
            var r = menu.getBoundingClientRect();
            offX = startX - r.left;
            offY = startY - r.top;
            dragging = false;
            cancel();
            pressTimer = setTimeout(function () {
              pressTimer = 0;
              dragging = true;
              menu.classList.add('dsh-menu-dragging');
              menu.style.transition = 'none';
              menu.style.left = r.left + 'px';
              menu.style.top = r.top + 'px';
              menu.style.right = 'auto';
              menu.style.touchAction = 'none';
            }, 420);
          }, { passive: true });
          menu.addEventListener('touchmove', function (e) {
            var t = e.touches && e.touches[0];
            if (!t) return;
            if (!dragging) {
              if (Math.abs(t.clientX - startX) > 8 || Math.abs(t.clientY - startY) > 8) cancel();
              return;
            }
            e.preventDefault();
            var x = Math.min(Math.max(t.clientX - offX, 2), (window.innerWidth || 400) - 38);
            var y = clampY(t.clientY - offY);
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
          }, { passive: false });
          function finish() {
            cancel();
            if (!dragging) return;
            dragging = false;
            menu.classList.remove('dsh-menu-dragging');
            var r = menu.getBoundingClientRect();
            var side = (r.left + r.width / 2) < (window.innerWidth || 400) / 2 ? 'left' : 'right';
            var y = clampY(r.top);
            menu.style.transition = 'top .18s ease, left .18s ease, right .18s ease';
            applyPos(side, y);
            try { localStorage.setItem('dsh-menu-pos', JSON.stringify({ side: side, y: y })); } catch (e) { /* noop */ }
            setTimeout(function () { menu.style.transition = ''; menu.style.touchAction = ''; }, 220);
            lastEnd = Date.now();
          }
          menu.addEventListener('touchend', finish, { passive: true });
          menu.addEventListener('touchcancel', finish, { passive: true });
          menu.addEventListener('click', function (e) {
            if (Date.now() - lastEnd < 500) {
              e.preventDefault();
              e.stopPropagation();
              if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            }
          }, true);
          menu.addEventListener('contextmenu', function (e) { e.preventDefault(); });
          return true;
        }
        function openLayoutCard() {
          var old = document.getElementById('dsh-tweaks-card-overlay');
          if (old && old.parentNode) old.parentNode.removeChild(old);
          var overlay = document.createElement('div');
          overlay.id = 'dsh-tweaks-card-overlay';
          overlay.className = 'dsh-tweaks-overlay';
          var card = document.createElement('div');
          card.className = 'dsh-tweaks-card';

          var head = document.createElement('div');
          head.className = 'dsh-tweaks-card-head';
          var title = document.createElement('div');
          title.className = 'dsh-tweaks-card-title';
          title.textContent = '主页排版设置';
          var close = document.createElement('button');
          close.type = 'button';
          close.className = 'dsh-tweaks-card-close';
          close.textContent = '×';
          var headValue = document.createElement('span');
          headValue.className = 'dsh-tweaks-card-value';
          head.appendChild(title);
          head.appendChild(headValue);
          head.appendChild(close);

          var body = document.createElement('div');
          body.className = 'dsh-tweaks-card-body';

          var sub = document.createElement('div');
          sub.className = 'dsh-tweaks-card-sub';
          sub.textContent = '拖动滑杆实时预览侧栏宽度（45–80%）';

          var preview = document.createElement('div');
          preview.className = 'dsh-tweaks-preview';
          var side = document.createElement('div');
          side.className = 'dsh-tweaks-preview-side';
          var plabel = document.createElement('div');
          plabel.className = 'dsh-tweaks-preview-label';
          preview.appendChild(side);
          preview.appendChild(plabel);

          var chips = document.createElement('div');
          chips.className = 'dsh-tweaks-chips';

          var slider = document.createElement('div');
          slider.className = 'dsh-tweaks-slider';
          var track = document.createElement('div');
          track.className = 'dsh-tweaks-track';
          var fill = document.createElement('div');
          fill.className = 'dsh-tweaks-fill';
          var thumb = document.createElement('div');
          thumb.className = 'dsh-tweaks-thumb';
          track.appendChild(fill);
          track.appendChild(thumb);
          slider.appendChild(track);
          var scale = document.createElement('div');
          scale.className = 'dsh-tweaks-scale';
          var sMin = document.createElement('span');
          sMin.textContent = WIDTH_MIN + '%';
          var sMax = document.createElement('span');
          sMax.textContent = WIDTH_MAX + '%';
          scale.appendChild(sMin);
          scale.appendChild(sMax);

          var switchRow = document.createElement('label');
          switchRow.className = 'dsh-tweaks-switch';
          var switchText = document.createElement('span');
          switchText.textContent = '左右滑动开关侧栏';
          var toggle = document.createElement('input');
          toggle.type = 'checkbox';
          toggle.checked = gesturesEnabled();
          toggle.addEventListener('change', function () {
            try { localStorage.setItem('dsh-tweaks-gesture', toggle.checked ? '1' : '0'); } catch (e) { /* noop */ }
          });
          switchRow.appendChild(switchText);
          switchRow.appendChild(toggle);

          var brandRow = document.createElement('label');
          brandRow.className = 'dsh-tweaks-switch';
          var brandText = document.createElement('span');
          brandText.textContent = '隐藏侧边栏 DeepSeek 标识';
          var brandToggle = document.createElement('input');
          brandToggle.type = 'checkbox';
          brandToggle.checked = brandHidden();
          brandToggle.addEventListener('change', function () {
            try { localStorage.setItem('dsh-hide-brand', brandToggle.checked ? '1' : '0'); } catch (e) { /* noop */ }
            applyBrandPref();
            if (brandHidden() && balanceOn()) refreshBalance();
          });
          brandRow.appendChild(brandText);
          brandRow.appendChild(brandToggle);

          var balanceRow = document.createElement('label');
          balanceRow.className = 'dsh-tweaks-switch';
          var balanceText = document.createElement('span');
          balanceText.textContent = '显示余额（需隐藏 DeepSeek 标识）';
          var balanceToggle = document.createElement('input');
          balanceToggle.type = 'checkbox';
          balanceToggle.checked = balanceOn();
          balanceToggle.addEventListener('change', function () {
            try { localStorage.setItem('dsh-show-balance', balanceToggle.checked ? '1' : '0'); } catch (e) { /* noop */ }
            applyBrandPref();
            if (brandHidden() && balanceOn()) refreshBalance();
          });
          balanceRow.appendChild(balanceText);
          balanceRow.appendChild(balanceToggle);

          function setSlider(w) {
            var pct = (w - WIDTH_MIN) / (WIDTH_MAX - WIDTH_MIN) * 100;
            fill.style.width = pct + '%';
            thumb.style.left = pct + '%';
          }
          function renderChips() {
            chips.innerHTML = '';
            WIDTHS.forEach(function (n) {
              var b = document.createElement('button');
              b.type = 'button';
              b.className = 'dsh-tweaks-chip' + (n === storedWidth() ? ' active' : '');
              b.textContent = n + '%';
              b.addEventListener('click', function () { update(n); });
              chips.appendChild(b);
            });
          }
          function update(w) {
            applyWidth(w);
            w = storedWidth();
            side.style.width = w + '%';
            plabel.textContent = '侧栏 ' + w + '%';
            if (headValue) headValue.textContent = w + '%';
            setSlider(w);
            renderChips();
            refreshRow();
          }
          var dragging = false;
          function fromEvent(e) {
            var r = track.getBoundingClientRect();
            if (!r.width) return;
            var ratio = (e.clientX - r.left) / r.width;
            update(clampWidth(Math.round(WIDTH_MIN + ratio * (WIDTH_MAX - WIDTH_MIN))));
          }
          track.addEventListener('pointerdown', function (e) {
            dragging = true;
            try { track.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
            fromEvent(e);
            e.preventDefault();
          });
          track.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
          track.addEventListener('pointerup', function () { dragging = false; });
          track.addEventListener('pointercancel', function () { dragging = false; });

          function closeCard() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }
          close.addEventListener('click', closeCard);
          overlay.addEventListener('click', function (e) { if (e.target === overlay) closeCard(); });

          body.appendChild(sub);
          body.appendChild(preview);
          body.appendChild(chips);
          body.appendChild(slider);
          body.appendChild(scale);
          body.appendChild(switchRow);
          body.appendChild(brandRow);
          body.appendChild(balanceRow);

          var field = document.createElement('div');
          field.className = 'dsh-tweaks-field';
          var fieldRow = document.createElement('div');
          fieldRow.className = 'dsh-tweaks-field-row';
          var labelInput = document.createElement('input');
          labelInput.className = 'dsh-tweaks-input';
          labelInput.type = 'text';
          labelInput.maxLength = 4;
          labelInput.placeholder = '余额标签（2–4 个字）';
          try { labelInput.value = localStorage.getItem('dsh-balance-label') || '余额'; } catch (e) { labelInput.value = '余额'; }
          var saveBtn = document.createElement('button');
          saveBtn.type = 'button';
          saveBtn.className = 'dsh-tweaks-save';
          saveBtn.textContent = '保存';
          var tip = document.createElement('div');
          tip.className = 'dsh-tweaks-tip';
          tip.textContent = 'Tip：需重启 DSH 才能生效';
          saveBtn.addEventListener('click', function () {
            var v = (labelInput.value || '').trim();
            if (v.length < 2 || v.length > 4) {
              tip.textContent = '请填 2–4 个字';
              tip.style.color = '#e5484d';
              return;
            }
            try { localStorage.setItem('dsh-balance-label', v); } catch (e) { /* noop */ }
            tip.style.color = '';
            tip.textContent = '已保存。Tip：需重启 DSH 才能生效';
          });
          fieldRow.appendChild(labelInput);
          fieldRow.appendChild(saveBtn);
          field.appendChild(fieldRow);
          field.appendChild(tip);
          body.appendChild(field);
          card.appendChild(head);
          card.appendChild(body);
          overlay.appendChild(card);
          document.body.appendChild(overlay);
          renderChips();
          update(storedWidth());
        }
        (function installLayoutEntry() {
          function add() {
            var foot = document.querySelector('[class*="sidebarCol"] [class*="footArea"]');
            if (!foot) return false;
            if (document.getElementById('dsh-tweaks-layout-row')) { refreshRow(); return true; }
            var row = document.createElement('button');
            row.id = 'dsh-tweaks-layout-row';
            row.type = 'button';
            row.textContent = '主页排版设置 · ' + storedWidth() + '%';
            row.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              openLayoutCard();
            });
            foot.insertBefore(row, foot.firstChild);
            layoutUI.row = row;
            return true;
          }
          setInterval(add, 1500);
          add();
        })();

        // 左右滑动：聊天区右滑开抽屉；抽屉内左滑关
        (function installDrawerGestures() {
          var startX = 0, startY = 0, mode = '', tracking = false;
          document.addEventListener('touchstart', function (e) {
            if (!gesturesEnabled() || window.innerWidth > 1024) return;
            var f = document.querySelector('[class*="frame"]');
            if (!f) return;
            var t = e.touches && e.touches[0];
            if (!t) return;
            var target = e.target;
            if (target && target.closest && target.closest('#dsh-mobile-menu')) return;
            if (target && target.closest && target.closest('pre, code, input, textarea, select, [contenteditable="true"]')) return;
            var collapsed = f.hasAttribute('data-sidebar-collapsed');
            if (collapsed && t.clientX > window.innerWidth / 3) return;
            mode = collapsed ? 'open' : 'close';
            startX = t.clientX;
            startY = t.clientY;
            tracking = true;
          }, { passive: true, capture: true });
          document.addEventListener('touchend', function (e) {
            if (!tracking) return;
            tracking = false;
            var t = e.changedTouches && e.changedTouches[0];
            if (!t) return;
            var dx = t.clientX - startX;
            var dy = t.clientY - startY;
            if (Math.abs(dy) > 45) return;
            if (mode === 'open' && dx > 60) setDrawer(true);
            else if (mode === 'close' && dx < -60) setDrawer(false);
          }, { passive: true, capture: true });
          document.addEventListener('touchcancel', function () { tracking = false; }, { passive: true, capture: true });
        })();

        // 点会话自动收起抽屉：先让 DSH 自己处理选中，120ms 后若抽屉还开着再关，
        // 这样 DSH 自己会关的版本不会“关了又开”。行内“更多/重命名”等控件跳过。
        (function closeOnSessionPick() {
          var layout = null;
          try {
            layout = (ctx && ctx.layout) || (ctx && typeof ctx.get === 'function' ? ctx.get('layout') : null);
          } catch (e) { /* noop */ }
          if (!layout || typeof layout.toggleSidebar !== 'function') return;
          document.addEventListener('click', function (e) {
            try {
              if (!window.matchMedia || !window.matchMedia('(max-width: 1024px)').matches) return;
              var t = e.target;
              if (!t || !t.closest) return;
              var row = t.closest('[data-row-key]');
              if (!row) return;
              var inner = t.closest('button, a, input, textarea, select, [role="menu"], [contenteditable="true"]');
              if (inner && inner !== row) return;
              var frame = document.querySelector('[class*="frame"]');
              if (!frame || frame.hasAttribute('data-sidebar-collapsed')) return;
              setTimeout(function () {
                var f = document.querySelector('[class*="frame"]');
                if (!f || f.hasAttribute('data-sidebar-collapsed')) return;
                try { layout.toggleSidebar(); } catch (err) { /* noop */ }
              }, 120);
            } catch (err) { /* noop */ }
          }, true);
        })();

        var vv = window.visualViewport;
        var raf = 0;
        function clearVh() {
          try { document.documentElement.style.removeProperty('--dsh-mobile-vh'); } catch (e) { /* noop */ }
        }
        function applyVh() {
          raf = 0;
          if (!enabledNow() || !vv) { clearVh(); return; }
          // 双指缩放时 vv.height 是缩放后的可视高，不能拿来当布局高度
          if (vv.scale && Math.abs(vv.scale - 1) > 0.01) { clearVh(); return; }
          var h = Math.round(vv.height);
          if (h > 0) document.documentElement.style.setProperty('--dsh-mobile-vh', h + 'px');
        }
        function schedule() { if (!raf) raf = requestAnimationFrame(applyVh); }

        if (vv) {
          vv.addEventListener('resize', schedule);
          vv.addEventListener('scroll', schedule);
        }
        window.addEventListener('orientationchange', schedule);

        // 跟随 mobile-adapt 的总开关：它禁用样式时，我们的覆盖一起失效。
        function sync() {
          var s = maStyle();
          var on = s ? !s.disabled : enabledNow();
          style.disabled = !on;
          if (!on) clearVh();
        }
        var ma = maStyle();
        if (ma) {
          new MutationObserver(sync).observe(ma, { attributes: true, attributeFilter: ['disabled'] });
          sync();
        } else {
          var timer = setInterval(function () {
            var s = maStyle();
            if (s === null) return;
            clearInterval(timer);
            new MutationObserver(sync).observe(s, { attributes: true, attributeFilter: ['disabled'] });
            sync();
          }, 1000);
        }

        // 剪贴板兜底：WebView 里 Clipboard API 常被拒，DSH 的消息复制/代码复制会“按了没反应”。
        // 统一改成 textarea + execCommand 兜底；代码块额外加一个自己的“复制”按钮。
        function copyText(text) {
          var ta = document.createElement('textarea');
          ta.value = String(text == null ? '' : text);
          ta.setAttribute('readonly', '');
          ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
          document.body.appendChild(ta);
          try {
            ta.select();
            ta.setSelectionRange(0, ta.value.length);
            var ok = document.execCommand('copy');
            if (!ok) throw new Error('copy failed');
          } finally {
            if (ta.parentNode) ta.parentNode.removeChild(ta);
          }
        }
        try {
          var writer = function (text) {
            try { copyText(text); return Promise.resolve(); }
            catch (e) { return Promise.reject(e); }
          };
          if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            try { navigator.clipboard.writeText = writer; }
            catch (e) { Object.defineProperty(navigator, 'clipboard', { value: { writeText: writer }, configurable: true }); }
          } else {
            Object.defineProperty(navigator, 'clipboard', { value: { writeText: writer }, configurable: true });
          }
        } catch (e) { /* noop */ }

        (function installCodeCopy() {
          function add() {
            var pres = document.querySelectorAll('pre');
            for (var i = 0; i < pres.length; i++) {
              var pre = pres[i];
              if (pre.getAttribute('data-dsh-tweaks-copy') === '1') continue;
              pre.setAttribute('data-dsh-tweaks-copy', '1');
              try {
                var cs = getComputedStyle(pre);
                if (cs.position === 'static') pre.style.position = 'relative';
              } catch (e) { /* noop */ }
              var btn = document.createElement('button');
              btn.type = 'button';
              btn.textContent = '复制';
              btn.setAttribute('data-dsh-tweaks-copy-btn', '1');
              btn.style.cssText = 'position:absolute;right:8px;bottom:8px;z-index:5;padding:4px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.15));background:var(--dsw-alias-bg-float, rgba(0,0,0,.65));color:var(--dsw-alias-label-primary, #fff);font-size:12px;line-height:16px;cursor:pointer;opacity:.9;';
              (function (preEl, b) {
                b.addEventListener('click', function (ev) {
                  ev.preventDefault();
                  ev.stopPropagation();
                  var code = preEl.querySelector('code');
                  var text;
                  if (code) text = code.innerText || code.textContent || '';
                  else {
                    var clone = preEl.cloneNode(true);
                    var stale = clone.querySelector('[data-dsh-tweaks-copy-btn]');
                    if (stale && stale.parentNode) stale.parentNode.removeChild(stale);
                    text = clone.textContent || '';
                  }
                  try { copyText(text); b.textContent = '已复制'; }
                  catch (e) { b.textContent = '复制失败'; }
                  setTimeout(function () { b.textContent = '复制'; }, 1200);
                }, true);
              })(pre, btn);
              pre.appendChild(btn);
            }
          }
          add();
          var scheduled = 0;
          try {
            new MutationObserver(function () {
              if (scheduled) return;
              scheduled = setTimeout(function () { scheduled = 0; add(); }, 400);
            }).observe(document.body, { childList: true, subtree: true });
          } catch (e) { /* noop */ }
          setInterval(add, 2500);
        })();

        // 顶部视图/轨迹切换：给新内容一个淡入上移，替代瞬移
        (function installViewAnimation() {
          document.addEventListener('click', function (e) {
            var t = e.target;
            if (!t || !t.closest) return;
            var tab = t.closest('[class*="tab"]');
            if (!tab || !tab.closest('[class*="tabs"]')) return;
            setTimeout(function () {
              var area = document.querySelector('[class*="viewArea"]');
              if (!area || typeof area.animate !== 'function') return;
              try {
                area.animate(
                  [{ opacity: 0.35, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
                  { duration: 180, easing: 'ease-out' }
                );
              } catch (err) { /* noop */ }
            }, 30);
          }, true);
        })();

        applyVh();

        // 抽屉打开时把当前会话滚到视野中间，省得每次手动找
        (function watchDrawer() {
          var frame = document.querySelector('[class*="frame"]');
          if (frame === null) { setTimeout(watchDrawer, 500); return; }
          var collapsed = frame.hasAttribute('data-sidebar-collapsed');
          new MutationObserver(function () {
            var now = frame.hasAttribute('data-sidebar-collapsed');
            if (now === collapsed) return;
            collapsed = now;
            if (now) return;
            setTimeout(function () {
              var sb = document.querySelector('[class*="sidebarCol"]');
              var row = sb && sb.querySelector('[data-row-key][aria-selected="true"]');
              if (row) {
                try { row.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch (e) { /* noop */ }
              }
            }, 280);
          }).observe(frame, { attributes: true, attributeFilter: ['data-sidebar-collapsed'] });
        })();
      } catch (e) { try { window.__dshTweaksLastError = String((e && e.stack) || e); } catch (err) { /* noop */ } }
    };

    return module.exports;
  },
});
