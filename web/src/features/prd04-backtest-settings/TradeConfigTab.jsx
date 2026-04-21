/**
 * PRD 04 §4 — 報告「交易設定」
 *
 * 條件渲染架構說明（給前端工程師）
 * ─────────────────────────────────
 * 本元件接收 `report` prop，其中 report.platform 決定左側「腳本設定」區塊的渲染內容：
 *
 *   選股中心 → <EntryExitPanel>：顯示「進場條件」+「出場條件」
 *   策略雷達 → <EntryExitPanel>：顯示「進場腳本」+「出場腳本」（多一組期貨停損）
 *   自動交易 → <AutoTradePanel>：隱藏進出場條件，改顯示「交易腳本」+「預設委託」
 *
 * 中間「執行資料」與右側「安控設定」同樣有條件顯示的 tag 與欄位：
 *   - [逐筆洗價] tag：tickSimulation=true 才顯示
 *   - [觸發即判斷成交] tag：自動交易且 immediateFill=true
 *   - [美股全時段] tag：usMarketAll=true
 *   - 安全監控區塊：僅自動交易顯示
 *   - 每日部位歸零：僅自動交易顯示
 *
 * 實際使用時，`report` 來自後端回傳的回測結果資料；
 * Prototype 模式下，由頁面注入各平台的 MOCK_REPORTS。
 */

import { useState } from 'react'

// ─── Mock 資料（Prototype 用）───────────────────────────────────────────────

const MOCK_REPORTS = {
  選股中心: {
    platform: '選股中心',
    // 執行資料
    frequency: '日',
    tickSimulation: false,
    immediateFill: false,
    usMarketAll: false,
    dataRangeStart: '2025/12/31',
    dataRangeEnd: '2026/03/31',
    executionTimestamp: '2026/04/17 10:23',
    executionDuration: '2分14秒',
    executionTargets: ['台股上市類股-普通股全部(組合)', '台股上櫃類股-普通股全部(組合)'],
    resultSuccessCount: 1515,
    resultFailCount: 23,
    // 腳本設定（進場條件）
    entryConditions: [
      { name: '01. 三次到頂而破', params: '定義整理區間幅度=7, 定義區間高檔範圍=1.5' },
      { name: '02. KD 低檔黃金交叉', params: '計算期數=9, RSVt權數=3, Kt權數=3, 低檔區=25' },
    ],
    entryPriceType: '下期開盤價',
    // 腳本設定（出場條件）
    exitScripts: [],
    takeProfit: { stock: '8%' },
    stopLoss: { stock: '8%' },
    maxHoldTime: 20,
    exitPriceType: '下期開盤價',
    // 安控設定
    stockFeeRate: 0.1425,
    stockTaxRate: 0.3,
    futuresFee: 100,
    futuresTaxRate: 0.3,
    volumeType: '等量',
    returnAlgorithm: '時間加權報酬率',
    entryOrderType: '股號',
    futuresMarginRate: 13.5,
    maxConcurrentTrades: 10,
    enableMaxConcurrent: true,
  },
  策略雷達: {
    platform: '策略雷達',
    frequency: '日',
    tickSimulation: true,
    immediateFill: false,
    usMarketAll: false,
    dataRangeStart: '2025/12/31',
    dataRangeEnd: '2026/03/31',
    executionTimestamp: '2026/04/17 11:05',
    executionDuration: '1分46秒',
    executionTargets: ['台積電(2330)'],
    resultSuccessCount: 1,
    resultFailCount: 0,
    // 進場腳本
    entryScripts: [
      { name: '大跌後的低檔五連陽', params: '觀察天數=5, 跌幅門檻=3%' },
    ],
    entryPriceType: '下期開盤價',
    // 出場腳本
    exitScripts: [
      { name: 'KD 高檔黃金交叉', params: '計算期數=9' },
    ],
    takeProfit: { stock: '8%', future: '50點' },
    stopLoss: { stock: '8%', future: '50點' },
    maxHoldTime: 20,
    exitPriceType: '下期開盤價',
    // 安控設定
    stockFeeRate: 0.1425,
    stockTaxRate: 0.3,
    futuresFee: 100,
    futuresTaxRate: 0.3,
    volumeType: '等量',
    returnAlgorithm: '時間加權報酬率',
    entryOrderType: '時間',
    futuresMarginRate: 13.5,
    maxConcurrentTrades: 10,
    enableMaxConcurrent: true,
  },
  自動交易: {
    platform: '自動交易',
    frequency: '1分鐘',
    tickSimulation: true,
    immediateFill: true,
    usMarketAll: false,
    dataRangeStart: '2025/12/31',
    dataRangeEnd: '2026/03/31',
    executionTimestamp: '2026/04/17 09:00',
    executionDuration: '3分02秒',
    executionTargets: ['台積電(2330)'],
    resultSuccessCount: 1,
    resultFailCount: 0,
    // 交易腳本（自動交易無進出場分離）
    scriptName: '02-時間權重交易(TWAP)',
    scriptParams: '委託區間(秒)=3600, 總委託數量=100, 買賣方向=買進',
    // 預設委託
    defaultBuyBase: '觸發價',
    defaultBuyOffset: 1,
    defaultSellBase: '觸發價',
    defaultSellOffset: 1,
    directSubmit: false,
    // 安控設定
    stockFeeRate: 0.1425,
    stockTaxRate: 0.3,
    futuresFee: 100,
    futuresTaxRate: 0.3,
    volumeType: '腳本',
    returnAlgorithm: '時間加權報酬率',
    entryOrderType: '時間',
    futuresMarginRate: 13.5,
    maxConcurrentTrades: 10,
    enableMaxConcurrent: true,
    // 安全監控（自動交易獨有）
    maxPosition: 1,
    maxDailyEntry: 1,
    maxTradePerMin: 6,
    dailyReset: false,
  },
}

// ─── 主元件 ──────────────────────────────────────────────────────────────────

export default function TradeConfigTab() {
  // Prototype 用：允許切換平台以觀察條件渲染效果
  // 實際實作時：platform 直接取自 report.platform，不需此切換器
  const [platform, setPlatform] = useState('選股中心')
  const [selectedScript, setSelectedScript] = useState(null)

  const report = MOCK_REPORTS[platform]

  // 同步選中腳本（切換平台時重置）
  const handlePlatformChange = (p) => {
    setPlatform(p)
    setSelectedScript(null)
  }

  // 收集本次回測所有腳本（用於腳本檢視器 tab 列表）
  const allScripts = collectScripts(report)

  return (
    <div style={s.root}>

      {/* ── Prototype 說明欄（實際實作時移除）── */}
      <div style={s.prototypeNotice}>
        <strong>Prototype 模式</strong>：切換平台觀察置頂區 tag 列、左側腳本設定、右側交易設定（自動交易底部顯示安全監控）的條件渲染差異。
        實際實作時，platform 由 <code>report.platform</code> 決定，不需此切換器。
        <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
          {['選股中心', '策略雷達', '自動交易'].map(p => (
            <button
              key={p}
              onClick={() => handlePlatformChange(p)}
              style={{
                ...s.platformBtn,
                background: platform === p ? 'var(--color-primary)' : 'var(--color-surface)',
                color: platform === p ? '#fff' : 'var(--color-text)',
                borderColor: platform === p ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── 置頂區：tag 列 + 交易數量 + 報酬率算法 ── */}
      <TopBar report={report} />

      {/* ── 三欄主區域 ── */}
      <div style={s.mainGrid}>

        {/* 左欄：腳本設定（條件渲染核心）
         * 分流邏輯：platform 在此做一次判斷，子元件不重複判斷。
         *   自動交易 → AutoTradePanel（腳本 + 委託 + 安全監控）
         *   其他     → EntryExitPanel（進場條件/腳本 + 出場條件/腳本）
         */}
        <div style={s.panel}>
          <div style={s.panelTitle}>腳本設定</div>
          {platform === '自動交易'
            ? <AutoTradePanel report={report} onSelectScript={setSelectedScript} selectedScript={selectedScript} />
            : <EntryExitPanel report={report} platform={platform} onSelectScript={setSelectedScript} selectedScript={selectedScript} />
          }
        </div>

        {/* 中欄：執行資料 */}
        <div style={s.panel}>
          <ExecutionDataPanel report={report} />
        </div>

        {/* 右欄：交易設定（費用 / 進場順序 / 保證金 / 同時持有 / 安全監控）
         * 交易數量 + 報酬率算法已移至置頂區。
         * 自動交易安全監控移至此欄底部（report.platform === '自動交易' 條件顯示）。
         */}
        <div style={s.panel}>
          <TradeSettingsPanel report={report} />
        </div>

      </div>

      {/* ── 腳本檢視器 ── */}
      <ScriptViewer scripts={allScripts} selected={selectedScript} onSelect={setSelectedScript} />

    </div>
  )
}

// ─── 置頂區 ──────────────────────────────────────────────────────────────────
// 僅顯示「交易數量」與「報酬率算法」兩個欄位，靠左對齊。
// 頻率 / 逐筆洗價 / 觸發即判斷成交 / 美股全時段 等 tag 已移至中欄執行資料面板。

function TopBar({ report }) {
  return (
    <div style={s.topBar}>
      <span style={s.topBarItem}>
        <span style={s.topBarLabel}>交易數量</span>
        <span style={s.topBarValue}>{report.volumeType}</span>
      </span>
      <span style={s.topBarDivider}>|</span>
      <span style={s.topBarItem}>
        <span style={s.topBarLabel}>報酬率算法</span>
        <span style={s.topBarValue}>{report.returnAlgorithm}</span>
      </span>
    </div>
  )
}

// ─── 左欄子元件：選股中心 / 策略雷達 ─────────────────────────────────────────

function EntryExitPanel({ report, platform, onSelectScript, selectedScript }) {
  const isRadar = platform === '策略雷達'

  // 進場：選股中心用 entryConditions，策略雷達用 entryScripts（同結構）
  const entryItems = isRadar ? report.entryScripts : report.entryConditions
  const entryLabel = isRadar ? '進場腳本' : '進場條件'
  const exitLabel = isRadar ? '出場腳本' : '出場策略'

  return (
    <div>
      {/* 進場 */}
      <div style={s.scriptGroup}>
        <div style={s.scriptGroupLabel}>{entryLabel}</div>
        {entryItems.map((item, i) => (
          <ScriptItem
            key={i}
            name={item.name}
            params={item.params}
            isSelected={selectedScript === item.name}
            onClick={() => onSelectScript(item.name)}
          />
        ))}
        <Row label="進場價格" value={report.entryPriceType} />
      </div>

      {/* 出場 */}
      <div style={s.scriptGroup}>
        <div style={s.scriptGroupLabel}>{exitLabel}</div>
        {report.exitScripts.length > 0
          ? report.exitScripts.map((item, i) => (
            <ScriptItem
              key={i}
              name={item.name}
              params={item.params}
              isSelected={selectedScript === item.name}
              onClick={() => onSelectScript(item.name)}
            />
          ))
          : <div style={s.emptyScript}>（無出場腳本）</div>
        }

        {/* 停利停損：策略雷達顯示期貨欄，選股中心只顯示股票 */}
        {report.takeProfit && (
          <Row
            label="停利"
            value={
              isRadar && report.takeProfit.future
                ? `股票 ${report.takeProfit.stock}　期貨 ${report.takeProfit.future}`
                : `股票 ${report.takeProfit.stock}`
            }
          />
        )}
        {report.stopLoss && (
          <Row
            label="停損"
            value={
              isRadar && report.stopLoss.future
                ? `股票 ${report.stopLoss.stock}　期貨 ${report.stopLoss.future}`
                : `股票 ${report.stopLoss.stock}`
            }
          />
        )}
        <Row label="最大持有時間" value={`${report.maxHoldTime} 期`} />
        <Row label="出場價格" value={report.exitPriceType} />
      </div>
    </div>
  )
}

// ─── 左欄子元件：自動交易 ────────────────────────────────────────────────────

function AutoTradePanel({ report, onSelectScript, selectedScript }) {
  return (
    <div>
      {/* 交易腳本（取代進出場分離） */}
      <div style={s.scriptGroup}>
        <div style={s.scriptGroupLabel}>交易腳本</div>
        <ScriptItem
          name={report.scriptName}
          params={report.scriptParams}
          isSelected={selectedScript === report.scriptName}
          onClick={() => onSelectScript(report.scriptName)}
        />
      </div>

      {/* 預設委託（自動交易獨有） */}
      <div style={s.scriptGroup}>
        <div style={s.scriptGroupLabel}>預設委託</div>
        <Row label="買進價基準" value={`${report.defaultBuyBase}  +/-  ${report.defaultBuyOffset} 檔`} />
        <Row label="賣出價基準" value={`${report.defaultSellBase}  +/-  ${report.defaultSellOffset} 檔`} />
        <Row label="委託直接送出" value={report.directSubmit ? '是' : '否'} />
      </div>

    </div>
  )
}

// ─── 中欄：執行資料 ──────────────────────────────────────────────────────────

function ExecutionDataPanel({ report }) {
  const freqLabel = report.frequency === '日' ? '日資料' : report.frequency
  return (
    <div>
      <div style={s.panelTitle}>執行資料</div>
      <div style={s.tagRow}>
        <Tag label={freqLabel} />
        {report.tickSimulation && <Tag label="逐筆洗價" />}
        {report.immediateFill && <Tag label="觸發即判斷成交" />}
        {report.usMarketAll && <Tag label="美股全時段" />}
      </div>
      <Row label="資料範圍" value={`${report.dataRangeStart} — ${report.dataRangeEnd}`} />
      <Row label="執行時間" value={`${report.executionTimestamp}（花費 ${report.executionDuration}）`} />

      <div style={{ ...s.rowLabel, marginTop: 6 }}>執行商品</div>
      {report.executionTargets.map((t, i) => (
        <div key={i} style={s.targetItem}>{t}</div>
      ))}

      <div style={s.resultRow}>
        <span style={s.resultLabel}>執行結果</span>
        <span style={s.successCount}>成功 {report.resultSuccessCount}</span>
        <span style={s.failCount}>失敗 {report.resultFailCount}</span>
        {report.resultFailCount > 0 && (
          <span style={s.retryBtn} title="針對失敗商品重新回測">↻</span>
        )}
      </div>
    </div>
  )
}

// ─── 右欄：交易設定 ──────────────────────────────────────────────────────────
// 交易數量 / 報酬率算法已移至置頂區。
// 安全監控（自動交易獨有）條件渲染於此欄底部。

function TradeSettingsPanel({ report }) {
  const isAT = report.platform === '自動交易'
  return (
    <div>
      <div style={s.panelTitle}>交易設定</div>

      <div style={s.sectionLabel}>交易費用</div>
      <Row label="股票" value={`手續費 ${report.stockFeeRate}%　交易稅 ${report.stockTaxRate}%`} />
      <Row label="期貨" value={`手續費 ${report.futuresFee}元/口　交易稅 ${report.futuresTaxRate}%`} />

      <div style={s.sectionLabel}>其他設定</div>
      <Row label="進場順序" value={report.entryOrderType} />
      <Row label="期貨保證金" value={`${report.futuresMarginRate}%`} />
      <Row
        label="最大同時持有"
        value={report.enableMaxConcurrent ? `${report.maxConcurrentTrades} 筆` : '無限制'}
      />

      {isAT && (
        <>
          <div style={s.sectionLabel}>安全監控</div>
          <Row
            label="單一商品最大部位"
            value={report.enableMaxPosition !== false ? `${report.maxPosition} 口` : '無限制'}
          />
          <Row
            label="每日最多進場"
            value={report.enableMaxDailyEntry !== false ? `${report.maxDailyEntry} 次` : '無限制'}
          />
          <Row
            label="每分鐘最多交易"
            value={report.enableMaxTradePerMin !== false ? `${report.maxTradePerMin} 次` : '無限制'}
          />
          <Row label="每日部位歸零" value={report.dailyReset ? '開啟' : '關閉'} />
        </>
      )}
    </div>
  )
}

// ─── 下方：腳本檢視器 ────────────────────────────────────────────────────────

function ScriptViewer({ scripts, selected, onSelect }) {
  const current = scripts.find(s => s.name === selected) || scripts[0]

  if (scripts.length === 0) return null

  return (
    <div style={s.viewer}>
      {/* 左側腳本列表 */}
      <div style={s.viewerList}>
        {scripts.map(sc => (
          <div key={sc.name}>
            {sc.category && <div style={s.viewerCategory}>{sc.category}</div>}
            <button
              key={sc.name}
              onClick={() => onSelect(sc.name)}
              style={{
                ...s.viewerItem,
                background: current?.name === sc.name ? 'var(--color-primary-light, #e6f4ff)' : 'transparent',
                fontWeight: current?.name === sc.name ? 600 : 400,
              }}
            >
              {'<>'} {sc.name}
            </button>
          </div>
        ))}
      </div>

      {/* 右側程式碼 */}
      <div style={s.viewerCode}>
        {current && (
          <>
            <div style={s.viewerCodeHeader}>
              <span style={s.viewerCodeTitle}>{current.name}</span>
              <span style={s.viewerCodeDate}>最後修改 {current.lastModified}</span>
              <button style={s.copyBtn} onClick={() => navigator.clipboard?.writeText(current.code)}>
                複製腳本
              </button>
            </div>
            <pre style={s.codeBlock}>{current.code}</pre>
          </>
        )}
      </div>
    </div>
  )
}

// ─── 工具元件 ─────────────────────────────────────────────────────────────────

function ScriptItem({ name, params, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...s.scriptItem,
        background: isSelected ? 'var(--color-primary-light, #e6f4ff)' : 'var(--color-surface)',
        cursor: 'pointer',
      }}
    >
      <div style={s.scriptName}>{'<>'} {name}</div>
      {params && <div style={s.scriptParams}>{params}</div>}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={s.row}>
      <span style={s.rowLabel}>{label}</span>
      <span style={s.rowValue}>{value}</span>
    </div>
  )
}

function Tag({ label }) {
  return <span style={s.tag}>{label}</span>
}

// ─── 工具函數 ─────────────────────────────────────────────────────────────────

/**
 * 從 report 資料中收集所有腳本，供腳本檢視器使用。
 * 實際實作時，腳本程式碼由後端回傳（report.scripts 陣列）；
 * Prototype 用假資料填充。
 */
function collectScripts(report) {
  const scripts = []

  if (report.platform === '自動交易') {
    scripts.push({
      name: report.scriptName,
      category: null,
      lastModified: '2026/04/15 18:30',
      code: `// ${report.scriptName}\n// 腳本程式碼由後端回傳\ninput: 委託區間(3600, "委託區間(秒)"),\n       總委託數量(100, "總委託數量");\n\n// ... XS 腳本內容 ...`,
    })
  } else {
    const entryItems = report.entryConditions || report.entryScripts || []
    entryItems.forEach((item, i) => {
      scripts.push({
        name: item.name,
        category: i === 0 ? '進場腳本' : null,
        lastModified: '2026/04/12 20:29',
        code: `// ${item.name}\n// 參數：${item.params}\n\n// ... XS 腳本內容 ...`,
      })
    })
    const exitItems = report.exitScripts || []
    exitItems.forEach((item, i) => {
      scripts.push({
        name: item.name,
        category: i === 0 ? '出場腳本' : null,
        lastModified: '2026/04/10 14:00',
        code: `// ${item.name}\n// 參數：${item.params}\n\n// ... XS 腳本內容 ...`,
      })
    })
  }

  return scripts
}

// ─── 樣式 ─────────────────────────────────────────────────────────────────────

const s = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    fontSize: 13,
    color: 'var(--color-text)',
  },
  prototypeNotice: {
    padding: '10px 16px',
    background: '#fffbe6',
    borderBottom: '1px solid #ffe58f',
    fontSize: 12,
    color: '#664d00',
    flexShrink: 0,
  },
  platformBtn: {
    padding: '4px 14px',
    fontSize: 12,
    border: '1px solid',
    borderRadius: 4,
    cursor: 'pointer',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 0,
    borderBottom: '1px solid var(--color-border)',
    flexShrink: 0,
  },
  panel: {
    padding: '12px 16px',
    borderRight: '1px solid var(--color-border)',
    overflowY: 'auto',
    maxHeight: 340,
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottom: '1px solid var(--color-border)',
  },
  scriptGroup: {
    marginBottom: 12,
  },
  scriptGroupLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  scriptItem: {
    padding: '6px 8px',
    borderRadius: 4,
    marginBottom: 4,
    border: '1px solid var(--color-border)',
  },
  scriptName: {
    fontWeight: 500,
    color: 'var(--color-primary)',
    fontSize: 12,
  },
  scriptParams: {
    fontSize: 11,
    color: 'var(--color-text-secondary)',
    marginTop: 2,
  },
  emptyScript: {
    fontSize: 12,
    color: 'var(--color-text-secondary)',
    fontStyle: 'italic',
    padding: '4px 0',
  },
  // 置頂區
  topBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '7px 16px',
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
    flexShrink: 0,
    gap: 8,
    fontSize: 12,
  },
  tagRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  topBarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  topBarLabel: {
    color: 'var(--color-text-secondary)',
    fontSize: 11,
  },
  topBarValue: {
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  topBarDivider: {
    color: 'var(--color-border)',
    fontSize: 14,
  },
  tag: {
    padding: '2px 8px',
    background: 'var(--color-primary-light, #e6f4ff)',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-primary)',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 500,
  },
  row: {
    display: 'flex',
    gap: 8,
    marginBottom: 5,
    alignItems: 'baseline',
  },
  rowLabel: {
    fontSize: 11,
    color: 'var(--color-text-secondary)',
    minWidth: 72,
    flexShrink: 0,
  },
  rowValue: {
    fontSize: 12,
    color: 'var(--color-text)',
    fontWeight: 500,
  },
  targetItem: {
    fontSize: 12,
    color: 'var(--color-text)',
    paddingLeft: 8,
    marginBottom: 2,
  },
  resultRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  resultLabel: {
    fontSize: 11,
    color: 'var(--color-text-secondary)',
  },
  successCount: {
    fontSize: 12,
    color: '#cf1322',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  failCount: {
    fontSize: 12,
    color: '#389e0d',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  retryBtn: {
    fontSize: 14,
    cursor: 'pointer',
    color: 'var(--color-primary)',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 4,
  },
  // 腳本檢視器
  viewer: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    borderTop: '1px solid var(--color-border)',
  },
  viewerList: {
    width: 220,
    flexShrink: 0,
    borderRight: '1px solid var(--color-border)',
    overflowY: 'auto',
    padding: '8px 0',
  },
  viewerCategory: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    padding: '8px 12px 2px',
  },
  viewerItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '6px 12px',
    fontSize: 12,
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text)',
  },
  viewerCode: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  viewerCodeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 16px',
    borderBottom: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    flexShrink: 0,
  },
  viewerCodeTitle: {
    fontWeight: 600,
    fontSize: 13,
    flex: 1,
  },
  viewerCodeDate: {
    fontSize: 11,
    color: 'var(--color-text-secondary)',
  },
  copyBtn: {
    padding: '3px 10px',
    fontSize: 11,
    border: '1px solid var(--color-border)',
    borderRadius: 4,
    cursor: 'pointer',
    background: 'var(--color-surface)',
  },
  codeBlock: {
    flex: 1,
    overflow: 'auto',
    margin: 0,
    padding: 16,
    fontSize: 12,
    lineHeight: 1.7,
    fontFamily: 'monospace',
    background: '#1e1e1e',
    color: '#d4d4d4',
  },
}
