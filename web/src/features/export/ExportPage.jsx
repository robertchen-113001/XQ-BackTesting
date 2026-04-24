import { useState } from 'react'

const FORMATS = [
  { fmt: 'XLSX', label: '完整匯出回測報告', desc: 'Excel 多分頁報表，含整體統計、每日報表、交易分析等所有分頁', ref: null },
  { fmt: 'CSV', label: '僅匯出交易紀錄', desc: '純文字逗號分隔，僅含交易明細（19 欄）', ref: '交易紀錄 §2、§5' },
  { fmt: 'BTReportNew', label: '儲存報告', desc: '完整回測結果存檔，可於 Web UI 重新開啟', ref: '交易紀錄 §6' },
]

const XLSX_SHEETS = [
  { id: 'overall',    label: '整體統計',              dynamic: false },
  { id: 'settings',  label: '交易設定',              dynamic: false },
  { id: 'daily',     label: '每日報表',              dynamic: false },
  { id: 'products',  label: '商品統計表',            dynamic: false },
  { id: 'trades',    label: '交易分析',              dynamic: false },
  { id: 'factor',    label: '因子分析',              dynamic: false },
  { id: 'period-d',  label: '週期分析(日)',           dynamic: false },
  { id: 'period-m',  label: '週期分析(月)',           dynamic: false },
  { id: 'period-q',  label: '週期分析(季)',           dynamic: false },
  { id: 'period-y',  label: '週期分析(年)',           dynamic: false },
  { id: 'product-n', label: '單商品統計（每商品一頁）', dynamic: true },
]

// ── Shared UI primitives ──────────────────────────────────────

function SectionNote({ children, type = 'info' }) {
  const c = { info: ['#f0f5ff','#adc6ff','#2f54eb'], warning: ['#fff7e6','#ffd591','#d46b08'], tip: ['#f6ffed','#b7eb8f','#389e0d'] }[type]
  return <div style={{ background: c[0], border: `1px solid ${c[1]}`, borderRadius: 6, padding: '6px 12px', fontSize: 12, color: c[2], marginBottom: 8 }}>{children}</div>
}

function BlockTitle({ children }) {
  return (
    <div style={{ fontWeight: 700, fontSize: 12, color: '#555', margin: '14px 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 3, height: 12, background: '#1677ff', borderRadius: 2, display: 'inline-block' }} />
      {children}
    </div>
  )
}

function ChartBox({ title, items }) {
  return (
    <div style={{ border: '1.5px dashed #d9d9d9', borderRadius: 6, background: '#fafafa', padding: '10px 14px', marginBottom: 8 }}>
      <div style={{ fontWeight: 600, fontSize: 12, color: '#555', marginBottom: 4 }}>{title}</div>
      {items.map((item, i) => (
        <div key={i} style={{ fontSize: 11, color: '#888', lineHeight: 1.7 }}>
          <span style={{ color: '#ccc', marginRight: 5 }}>▸</span>{item}
        </div>
      ))}
    </div>
  )
}

function KVSection({ title, rows }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 11, color: '#fff', background: '#595959', padding: '3px 10px', borderRadius: '4px 4px 0 0' }}>{title}</div>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 11 }}>
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
              <td style={{ padding: '4px 10px', border: '1px solid #f0f0f0', fontWeight: 600, color: '#444', width: 180, whiteSpace: 'nowrap' }}>{k}</td>
              <td style={{ padding: '4px 10px', border: '1px solid #f0f0f0', color: '#555' }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── StatsTable: vertical list with category spanning rows ─────
// Used by: 整體統計, 週期分析, 單商品統計
// rows: [{ cat: string } | { item, vals: string[], omitCols?: number[] }]

function StatsTable({ headerCols, rows }) {
  const thStyle = (omit) => ({
    padding: '5px 10px', border: '1px solid #e0e0e0', fontWeight: 700,
    background: '#f5f5f5', whiteSpace: 'nowrap', textAlign: 'left',
    color: omit ? '#bbb' : '#333', fontSize: 11,
  })
  const tdStyle = (omit, right) => ({
    padding: '4px 10px', border: '1px solid #f0f0f0', fontSize: 11,
    whiteSpace: 'nowrap', textAlign: right ? 'right' : 'left',
    color: omit ? '#bbb' : '#444',
  })
  const valColor = v => {
    if (!v || v === '—') return '#bbb'
    const n = parseFloat(String(v).replace(/[,% $]/g, ''))
    if (isNaN(n)) return '#444'
    return n < 0 ? '#389e0d' : n > 0 ? '#cf1322' : '#444'
  }
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e8e8e8', borderRadius: 6, marginBottom: 12 }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 11, minWidth: '100%' }}>
        <thead>
          <tr>
            {headerCols.map((col, i) => (
              <th key={i} style={thStyle(col.omit)}>
                {col.name}
                {col.omit && <span style={{ fontSize: 9, color: '#cf1322', marginLeft: 3 }}>[等比省略]</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) =>
            row.cat ? (
              <tr key={i}>
                <td colSpan={999} style={{ background: '#efefef', fontWeight: 700, padding: '4px 10px', color: '#333', border: '1px solid #e0e0e0', fontSize: 11 }}>
                  {row.cat}
                </td>
              </tr>
            ) : (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ ...tdStyle(false, false), fontWeight: 500 }}>{row.item}</td>
                {row.vals.map((v, j) => {
                  const omit = headerCols[j + 1]?.omit
                  return (
                    <td key={j} style={{ ...tdStyle(omit, true), color: omit ? '#bbb' : valColor(v) }}>
                      {omit ? <span style={{ fontSize: 9 }}>省略</span> : (v || '—')}
                    </td>
                  )
                })}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}

// ── GroupTable: two-level column headers ──────────────────────
// Used by: 商品統計表
// groups: [{ name, omit, cols: [{ name, omit }] }]
// dataRows: string[][] (one array per data row, flat across all groups)

function GroupTable({ pinnedCol, pinnedVal, groups, dataRows }) {
  const thG = (omit) => ({
    padding: '4px 8px', border: '1px solid #e0e0e0', fontWeight: 700, textAlign: 'center',
    background: omit ? '#f5f5f5' : '#ebebeb', color: omit ? '#bbb' : '#444', fontSize: 11, whiteSpace: 'nowrap',
  })
  const thC = (omit) => ({
    padding: '4px 8px', border: '1px solid #e8e8e8', fontWeight: 600, background: '#f9f9f9',
    color: omit ? '#bbb' : '#555', fontSize: 10, whiteSpace: 'nowrap', textAlign: 'right',
  })
  const td0 = { padding: '4px 10px', border: '1px solid #f0f0f0', fontSize: 11, fontWeight: 600, color: '#222', background: '#fafafa', whiteSpace: 'nowrap' }
  const tdV = (omit) => ({ padding: '4px 8px', border: '1px solid #f0f0f0', fontSize: 11, color: omit ? '#bbb' : '#444', textAlign: 'right', whiteSpace: 'nowrap' })
  const valColor = v => {
    if (!v || v === '—') return '#bbb'
    const n = parseFloat(String(v).replace(/[,% $]/g, ''))
    if (isNaN(n)) return '#444'
    return n < 0 ? '#389e0d' : n > 0 ? '#cf1322' : '#444'
  }
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e8e8e8', borderRadius: 6, marginBottom: 12 }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr>
            <th rowSpan={2} style={{ ...thG(false), background: '#e0e0e0', verticalAlign: 'middle', minWidth: 80 }}>{pinnedCol}</th>
            {groups.map((g, i) => (
              <th key={i} colSpan={g.cols.length} style={thG(g.omit)}>
                {g.name}
                {g.omit && <span style={{ fontSize: 9, color: '#cf1322', marginLeft: 3 }}>[等比省略]</span>}
              </th>
            ))}
          </tr>
          <tr>
            {groups.flatMap((g, gi) =>
              g.cols.map((col, ci) => (
                <th key={`${gi}-${ci}`} style={thC(col.omit || g.omit)}>
                  {col.name}
                  {col.omit && !g.omit && <span style={{ fontSize: 9, color: '#cf1322', marginLeft: 2 }}>✕</span>}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={td0}>{pinnedVal}</td>
              {groups.flatMap((g, gi) =>
                g.cols.map((col, ci) => {
                  const idx = groups.slice(0, gi).reduce((s, gr) => s + gr.cols.length, 0) + ci
                  const v = row[idx]
                  const omit = col.omit || g.omit
                  return (
                    <td key={`${gi}-${ci}`} style={{ ...tdV(omit), color: omit ? '#bbb' : valColor(v) }}>
                      {omit ? <span style={{ fontSize: 9 }}>省略</span> : (v || '—')}
                    </td>
                  )
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── SimpleTable: flat header + sample data rows ───────────────
// Used by: 每日報表, 交易分析, 因子分析, 單商品交易明細

function SimpleTable({ cols, dataRows }) {
  const thStyle = (omit, frozen) => ({
    padding: '5px 10px', border: '1px solid #e0e0e0', fontWeight: 700, background: '#f5f5f5',
    color: omit ? '#bbb' : '#333', fontSize: 11, whiteSpace: 'nowrap', textAlign: 'left',
    position: frozen ? 'sticky' : 'static', left: 0, zIndex: frozen ? 1 : 0,
  })
  const tdStyle = (omit, frozen) => ({
    padding: '4px 10px', border: '1px solid #f0f0f0', fontSize: 11, whiteSpace: 'nowrap',
    color: omit ? '#bbb' : '#444', background: frozen ? '#fdfdfd' : 'inherit',
    position: frozen ? 'sticky' : 'static', left: 0,
  })
  const valColor = v => {
    if (!v || v === '—') return '#bbb'
    const n = parseFloat(String(v).replace(/[,% $元]/g, ''))
    if (isNaN(n)) return '#444'
    return n < 0 ? '#389e0d' : n > 0 ? '#cf1322' : '#444'
  }
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e8e8e8', borderRadius: 6, marginBottom: 12 }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr>
            {cols.map((col, i) => (
              <th key={i} style={thStyle(col.omit, col.frozen)}>
                {col.name}
                {col.frozen && <span style={{ fontSize: 9, color: '#aaa', marginLeft: 3 }}>[凍結]</span>}
                {col.omit && <span style={{ fontSize: 9, color: '#cf1322', marginLeft: 3 }}>[等比省略]</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#fafafa' }}>
              {cols.map((col, ci) => {
                const v = row[ci]
                return (
                  <td key={ci} style={{ ...tdStyle(col.omit, col.frozen), color: col.omit ? '#bbb' : valColor(v) }}>
                    {col.omit ? <span style={{ fontSize: 9 }}>省略</span> : (v || '—')}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Sheet detail panels ───────────────────────────────────────

function SheetOverall() {
  const headerCols = [
    { name: '項目' },
    { name: '全部(%)' }, { name: '全部($)', omit: true },
    { name: '做多(%)' }, { name: '做多($)', omit: true },
    { name: '做空(%)' }, { name: '做空($)', omit: true },
  ]
  const rows = [
    { cat: '利潤統計' },
    { item: '報酬率', vals: ['60.70%', '2,711,109', '—', '—', '—', '—'] },
    { item: '平均年化報酬', vals: ['12.13%', '—', '—', '—', '—', '—'] },
    { item: '複利年化報酬', vals: ['9.95%', '—', '—', '—', '—', '—'] },
    { item: '毛利', vals: ['139.88%', '6,247,587', '—', '—', '—', '—'] },
    { item: '毛損', vals: ['-79.18%', '-3,536,478', '—', '—', '—', '—'] },
    { item: '總交易成本', vals: ['8.42%', '376,262', '—', '—', '—', '—'] },
    { item: '買進持有報酬', vals: ['283.50%', '—', '—', '—', '—', '—'] },
    { item: '加權指數報酬', vals: ['96.76%', '—', '—', '—', '—', '—'] },
    { cat: '績效指標' },
    { item: '夏普比率', vals: ['1.056', '—', '—', '—', '—', '—'] },
    { item: '索提諾比率', vals: ['1.276', '—', '—', '—', '—', '—'] },
    { item: '風報比', vals: ['2.546', '—', '—', '—', '—', '—'] },
    { item: '獲利因子', vals: ['1.767', '—', '—', '—', '—', '—'] },
    { item: '超額報酬', vals: ['5.00%', '—', '—', '—', '—', '—'] },
    { item: '貝他', vals: ['0.439', '—', '—', '—', '—', '—'] },
    { item: '標準差', vals: ['0.824%', '—', '—', '—', '—', '—'] },
    { cat: '最大統計' },
    { item: '最大投入金額', vals: ['—', '4,466,374', '—', '—', '—', '—'] },
    { item: '最大區間獲利', vals: ['61.97%', '2,767,864', '—', '—', '—', '—'] },
    { item: '最大區間虧損', vals: ['-23.84%', '-1,049,988', '—', '—', '—', '—'] },
    { item: 'MDD區間天數', vals: ['254', '—', '—', '—', '—', '—'] },
    { item: '最大獲利交易', vals: ['21.19%', '20,938', '—', '—', '—', '—'] },
    { item: '最大虧損交易', vals: ['-27.15%', '-26,961', '—', '—', '—', '—'] },
    { item: '最大連續獲利', vals: ['4.57%', '203,940', '—', '—', '—', '—'] },
    { item: '最大連續虧損', vals: ['-12.54%', '-559,999', '—', '—', '—', '—'] },
    { cat: '創高統計' },
    { item: '創新高天數', vals: ['157', '—', '—', '—', '—', '—'] },
    { item: '未創新高天數', vals: ['2', '—', '—', '—', '—', '—'] },
    { item: '最大未創新高天數', vals: ['318', '—', '—', '—', '—', '—'] },
    { item: '平均未創新高天數', vals: ['6.69', '—', '—', '—', '—', '—'] },
    { cat: '交易頻率' },
    { item: '勝率', vals: ['70.63%', '—', '—', '—', '—', '—'] },
    { item: '總交易次數', vals: ['623', '—', '—', '—', '—', '—'] },
    { item: '獲利交易次數', vals: ['440', '—', '—', '—', '—', '—'] },
    { item: '虧損交易次數', vals: ['183', '—', '—', '—', '—', '—'] },
    { item: '年均交易數', vals: ['124', '—', '—', '—', '—', '—'] },
    { cat: '交易表現' },
    { item: '每筆報酬加總', vals: ['2,714.16%', '—', '—', '—', '—', '—'] },
    { item: '平均單筆報酬', vals: ['4.36%', '—', '—', '—', '—', '—'] },
    { item: '平均交易', vals: ['0.10%', '4,352', '—', '—', '—', '—'] },
    { item: '平均獲利交易', vals: ['0.32%', '14,199', '—', '—', '—', '—'] },
    { item: '平均虧損交易', vals: ['-0.43%', '-19,325', '—', '—', '—', '—'] },
    { item: '平均獲利虧損比', vals: ['0.735', '—', '—', '—', '—', '—'] },
    { cat: '時間統計' },
    { item: '回測K線根數', vals: ['1,214', '—', '—', '—', '—', '—'] },
    { item: '實際交易天數', vals: ['1,214', '—', '—', '—', '—', '—'] },
    { item: '交易日佔比', vals: ['100.00%', '—', '—', '—', '—', '—'] },
    { item: '全交易平均持倉', vals: ['76.4', '—', '—', '—', '—', '—'] },
    { item: '獲利平均持倉', vals: ['74.9', '—', '—', '—', '—', '—'] },
    { item: '虧損平均持倉', vals: ['80.1', '—', '—', '—', '—', '—'] },
  ]
  return (
    <div>
      <SectionNote>A1 直接開始；版面順序：績效統計表 → 空一列 → 報酬率圖 → 空一列 → 執行失敗商品表格</SectionNote>
      <SectionNote type="warning">⚠ 等比模式：移除所有 ($) 欄；「最大投入金額($)」整欄省略</SectionNote>
      <SectionNote type="tip">範例資料：MACD黃金交叉策略，50 檔等量最大投入，2021/01/04–2025/12/31</SectionNote>
      <BlockTitle>績效統計表</BlockTitle>
      <StatsTable headerCols={headerCols} rows={rows} />
      <BlockTitle>報酬率圖</BlockTitle>
      <ChartBox title="主圖（面積折線 + 副座標）" items={['策略累積報酬率：面積折線（漲紅跌綠）', '淨值折線：折線（副座標）— 等比隱藏', '買進持有報酬率、[基準指標]報酬率：折線']} />
      <ChartBox title="副圖 1 風險｜副圖 2 資金（等比移除）｜副圖 3 交易｜副圖 4 商品" items={['MDD 面積 + 區間虧損折線', '最大投入金額面積 + 投入金額折線', '進 / 出場筆數柱狀 + 持倉筆數折線', '持倉商品數柱狀']} />
      <BlockTitle>執行失敗商品表格</BlockTitle>
      <SimpleTable
        cols={[{ name: '商品名稱' }, { name: '狀態' }, { name: '說明' }]}
        dataRows={[['（本次無失敗商品）', '', '']]}
      />
    </div>
  )
}

function SheetSettings() {
  return (
    <div>
      <SectionNote>A 欄項目名稱（粗體）、B 欄內容；依下列區塊順序排列</SectionNote>
      <KVSection title="置頂資訊" rows={[
        ['交易數量', '等量'],
        ['報酬率算法', '最大投入'],
      ]} />
      <KVSection title="執行資料" rows={[
        ['執行頻率', '日線'],
        ['資料範圍', '2021/01/04 ～ 2025/12/31'],
        ['執行時間', '2026/03/03 14:36:37（花費 12.1 秒）'],
        ['執行商品', '2330.TW、2317.TW、2454.TW…（50 檔，每商品獨立一列）'],
        ['執行結果', '成功 50、失敗 0'],
      ]} />
      <KVSection title="腳本設定（選股中心 / 策略雷達）" rows={[
        ['進場腳本名稱', 'MACD黃金交叉'],
        ['進場腳本參數', '快線週期 = 12、慢線週期 = 26、訊號週期 = 9'],
        ['進場價格', '開盤價'],
        ['停利', '15%（股票）'],
        ['停損', '8%（股票）'],
        ['最大持有時間', '120 根'],
        ['出場價格', '開盤價'],
      ]} />
      <KVSection title="交易設定" rows={[
        ['股票手續費率', '0.1425%'],
        ['股票交易稅率', '0.3%'],
        ['進場順序', '依訊號強度'],
        ['期貨保證金成數', '未啟用'],
        ['最大同時持有筆數', '無限制'],
      ]} />
    </div>
  )
}

function SheetDaily() {
  const cols = [
    { name: '日期' },
    { name: '累積損益(%)' }, { name: '累積損益($)', omit: true },
    { name: '當日損益(%)' }, { name: '當日損益($)', omit: true },
    { name: '區間虧損(%)' }, { name: '區間虧損($)', omit: true },
    { name: '最大區間虧損(%)' }, { name: '最大區間虧損($)', omit: true },
    { name: '投入金額($)', omit: true },
    { name: '最大投入金額($)', omit: true },
    { name: '進場筆數' }, { name: '出場筆數' },
    { name: '持倉筆數' }, { name: '持倉商品數' },
  ]
  // DailyBar[0]: TDate=20210104, RN=-0.142%, NetProfit=-0.142%, Drawdown=-0.142%, MaxDrawdown=-0.142%
  const dataRows = [['2021/01/04', '-0.14%', '-710', '-0.14%', '-710', '-0.14%', '-710', '-0.14%', '-710', '498,997', '498,997', '5', '0', '5', '5']]
  return (
    <div>
      <SectionNote>從 A1 寫入表格，標題列粗體 + 灰底；日期格式 yyyy/MM/dd</SectionNote>
      <SectionNote type="warning">⚠ 等比模式：移除所有 ($) 欄；「投入金額($)」「最大投入金額($)」整欄省略</SectionNote>
      <SimpleTable cols={cols} dataRows={dataRows} />
    </div>
  )
}

function SheetProducts() {
  // Two-level header: category group + column names
  const groups = [
    { name: '利潤統計', cols: [
      { name: '報酬率(%)' }, { name: '報酬率($)', omit: true },
      { name: '平均年化報酬(%)' }, { name: '複利年化報酬(%)' },
      { name: '毛利(%)' }, { name: '毛利($)', omit: true },
      { name: '毛損(%)' }, { name: '毛損($)', omit: true },
      { name: '總交易成本(%)' }, { name: '總交易成本($)', omit: true },
    ]},
    { name: '績效指標', cols: [
      { name: '夏普比率' }, { name: '索提諾比率' }, { name: '風報比' },
      { name: '獲利因子' }, { name: '超額報酬(%)' }, { name: '貝他' }, { name: '標準差' },
    ]},
    { name: '最大統計', cols: [
      { name: '最大投入金額($)', omit: true },
      { name: '最大區間獲利(%)' }, { name: '最大區間獲利($)', omit: true },
      { name: '最大區間虧損(%)' }, { name: '最大區間虧損($)', omit: true },
      { name: '最大獲利交易(%)' }, { name: '最大獲利交易($)', omit: true },
      { name: '最大虧損交易(%)' }, { name: '最大虧損交易($)', omit: true },
      { name: '最大連續獲利(%)' }, { name: '最大連續獲利($)', omit: true },
      { name: '最大連續虧損(%)' }, { name: '最大連續虧損($)', omit: true },
    ]},
    { name: '創高統計', cols: [
      { name: '創新高天數' }, { name: '未創新高天數' },
      { name: '最大未創新高天數' }, { name: '平均未創新高天數' },
    ]},
    { name: '交易頻率', cols: [
      { name: '勝率(%)' }, { name: '總交易次數' }, { name: '獲利次數' }, { name: '虧損次數' }, { name: '年均交易數' },
    ]},
    { name: '交易表現', cols: [
      { name: '每筆報酬加總(%)' }, { name: '平均單筆報酬(%)' },
      { name: '平均交易(%)' }, { name: '平均交易($)', omit: true },
      { name: '平均獲利交易(%)' }, { name: '平均獲利交易($)', omit: true },
      { name: '平均虧損交易(%)' }, { name: '平均虧損交易($)', omit: true },
      { name: '平均獲利虧損比' },
    ]},
    { name: '時間統計', cols: [
      { name: '回測K線根數' }, { name: '實際交易天數' }, { name: '交易日佔比(%)' },
      { name: '全交易平均持倉' }, { name: '獲利平均持倉' }, { name: '虧損平均持倉' },
    ]},
  ]
  // 台積電 data row (flat, in group order)
  const dataRows = [[
    // 利潤統計
    '53.91%', '70,919', '10.78%', '9.00%', '118.99%', '156,542', '-65.09%', '-85,623', '6.90%', '9,071',
    // 績效指標
    '0.500', '0.615', '1.277', '1.828', '-1.07%', '0.555', '1.272%',
    // 最大統計
    '131,553', '79.68%', '104,822', '-42.22%', '-46,870', '18.06%', '17,982', '-24.41%', '-24,334', '12.87%', '12,833', '-11.48%', '-11,443',
    // 創高統計
    '42', '0', '809', '27.26',
    // 交易頻率
    '73.33%', '15', '11', '4', '2',
    // 交易表現
    '71.34%', '4.76%', '3.59%', '4,728', '10.82%', '14,231', '-16.27%', '-21,406', '0.665',
    // 時間統計
    '1,214', '887', '73.06%', '59.1', '58.3', '61.5',
  ]]
  return (
    <div>
      <SectionNote>每商品一列；分類以兩層欄位 header 呈現（上層：分類群組，下層：個別欄名）；商品名稱欄純文字不設超連結</SectionNote>
      <SectionNote type="warning">⚠ 等比模式：移除所有 ($) 欄及「最大投入金額($)」整欄</SectionNote>
      <SectionNote type="tip">範例資料：台積電 (2330.TW)</SectionNote>
      <GroupTable pinnedCol="商品名稱" pinnedVal="台積電" groups={groups} dataRows={dataRows} />
    </div>
  )
}

function SheetTrades() {
  const cols = [
    { name: '商品名稱', frozen: true }, { name: '序號', frozen: true },
    { name: '進出場方向' }, { name: '進場時間' }, { name: '出場時間' },
    { name: '進場價格(元)' }, { name: '出場價格(元)' },
    { name: '報酬率(%)' }, { name: '獲利金額($)', omit: true },
    { name: '交易數量（股）', omit: true },
    { name: '持有區間（天）' },
    { name: '區間最高價(元)' }, { name: '區間最低價(元)' },
    { name: '進場訊息' }, { name: '出場訊息' },
  ]
  const dataRows = [['台積電', '1', '多', '2021/01/04', '2021/01/15', '536', '621', '15.20%', '15,157', '186', '10', '625', '528', '—', '停利 15%']]
  return (
    <div>
      <SectionNote>商品名稱、序號兩欄凍結；商品名稱欄純文字不設超連結</SectionNote>
      <SectionNote type="warning">⚠ 等比模式：移除「獲利金額($)」；「交易數量（股）」整欄省略</SectionNote>
      <SimpleTable cols={cols} dataRows={dataRows} />
    </div>
  )
}

function SheetFactor() {
  const cols = [
    { name: '分組' }, { name: '樣本數' },
    { name: '累計報酬率(%)' }, { name: '累計報酬率($)', omit: true },
    { name: '平均單筆報酬率(%)' }, { name: '平均單筆報酬率($)', omit: true },
    { name: '勝率(%)' },
    { name: '最大區間虧損(%)' }, { name: '最大區間虧損($)', omit: true },
    { name: '日標準差' }, { name: 'Beta' }, { name: '夏普比率' }, { name: '索提諾比率' }, { name: 'Alpha(%)' },
  ]
  const dataRows = [
    ['低因子值', '89', '32.14%', '1,245,000', '0.36%', '3,900', '64.04%', '-18.32%', '-712,000', '0.821%', '0.38', '0.87', '0.91', '2.15%'],
    ['中因子值', '134', '58.92%', '2,280,000', '0.44%', '5,200', '68.66%', '-22.10%', '-856,000', '0.935%', '0.45', '1.02', '1.18', '4.72%'],
    ['高因子值', '112', '81.67%', '3,162,000', '0.73%', '8,100', '72.32%', '-15.88%', '-614,000', '0.764%', '0.52', '1.31', '1.58', '7.43%'],
  ]
  return (
    <div>
      <SectionNote>從 A1 寫入表格，標題列粗體 + 灰底</SectionNote>
      <SectionNote type="warning">⚠ 等比模式：移除所有 ($) 欄</SectionNote>
      <SimpleTable cols={cols} dataRows={dataRows} />
    </div>
  )
}

function SheetPeriod({ freq }) {
  const label = { d: '日', m: '月', q: '季', y: '年' }[freq]
  const headerCols = [{ name: '項目' }, { name: `(%)` }, { name: `($)` }]

  // 週期分析 Day JSON data
  const dayRows = [
    { cat: '報酬統計' },
    { item: `${label}報酬率`, vals: ['0.04%', '2,233'] },
    { item: '毛利', vals: ['382.21%', '17,070,879'] },
    { item: '毛損', vals: ['-321.51%', '-14,359,770'] },
    { item: '獲利因子', vals: ['1.189', '—'] },
    { cat: '平均統計' },
    { item: '平均金額變動', vals: ['0.04%', '2,233'] },
    { item: '平均獲利金額變動', vals: ['0.45%', '24,812'] },
    { item: '平均虧損金額變動', vals: ['-0.49%', '-27,300'] },
    { item: '平均獲利虧損比', vals: ['0.909', '—'] },
    { cat: '最大統計' },
    { item: '最大區間獲利', vals: ['4.29%', '203,940'] },
    { item: '最大區間虧損', vals: ['-8.76%', '-559,999'] },
    { item: `最大單${label}獲利`, vals: ['2.62%', '130,908'] },
    { item: `最大單${label}虧損`, vals: ['-5.71%', '-364,594'] },
    { cat: '交易統計' },
    { item: `${label}勝率`, vals: ['56.67%', '—'] },
    { item: `總交易${label}數`, vals: ['1,214', '—'] },
    { item: `獲利交易${label}數`, vals: ['688', '—'] },
    { item: `虧損交易${label}數`, vals: ['526', '—'] },
  ]
  // Placeholder rows for month/quarter/year (similar structure, different values)
  const otherRows = [
    { cat: '報酬統計' },
    { item: `${label}報酬率`, vals: ['—', '—'] },
    { item: '毛利', vals: ['—', '—'] },
    { item: '毛損', vals: ['—', '—'] },
    { item: '獲利因子', vals: ['—', '—'] },
    { cat: '平均統計' },
    { item: '平均金額變動', vals: ['—', '—'] },
    { item: '平均獲利虧損比', vals: ['—', '—'] },
    { cat: '最大統計' },
    { item: '最大區間獲利', vals: ['—', '—'] },
    { item: '最大區間虧損', vals: ['—', '—'] },
    { cat: '交易統計' },
    { item: `${label}勝率`, vals: ['—', '—'] },
    { item: `總交易${label}數`, vals: ['—', '—'] },
  ]
  const rows = freq === 'd' ? dayRows : otherRows

  const chartsByFreq = {
    d: [
      { title: '星期一～五 日報酬 柱狀圖', items: ['總計(%)、平均(%)、總計($)、平均($) 各展開為獨立靜態圖；漲紅跌綠'] },
      { title: '星期一～五 日勝率 折線圖', items: ['總計、平均 各展開為獨立靜態圖'] },
      { title: '1～31日 日報酬 柱狀圖', items: ['總計(%)、平均(%)、總計($)、平均($) 各展開'] },
      { title: '1～31日 日勝率 折線圖', items: ['總計、平均 各展開'] },
      { title: '每一日 報酬折線圖', items: ['(%)、($) 各一圖'] },
    ],
    m: [
      { title: '1～12月 月報酬 柱狀圖', items: ['總計(%)、平均(%)、總計($)、平均($) 各展開'] },
      { title: '1～12月 月勝率 折線圖', items: ['總計、平均 各展開'] },
      { title: '每一月 報酬折線圖', items: ['(%)、($) 各一圖'] },
      { title: '月熱力圖 (%)', items: ['漲紅跌綠'] },
    ],
    q: [
      { title: '第一～四季 季報酬 柱狀圖', items: ['總計(%)、平均(%)、總計($)、平均($) 各展開'] },
      { title: '第一～四季 季勝率 折線圖', items: ['總計、平均 各展開'] },
      { title: '每一季 報酬折線圖', items: ['(%)、($) 各一圖'] },
      { title: '季熱力圖 (%)', items: ['漲紅跌綠'] },
    ],
    y: [
      { title: '每一年 報酬折線圖', items: ['(%)、($) 各一圖'] },
      { title: '年熱力圖 (%)', items: ['漲紅跌綠'] },
    ],
  }

  return (
    <div>
      <SectionNote type="warning">⚠ 等比模式不輸出週期分析分頁（此分頁僅適用一般模式）</SectionNote>
      <SectionNote>表格區（A1）→ 空一列 → 圖片區（每圖：標題列 → 圖片 → 空列）</SectionNote>
      {freq === 'd' && <SectionNote type="tip">範例資料：日頻率週期分析，MACD黃金交叉策略</SectionNote>}
      <BlockTitle>表格區（項目 | (%) | ($)）</BlockTitle>
      <StatsTable headerCols={headerCols} rows={rows} />
      <BlockTitle>圖片區</BlockTitle>
      {chartsByFreq[freq].map((c, i) => <ChartBox key={i} title={c.title} items={c.items} />)}
    </div>
  )
}

function SheetProductN() {
  const headerCols = [
    { name: '項目' },
    { name: '全部(%)' }, { name: '全部($)', omit: true },
    { name: '做多(%)' }, { name: '做多($)', omit: true },
    { name: '做空(%)' }, { name: '做空($)', omit: true },
  ]
  const summaryRows = [
    { cat: '利潤統計' },
    { item: '報酬率', vals: ['53.91%', '70,919', '—', '—', '—', '—'] },
    { item: '平均年化報酬', vals: ['10.78%', '—', '—', '—', '—', '—'] },
    { item: '複利年化報酬', vals: ['9.00%', '—', '—', '—', '—', '—'] },
    { item: '毛利', vals: ['118.99%', '156,542', '—', '—', '—', '—'] },
    { item: '毛損', vals: ['-65.09%', '-85,623', '—', '—', '—', '—'] },
    { item: '總交易成本', vals: ['6.90%', '9,071', '—', '—', '—', '—'] },
    { cat: '績效指標' },
    { item: '夏普比率', vals: ['0.500', '—', '—', '—', '—', '—'] },
    { item: '索提諾比率', vals: ['0.615', '—', '—', '—', '—', '—'] },
    { item: '風報比', vals: ['1.277', '—', '—', '—', '—', '—'] },
    { item: '獲利因子', vals: ['1.828', '—', '—', '—', '—', '—'] },
    { item: '超額報酬', vals: ['-1.07%', '—', '—', '—', '—', '—'] },
    { item: '貝他', vals: ['0.555', '—', '—', '—', '—', '—'] },
    { item: '標準差', vals: ['1.272%', '—', '—', '—', '—', '—'] },
    { cat: '最大統計' },
    { item: '最大投入金額', vals: ['—', '131,553', '—', '—', '—', '—'] },
    { item: '最大區間獲利', vals: ['79.68%', '104,822', '—', '—', '—', '—'] },
    { item: '最大區間虧損', vals: ['-42.22%', '-46,870', '—', '—', '—', '—'] },
    { item: '最大獲利交易', vals: ['18.06%', '17,982', '—', '—', '—', '—'] },
    { item: '最大虧損交易', vals: ['-24.41%', '-24,334', '—', '—', '—', '—'] },
    { item: '最大連續獲利', vals: ['12.87%', '12,833', '—', '—', '—', '—'] },
    { item: '最大連續虧損', vals: ['-11.48%', '-11,443', '—', '—', '—', '—'] },
    { cat: '創高統計' },
    { item: '創新高天數', vals: ['42', '—', '—', '—', '—', '—'] },
    { item: '未創新高天數', vals: ['0', '—', '—', '—', '—', '—'] },
    { item: '最大未創新高天數', vals: ['809', '—', '—', '—', '—', '—'] },
    { item: '平均未創新高天數', vals: ['27.26', '—', '—', '—', '—', '—'] },
    { cat: '交易頻率' },
    { item: '勝率', vals: ['73.33%', '—', '—', '—', '—', '—'] },
    { item: '總交易次數', vals: ['15', '—', '—', '—', '—', '—'] },
    { item: '獲利交易次數', vals: ['11', '—', '—', '—', '—', '—'] },
    { item: '虧損交易次數', vals: ['4', '—', '—', '—', '—', '—'] },
    { item: '年均交易數', vals: ['2', '—', '—', '—', '—', '—'] },
    { item: '最大連續獲利次數（本頁獨有）', vals: ['5', '—', '—', '—', '—', '—'] },
    { item: '最大連續虧損次數（本頁獨有）', vals: ['2', '—', '—', '—', '—', '—'] },
    { cat: '交易表現' },
    { item: '每筆報酬加總', vals: ['71.34%', '—', '—', '—', '—', '—'] },
    { item: '平均單筆報酬', vals: ['4.76%', '—', '—', '—', '—', '—'] },
    { item: '平均交易', vals: ['3.59%', '4,728', '—', '—', '—', '—'] },
    { item: '平均獲利交易', vals: ['10.82%', '14,231', '—', '—', '—', '—'] },
    { item: '平均虧損交易', vals: ['-16.27%', '-21,406', '—', '—', '—', '—'] },
    { item: '平均獲利虧損比', vals: ['0.665', '—', '—', '—', '—', '—'] },
    { cat: '時間統計' },
    { item: '回測K線根數', vals: ['1,214', '—', '—', '—', '—', '—'] },
    { item: '實際交易天數', vals: ['887', '—', '—', '—', '—', '—'] },
    { item: '交易日佔比', vals: ['73.06%', '—', '—', '—', '—', '—'] },
    { item: '全交易平均持倉', vals: ['59.1', '—', '—', '—', '—', '—'] },
    { item: '獲利平均持倉', vals: ['58.3', '—', '—', '—', '—', '—'] },
    { item: '虧損平均持倉', vals: ['61.5', '—', '—', '—', '—', '—'] },
  ]
  const tradeCols = [
    { name: '序號', frozen: true }, { name: '進出場方向' },
    { name: '進場時間' }, { name: '出場時間' },
    { name: '進場價格(元)' }, { name: '出場價格(元)' },
    { name: '報酬率(%)' }, { name: '獲利金額($)', omit: true },
    { name: '累積報酬率(%)' }, { name: '累積獲利金額($)', omit: true },
    { name: '交易數量（股）', omit: true },
    { name: '持有區間（天）' }, { name: '區間最高價(元)' }, { name: '區間最低價(元)' },
    { name: '連續次數' }, { name: '進場訊息' }, { name: '出場訊息' },
  ]
  const tradeDataRows = [['1', '多', '2021/01/04', '2021/01/15', '536', '621', '15.20%', '15,157', '15.20%', '70,919', '186', '10', '625', '528', '+1', '—', '停利 15%']]
  return (
    <div>
      <SectionNote>分頁命名：<code style={{ background: '#f5f5f5', padding: '1px 5px', borderRadius: 3 }}>{'{商品名稱}({商品代碼})'}</code> — 例：台積電(2330.TW)；非法字元替換為 _；超 31 字元截斷商品名稱，保留完整代碼尾段</SectionNote>
      <SectionNote type="warning">⚠ 等比模式：移除所有 ($) 欄；「最大投入金額($)」整欄省略</SectionNote>
      <SectionNote type="tip">範例資料：台積電 (2330.TW)，與整體統計差異：無「買進持有報酬 / 基準指標報酬」；多「最大連續獲利/虧損次數」</SectionNote>
      <BlockTitle>統計摘要表（A1 起）</BlockTitle>
      <StatsTable headerCols={headerCols} rows={summaryRows} />
      <BlockTitle>交易明細表（摘要表後空一列）</BlockTitle>
      <div style={{ fontWeight: 700, fontSize: 11, padding: '4px 0 6px', color: '#333' }}>交易明細</div>
      <SimpleTable cols={tradeCols} dataRows={tradeDataRows} />
    </div>
  )
}

const SHEET_PANELS = {
  overall:    <SheetOverall />,
  settings:   <SheetSettings />,
  daily:      <SheetDaily />,
  products:   <SheetProducts />,
  trades:     <SheetTrades />,
  factor:     <SheetFactor />,
  'period-d': <SheetPeriod freq="d" />,
  'period-m': <SheetPeriod freq="m" />,
  'period-q': <SheetPeriod freq="q" />,
  'period-y': <SheetPeriod freq="y" />,
  'product-n': <SheetProductN />,
}

// ── Main page ─────────────────────────────────────────────────

export default function ExportPage() {
  const [activeSheet, setActiveSheet] = useState(null)
  const active = XLSX_SHEETS.find(s => s.id === activeSheet)

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>匯出功能</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: 14 }}>
        XLSX 完整報告匯出規格；CSV 格式與 BTReportNew 詳見交易紀錄
      </p>

      <h3 style={sTitle}>支援匯出格式</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 36 }}>
        {FORMATS.map(f => (
          <div key={f.fmt} style={{ ...card, flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{f.fmt}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{f.label}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{f.desc}</div>
            {f.ref && <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>詳見 {f.ref}</div>}
          </div>
        ))}
      </div>

      <h3 style={sTitle}>XLSX 分頁清單（10 個固定分頁＋單商品動態分頁）</h3>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {XLSX_SHEETS.map((s, i) => {
            const isActive = activeSheet === s.id
            return (
              <button key={s.id} onClick={() => setActiveSheet(isActive ? null : s.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 6, cursor: 'pointer', textAlign: 'left',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                borderStyle: s.dynamic ? 'dashed' : 'solid',
                background: isActive ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'var(--color-surface)',
                opacity: s.dynamic ? 0.75 : 1,
                transition: 'background 0.1s, border-color 0.1s',
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-secondary)', minWidth: 24 }}>
                  {s.dynamic ? '11+' : String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 13, color: isActive ? 'var(--color-primary)' : 'var(--color-text)', fontStyle: s.dynamic ? 'italic' : 'normal', fontWeight: isActive ? 600 : 400 }}>
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {active ? (
            <div style={{ ...card, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400, fontSize: 12, marginRight: 8 }}>
                  {active.dynamic ? '11+' : String(XLSX_SHEETS.indexOf(active) + 1).padStart(2, '0')}
                </span>
                {active.label}
              </div>
              {SHEET_PANELS[active.id]}
            </div>
          ) : (
            <div style={{ ...card, padding: 32, minHeight: 200, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              選擇左側分頁以查看分頁規格
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const sTitle = { fontSize: 17, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12, marginTop: 0 }
const card = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 16 }
