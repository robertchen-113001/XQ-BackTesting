# shadcn/ui 組件庫使用技能

此技能提供 shadcn/ui 組件的安裝、使用與樣式規範，適用於本專案（Vite + React 18 + Tailwind）。

---

## 核心工作流程

1. `npx shadcn@latest info --json` — 確認專案配置（aliases、style、tailwindVersion 等）
2. `npx shadcn@latest search` — 安裝前先搜尋可用組件（**必做**）
3. `npx shadcn@latest docs <component>` — 查閱組件文件
4. `npx shadcn@latest add <component>` — 安裝組件（加入原始碼至專案）
5. 更新組件時使用 `--dry-run` 與 `--diff` 確認差異後再執行

## Tailwind 樣式規範

- **顏色**：使用語義 token（`bg-primary`、`text-foreground`），禁用原始色值（`bg-blue-500`）
- **間距**：以 `flex` + `gap-*` 取代 `space-x-*` / `space-y-*`
- **尺寸**：寬高相同時用 `size-*`（如 `size-4` 等同 `w-4 h-4`）
- **條件樣式**：使用 `cn()` 工具函式合併 class

## 表單組件

| 情境 | 組件組合 |
|------|---------|
| 基本欄位 | `FieldGroup` + `Field` |
| 文字輸入 | `InputGroup` + `InputGroupInput` |
| 多行文字 | `InputGroup` + `InputGroupTextarea` |
| 多選（2–7 項） | `ToggleGroup` |
| 欄位驗證狀態 | `Field[data-invalid]` + `control[aria-invalid]` |

## 組件組合規則

- 子元件需在對應 **Group 容器**內，不可脫離使用
- 自訂觸發器：Radix 組件用 `asChild`，Base 組件用 `render`
- `Dialog`、`Sheet`、`Drawer` 必須包含可見標題（accessibility）
- `Avatar` 必須搭配 `AvatarFallback`，防止無圖片時破版

## 關鍵配置欄位（shadcn.json）

| 欄位 | 說明 |
|------|------|
| `aliases` | 路徑別名設定 |
| `isRSC` | 是否使用 React Server Components（本專案為 false） |
| `tailwindVersion` | Tailwind 版本（v3） |
| `style` | 樣式主題（default / new-york） |
| `iconLibrary` | 圖示庫（lucide-react） |
| `framework` | 框架（vite） |
| `packageManager` | 套件管理器（npm） |

## 本專案注意事項

- 本專案為 Vite + React 18 + Tailwind v3（**非** Next.js，`isRSC = false`）
- 所有樣式透過 Tailwind Utility Classes，禁止手寫 .css / .scss
- 安裝組件後請確認 `cn()` 已在 `src/lib/utils.js` 中定義
