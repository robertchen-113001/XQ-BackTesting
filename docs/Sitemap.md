# Sitemap — 回測報告專案規劃

> 本文件描述「回測報告」專案的整體功能規劃與模組架構。
> 詳細 UI 規格請參考 `docs/prd/` 下的各功能 PRD 文件。

---

## 整體架構

```mermaid
graph TD
    Entry["回測報告入口<br>XQ → 策略(D) → 回測報告"]
    Entry --> Monitor["回測監控 Tab<br>（固定，不可關閉）"]
    Entry --> Report["回測報告 Tab<br>（可多開、可獨立視窗）"]
    Entry --> Compare["回測比較 Tab<br>（可多開、可獨立視窗）"]

    Report --> Sticky["置頂區<br>交易數量 / 報酬率算法 / 數據篩選"]
    Sticky --> T1["整體統計"]
    Sticky --> T2["交易統計"]
    Sticky --> T3["週期分析"]
    Sticky --> T4["因子分析"]
    Sticky --> T5["商品與交易"]
    Sticky --> T6["交易設定"]

    style Entry fill:#4f46e5,color:#fff
    style Monitor fill:#0891b2,color:#fff
    style Report fill:#059669,color:#fff
    style Compare fill:#d97706,color:#fff
```

---

## 功能模組一覽

### 1. 回測監控

| 功能 | 說明 |
|------|------|
| 多工監控 | 同時顯示多個回測任務的執行進度 |
| 狀態管理 | 執行中 / 暫停 / 成功 / 失敗 |
| 快速操作 | 暫停、繼續、刪除、重新回測 |
| 自動導航 | 回測成功後自動開啟報告 Tab，監控列 1 分鐘後移除 |

### 2. 回測報告

#### 2.1 置頂區（全局設定）

| 設定項目 | 選項 |
|---------|------|
| 交易數量 | 原始、等量、等額、等比 |
| 報酬率算法 | 最大投入報酬率、時間加權報酬率 |
| 數據篩選 | 全（自動交易：全 / 多 / 空）|
| 功能 | 備註（記事本）、匯出、重新回測 |

#### 2.2 整體統計 Tab

```mermaid
graph LR
    A["整體統計 Tab"]
    A --> B["圖形區<br>報酬率曲線（主圖）<br>副圖（每日報表欄位）<br>參考指標（可疊加 2 個）"]
    A --> C["每日報表<br>表格（日期遞減）<br>交易筆數連結"]
```

#### 2.3 交易統計 Tab

```mermaid
graph LR
    A["交易統計 Tab"]
    A --> B["報酬分佈圖（直方圖）<br>X: 報酬區間 Y: 交易次數"]
    A --> C["持倉效率圖（散佈圖）<br>X: 持倉K線根數 Y: 報酬率"]
    A --> D["欄位統計區（可收合）"]
```

#### 2.4 週期分析 Tab

| 頻率 | 圖表說明 |
|------|---------|
| 日 | 1日～31日 / 星期一～五 / 每一日（長條圖）|
| 月 | 1月～12月 / 每一月 / 熱力圖（年 × 月）|
| 季 | Q1～Q4 / 每一季 / 熱力圖（年 × 季）|
| 年 | 每一年 / 熱力圖（年）|

#### 2.5 因子分析 Tab

```mermaid
graph LR
    A["因子分析 Tab"]
    A --> B["因子設定（選擇 XS 函數）"]
    B --> C["10 組等分分組"]
    C --> D["累積報酬率圖<br>（各組線圖）"]
    C --> E["因子分析表格<br>（勝率、Alpha、Sharpe 等）"]
```

#### 2.6 商品與交易 Tab

```mermaid
graph LR
    A["商品與交易 Tab"]
    A --> B["商品統計表<br>（可勾選、進階篩選、重新統計）"]
    A --> C["交易紀錄<br>（可篩選日期、賺賠、進階條件）"]
    B --> D["商品資訊側面板<br>（K線圖 + 交易明細）"]
```

#### 2.7 交易設定 Tab

| 區域 | 內容 |
|------|------|
| A 設定資訊 | 回測資料範圍、執行時間、商品、交易設定詳情 |
| B 腳本資料 | 腳本名稱 Tab、修改日期、複製按鈕、XS 程式碼顯示 |

---

## 匯出模組

```mermaid
graph LR
    Export["匯出選單"]
    Export --> CSV["僅匯出交易紀錄<br>.csv"]
    Export --> XLSX["完整匯出<br>.xlsx（11 個分頁）"]
    Export --> BTR["儲存報告<br>.BTReportNew"]
```

**XLSX 完整匯出分頁**：整體統計、設定、每日報表、商品統計表、交易分析、族群透視、週期分析（日/月/季/年）、單商品統計

---

## 資料流架構

```mermaid
flowchart TD
    Source["資料來源"]
    Source --> XS["XS 產生（選股中心 / 策略雷達 / 自動交易 / 量化積木）"]
    Source --> Factor["因子投資"]
    Source --> Local["LocalBella"]
    Source --> Import["使用者匯入（CSV / BTReportNew）"]

    XS --> Stats["報表統計服務"]
    Factor --> Stats
    Local --> Stats
    Import --> Stats

    Stats --> WebUI["回測報告 Web UI"]
    WebUI --> User["使用者"]
```

---

## 前端模組規劃

| 模組 | 主要元件 | 對應 PRD |
|------|---------|---------|
| 進入點 | `BacktestReportApp.jsx` | PRD 05 |
| 回測監控 | `BacktestMonitorList.jsx` | PRD 05 |
| 目錄管理 | `SidebarTree.jsx` | PRD 05 |
| 置頂區 | `StickyHeader.jsx` | PRD 05 |
| 整體統計 | `OverallStatsTab.jsx` + `ReturnChart.jsx` | PRD 05 |
| 交易統計 | `TradeStatsTab.jsx` | PRD 05 |
| 週期分析 | `PeriodAnalysisTab.jsx` + `HeatmapChart.jsx` | PRD 05 |
| 因子分析 | `FactorAnalysisTab.jsx` | PRD 05 |
| 商品與交易 | `ProductTradeTab.jsx` + `KLineChart.jsx` | PRD 05 |
| 交易設定 | `TradeConfigTab.jsx` + `ScriptViewer.jsx` | PRD 05 |
| 匯出選單 | `ExportMenu.jsx` | PRD 06 |
| 匯入對話框 | `ImportDialog.jsx` + `CsvImportDialog.jsx` | PRD 03 |
| 系統設定 | `SystemParamsPanel.jsx` + `TradeSettingsPanel.jsx` | PRD 04 |

---

## 版本規劃

| 版本 | 範圍 | 狀態 |
|------|------|------|
| v1.0 | 核心回測流程、基本 UI、整體統計、交易設定 | 規劃中 |
| v1.1 | 交易統計、週期分析 | 規劃中 |
| v1.2 | 因子分析、商品與交易進階功能 | 規劃中 |
| v2.0 | 回測比較功能 | 規劃中 |
