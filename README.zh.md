# 侧边栏优化 · dsh-sidebar-optimization

[English](README.md) | **中文**

[![CI](https://github.com/yinfenAce/dsh-sidebar-optimization/actions/workflows/ci.yml/badge.svg)](https://github.com/yinfenAce/dsh-sidebar-optimization/actions/workflows/ci.yml)
![version](https://img.shields.io/github/v/tag/yinfenAce/dsh-sidebar-optimization?label=version) · **v0.7.4** · [更新记录](CHANGELOG.md)

面向 [DSHBox](https://github.com/WSK-build/DSHBox) / DeepSeek Harness 的移动端侧边栏优化插件。它是纯客户端插件，不替换内置的 `@local/dsh-mobile-adapt`，只覆盖部分移动端样式并增加交互。

## 界面语言

设置卡片默认跟随系统语言；可在「通用」里切换 **自动 / 中文 / English**。英文为初版静态翻译，不调用运行时翻译服务；措辞改进请见 [TRANSLATIONS.md](TRANSLATIONS.md)。

## 截图

![设置卡片](docs/screenshots/settings-real.jpg)

*实机截图（v0.3.13；0.3.14 增加余额刷新与自动恢复星号）。*

![余额隐私与预警](docs/screenshots/settings-privacy.jpg)

*余额隐私与低额预警。*

![手动用量入口](docs/screenshots/settings-manual.jpg)

*手动用量入口。*

> 截图摄于 **v0.3.13**。后续版本只做增量修改和分类标签，暂未重拍；当前界面改为「界面 / 显示 / 通用」三个顶部标签，宽度上限提升到 100%；具体以最新 Release 为准。

## 功能

- **侧栏宽度可调**：默认 60%，支持 50% / 60% / 70% / 100% 预设和 45%–100% 自定义滑杆，设置会记住；
- **场景预设**：默认、单手、阅读、全屏；一键设置宽度、左右布局、滑动范围和动效；
- **阅读密度**：正文字号 13–20px、行高 1.3–2.0、消息间距 0–24px；「阅读」场景会自动启用 16px / 1.8 / 12px。
- **强调色**：默认、红、橙、黄、绿、蓝、紫，更多过渡色可展开；影响插件标签、开关、滑杆和主按钮；
- **余额币种**：按账户实际钱包动态生成，每行 3 个；仅在多个钱包时显示，自动优先 CNY。
- **诊断信息**：复制插件版本、UA、视口、当前设置和最近错误；不含余额、聊天或账号。
- **左右布局互换**：侧栏可移到右侧，滑动方向同步反转；
- **滑动范围可调**：20%–80%，调整时显示当前强调色的范围提示（默认淡白）；
- **☰ 位置重置**：长按仍可拖动；界面页提供重置按钮，恢复默认位置；
- **界面动效开关**：分组切换、隐私/预警联动行也带过渡；关闭后卡片、提示、范围提示、菜单、分组和视图切换立即完成；
- **低额预警红点**：余额低于阈值时，侧栏「主页排版设置」行显示红点；记住上次低额状态，打开侧栏立即显示，不显示金额。
- **点击空白关闭**：点击右侧空白区域收起侧栏；
- **自由滚动**：面板、会话列表、底部区域作为一列滚动；
- **长会话性能**：消息使用 `content-visibility: auto`，减少键盘弹起时的重排；
- **键盘跟随**：通过 `visualViewport` 立即调整根高度，减少输入框延迟；
- **☰ 可拖动**：长按拖动，松手吸附到最近一侧，位置会记住；
- **复制修正**：Clipboard API 失败时使用 textarea 兜底，代码块提供“复制”按钮；
- **视图切换动画**：切换对话/轨迹时淡入并轻微上移；
- **余额显示**：可选显示账户余额，保留两位小数；
- **余额隐私自动恢复**：关闭侧栏或切换后台后恢复 `****`；
- **刷新余额**：余额菜单中可直接重新获取；
- **余额隐私**：开启后金额显示为 `****`，右侧出现带斜线的眼睛按钮；点击眼睛显示余额，再点恢复星号；
- **余额预警**：开启后显示阈值设置，默认 ¥1；余额小于等于阈值时数字变红，阈值可自定义（0–999999）；
- **自动隐藏倒计时**：隐私开启时，展开余额后 5–600 秒自动恢复 `****`，默认 30 秒；
- **阈值快捷值**：1 / 5 / 10 元一键设置；
- **设置备份**：复制当前设置、从文本恢复、恢复默认设置；重置会清除宽度、布局、滑动/手势、标识隐藏、余额/隐私/预警、自动隐藏、标签、手动入口和 ☰ 位置，不影响 DSH 账号、余额数据、聊天记录和其他插件；恢复后页面重载。
- **用量入口**：优先手动入口，其次自动识别已启用的用量/上下文插件，最后打开官方平台用量页；
- **顶部分类标签**：界面、显示、通用；默认第一个，点击切换对应内容，标签指示条会滑动；
- **设置卡片可滚动**：屏幕较矮时内容可滚动，不遮挡操作。

## 安装

从 GitHub 源码安装：

```sh
dsh plugin --profile web add github:yinfenAce/dsh-sidebar-optimization
```

或使用 Release 的固定版本 tarball：

```sh
dsh plugin --profile web add https://github.com/yinfenAce/dsh-sidebar-optimization/releases/download/v0.7.4/dsh-sidebar-optimization-0.7.4.tgz
```

安装后需要**完全退出 DSHBox 再启动**；只刷新页面不会重新加载客户端插件。

## 使用

1. 打开侧栏；
2. 点击“主页排版设置”；
3. 在卡片中调整宽度、滑动范围、余额隐私/预警、手动用量入口；
4. 点击卡片外区域关闭。

手动用量入口的优先级：

```text
手动入口 → 自动识别（已启用插件） → 官方平台用量页
```

## 兼容性

- **DSHBox**：1.4+ / 1.5.x，需启用内置 `@local/dsh-mobile-adapt`；实测 1.5.1；
- **DSH**：声明 `>=0.2.0-rc.2 <0.3.0`，实测 0.2.1-rc.5；
- **Android**：10+，使用系统 WebView；实测 Android 14；
- **视口**：≤ 1024px；桌面布局不做修改。

## 开发

```sh
npm run check
npm test
npm pack --dry-run
```

- [架构说明](docs/ARCHITECTURE.md)
- [开发与发布流程](docs/DEVELOPMENT.md)
- [贡献指南](CONTRIBUTING.md)
- [安全策略](SECURITY.md)

## 安全

- 纯客户端，宿主半为空实现；
- 不读取本地文件、不启动服务、不收集数据；
- 外部跳转仅限官方 DeepSeek 用量/充值页面；
- 手动用量入口只能点击侧栏/顶部导航项，不接受任意 URL；
- 余额通过宿主账户接口读取，不持久化。

## 许可证

MIT，见 [LICENSE](LICENSE)。
