# 長期記憶 (Long-Term Memory)

> 由 `memory_sync.py` 定期更新追加，或於每次 `/memory-sync` 執行後自動萃取自 `stm.md`。

---

## 領域字典 (Glossary)

| 術語名稱 | 定義 | 英文對照 |
|----------|------|----------|
| 回測 | 以歷史資料模擬策略執行，評估策略績效 | Backtest |
| 等額 | 每次進場投入固定金額（預設 100 萬）| Fixed Amount |
| 等量 | 每次進場買入固定股數（預設 1,000 股）| Fixed Quantity |
| 等比 | 系統依資金比例自動計算每次投入量 | Proportional |
| 原始 | 自動交易中由使用者腳本自訂的交易數量 | Script-defined |
| 時間加權報酬率 | TWR：消除資金投入時間點影響的報酬率算法 | Time Weighted Return (TWR) |
| 最大投入報酬率 | MIR：以歷史最大投入金額為分母的報酬率算法 | Max Invest Return (MIR) |
| 開倉金額 | 以進場價計算的交易金額（ROUNDDOWN 至整數，永遠為正值）| Position Value |
| 價差 | 出場還原價與進場原始價之差乘以交易數量（ROUNDDOWN 至整數）| Price Spread |
| 毛利 | 所有獲利交易損益之加總（含未實現）| Gross Profit |
| 毛損 | 所有虧損交易損益之加總（含未實現，值為負）| Gross Loss |
| 獲利因子 | 毛利 / ABS(毛損) × SIGN(淨利)，衡量獲利能力 | Profit Factor |
| 最大區間虧損 | MaxDrawdown：從高點到低點的最大回撤幅度 | Max Drawdown (MDD) |
| 最大區間獲利 | MaxRunUp：從低點到高點的最大上漲幅度 | Max Run-Up |
| 夏普比率 | (超額報酬) / (報酬率標準差 × √252)，衡量每單位風險的報酬 | Sharpe Ratio |
| 索提諾比率 | 與夏普比率相似，但只計入下行風險（虧損日的標準差）| Sortino Ratio |
| Beta | 策略報酬率與大盤報酬率的相關係數乘以波動比 | Beta |
| Alpha | 策略超額報酬（扣除無風險利率與市場因子後的剩餘報酬）| Alpha |
| 買進持有報酬 | 所有回測商品在回測區間起點買進、終點賣出的報酬率（含交易成本）| Buy and Hold Return |
| 大盤指數報酬 | 加權指數(TSE.TW) 在回測區間起點買進、終點賣出的報酬率（含交易成本）| TAIEX Return |
| Lots | 系統根據商品定義帶入的合約規模倍數 | Lots |
| 進場還原率 | 個股：進場原始價 / 進場還原價；期貨：期貨還原因子 | Entry Adjustment Rate |
| BTReportNew | 新版回測報告格式，支援所有 UI 功能，無需重新計算 | BTReportNew |
| btreport（舊版）| 舊版回測報告格式，僅支援舊版 UI，重新回測需帶新版參數 | btreport (legacy) |
| 連續次數 | 統計連續獲利或虧損的交易筆數 | Consecutive Times |
| 創新高天數 | 報酬率突破歷史最高點的天數 | Days of New Highs |
| MDD 區間天數 | 從最大回撤高點到最大回撤低點的日曆天數 | MDD Duration |
| 族群透視 | 依上市櫃、細產業、主題分類的績效統計 | Sector Analysis |
| 因子分析 | 依 XS 函數計算的因子值將商品等分 10 組，比較各組績效 | Factor Analysis |
| 週期分析 | 依日 / 月 / 季 / 年頻率分析策略在不同時間週期的表現 | Period Analysis |
| 等比計算 | 等比模式下的特殊計算邏輯，每筆交易視為資金等比分配 | Proportional Calculation |
| 槓桿倍數 | 股票：1 / (1 − 融資比例)；期貨：1 / 保證金成數 | Leverage Ratio |
| Sinker | AP（XQ 應用程式）與 Web UI 的訊息傳遞機制 | Sinker |

> 新增術語時請按筆畫順序排列，確保其他文件引用保持一致。

---

## 決策與架構日誌 (Decision Logs)

<!-- memory_sync.py 追加區域（勿手動修改以下內容）-->
### [2026-03-11 15:45] 前端架構重構：7 PRD Tab + PRD02 改為純 SVG CFD/DFD

- 前端鏡像原則落實：頂層 Tab 結構固定為 7 個（`prd-01` ～ `prd-07`），對應 7 份 PRD 文件，`closable: false`，移除動態 Tab 邏輯
- PRD05 例外處理：`activeTabId === 'prd-05'` 時渲染完整 `ReportInterfacePage`（含 SidebarTree + 內部動態 Tab），其餘 PRD 頁面為靜態展示
- PRD02 圖形策略：使用純 SVG 實作 CFD（系統情境圖）與 DFD（Level-1 資料流圖），無需新增 npm 依賴；SVG 內使用 inline hex 色碼，外部元件使用 `var(--color-*)` 變數
- 舊元件歸檔策略：過期互動元件移至 `_archive/` 子目錄保留歷史，不直接刪除
- CSS 規範確立：全程使用 CSS 變數 `var(--color-*)`，僅 SVG inline 樣式允許直接寫 hex 值
- 各 PRD Feature 模組職責對應：
  - `prd01`：MoSCoW 表 + 適用範圍
  - `prd02`：CFD/DFD 兩子頁籤容器
  - `prd03`：來源說明、統一格式欄位表、匯入規格
  - `prd04`：三平台設定 Tab、通用交易設定表格
  - `prd05`：完整 SidebarTree + TabBar + Monitor（從 App.jsx 搬移）
  - `prd06`：匯出格式表、XLSX 11 分頁清單、模擬下拉選單
  - `prd07`：計算公式分組展示、每日報表欄位表
- 待確認：舊 `features/flow-architecture/`（非 `_archive/` 版本）是否有殘留檔案，需使用者確認後決定是否清除

### [2026-03-11 15:01] PRD 02 流程架構：7 個互動 Prototype 實作完成

- 流程架構 Prototype 已完整實作，共 7 個流程模組，對應 `docs/prd/02-流程架構.md`，前端入口為 `frontend/src/features/flow-architecture/FlowArchitectureDemo.jsx`（Tab 切換外殼）
- 架構分層原則：`flowDefinitions.js` 作為純資料層，UI 元件與資料解耦
- `ExportMenu` 下拉選單定位方案：使用 `position: fixed + getBoundingClientRect()`，可避免父層 `overflow: hidden` 造成裁切
- `BacktestProgressPage` 動畫：`setInterval` 須搭配 `useEffect` cleanup 函式，確保元件 unmount 後計時器停止，防止記憶體洩漏
- `FlowStepIndicator` SVG `viewBox` 依 `steps.length` 動態計算，支援 3～5 步驟，具備複用彈性
- 條件顯示按鈕的 UX 模式：以 `opacity: 0 → 1 transition`（非 `display: none`）實現條件渲染，保留版面空間並提供視覺過渡
- PRD 連動前端的標準做法：PRD 文件（`docs/prd/`）各流程段落補充「元件路徑 ref 標記」，維持文件與程式碼的可追溯性

### [2026-03-11 13:38] Vite 前端原型建立：架構決策與技術快照

- 專案採用 Vite + React 18 + React Router v6（JSX，非 TypeScript）架構，入口為 `frontend/src/main.jsx`，使用 `createRoot` 初始化
- 前端原型共 19 個檔案，功能模組集中於 `frontend/src/components/`，報告子頁籤置於 `frontend/src/components/report/`
- 圖表方案採純 SVG 實作，不引入外部圖表函式庫（Recharts、Chart.js 等）
- CSS 架構以 CSS 變數（`--color-*`, `--font-size-*`）為主，搭配 inline style，設計系統集中於 `frontend/src/index.css`
- Mock 資料統一集中於 `frontend/src/data/mockData.js`，包含監控列表、資料夾樹、報告資料、商品資料、週期資料
- 台股顏色慣例：獲利 = 紅（`#cf1322`），虧損 = 綠（`#389e0d`），與國際慣例相反，須特別注意
- 等比模式下強制使用時間加權報酬率（TWR），`returnAlgo` select 自動 disabled，不可切換最大投入報酬率
- 欄位計算 Spec 第 246 行：`報酬率高點 = MIN(...)` 疑應為 `MAX`，已記錄至 `docs/open-questions.md`，待業主確認
- 交易紀錄 Spec 日期格式 `yyyy:MM:dd` 中冒號疑應為斜線，已記錄至 `docs/open-questions.md`，待確認
- Spec OCR 品質問題：下標符號易出現逗號殘影（如 `t` 下標）、公式缺減號、亂碼（如「W-700/00/35 | E187」），閱讀 Spec 時須人工比對原意
- `docs/reference/pdf-convert/` 下 7 份 Spec 均為唯讀，對應 7 份 PRD（位於 `docs/prd/`，格式：`XX-名稱.md`）
- `docs/open-questions.md` 目前有 6 筆跨日待確認問題，涵蓋公式邏輯與格式疑問
- 後端 API 串接尚未規劃，目前前端全為 mock 資料，為後續重要待辦項目

### [2026-03-11] PRD 初始化：Spec 轉換為 PRD

**背景**：將 `docs/reference/pdf-convert/` 下的手寫 Spec（共 7 份）整理為正式 PRD 文件。

**決策**：
1. PRD 共分 7 份，存放於 `docs/prd/`，以數字前綴排序
2. 原始 Spec 中的 PNG 圖檔全部移除，改以 Mermaid 流程圖或前端 Prototype 規劃取代
3. Spec 中發現的格式問題一律在 PRD 中以「⚠️ Spec 格式問題標註」標示，不更動原始 Spec
4. 所有公式中的 OCR 殘影（下標符號以逗號呈現）在 PRD 中已修正標記方式

**Spec 格式問題處理方式**：格式問題一律在對應 PRD 以 ⚠️ 標注；邏輯問題已彙整至 `docs/open-questions.md` 追蹤。

