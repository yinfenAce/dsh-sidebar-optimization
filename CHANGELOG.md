# Changelog

## 0.8.4 — 2026-11-08

- 修复 0.8.3 客户端版本号仍显示 0.7.6：VERSION 常量随发版同步。
- 新增 CI 校验：package.json 版本必须与 lib/client.js 的 VERSION 一致。
- 反馈问题返回后清掉状态提示；复制提示 3 秒消失；反馈按钮 1.2 秒防重复。
- 开关行不再使用 label，只有开关本体响应，点文字不会误触。
- 修复“账户没有 AUTO 钱包”误报：auto 不再被当成真实币种。
- README 截图更新到 v0.8.4。

## 0.8.3 — 2026-11-08

- 反馈问题：复制失败不再误报“已复制”，区分成功/失败状态。
- 反馈 Issue 使用紧凑 JSON，最近错误截断到 1200 字符，避免 URL 过长。
- 诊断信息读取设置失败时不会让反馈按钮失效；全局错误附带来源文件/行号。

## 0.8.2 — 2026-11-08

- 诊断区新增「反馈问题」：复制诊断信息并打开预填环境的 GitHub Issue。
- 启动时记录全局 error / unhandledrejection 到最近错误，便于用户反馈。
- 仍不采集余额、聊天或账号；反馈内容只含版本、UA、视口和插件设置。

## 0.8.1 — 2026-11-08

- 撤销 0.8.0 的实验性双击快捷面板，恢复 0.7.6 的单击开关侧栏、长按拖动 ☰。
- 清除快捷面板的脚本、样式和 README 文案，避免残留误触。
- 逐项复核原有功能：场景、宽度、滑动范围、左右布局、手势/动效、标识隐藏、余额与隐私/预警、阅读密度、强调色、币种、备份/诊断/语言、手动入口。

## 0.7.6 — 2026-11-08

- 修复强调色启动后回到白色：初始化时 ACCENTS 表尚未就绪，accentPref 异常被吞掉。
- 同一问题也影响阅读密度的启动恢复，已一并修复。
- 每次打开设置卡片时重新应用强调色和阅读密度，避免根节点样式被重置。

## 0.7.5 — 2026-11-08

- 侧栏实时预览框的填充改为跟随强调色；未选强调色时跟随主题前景色。
- 修复标题版本号 v0.7.4 与百分比 60% 粘在一起的问题，标题区增加间距。

## 0.7.4 — 2026-11-08

- 滑动范围提示默认从淡蓝改为淡白。
- 提示色跟随强调色：描边、背景和内侧光晕都由当前强调色生成；默认强调色时为白色。

## 0.7.3 — 2026-11-08

- 移除强制余额刷新的 250ms 冷却，手动刷新和币种切换更跟手。
- 币种切换遇到余额请求进行中会自动排队重试，不再出现“按钮变了但余额没变”。
- 低额红点仍使用持久状态 + 后台预取，不会因去掉冷却而闪烁。

## 0.7.2 — 2026-11-08

- 自审 117 条英文文案，修正不自然/不一致的措辞与单复数。
- 调整 One-handed、Show fewer colors、characters、剪贴板提示和英文引号。
- 未发现意思反转的硬错误；英文仍标记为初版/社区翻译，非母语认证。

## 0.7.1 — 2026-11-08

- 修复英文长文案导致的挤压/重叠：标题省略、开关换行、按钮自动增高、Tab/场景/颜色缩排。
- Toast 增加最大宽度；余额菜单按英文长文案加宽。
- 英文为初版静态翻译，不调用运行时翻译服务；欢迎指出不自然措辞。

## 0.7.0 — 2026-11-08

- 新增中英文界面：自动跟随系统语言，也可在「通用」手动切换中文/English。
- 卡片、标签、开关、帮助、状态、toast、余额菜单和代码复制按钮接入英文文案。
- 英文界面下默认余额标签为 Balance；自定义标签保持不变。
- 语言设置进入备份、恢复和诊断信息。

## 0.6.5 — 2026-11-08

- 低额红点改为持久化布尔状态，打开侧栏立即显示上次结果；启动时后台预取余额。
- 强制刷新继续 250ms 去重，避免打开时重复请求。
- 币种选择按账户实际钱包动态生成，每行 3 个自动换行；支持任意 3–5 位币种代码。

## 0.6.4 — 2026-11-08

- 修复打开侧边栏时低额红点闪烁：刷新期间保留低额状态，不再先移除再加回。
- 强制刷新增加 250ms 去重，避免打开时多个观察器连续触发两次余额请求。

## 0.6.3 — 2026-11-08

- 强调色扩展为经典色 + 过渡色：红橙、橙黄、黄绿、绿青、青蓝、蓝紫、紫红。
- 移除原先不协调的青/粉/青绿/靛四个杂色。
- 余额币种仅在账户有多个钱包时显示；单币种账户隐藏，避免无意义切换。

## 0.6.2 — 2026-11-08

- 修复 CI 测试桩缺少 `dataset` 导致 v0.6.1 发布失败的问题。
- 强调色、多币种与按钮配色随 v0.6.1 一起发布。

## 0.6.1 — 2026-11-08

- 强调色经典色置顶：默认、红、橙、黄、绿、蓝、紫；更多颜色可展开。
- 默认色改为文字按钮，不再使用黑色色块。
- 主操作按钮跟随强调色，并根据背景亮度自动切换黑/白文字。
- 余额币种按账户实际钱包启用/禁用；选择不存在的币种会提示并切回自动。

## 0.6.0 — 2026-11-08

- 显示新增强调色：默认、蓝、绿、紫、橙；只影响插件标签、开关、滑杆和选中态。
- 显示新增余额币种：自动 / CNY / USD；自动优先 CNY，不存在时回退第一个钱包。
- 预警阈值改为“金额”中性文案，快捷值改为 1 / 5 / 10。
- 强调色和余额币种进入备份、恢复和诊断信息。

## 0.5.1 — 2026-11-08

- 阅读密度改为覆盖 DSH 的 `--dsh-content-font-size` / `--dsh-content-font-delta` 变量，字号和行高真正作用到聊天内容。
- 阅读密度滑动条改为与宽度/滑动范围一致的轨道和圆点样式，并显示已选进度。

## 0.5.0 — 2026-11-08

- 显示新增阅读密度：正文字号 13–20、行高 1.3–2.0、消息间距 0–24。
- 「阅读」场景会同时开启阅读密度（16px / 1.8 / 12px）并关闭界面动效。
- 阅读设置进入备份、恢复和诊断信息。

## 0.4.0 — 2026-11-07

- 界面新增场景预设：默认、单手、阅读、全屏；一键设置宽度、左右布局、滑动范围和动效。
- 通用新增诊断信息：复制插件版本、UA、视口、当前设置和最近错误；不包含余额、聊天或账号。
- 标签指示条和联动行动画随界面动效开关生效。

## 0.3.23 — 2026-11-07

- 标签栏增加滑动指示条，切换「界面 / 显示 / 通用」时会滑到当前标签。
- 「界面动效」关闭时指示条立即跳转，不播放滑动动画。

## 0.3.22 — 2026-11-07

- 切换「界面 / 显示 / 通用」标签时增加淡入上移动画。
- 打开/关闭余额隐私时，自动隐藏行增加展开/收起动画。
- 打开/关闭余额预警时，阈值区域增加展开/收起动画。
- 关闭「界面动效」后，上述动画与原有卡片/菜单/视图动画全部立即完成。

## 0.3.21 — 2026-11-07

- 界面：新增「重置 ☰ 位置」，清除拖动位置并恢复默认。
- 界面：新增「界面动效」开关；关闭后卡片、提示、菜单和视图切换立即完成。
- 显示：余额低于阈值时，侧栏「主页排版设置」行显示红点；余额隐藏或预警关闭时不显示。
- 设置备份包含界面动效和 ☰ 位置；恢复默认会一并清除。

## 0.3.20 — 2026-11-07

- 自动隐藏秒数输入框宽度改为与预警阈值一致（88px）。
- 余额预警阈值增加上限 999999，超出时自动收敛到上限。

## 0.3.19 — 2026-11-07

- 「通用」底部补充恢复默认的清除范围与不影响范围。
- 去掉备份输入框右下角的缩放手柄，以及数字输入框的上下箭头。

## 0.3.18 — 2026-11-07

- 侧栏宽度上限从 80% 提高到 100%，并增加 100% 预设。
- 余额隐私支持自定义自动隐藏倒计时（5–600 秒，默认 30 秒）。
- 余额预警阈值增加 1 / 5 / 10 元快捷值。
- 「通用」标签新增设置备份、从文本恢复、读取剪贴板、恢复默认设置。
- 三个标签改为「界面 / 显示 / 通用」。

## 0.3.17 — 2026-11-07

- 设置卡片改为顶部分类标签：布局与手势、显示与余额、用量入口。
- 默认选中第一项；点击其他标签直接切换对应内容，不再使用折叠分组。
- 切换标签时重置卡片内容滚动位置；标签栏固定在卡片顶部，不随内容滚动。

## 0.3.16 — 2026-11-07

- 设置分组默认全部折叠；打开卡片即可同时看到「布局与手势 / 显示与余额 / 用量入口」三个标题。
- 卡片顶部增加“点击分组标题展开或折叠”的提示。

## 0.3.15 — 2026-11-07

- 设置卡片按「布局与手势 / 显示与余额 / 用量入口」分组；前两组默认展开，用量入口默认折叠，减少滚动。
- 增加截图说明：实机截图摄于 v0.3.13，后续版本仅增量修改，因此暂用旧图。
- 增加 `npm run release` 本地发布脚本入口。

## 0.3.14 — 2026-11-07

- 余额隐私：关闭侧栏或切换后台后自动恢复 `****`，避免展开状态被保留。
- 余额菜单新增「刷新余额」，无需关闭再打开侧栏。
- 余额预警阈值清空时不再变成 0；失焦后恢复为已保存值。
- 设置卡片支持 `Esc` 关闭；重复打开时清理旧键盘监听。
- 修复 `account.getBalance` 同步抛错时刷新状态卡死的问题。

## 0.3.13 — 2026-11-07

- Balance privacy: off by default; when enabled the amount shows `****` and an eye-slash button appears. Tapping the eye reveals the amount and removes the slash; tapping again hides it.
- Balance warning: off by default; when enabled, a threshold row appears with a default of ¥1. The amount turns red when the balance is less than or equal to the threshold.
- Threshold is editable (≥0) and remembered; disabling the warning hides the threshold row.
- Privacy/warning are independent of the show-balance switch.

## 0.3.12 — 2026-11-07

- Removed the card × button (a native floating overlay covered it); tapping outside now closes with a 140ms fade/scale-out.
- Added 「删除手动入口」.
- If a manual entry has a package name and that plugin is disabled/absent, the entry is removed automatically on load and when the card opens.
- Card hint now says tapping outside closes.

## 0.3.11 — 2026-11-07

- Motion polish: settings card fades/scales in (160–180ms), balance menu fades/slides in (140ms); no layout or behavior changes.
- Conflict guards: page swipes are ignored while the settings card or balance menu is open; opening the card closes the balance menu first.
- Audited existing paths: drawer width/side/swap, swipe, ☰ drag/snap, brand/balance, manual priority, copy, view animation, keyboard and long-chat rules are unchanged.

## 0.3.10 — 2026-11-07

- Manual-entry instructions rewritten in formal, numbered steps; the detailed guide is collapsed by default, with a one-line operation order above the fields.
- Status wording: 扫描完成/失败、验证成功/失败、保存成功/失败; red/green feedback remains.
- Section title changed to 「填写说明与匹配顺序」.

## 0.3.9 — 2026-11-07

- Scanner filters out the balance amount, conversation/system tabs (`对话`, `轨迹`), command/thinking cards, session rows, and the plugin's own UI; only plugin navigation/tab labels remain.
- Test and save now show a colored status line: green on success, red on failure/not found. Save also verifies that the entry currently exists.
- Selecting a scan result shows a clear status; saving a label that is not currently found warns instead of silently falling back.

## 0.3.8 — 2026-11-07

- Scan results are now a visible list of tappable labels instead of a native select with a blank placeholder.
- Scan/test buttons use a secondary outline style; buttons no longer visually merge.
- Tutorial copy rewritten in plain steps; removed 「最快」/「兜底」 wording.

## 0.3.7 — 2026-11-07

- Scanner now only lists navigation entries (sidebar + header/view tabs), not conversation command/tool cards.
- Manual form layout: scan/test/save buttons have proper spacing; the full tutorial is open by default.
- Priority is explicit: manual entry > auto-detected enabled plugin > platform usage page.
- Manual failures fall through to auto detection instead of jumping straight to the platform page.

## 0.3.6 — 2026-11-07

- Manual entry guidance: 「扫描当前入口」 lists visible sidebar/tab labels, 「测试入口」 highlights the matched target without navigating.
- Saved/label matching is restricted to navigation containers (sidebar, header tabs, view tabs) and skips external links; the manual entry cannot be used as an arbitrary button/link clicker.
- Manual hints explain what to fill and that it only opens installed plugin entries, never external URLs.

## 0.3.5 — 2026-11-07

- Removed the arbitrary page-URL field from the manual usage entry. A user-supplied URL could be used as a redirect/phishing entry and get the plugin reported.
- Manual entry is now only 「插件包名 + 入口文字」; external navigation is limited to the hardcoded official `platform.deepseek.com` usage/top-up pages.

## 0.3.4 — 2026-11-07

- Manual usage entry is now a proper form: plugin package name, entry label, and optional page URL.
- Package name identifies the plugin/enabled state; entry label clicks the feature tab/sidebar item; URL opens directly.
- `dsh-usage-entry` stores JSON; the old plain-label value is still read as a label.

## 0.3.3 — 2026-11-07

- Auto usage-plugin matching now includes the localized plugin title and Chinese keywords `用量` / `上下文`, so newly added usage plugins are detected more often.
- The manual 「用量入口文字」 field accepts multiple candidates separated by `,` / `|` / `，`; it is used only when auto detection fails.
- Context matching has a safe prefix fallback for visible tabs and sidebar entries, so a badge/suffix does not break the jump.
- Draggable ☰ snap animation: both left and right snaps now animate via `left` pixels instead of `left → auto`/`right`, fixing the right-side teleport.

## 0.3.2 — 2026-11-07

- Fix: the v0.3.1 fast path could click an unrelated 「上下文」 element and then close the drawer with no jump.
- Navigation matching is exact first (with a loose fallback only for custom entry/title), and the drawer is closed only after a real target is found.
- The speed win stays via the 60s plugin-state cache and prefetch; no blind click.

## 0.3.1 — 2026-11-07

- Faster usage jump: if the Context feature tab/sidebar entry is already present, click it immediately instead of waiting for the plugin-manager query.
- Plugin-manager usage state is cached for 60s and warmed on load/menu open; non-context plugins no longer query on every tap.
- Drawer close after the jump is 80ms instead of 280ms.

## 0.3.0 — 2026-11-07

- Generic usage entry: a new 「用量入口文字」 setting lets the user type the sidebar/tab label of any usage plugin (e.g. `上下文`, `用量`); the balance menu clicks that entry directly.
- Leave it empty to keep automatic detection by bundle id/title; if the custom entry is not found, usage falls back to the platform page.
- This covers plugins that do not match the built-in `context` / `usage` / `token-*` names.

## 0.2.9 — 2026-11-07

- Generic feature-entry adaptation: for an enabled usage/context plugin, find its sidebar or conversation-view tab by the plugin's localized `meta.title` (or label) and click it, instead of opening the bundle config page.
- `pluginNavigation.openBundle` is no longer used as a usage fallback; if no feature entry is found, usage falls back to the platform page.
- New plugins can be adapted by adding their bundle id/label to `USAGE_BUNDLES`, or by registering a sidebar/tab entry whose text matches the plugin title.

## 0.2.8 — 2026-11-07

- Fix: Context opened the plugin **configuration** page instead of its feature view.
- The jump now finds the `上下文` / `上下文洞察` conversation-view tab or sidebar entry (the context plugin's `tab.context` label is 「上下文」).
- For `dsh-context`, `pluginNavigation.openBundle` is no longer used as a fallback because it opens the config page; if no tab/entry is found, usage falls back to the platform page.

## 0.2.7 — 2026-11-07

- Fix: `dsh-context` enabled but not detected. Usage-plugin matching now reads `entryId`/`moduleName` from `pluginManager/listPlugins`; bundle and plugin-manager calls fall back to the host RPC when the client remote namespace is absent.
- Context navigation uses the matched context entry, so an enabled Context bundle opens even when its bundle id is not literally `dsh-context`.
- Balance-not-ready toast now uses the custom label: 「正在获取{label}…」 / 「暂时获取不到{label}」.

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
