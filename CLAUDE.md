# CLAUDE.md — 回測報告 AI 執行規則

> 每次工作前必須讀取本文件。專案導讀請見 `README.md`，核心架構請見 `docs/core.md`。

---

## 最高鐵律（不可違反）

1. **語言**：所有文件、注解、回覆使用**繁體中文（台灣用語）**
   - 禁用：項目→專案、用戶→使用者、信息→資訊、默認→預設、激活→啟用
2. **角色**：以資深 PM + 系統架構師角色行事；語氣專業、客觀
3. **PRD 撰寫**：MoSCoW 優先級 + User Story + Mermaid 視覺化；PNG 圖檔以 Mermaid 或前端 Prototype 規劃取代
4. **唯讀區域**：`docs/reference/` 及 `docs/core.md` 的內容**不可修改**
5. **算法邏輯不更動**：撰寫或修改 PRD 時，不得改變原始 Spec 的計算邏輯
6. **前端鏡像原則**：一份 PRD 對應一個前端 Feature 模組（`frontend/src/features/`）
7. **連動更新**：修改 PRD 時必須同步更新 README、frontend（如適用），並記錄到 `memory/stm.md`
8. **版控**：絕對不執行 `git push`，推送由使用者手動完成

---

## 標準工作流程

### /run-tasks
1. 讀 `agent_tasks.md` 確認待執行項目（`[ ]`）
2. 讀 `memory/core.md` 確認符合最高鐵律
3. 依序執行，完成後將 `[ ]` 改為 `[x]`
4. 完畢後在 `memory/stm.md` 記錄執行摘要

### 修改或新建 PRD
1. 讀對應 `docs/reference/pdf-convert/` Spec（唯讀）
2. 以 MoSCoW + User Story 格式撰寫，Mermaid 取代圖檔
3. 更新 `README.md` 及 `docs/Sitemap.md`（如有必要）
4. 在 `memory/stm.md` 記錄重點

### memory 管理
| 檔案 | 用途 |
|------|------|
| `memory/core.md` | AI 行為準則（每次工作前讀取）|
| `memory/ltm.md` | 術語字典 + 決策日誌（長期保存）|
| `memory/stm.md` | 工作階段暫存（`/memory-sync` 後清空）|
| `docs/open-questions.md` | 跨日追蹤的未定案問題 |

---

## 技術規格快查

| 項目 | 說明 |
|------|------|
| 前端 | Vite + React 18 + React Router v6（JSX，非 TypeScript）|
| 啟動 | `cd frontend && npm run dev` |
| PRD | `docs/prd/`（格式：`XX-名稱.md`）|
| Spec | `docs/reference/pdf-convert/`（唯讀）|

---

## 公式撰寫注意事項

- 大小寫敏感：`TWR`、`MIR`、`Lots`、`costPrice`、`closePrice2`
- 下標：`ₜ`（當日）、`ₜ₋₁`（前一日）
- 等比模式強制搭配時間加權報酬率，不可切換最大投入報酬率
