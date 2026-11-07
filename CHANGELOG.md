# Changelog

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
