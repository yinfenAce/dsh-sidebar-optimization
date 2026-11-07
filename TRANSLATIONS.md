# Translations

English UI copy is community-maintained. The source of truth is the `EN` object near the top of `lib/client.js`.

## How to contribute

1. Edit **only** the `EN` object values in `lib/client.js`.
2. Keep the Chinese keys unchanged.
3. Do not add URLs, contact details, promotions, political/sexual/violent content, or misleading claims.
4. Run:
   ```sh
   npm test
   ```
5. Open a PR titled `i18n: ...` and describe the changed strings.

Do not edit plugin logic, CSS, or settings keys in a translation PR. Keep the diff limited to `EN` (and tests if needed).

## Glossary

| Chinese | English |
|---|---|
| 侧边栏 | Sidebar |
| 设置卡片 | Settings card |
| 余额 | Balance |
| 隐私 | Privacy |
| 预警 | Warning |
| 阈值 | Threshold |
| 自动隐藏 | Auto-hide |
| 强调色 | Accent color |
| 阅读密度 | Reading density |
| 场景预设 | Scene preset |
| 手动入口 | Manual entry |
| 用量 | Usage |
| 备份 / 恢复 / 重置 | Backup / Restore / Reset |

## Review rules

- All translation PRs are reviewed before merge; no direct writes to `main`.
- Translations must not include external URLs or illegal/abusive content.
- The maintainer may reject any translation without changing the plugin behavior.
- English is an initial community translation; wording improvements are welcome.

## Status

English is a static, built-in table. There is no runtime translation API and no external translation service.
