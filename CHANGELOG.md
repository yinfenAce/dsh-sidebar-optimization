# Changelog

## 0.2.6 — 2026-11-07

- Menu subtitle changed to 「第三方插件 / 平台用量」.
- Generic usage-plugin detection: any enabled plugin whose id/name matches `context`, `usage`, `token-usage` or `token-meter` is considered; `dsh-context` still preferred.
- Bundle enablement is authoritative: a disabled bundle falls back to the platform page even if its individual loader entry looks enabled.
- The plugin's own id and mobile-adapt are excluded from the match.

## 0.2.5 — 2026-11-07

- 「查看用量」 now checks the plugin manager for **installed + enabled** usage plugins instead of only looking for a sidebar entry.
- Candidates: `dsh-context`, `dsh-usage`, `dsh-token-usage`, `dsh-token-meter`.
- If the matched plugin is disabled or absent, it opens `https://platform.deepseek.com/usage`.
- Opening a non-context usage plugin uses its own bundle id, not a hardcoded `dsh-context`.

## 0.2.4 — 2026-11-07

- 「查看用量」 now falls back to `https://platform.deepseek.com/usage` when the `dsh-context` plugin is not installed, instead of a disabled item.
- When `dsh-context` is installed, the same entry still opens the Context panel.

## 0.2.3 — 2026-11-07

- Balance quick actions: tap only the amount (not the label or colon) to open a small menu.
- 「查看用量」 opens the installed `dsh-context` plugin (Context / 上下文洞察) when present; otherwise the option is disabled.
- 「充值」 opens `https://platform.deepseek.com/top_up`.
- The menu closes on outside tap, Escape, or when the drawer closes.

## 0.2.2 — 2026-11-07

- Fix: remove the drawer/backdrop `z-index` override that covered sidebar popovers. The workspace filter/sliders button and the settings dialog now open normally.
- Trade-off: the drawer no longer forces itself above plugin dialogs; the normal mobile-adapt layer order is restored.

## 0.2.1 — 2026-11-07

- Swipe detection range is now adjustable from 20% to 80% (default 33%).
- While dragging the range slider, a flashing light-blue guide shows the active zone in real time; it sits below the settings card so the card stays readable.

## 0.2.0 — 2026-11-07

- Left/right layout swap: sidebar to the right, right panel to the left.
- Reversed swipe: open from the right third with a left swipe, close with a right swipe.
- ☰ defaults to the right edge when mirror mode is on; a saved drag position still wins.

## 0.1.1 — 2026-11-07

- Broaden the declared compatibility: DSH `0.2.x` (>=0.2.0-rc.2 <0.3.0), DSHBox 1.4+/1.5.x, Android 10+.
- README now separates the **declared** range from the **tested** combination (DSHBox 1.5.1 / DSH 0.2.1-rc.5 / Android 14).

## 0.1.0 — 2026-11-07

首个公开版本。

### 侧栏
- 45–80% 宽度，预设 50 / 60 / 70，设置卡片内实时预览
- 点右侧空白关闭，点会话自动收起
- 整列自由滚动，底部设置吸底
- 左侧 1/3 区域右滑呼出（实验性），抽屉内左滑关闭
- ☰ 长按拖动，松手吸附到最近的左右边缘，位置记忆
- 可隐藏侧边栏 DeepSeek 标识
- 可选余额：仅在隐藏标识时显示，两位小数，标签可自定义 2–4 字（重启 DSH 生效），每次打开侧栏刷新

### 体验
- 触屏点按不再出现焦点蓝框，键盘焦点环保留
- 复制兜底（Clipboard API → execCommand），每个代码块带「复制」按钮
- 顶部视图/轨迹切换淡入上移动画
- 键盘 `visualViewport` 跟随
- 长会话 `content-visibility`，键盘弹起只重排可见消息

### 兼容
- DSHBox 1.5.1
- DSH 0.2.1-rc.5
- Android 14（系统 WebView）
