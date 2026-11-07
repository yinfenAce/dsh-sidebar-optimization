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
    var VERSION = '0.3.13';

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

      '  /* 左右互换：抽屉到右侧 */',
      '  html.dsh-drawer-right [class*="frame"][data-sidebar-collapsed] [class*="sidebarCol"] {',
      '    left: auto !important; right: 0 !important;',
      '    transform: translateX(100%) !important;',
      '  }',
      '  html.dsh-drawer-right [class*="frame"]:not([data-sidebar-collapsed]) [class*="sidebarCol"] {',
      '    left: auto !important; right: 0 !important;',
      '    transform: translateX(0) !important;',
      '    box-shadow: -2px 0 24px rgba(0,0,0,.35) !important;',
      '    border-right: none !important;',
      '    border-left: .5px solid var(--dsw-alias-border-l3, rgba(0,0,0,.1)) !important;',
      '  }',
      '  html.dsh-drawer-right #dsh-mobile-menu { left: auto; right: 6px; }',

      '  /* 右栏面板镜像到左侧：列钉到第 1 条轨道，面板从左边滑入 */',
      '  html.dsh-drawer-right [class*="frame"] [class*="rightbarCol"],',
      '  html.dsh-drawer-right [class*="frame"] [class*="detailsCol"] { grid-column: 1 !important; }',
      '  html.dsh-drawer-right [class*="frame"] [class*="rightbarCol"] [class*="panel"],',
      '  html.dsh-drawer-right [class*="frame"] [class*="detailsCol"] [class*="panel"] {',
      '    right: auto !important; left: 0 !important;',
      '  }',
      '  html.dsh-drawer-right [class*="frame"] [class*="rightbarCol"] [class*="panel"] [data-dockkit-host="dock"],',
      '  html.dsh-drawer-right [class*="frame"] [class*="rightbarCol"] [class*="panel"] [data-dockkit-empty],',
      '  html.dsh-drawer-right [class*="frame"] [class*="rightbarCol"] [class*="panel"] [data-dockkit-divider],',
      '  html.dsh-drawer-right [class*="frame"] [class*="detailsCol"] [class*="panel"] [data-dockkit-host="dock"],',
      '  html.dsh-drawer-right [class*="frame"] [class*="detailsCol"] [class*="panel"] [data-dockkit-empty],',
      '  html.dsh-drawer-right [class*="frame"] [class*="detailsCol"] [class*="panel"] [data-dockkit-divider] {',
      '    transform: translateX(calc(-1 * var(--dsh-sidebar-width))) !important;',
      '  }',
      '  html.dsh-drawer-right [class*="frame"] [class*="rightbarCol"] [class*="panel"][data-sidebar-right-open] [data-dockkit-host="dock"],',
      '  html.dsh-drawer-right [class*="frame"] [class*="rightbarCol"] [class*="panel"][data-sidebar-right-open] [data-dockkit-empty],',
      '  html.dsh-drawer-right [class*="frame"] [class*="rightbarCol"] [class*="panel"][data-sidebar-right-open] [data-dockkit-divider],',
      '  html.dsh-drawer-right [class*="frame"] [class*="detailsCol"] [class*="panel"][data-sidebar-right-open] [data-dockkit-host="dock"],',
      '  html.dsh-drawer-right [class*="frame"] [class*="detailsCol"] [class*="panel"][data-sidebar-right-open] [data-dockkit-empty],',
      '  html.dsh-drawer-right [class*="frame"] [class*="detailsCol"] [class*="panel"][data-sidebar-right-open] [data-dockkit-divider] {',
      '    transform: none !important;',
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
      '  .dsh-tweaks-overlay { animation: dsh-tweaks-fade .16s ease both; }',
      '  .dsh-tweaks-card { animation: dsh-tweaks-card-in .18s cubic-bezier(.2,.7,.2,1) both; }',
      '  .dsh-balance-menu.dsh-balance-menu-in { animation: dsh-tweaks-menu-in .14s ease both; }',
      '  @keyframes dsh-tweaks-fade { from { opacity:0; } to { opacity:1; } }',
      '  @keyframes dsh-tweaks-card-in { from { opacity:0; transform:translateY(6px) scale(.985); } to { opacity:1; transform:none; } }',
      '  @keyframes dsh-tweaks-menu-in { from { opacity:0; transform:translateY(-4px) scale(.98); } to { opacity:1; transform:none; } }',
      '  .dsh-tweaks-overlay.dsh-tweaks-closing { animation: dsh-tweaks-fade-out .14s ease both; }',
      '  .dsh-tweaks-overlay.dsh-tweaks-closing .dsh-tweaks-card { animation: dsh-tweaks-card-out .14s ease both; }',
      '  @keyframes dsh-tweaks-fade-out { from { opacity:1; } to { opacity:0; } }',
      '  @keyframes dsh-tweaks-card-out { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(4px) scale(.985); } }',
      '  .dsh-tweaks-danger { background:transparent !important; color:#e5484d !important; border:1px solid rgba(229,72,77,.45) !important; }',
      '  .dsh-tweaks-card { position:relative; z-index:2; width:min(340px,92vw); height:min(460px,72vh); max-height:72vh; box-sizing:border-box; border-radius:18px; background:var(--dsw-alias-bg-layer-1,#fff); color:var(--dsw-alias-label-primary,#111); box-shadow:0 18px 60px rgba(0,0,0,.35); padding:0; display:flex; flex-direction:column; overflow:hidden; }',
      '  .dsh-tweaks-card-body { padding:0 18px 18px; overflow-y:auto; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; min-height:0; flex:1 1 auto; }',
      '  .dsh-tweaks-card-head { display:flex; align-items:center; justify-content:space-between; padding:16px 18px 6px; flex:none; }',
      '  .dsh-tweaks-card-title { font-size:16px; font-weight:600; }',
      '  .dsh-tweaks-card-value { margin-left:auto; margin-right:10px; font-size:13px; color:var(--dsw-alias-label-secondary,#666); }',
      '  .dsh-tweaks-version { margin-left:8px; font-size:11px; line-height:16px; color:var(--dsw-alias-label-secondary,#666); }',
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
      '  .dsh-tweaks-guide { position:fixed; top:0; bottom:0; left:0; width:33%; box-sizing:border-box; z-index:1; pointer-events:none; display:none; border:2px solid #7cc4ff; background:rgba(124,196,255,.10); box-shadow:inset 0 0 18px rgba(124,196,255,.35); animation:dsh-guide-blink 1.1s ease-in-out infinite; }',
      '  .dsh-tweaks-guide.is-right { left:auto; right:0; }',
      '  @keyframes dsh-guide-blink { 0%,100% { opacity:.95; } 50% { opacity:.35; } }',
      '  .dsh-tweaks-range-head { display:flex; align-items:center; justify-content:space-between; margin-top:16px; font-size:13px; color:var(--dsw-alias-label-primary,#111); }',
      '  .dsh-tweaks-range-head span { color:var(--dsw-alias-label-secondary,#666); font-variant-numeric:tabular-nums; }',
      '  .dsh-tweaks-switch { display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:13px; color:var(--dsw-alias-label-primary,#111); }',
      '  .dsh-tweaks-switch + .dsh-tweaks-switch { margin-top:12px; }',
      '  .dsh-tweaks-field { margin-top:14px; padding-top:12px; border-top:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.18)); }',
      '  .dsh-tweaks-field-row { display:flex; gap:8px; align-items:center; }',
      '  .dsh-tweaks-btn-row { display:flex; gap:8px; margin:7px 0; }',
      '  .dsh-tweaks-btn-row .dsh-tweaks-save { flex:1; min-width:0; padding:0 8px; }',
      '  .dsh-tweaks-help { margin-top:10px; font-size:12px; line-height:18px; color:var(--dsw-alias-label-secondary,#666); }',
      '  .dsh-tweaks-status { min-height:18px; margin-top:6px; font-size:12px; line-height:18px; font-weight:600; }',
      '  .dsh-tweaks-help summary { cursor:pointer; color:var(--dsw-alias-label-primary,#111); font-weight:500; }',
      '  .dsh-tweaks-help-body { white-space:pre-line; margin-top:6px; }',
      '  .dsh-tweaks-scan-list { margin:7px 0; border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.24)); border-radius:10px; overflow:hidden; }',
      '  .dsh-tweaks-scan-item { display:block; width:100%; box-sizing:border-box; padding:9px 10px; border:0; border-bottom:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.18)); background:transparent; color:var(--dsw-alias-label-primary,#111); font:inherit; font-size:13px; text-align:left; cursor:pointer; }',
      '  .dsh-tweaks-scan-item:last-child { border-bottom:0; }',
      '  .dsh-tweaks-scan-item:active { background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06)); }',
      '  .dsh-tweaks-secondary { background:transparent !important; color:var(--dsw-alias-label-primary,#111) !important; border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.24)) !important; }',
      '  .dsh-tweaks-input { flex:1; min-width:0; height:34px; box-sizing:border-box; padding:0 10px; border-radius:9px; border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.24)); background:transparent; color:var(--dsw-alias-label-primary,#111); font:inherit; font-size:13px; outline:none; }',
      '  .dsh-tweaks-save { height:34px; padding:0 14px; border-radius:9px; border:none; background:var(--dsw-alias-label-primary,#111); color:var(--dsw-alias-bg-layer-1,#fff); font-size:13px; cursor:pointer; }',
      '  .dsh-tweaks-tip { margin-top:6px; font-size:11px; line-height:16px; color:var(--dsw-alias-label-secondary,#666); }',
      '  #dsh-sidebar-balance { display:none; max-width:calc(100% - 48px); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:2px 4px 6px; font-size:12px; line-height:18px; color:var(--dsw-alias-label-secondary,#666); font-variant-numeric:tabular-nums; }',
      '  html.dsh-hide-brand.dsh-show-balance [class*="sidebarCol"] [class*="logoRow"] + #dsh-sidebar-balance { display:flex; align-items:center; margin-top:-36px; margin-bottom:8px; font-size:16px; font-weight:600; color:var(--dsw-alias-label-primary,#111); }',
      '  #dsh-sidebar-balance .dsh-balance-amount { border:0; background:transparent; padding:0; margin:0; font:inherit; color:inherit; cursor:pointer; text-decoration:underline dotted; text-underline-offset:3px; -webkit-tap-highlight-color:transparent; outline:none; }',
      '  #dsh-sidebar-balance .dsh-balance-amount:active { opacity:.7; }',
      '  #dsh-sidebar-balance .dsh-balance-eye { display:none; border:0; background:transparent; color:inherit; padding:0 0 0 5px; margin:0; width:18px; height:18px; align-items:center; justify-content:center; cursor:pointer; -webkit-tap-highlight-color:transparent; outline:none; }',
      '  #dsh-sidebar-balance.show-eye .dsh-balance-eye { display:inline-flex; }',
      '  #dsh-sidebar-balance .dsh-balance-eye svg { width:16px; height:16px; display:block; }',
      '  .dsh-tweaks-threshold { display:none; margin-top:12px; }',
      '  .dsh-tweaks-threshold .dsh-tweaks-input { width:88px; flex:none; text-align:right; }',
      '  .dsh-balance-menu { position:fixed; z-index:1500; width:196px; box-sizing:border-box; padding:6px; border-radius:12px; background:var(--dsw-alias-bg-layer-1,#fff); color:var(--dsw-alias-label-primary,#111); box-shadow:0 12px 36px rgba(0,0,0,.28); border:1px solid var(--dsw-alias-border-l1,rgba(128,128,128,.20)); }',
      '  .dsh-balance-menu button { display:flex; flex-direction:column; align-items:flex-start; gap:1px; width:100%; box-sizing:border-box; padding:9px 10px; border:none; border-radius:8px; background:transparent; color:inherit; font:inherit; text-align:left; cursor:pointer; }',
      '  .dsh-balance-menu button:active { background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06)); }',
      '  .dsh-balance-menu button[disabled] { opacity:.45; cursor:default; }',
      '  .dsh-balance-menu .t { font-size:13px; line-height:18px; }',
      '  .dsh-balance-menu .s { font-size:11px; line-height:15px; color:var(--dsw-alias-label-secondary,#666); }',
      '  #dsh-mobile-menu.dsh-menu-dragging { transition:none !important; transform:scale(1.08); box-shadow:0 6px 18px rgba(0,0,0,.35); opacity:.92; }',
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
        // 滑动检测范围：从当前侧边缘算起，20%–80%
        var SWIPE_MIN = 20, SWIPE_MAX = 80, SWIPE_DEFAULT = 33;
        function clampSwipeRange(n) {
          n = parseInt(n, 10);
          if (!isFinite(n)) n = SWIPE_DEFAULT;
          return Math.max(SWIPE_MIN, Math.min(SWIPE_MAX, n));
        }
        function storedSwipeRange() {
          try { return clampSwipeRange(localStorage.getItem('dsh-swipe-range')); } catch (e) { return SWIPE_DEFAULT; }
        }
        function applySwipeRange(n) {
          n = clampSwipeRange(n);
          try { localStorage.setItem('dsh-swipe-range', String(n)); } catch (e) { /* noop */ }
          return n;
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
        applyDrawerSide();
        setInterval(installBalance, 1500);
        installBalance();
        setTimeout(refreshBalance, 800);
        setTimeout(function () { try { getUsageState(); } catch (e) { /* noop */ } }, 1500);
        setTimeout(function () { try { cleanupManualEntry(); } catch (e) { /* noop */ } }, 2200);
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
              try { remoteService = (rctx && rctx.remote) || (rctx && rctx.get && rctx.get('remote')) || remoteService; } catch (e) { /* noop */ }
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
        function drawerOnRight() {
          try { return localStorage.getItem('dsh-drawer-side') === 'right'; } catch (e) { return false; }
        }
        function applyDrawerSide() {
          try { document.documentElement.classList.toggle('dsh-drawer-right', drawerOnRight()); } catch (e) { /* noop */ }
        }

        // 侧栏余额：呼出侧栏时向 account remote 取一次
        var remoteService = null;
        var balanceApi = null;
        var balanceFetching = false, balanceLastFetch = 0, balanceLastOpen = null;
        var balanceLabelText = '余额';
        try { balanceLabelText = localStorage.getItem('dsh-balance-label') || '余额'; } catch (e) { /* noop */ }
        var balanceAmountText = '';
        var balanceAmountValue = null;
        var balanceRevealed = false;
        function balancePrivacyOn() {
          try { return localStorage.getItem('dsh-balance-privacy') === '1'; } catch (e) { return false; }
        }
        function balanceWarningOn() {
          try { return localStorage.getItem('dsh-balance-warning') === '1'; } catch (e) { return false; }
        }
        function balanceThreshold() {
          try {
            var n = parseFloat(localStorage.getItem('dsh-balance-threshold'));
            return isFinite(n) && n >= 0 ? n : 1;
          } catch (e) { return 1; }
        }
        function applyBalanceColor() {
          var el = document.getElementById('dsh-sidebar-balance');
          if (!el) return;
          var amount = el.querySelector('.dsh-balance-amount');
          if (!amount) return;
          var low = balanceWarningOn() && balanceAmountValue !== null && isFinite(balanceAmountValue) && balanceAmountValue <= balanceThreshold();
          amount.style.color = low ? '#e5484d' : '';
          amount.style.fontWeight = low ? '700' : '';
        }
        function renderBalanceAmount() {
          var el = document.getElementById('dsh-sidebar-balance');
          if (!el) return;
          var amount = el.querySelector('.dsh-balance-amount');
          var eye = el.querySelector('.dsh-balance-eye');
          if (!amount) return;
          var privacy = balancePrivacyOn();
          var hasValue = !!balanceAmountText && balanceAmountText !== '…' && balanceAmountText !== '--';
          var masked = privacy && hasValue && !balanceRevealed;
          amount.textContent = masked ? '****' : (balanceAmountText || '--');
          el.classList.toggle('show-eye', privacy);
          if (eye) {
            eye.style.display = privacy ? 'inline-flex' : 'none';
            var slash = eye.querySelector('.dsh-eye-slash');
            if (slash) slash.style.display = masked ? '' : 'none';
            eye.setAttribute('aria-label', masked ? '显示余额' : '隐藏余额');
          }
          applyBalanceColor();
        }
        function refreshBalance(force) {
          if (!brandHidden() || !balanceOn()) return;
          var frame = document.querySelector('[class*="frame"]');
          if (frame && frame.hasAttribute('data-sidebar-collapsed')) return;
          if (balanceFetching) return;
          var now = Date.now();
          if (!force && now - balanceLastFetch < 1500) return;
          var el = document.getElementById('dsh-sidebar-balance');
          if (!el) return;
          var labelEl = el.querySelector('.dsh-balance-label');
          var amountEl = el.querySelector('.dsh-balance-amount');
          if (!amountEl) return;
          if (labelEl) labelEl.textContent = balanceLabelText + '：';
          balanceFetching = true;
          balanceLastFetch = now;
          balanceAmountText = '…';
          balanceAmountValue = null;
          renderBalanceAmount();
          var account = balanceApi;
          if (!account) {
            var remote = null;
            try { remote = (ctx && ctx.remote) || (ctx && typeof ctx.get === 'function' ? ctx.get('remote') : null); } catch (e) { /* noop */ }
            account = remote && remote.account;
            if (account) balanceApi = account;
          }
          if (!account || typeof account.getBalance !== 'function') { balanceAmountText = '--'; balanceAmountValue = null; renderBalanceAmount(); balanceFetching = false; return; }
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
            var amountEl2 = el2.querySelector('.dsh-balance-amount');
            var labelEl2 = el2.querySelector('.dsh-balance-label');
            if (!amountEl2) return;
            if (labelEl2) labelEl2.textContent = balanceLabelText + '：';
            if (!res || !res.ok || !res.value || res.value.status !== 'ready') { balanceAmountText = '--'; balanceAmountValue = null; renderBalanceAmount(); return; }
            var wallets = res.value.value || [];
            var main = null;
            for (var i = 0; i < wallets.length; i++) {
              if (wallets[i].currency === 'CNY') { main = wallets[i]; break; }
              if (!main) main = wallets[i];
            }
            if (!main) { balanceAmountText = '--'; balanceAmountValue = null; renderBalanceAmount(); return; }
            var symbol = main.currency === 'CNY' ? '¥' : (main.currency === 'USD' ? '$' : '');
            var amount = Number(main.balance);
            balanceAmountValue = isFinite(amount) ? amount : null;
            amount = isFinite(amount) ? amount.toFixed(2) : main.balance;
            balanceAmountText = symbol + amount;
            renderBalanceAmount();
          }).catch(function () {
            balanceFetching = false;
            var el3 = document.getElementById('dsh-sidebar-balance');
            balanceAmountText = '--';
            balanceAmountValue = null;
            renderBalanceAmount();
          });
        }
        var balanceMenuCleanup = null;
        function closeBalanceMenu() {
          var m = document.getElementById('dsh-balance-menu');
          if (m && m.parentNode) m.parentNode.removeChild(m);
          if (balanceMenuCleanup) {
            try { balanceMenuCleanup(); } catch (e) { /* noop */ }
            balanceMenuCleanup = null;
          }
        }
        function isUnsafeNavLink(el) {
          try {
            var a = el && el.closest ? el.closest('a') : null;
            if (!a) return false;
            var href = a.getAttribute('href') || '';
            return /^(https?:)?\/\//i.test(href);
          } catch (e) { return false; }
        }
        function blockedNavLabel(el) {
          try {
            if (el.closest && (el.closest('#dsh-sidebar-balance') || el.closest('#dsh-tweaks-card-overlay') || el.closest('#dsh-tweaks-layout-row') || el.closest('.dsh-balance-menu') || el.closest('[class*="footArea"]') || el.closest('[class*="logoRow"]') || el.closest('[data-row-key]'))) return true;
            var t = (el.textContent || '').replace(/\s+/g, '');
            if (!t) return true;
            if (/^[¥$]?\d/.test(t)) return true;
            if (/^(对话|轨迹|新会话|插件|设置|更多|搜索|工作区|任务看板|技能中心)$/.test(t)) return true;
            if (/^(思考|运行命令|用量\s*\d)/.test(t)) return true;
            return false;
          } catch (e) { return false; }
        }
        var NAV_SELECTORS = [
          '[class*="sidebarCol"] button',
          '[class*="sidebarCol"] [role="button"]',
          '[class*="sidebarCol"] [role="tab"]',
          '[class*="sidebarCol"] a',
          '[class*="header"] [role="tab"]',
          '[class*="header"] [role="button"]',
          '[class*="tabBar"] button',
          '[class*="tabBar"] [role="tab"]',
          '[class*="viewHeader"] [role="tab"]',
          '[class*="viewTabs"] [role="tab"]',
        ].join(', ');
        function scanManualEntries() {
          try {
            var nodes = document.querySelectorAll(NAV_SELECTORS);
            var out = [], seen = {};
            for (var i = 0; i < nodes.length && out.length < 30; i++) {
              var el = nodes[i];
              if (isUnsafeNavLink(el) || blockedNavLabel(el)) continue;
              var t = (el.textContent || '').replace(/\s+/g, '');
              if (!t || t.length > 24 || seen[t]) continue;
              var r = el.getBoundingClientRect();
              if (r.width <= 0 || r.height <= 0) continue;
              seen[t] = 1;
              out.push(t);
            }
            return out;
          } catch (e) { return []; }
        }
        function findNavByText(text, exact) {
          try {
            var needle = String(text || '').replace(/\s+/g, '');
            if (!needle) return null;
            function visible(el) {
              try { var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; } catch (e) { return false; }
            }
            function matches(el) {
              var t = (el.textContent || '').replace(/\s+/g, '');
              var n = needle;
              if (exact) return t === n || t.toLowerCase() === n.toLowerCase();
              return t === n || t.toLowerCase() === n.toLowerCase() || t.indexOf(n) >= 0;
            }
            function findIn(selector) {
              var nodes = document.querySelectorAll(selector);
              for (var i = 0; i < nodes.length; i++) {
                if (isUnsafeNavLink(nodes[i]) || blockedNavLabel(nodes[i])) continue;
                if (matches(nodes[i]) && visible(nodes[i])) return nodes[i];
              }
              return null;
            }
            var n = findIn('[class*="sidebarCol"] button, [class*="sidebarCol"] a, [class*="sidebarCol"] [role="button"], [class*="sidebarCol"] [role="tab"]');
            if (n) return n;
            n = findIn('[class*="header"] [role="tab"], [class*="header"] [role="button"], [class*="tabBar"] button, [class*="tabBar"] [role="tab"], [class*="viewHeader"] [role="tab"], [class*="viewTabs"] [role="tab"]');
            if (n) return n;
            var all = document.querySelectorAll('[class*="sidebarCol"] *');
            for (var k = 0; k < all.length; k++) {
              var leaf = all[k];
              if (isUnsafeNavLink(leaf) || blockedNavLabel(leaf)) continue;
              var lt = (leaf.textContent || '').replace(/\s+/g, '');
              if (leaf.children && leaf.children.length === 0 && (exact ? (lt === needle || lt.toLowerCase() === needle.toLowerCase()) : (lt.indexOf(needle) >= 0 || lt.toLowerCase() === needle.toLowerCase()))) return leaf;
            }
          } catch (e) { /* noop */ }
          return null;
        }
        function findVisibleByPrefix(selector, prefix, maxLen) {
          try {
            var nodes = document.querySelectorAll(selector);
            for (var i = 0; i < nodes.length; i++) {
              var el = nodes[i];
              var t = (el.textContent || '').replace(/\s+/g, '');
              if (t.indexOf(prefix) !== 0 || t.length > maxLen) continue;
              var r = el.getBoundingClientRect();
              if (r.width > 0 && r.height > 0) return el;
            }
          } catch (e) { /* noop */ }
          return null;
        }
        function contextNav() {
          return findNavByText('上下文', true) ||
            findNavByText('上下文洞察', true) ||
            findNavByText('Context', true) ||
            findVisibleByPrefix('[role="tab"]', '上下文', 10) ||
            findVisibleByPrefix('[class*="sidebarCol"] button, [class*="sidebarCol"] [role="button"], [class*="sidebarCol"] a', '上下文洞察', 12);
        }
        function manualUsage() {
          try {
            var raw = (localStorage.getItem('dsh-usage-entry') || '').trim();
            if (!raw) return null;
            if (raw.charAt(0) === '{') {
              var j = JSON.parse(raw);
              return { package: String(j.package || '').trim(), label: String(j.label || '').trim() };
            }
            return { package: '', label: raw };
          } catch (e) { return null; }
        }
        var USAGE_BUNDLES = [
          { id: 'dsh-context', label: '上下文洞察', nav: '上下文洞察' },
          { id: 'dsh-usage', label: '用量' },
          { id: 'dsh-token-usage', label: 'Token 用量' },
          { id: 'dsh-token-meter', label: 'Token 用量' },
        ];
        function entryTitle(entry) {
          var t = entry && entry.meta && entry.meta.title;
          if (typeof t === 'string') return t;
          if (t && typeof t === 'object') {
            var keys = ['zh', 'zh-CN', 'en'];
            for (var i = 0; i < keys.length; i++) if (typeof t[keys[i]] === 'string') return t[keys[i]];
            for (var k in t) if (typeof t[k] === 'string') return t[k];
          }
          return '';
        }
        function matchUsageEntry(entry) {
          var id = String(entry.id || entry.name || entry.packageName || entry.entryId || entry.moduleName || '');
          var pkg = String(entry.packageName || entry.package || entry.moduleName || '');
          var hay = (id + ' ' + pkg + ' ' + entryTitle(entry)).toLowerCase();
          if (/dsh-sidebar-optimization|mobile-tweaks|mobile-adapt/.test(hay)) return null;
          for (var i = 0; i < USAGE_BUNDLES.length; i++) {
            if (hay.indexOf(USAGE_BUNDLES[i].id) >= 0) {
              return { id: entry.name || entry.packageName || entry.moduleName || entry.entryId || id, label: USAGE_BUNDLES[i].label, nav: USAGE_BUNDLES[i].nav, title: entryTitle(entry) };
            }
          }
          if (/(?:^|[-_/])(context|usage|token[-_]?usage|token[-_]?meter)(?:[-_/]|$)/.test(hay) || /用量|上下文/.test(hay)) {
            return { id: id || entry.name, label: '第三方用量插件', title: entryTitle(entry) };
          }
          return null;
        }
        function hostRpc(method) {
          try {
            var conn = ctx && typeof ctx.get === 'function' ? ctx.get('connection') : null;
            var call = conn && conn.rpc && conn.rpc.call;
            if (typeof call === 'function') return Promise.resolve(call('/api', method, { args: {} }));
          } catch (e) { /* noop */ }
          return null;
        }
        var usageStateCache = null;
        function getUsageState(force) {
          if (!force && usageStateCache && Date.now() - usageStateCache.at < 60000) return Promise.resolve(usageStateCache.state);
          return new Promise(function (resolve) {
            var pm = null;
            try { pm = (remoteService && remoteService.pluginManager) || null; } catch (e) { /* noop */ }
            if (!pm) {
              try {
                var remote = ctx && typeof ctx.get === 'function' ? ctx.get('remote') : null;
                pm = remote && remote.pluginManager;
              } catch (e) { /* noop */ }
            }
            function listOf(r) {
              return r && r.ok && Array.isArray(r.value) ? r.value : [];
            }
            var pluginJob = null, bundleJob = null;
            if (pm && typeof pm.listPlugins === 'function') {
              pluginJob = Promise.resolve().then(function () { return pm.listPlugins(); }).then(listOf).catch(function () { return []; });
            } else {
              var rpcPlugins = hostRpc('pluginManager/listPlugins');
              if (rpcPlugins) pluginJob = rpcPlugins.then(listOf).catch(function () { return []; });
            }
            if (pm && typeof pm.listBundles === 'function') {
              bundleJob = Promise.resolve().then(function () { return pm.listBundles(); }).then(listOf).catch(function () { return []; });
            } else {
              var rpcBundles = hostRpc('pluginManager/listBundles');
              if (rpcBundles) bundleJob = rpcBundles.then(listOf).catch(function () { return []; });
            }
            if (!pluginJob && !bundleJob) { resolve(null); return; }
            Promise.all([pluginJob || [], bundleJob || []]).then(function (vals) {
              var plugins = vals[0] || [];
              var bundles = vals[1] || [];
              var bundleCandidates = [];
              var pluginCandidates = [];
              for (var i = 0; i < bundles.length; i++) {
                var ub = matchUsageEntry(bundles[i]);
                if (ub) bundleCandidates.push({ entry: bundles[i], bundle: ub, enabled: !!bundles[i].enabled });
              }
              for (var j = 0; j < plugins.length; j++) {
                var up = matchUsageEntry(plugins[j]);
                if (up) pluginCandidates.push({ entry: plugins[j], bundle: up, enabled: !!plugins[j].enabled });
              }
              var chosen = null;
              for (var k = 0; k < bundleCandidates.length; k++) { if (bundleCandidates[k].enabled) { chosen = bundleCandidates[k]; break; } }
              if (!chosen && bundleCandidates.length) chosen = bundleCandidates[0];
              if (!chosen) {
                for (var m = 0; m < pluginCandidates.length; m++) { if (pluginCandidates[m].enabled) { chosen = pluginCandidates[m]; break; } }
                if (!chosen && pluginCandidates.length) chosen = pluginCandidates[0];
              }
              if (!chosen) resolve({ installed: false, enabled: false });
              else resolve({ installed: true, enabled: chosen.enabled, bundle: chosen.bundle, entry: chosen.entry });
            }).catch(function () { resolve(null); });
          }).then(function (state) {
            if (state) usageStateCache = { at: Date.now(), state: state };
            return state;
          });
        }
        function cleanupManualEntry() {
          var m = manualUsage();
          if (!m || !m.package) return Promise.resolve(false);
          var wanted = m.package.toLowerCase();
          return getUsageState(true).then(function (state) {
            if (!state) return false;
            var e = state.entry || {};
            var hay = String(e.name || e.packageName || e.moduleName || e.id || '').toLowerCase();
            if (state.installed && state.enabled && hay.indexOf(wanted) >= 0) return false;
            try { localStorage.removeItem('dsh-usage-entry'); } catch (err) { /* noop */ }
            return true;
          }).catch(function () { return false; });
        }
        function openExternal(url) {
          try {
            var a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); }, 0);
          } catch (e) {
            try { location.href = url; } catch (e2) { /* noop */ }
          }
        }
        function goContext() {
          closeBalanceMenu();
          var manual = manualUsage();
          if (manual) {
            if (manual.label) {
              var labels = manual.label.split(/[|,，]/).map(function (x) { return x.trim(); }).filter(Boolean);
              for (var ci = 0; ci < labels.length; ci++) {
                var customNav = findNavByText(labels[ci], true) || findNavByText(labels[ci], false);
                if (customNav) {
                  try { customNav.click(); } catch (e) { /* noop */ }
                  setTimeout(function () { setDrawer(false); }, 80);
                  return;
                }
              }
            }
            if (manual.package) {
              var wanted = manual.package.toLowerCase();
              getUsageState().then(function (state) {
                if (state && state.installed && state.enabled) {
                  var e = state.entry || {};
                  var hay = String(e.name || e.packageName || e.moduleName || e.id || '').toLowerCase();
                  if (hay.indexOf(wanted) >= 0) {
                    var title = state.bundle && (state.bundle.title || state.bundle.label);
                    var nav2 = findNavByText(title, true) || findNavByText(title, false);
                    if (nav2) {
                      try { nav2.click(); } catch (err) { /* noop */ }
                      setTimeout(function () { setDrawer(false); }, 80);
                      return;
                    }
                  }
                }
                autoUsageJump();
              });
              return;
            }
            autoUsageJump();
            return;
          }
          autoUsageJump();
        }
        function autoUsageJump() {
          getUsageState().then(function (state) {
            if (state && state.installed && state.enabled) {
              var bundleId = state.bundle && state.bundle.id;
              var isContext = !!(state.bundle && (state.bundle.nav === '上下文洞察' || (bundleId && /dsh-context/i.test(bundleId))));
              var nav = isContext ? contextNav() : (findNavByText(state.bundle && state.bundle.title, true) || findNavByText(state.bundle && state.bundle.label, true) || findNavByText(state.bundle && state.bundle.title, false) || findNavByText(state.bundle && state.bundle.label, false));
              if (nav) {
                try { nav.click(); } catch (e) { /* noop */ }
                setTimeout(function () { setDrawer(false); }, 80);
                return;
              }
            }
            openExternal('https://platform.deepseek.com/usage');
          });
        }
        function openTopUp() {
          closeBalanceMenu();
          openExternal('https://platform.deepseek.com/top_up');
        }
        function openBalanceMenu(anchor) {
          closeBalanceMenu();
          var txt = (anchor.textContent || '').trim();
          if (!txt || txt === '…') { toast('正在获取' + balanceLabelText + '…'); return; }
          if (txt === '--') { toast('暂时获取不到' + balanceLabelText); return; }
          var menu = document.createElement('div');
          menu.id = 'dsh-balance-menu';
          menu.className = 'dsh-balance-menu';
          menu.style.visibility = 'hidden';
          function option(title, sub, disabled, action) {
            var b = document.createElement('button');
            b.type = 'button';
            b.disabled = !!disabled;
            var t = document.createElement('span');
            t.className = 't';
            t.textContent = title;
            var s = document.createElement('span');
            s.className = 's';
            s.textContent = sub;
            b.appendChild(t);
            b.appendChild(s);
            if (!disabled) b.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              closeBalanceMenu();
              action();
            });
            return b;
          }
          menu.appendChild(option('查看用量', '第三方插件 / 平台用量', false, goContext));
          menu.appendChild(option('充值', 'platform.deepseek.com', false, openTopUp));
          document.body.appendChild(menu);
          var r = anchor.getBoundingClientRect();
          var w = menu.offsetWidth || 196, h = menu.offsetHeight || 86;
          var left = Math.min(Math.max(8, r.left), Math.max(8, window.innerWidth - w - 8));
          var top = r.bottom + 8;
          if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 8);
          menu.style.left = left + 'px';
          menu.style.top = top + 'px';
          menu.style.visibility = 'visible';
          menu.classList.add('dsh-balance-menu-in');
          setTimeout(function () { try { getUsageState(); } catch (e) { /* noop */ } }, 0);
          function onDoc(e) {
            if (e.target && e.target.closest && e.target.closest('#dsh-balance-menu')) return;
            closeBalanceMenu();
          }
          function onKey(e) { if (e.key === 'Escape') closeBalanceMenu(); }
          setTimeout(function () {
            if (!document.getElementById('dsh-balance-menu')) return;
            document.addEventListener('click', onDoc, true);
            document.addEventListener('keydown', onKey, true);
          }, 0);
          balanceMenuCleanup = function () {
            document.removeEventListener('click', onDoc, true);
            document.removeEventListener('keydown', onKey, true);
          };
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
            created = true;
          }
          if (!el.querySelector('.dsh-balance-amount')) {
            el.textContent = '';
            var label = document.createElement('span');
            label.className = 'dsh-balance-label';
            label.textContent = balanceLabelText + '：';
            var amount = document.createElement('button');
            amount.type = 'button';
            amount.className = 'dsh-balance-amount';
            amount.textContent = '--';
            amount.setAttribute('aria-label', '查看余额选项');
            amount.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              openBalanceMenu(amount);
            });
            var eye = document.createElement('button');
            eye.type = 'button';
            eye.className = 'dsh-balance-eye';
            eye.setAttribute('aria-label', '显示余额');
            eye.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/><line class="dsh-eye-slash" x1="4" y1="20" x2="20" y2="4"/></svg>';
            eye.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              if (!balancePrivacyOn()) return;
              balanceRevealed = !balanceRevealed;
              renderBalanceAmount();
            });
            el.appendChild(label);
            el.appendChild(amount);
            el.appendChild(eye);
            created = true;
          }
          if (!el.querySelector('.dsh-balance-eye')) {
            var eye2 = document.createElement('button');
            eye2.type = 'button';
            eye2.className = 'dsh-balance-eye';
            eye2.setAttribute('aria-label', '显示余额');
            eye2.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/><line class="dsh-eye-slash" x1="4" y1="20" x2="20" y2="4"/></svg>';
            eye2.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              if (!balancePrivacyOn()) return;
              balanceRevealed = !balanceRevealed;
              renderBalanceAmount();
            });
            el.appendChild(eye2);
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
            var w = 0;
            try { w = menu.getBoundingClientRect().width || 34; } catch (e) { w = 34; }
            var x = side === 'right' ? ((window.innerWidth || 400) - w - 6) : 6;
            menu.style.left = Math.max(2, x) + 'px';
            menu.style.right = 'auto';
            menu.style.top = clampY(y) + 'px';
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
          closeBalanceMenu();
          var old = document.getElementById('dsh-tweaks-card-overlay');
          if (old && old.parentNode) old.parentNode.removeChild(old);
          var overlay = document.createElement('div');
          overlay.id = 'dsh-tweaks-card-overlay';
          overlay.className = 'dsh-tweaks-overlay';
          var guide = document.createElement('div');
          guide.className = 'dsh-tweaks-guide';
          var guideTimer = 0;
          function updateGuide(w) {
            guide.style.width = clampSwipeRange(w) + '%';
            guide.classList.toggle('is-right', drawerOnRight());
          }
          function showGuide(w) {
            clearTimeout(guideTimer);
            updateGuide(w);
            guide.style.display = 'block';
          }
          function hideGuideSoon() {
            clearTimeout(guideTimer);
            guideTimer = setTimeout(function () { guide.style.display = 'none'; }, 700);
          }
          overlay.appendChild(guide);
          var card = document.createElement('div');
          card.className = 'dsh-tweaks-card';

          var head = document.createElement('div');
          head.className = 'dsh-tweaks-card-head';
          var title = document.createElement('div');
          title.className = 'dsh-tweaks-card-title';
          title.textContent = '主页排版设置';
          var version = document.createElement('span');
          version.className = 'dsh-tweaks-version';
          version.textContent = 'v' + VERSION;
          var headValue = document.createElement('span');
          headValue.className = 'dsh-tweaks-card-value';
          head.appendChild(title);
          head.appendChild(version);
          head.appendChild(headValue);

          var body = document.createElement('div');
          body.className = 'dsh-tweaks-card-body';

          var sub = document.createElement('div');
          sub.className = 'dsh-tweaks-card-sub';
          sub.textContent = '拖动滑杆实时预览侧栏宽度（45–80%）；点击卡片外区域关闭';

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

          var rangeHead = document.createElement('div');
          rangeHead.className = 'dsh-tweaks-range-head';
          var rangeLabel = document.createElement('span');
          rangeLabel.textContent = '滑动检测范围';
          var rangeValue = document.createElement('span');
          rangeValue.textContent = storedSwipeRange() + '%';
          rangeHead.appendChild(rangeLabel);
          rangeHead.appendChild(rangeValue);

          var rangeSlider = document.createElement('div');
          rangeSlider.className = 'dsh-tweaks-slider dsh-tweaks-range-slider';
          var rangeTrack = document.createElement('div');
          rangeTrack.className = 'dsh-tweaks-track';
          var rangeFill = document.createElement('div');
          rangeFill.className = 'dsh-tweaks-fill';
          var rangeThumb = document.createElement('div');
          rangeThumb.className = 'dsh-tweaks-thumb';
          rangeTrack.appendChild(rangeFill);
          rangeTrack.appendChild(rangeThumb);
          rangeSlider.appendChild(rangeTrack);

          var rangeScale = document.createElement('div');
          rangeScale.className = 'dsh-tweaks-scale';
          var rsMin = document.createElement('span');
          rsMin.textContent = SWIPE_MIN + '%';
          var rsMax = document.createElement('span');
          rsMax.textContent = SWIPE_MAX + '%';
          rangeScale.appendChild(rsMin);
          rangeScale.appendChild(rsMax);

          var rangeHint = document.createElement('div');
          rangeHint.className = 'dsh-tweaks-tip';
          rangeHint.textContent = '从当前侧边缘算起，越大越容易呼出';

          function setRangeSlider(n) {
            n = clampSwipeRange(n);
            var pct = (n - SWIPE_MIN) / (SWIPE_MAX - SWIPE_MIN) * 100;
            rangeFill.style.width = pct + '%';
            rangeThumb.style.left = pct + '%';
            rangeValue.textContent = n + '%';
          }
          function fromRangeEvent(e) {
            var r = rangeTrack.getBoundingClientRect();
            if (!r.width) return;
            var ratio = (e.clientX - r.left) / r.width;
            var n = applySwipeRange(Math.round(SWIPE_MIN + ratio * (SWIPE_MAX - SWIPE_MIN)));
            setRangeSlider(n);
            showGuide(n);
          }
          var rangeDragging = false;
          rangeTrack.addEventListener('pointerdown', function (e) {
            rangeDragging = true;
            try { rangeTrack.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
            fromRangeEvent(e);
            e.preventDefault();
          });
          rangeTrack.addEventListener('pointermove', function (e) { if (rangeDragging) fromRangeEvent(e); });
          rangeTrack.addEventListener('pointerup', function () { rangeDragging = false; hideGuideSoon(); });
          rangeTrack.addEventListener('pointercancel', function () { rangeDragging = false; hideGuideSoon(); });
          setRangeSlider(storedSwipeRange());

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

          var sideRow = document.createElement('label');
          sideRow.className = 'dsh-tweaks-switch';
          var sideText = document.createElement('span');
          sideText.textContent = '侧栏放在右侧（左右互换）';
          var sideToggle = document.createElement('input');
          sideToggle.type = 'checkbox';
          sideToggle.checked = drawerOnRight();
          sideToggle.addEventListener('change', function () {
            try { localStorage.setItem('dsh-drawer-side', sideToggle.checked ? 'right' : 'left'); } catch (e) { /* noop */ }
            applyDrawerSide();
            if (guide.style.display === 'block') updateGuide(storedSwipeRange());
          });
          sideRow.appendChild(sideText);
          sideRow.appendChild(sideToggle);

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

          var privacyRow = document.createElement('label');
          privacyRow.className = 'dsh-tweaks-switch';
          var privacyText = document.createElement('span');
          privacyText.textContent = '余额隐私（显示为星号）';
          var privacyToggle = document.createElement('input');
          privacyToggle.type = 'checkbox';
          privacyToggle.checked = balancePrivacyOn();
          privacyToggle.addEventListener('change', function () {
            try { localStorage.setItem('dsh-balance-privacy', privacyToggle.checked ? '1' : '0'); } catch (e) { /* noop */ }
            balanceRevealed = false;
            renderBalanceAmount();
          });
          privacyRow.appendChild(privacyText);
          privacyRow.appendChild(privacyToggle);

          var warningRow = document.createElement('label');
          warningRow.className = 'dsh-tweaks-switch';
          var warningText = document.createElement('span');
          warningText.textContent = '余额预警（≤阈值时数字变红）';
          var warningToggle = document.createElement('input');
          warningToggle.type = 'checkbox';
          warningToggle.checked = balanceWarningOn();
          var thresholdRow = document.createElement('div');
          thresholdRow.className = 'dsh-tweaks-threshold';
          var thresholdLine = document.createElement('label');
          thresholdLine.className = 'dsh-tweaks-switch';
          var thresholdText = document.createElement('span');
          thresholdText.textContent = '预警阈值（元）';
          var thresholdInput = document.createElement('input');
          thresholdInput.className = 'dsh-tweaks-input';
          thresholdInput.type = 'number';
          thresholdInput.min = '0';
          thresholdInput.step = '0.01';
          thresholdInput.value = String(balanceThreshold());
          var thresholdTip = document.createElement('div');
          thresholdTip.className = 'dsh-tweaks-tip';
          thresholdTip.textContent = '余额小于等于该值时，数字显示为红色。';
          function applyThreshold() {
            var n = parseFloat(thresholdInput.value);
            if (!isFinite(n) || n < 0) n = 0;
            try { localStorage.setItem('dsh-balance-threshold', String(n)); } catch (e) { /* noop */ }
            applyBalanceColor();
          }
          thresholdInput.addEventListener('input', applyThreshold);
          thresholdInput.addEventListener('change', applyThreshold);
          thresholdLine.appendChild(thresholdText);
          thresholdLine.appendChild(thresholdInput);
          thresholdRow.appendChild(thresholdLine);
          thresholdRow.appendChild(thresholdTip);
          thresholdRow.style.display = balanceWarningOn() ? 'block' : 'none';
          warningToggle.addEventListener('change', function () {
            try { localStorage.setItem('dsh-balance-warning', warningToggle.checked ? '1' : '0'); } catch (e) { /* noop */ }
            thresholdRow.style.display = warningToggle.checked ? 'block' : 'none';
            applyBalanceColor();
          });
          warningRow.appendChild(warningText);
          warningRow.appendChild(warningToggle);

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

          var closingCard = false;
          function closeCard() {
            if (closingCard || !overlay.parentNode) return;
            closingCard = true;
            overlay.classList.add('dsh-tweaks-closing');
            setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 150);
          }
          overlay.addEventListener('click', function (e) { if (e.target === overlay) closeCard(); });

          body.appendChild(sub);
          body.appendChild(preview);
          body.appendChild(chips);
          body.appendChild(slider);
          body.appendChild(scale);
          body.appendChild(rangeHead);
          body.appendChild(rangeSlider);
          body.appendChild(rangeScale);
          body.appendChild(rangeHint);
          body.appendChild(switchRow);
          body.appendChild(sideRow);
          body.appendChild(brandRow);
          body.appendChild(balanceRow);
          body.appendChild(privacyRow);
          body.appendChild(warningRow);
          body.appendChild(thresholdRow);

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

          var usageField = document.createElement('div');
          usageField.className = 'dsh-tweaks-field';
          var manual = manualUsage();
          function mkManualInput(placeholder, value, max) {
            var input = document.createElement('input');
            input.className = 'dsh-tweaks-input';
            input.type = 'text';
            input.maxLength = max;
            input.placeholder = placeholder;
            input.value = value || '';
            input.style.width = '100%';
            input.style.marginBottom = '7px';
            return input;
          }
          var usagePkg = mkManualInput('插件包名（可选，如 dsh-context）', manual && manual.package, 80);
          var usageLabel = mkManualInput('入口文字（如 上下文）', manual && manual.label, 60);
          var scanList = document.createElement('div');
          scanList.className = 'dsh-tweaks-scan-list';
          scanList.style.display = 'none';
          var usageActions = document.createElement('div');
          usageActions.className = 'dsh-tweaks-btn-row';
          var scanBtn = document.createElement('button');
          scanBtn.type = 'button';
          scanBtn.className = 'dsh-tweaks-save';
          scanBtn.textContent = '扫描当前入口';
          scanBtn.style.flex = '1';
          scanBtn.className = 'dsh-tweaks-save dsh-tweaks-secondary';
          var testBtn = document.createElement('button');
          testBtn.type = 'button';
          testBtn.className = 'dsh-tweaks-save';
          testBtn.textContent = '验证入口';
          testBtn.style.flex = '1';
          testBtn.className = 'dsh-tweaks-save dsh-tweaks-secondary';
          var usageSave = document.createElement('button');
          usageSave.type = 'button';
          usageSave.className = 'dsh-tweaks-save';
          usageSave.textContent = '保存手动入口';
          usageSave.style.width = '100%';
          usageSave.style.marginTop = '7px';
          var usageTip = document.createElement('div');
          usageTip.className = 'dsh-tweaks-tip';
          usageTip.style.whiteSpace = 'pre-line';
          var usageStatus = document.createElement('div');
          usageStatus.className = 'dsh-tweaks-status';
          function setUsageStatus(text, ok) {
            usageStatus.textContent = text || '';
            usageStatus.style.color = ok === true ? '#2da44e' : (ok === false ? '#e5484d' : '');
          }
          usageTip.textContent = '操作顺序：打开目标插件页 → 扫描入口 → 选择名称 → 验证 → 保存。包名可留空。';
          scanBtn.addEventListener('click', function () {
            var items = scanManualEntries();
            scanList.innerHTML = '';
            for (var i = 0; i < items.length; i++) {
              (function (text) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'dsh-tweaks-scan-item';
                b.textContent = text;
                b.addEventListener('click', function () {
                  usageLabel.value = text;
                  setUsageStatus('已选择入口：' + text, null);
                  usageTip.textContent = '请点击「验证入口」确认是否可以定位。';
                });
                scanList.appendChild(b);
              })(items[i]);
            }
            scanList.style.display = items.length ? 'block' : 'none';
            usageTip.textContent = items.length
              ? '扫描结果如下，请选择目标入口：'
              : '未发现可用入口。请启用目标插件，并打开其功能页或展开侧栏入口后重试。';
            setUsageStatus(items.length ? '扫描完成，共 ' + items.length + ' 个入口' : '扫描失败：未发现可用入口', items.length > 0);
          });
          testBtn.addEventListener('click', function () {
            var v = (usageLabel.value || '').trim();
            if (!v) { setUsageStatus('验证失败：请先填写入口文字或执行扫描', false); return; }
            var found = findNavByText(v, true) || findNavByText(v, false);
            if (!found) { setUsageStatus('验证失败：未找到入口「' + v + '」', false); usageTip.textContent = '请确认目标插件已启用，且其页面或侧栏入口已显示。'; return; }
            try {
              found.style.outline = '2px solid #4d6bfe';
              found.style.outlineOffset = '2px';
              setTimeout(function () { found.style.outline = ''; found.style.outlineOffset = ''; }, 1600);
            } catch (e) { /* noop */ }
            setUsageStatus('验证成功：已定位入口「' + v + '」', true);
          });
          usageSave.addEventListener('click', function () {
            var obj = {
              package: (usagePkg.value || '').trim(),
              label: (usageLabel.value || '').trim(),
            };
            try {
              if (!obj.package && !obj.label) localStorage.removeItem('dsh-usage-entry');
              else localStorage.setItem('dsh-usage-entry', JSON.stringify(obj));
            } catch (e) { /* noop */ }
            if (!obj.package && !obj.label) {
              setUsageStatus('已清空，恢复自动识别', null);
              return;
            }
            var savedFound = obj.label ? (findNavByText(obj.label, true) || findNavByText(obj.label, false)) : null;
            if (obj.label && !savedFound) setUsageStatus('保存成功，但当前未定位到「' + obj.label + '」', false);
            else setUsageStatus('保存成功', true);
          });
          usageField.appendChild(usagePkg);
          usageField.appendChild(usageLabel);
          usageField.appendChild(scanList);
          usageActions.appendChild(scanBtn);
          usageActions.appendChild(testBtn);
          usageField.appendChild(usageActions);
          var deleteBtn = document.createElement('button');
          deleteBtn.type = 'button';
          deleteBtn.className = 'dsh-tweaks-save dsh-tweaks-danger';
          deleteBtn.textContent = '删除手动入口';
          deleteBtn.style.width = '100%';
          deleteBtn.style.marginTop = '7px';
          deleteBtn.addEventListener('click', function () {
            try { localStorage.removeItem('dsh-usage-entry'); } catch (e) { /* noop */ }
            usagePkg.value = '';
            usageLabel.value = '';
            scanList.innerHTML = '';
            scanList.style.display = 'none';
            setUsageStatus('已删除手动入口', null);
          });
          usageField.appendChild(usageSave);
          usageField.appendChild(deleteBtn);
          usageField.appendChild(usageTip);
          usageField.appendChild(usageStatus);
          var help = document.createElement('details');
          help.className = 'dsh-tweaks-help';
          var helpSummary = document.createElement('summary');
          helpSummary.textContent = '填写说明与匹配顺序';
          var helpBody = document.createElement('div');
          helpBody.className = 'dsh-tweaks-help-body';
          helpBody.textContent = '1. 启用目标用量插件，并打开其功能页或展开侧栏入口。\n2. 点击「扫描当前入口」，在结果中选择该插件的导航名称（例如「上下文」）。\n3. 点击「验证入口」。入口出现蓝色描边表示定位成功；未出现时，请确认插件已启用并重新扫描。\n4. 点击「保存手动入口」。\n5. 点击侧栏余额数字，选择「查看用量」。\n\n插件包名：可在「设置 → 插件」中查看，非必填；填写后，对应插件停用时手动入口会自动删除。\n\n匹配顺序：\n1. 手动入口：定位成功时直接跳转。\n2. 自动识别：手动入口未定位时，使用已启用的用量/上下文插件。\n3. 平台用量页：以上均未定位时打开。\n\n入口文字须与插件实际显示的名称一致，避免填写「设置」「更多」等通用名称。';
          help.appendChild(helpSummary);
          help.appendChild(helpBody);
          usageField.appendChild(help);
          body.appendChild(usageField);
          cleanupManualEntry().then(function (removed) {
            if (!removed) return;
            usagePkg.value = '';
            usageLabel.value = '';
            scanList.innerHTML = '';
            scanList.style.display = 'none';
            setUsageStatus('对应插件已停用，手动入口已自动删除', false);
          });
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
            if (document.getElementById('dsh-tweaks-card-overlay') || document.getElementById('dsh-balance-menu')) return;
            if (target && target.closest && target.closest('#dsh-mobile-menu, #dsh-tweaks-card-overlay, #dsh-balance-menu')) return;
            if (target && target.closest && target.closest('pre, code, input, textarea, select, [contenteditable="true"]')) return;
            var collapsed = f.hasAttribute('data-sidebar-collapsed');
            var rightSide = drawerOnRight();
            var range = storedSwipeRange();
            if (collapsed) {
              if (rightSide) {
                if (t.clientX < window.innerWidth * (1 - range / 100)) return;
              } else if (t.clientX > window.innerWidth * range / 100) return;
            }
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
            var rightSide = drawerOnRight();
            if (mode === 'open') {
              if (rightSide ? dx < -60 : dx > 60) setDrawer(true);
            } else if (mode === 'close') {
              if (rightSide ? dx > 60 : dx < -60) setDrawer(false);
            }
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
