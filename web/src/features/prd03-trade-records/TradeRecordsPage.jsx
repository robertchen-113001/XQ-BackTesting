import { useState } from 'react'
import UploadBacktestDialog from './UploadBacktestDialog'

// ─── 欄位資料 ──────────────────────────────────────────────────────────────────

const FIELDS = [
  { n: 1,  id: 'Name',            name: '商品名稱',     fmt: 'string',                          required: false, src: '系統依商品代碼查詢' },
  { n: 2,  id: 'Code',            name: '商品代碼',     fmt: 'XQ 商品代碼（如 2330.TW）',         required: true,  src: '使用者提供' },
  { n: 3,  id: 'Number',          name: '序號',         fmt: 'integer，同一商品遞增',              required: false, src: '系統自動產生' },
  { n: 4,  id: 'EntryDate',       name: '進場時間',     fmt: 'yyyy/MM/dd 或 yyyy/MM/dd HH:mm:ss', required: true,  src: '使用者提供' },
  { n: 5,  id: 'EntryDirection',  name: '進場方向',     fmt: '買進 / B / 賣出 / S',               required: false, src: '預設「買進」' },
  { n: 6,  id: 'EntryPrice',      name: '進場價格',     fmt: 'double',                           required: true,  src: '使用者提供' },
  { n: 7,  id: 'ExitDate',        name: '出場時間',     fmt: '同進場；未出場填 --',               required: true,  src: '使用者提供' },
  { n: 8,  id: 'ExitDirection',   name: '出場方向',     fmt: '進場方向的反向，由系統計算；使用者填入值會被覆蓋', required: false, src: '系統自動推算' },
  { n: 9,  id: 'ExitPrice',       name: '出場價格',     fmt: 'double；未出場填 --',               required: true,  src: '使用者提供' },
  { n: 10, id: 'HoldingPeriod',   name: '持有區間',     fmt: 'integer（交易日數）',               required: false, src: 'server 計算' },
  { n: 11, id: 'NumberOfTrades',  name: '交易數量',     fmt: 'integer；-1 由 server 依設定換算',  required: true,  src: '使用者提供' },
  { n: 12, id: 'ProfitLoss',      name: '獲利金額',     fmt: 'double，ROUNDDOWN 至整數',          required: false, src: 'server 計算' },
  { n: 13, id: 'ReturnRate',      name: '報酬率',       fmt: 'double，保留 6 位小數',             required: false, src: 'server 計算' },
  { n: 14, id: 'NetProfit_Amount',name: '累計獲利金額', fmt: 'double，ROUNDDOWN 至整數',          required: false, src: 'server 計算' },
  { n: 15, id: 'NetProfit',       name: '累積報酬率',   fmt: 'double，保留 6 位小數',             required: false, src: 'server 計算' },
  { n: 16, id: 'PeriodHigh',      name: '區間最高價',   fmt: 'double，持有區間內最高成交價',       required: false, src: 'server 計算' },
  { n: 17, id: 'PeriodLow',       name: '區間最低價',   fmt: 'double，持有區間內最低成交價',       required: false, src: 'server 計算' },
  { n: 18, id: 'EntrySignal',     name: '進場訊息',     fmt: 'string，策略觸發條件說明',          required: false, src: '使用者提供或策略產生' },
  { n: 19, id: 'ExitSignal',      name: '出場訊息',     fmt: 'string，出場條件（如 停利 8 %）',   required: false, src: '使用者提供或策略產生' },
]

const PLATFORM_MAPPING = [
  { field: '商品名稱',    s: '✓', r: '✓', a: '✓' },
  { field: '商品代碼',    s: '✓', r: '✓', a: '✓' },
  { field: '序號',        s: '✓', r: '✓', a: '✓' },
  { field: '進場時間',    s: '日期', r: '日期', a: '含時分秒' },
  { field: '進場方向',    s: '✓', r: '✓', a: '✓' },
  { field: '進場價格',    s: '✓', r: '✓', a: '✓' },
  { field: '出場時間',    s: '日期', r: '日期', a: '含時分秒 / --' },
  { field: '出場方向',    s: '✓', r: '✓', a: '✓ 或 --' },
  { field: '出場價格',    s: '✓', r: '✓', a: '✓ 或 --' },
  { field: '持有區間',    s: '✓', r: '✓', a: '✓' },
  { field: '交易數量',    s: '輸入 -1，server 後製', r: '輸入 -1，server 後製', a: '後製 / 腳本' },
  { field: '獲利金額',    s: 'server 計算', r: 'server 計算', a: 'server 計算' },
  { field: '報酬率',      s: 'server 計算', r: 'server 計算', a: 'server 計算' },
  { field: '累計獲利金額',s: 'server 計算', r: 'server 計算', a: 'server 計算' },
  { field: '累積報酬率',  s: 'server 計算', r: 'server 計算', a: 'server 計算' },
  { field: '區間最高價',  s: 'server 計算', r: 'server 計算', a: 'server 計算' },
  { field: '區間最低價',  s: 'server 計算', r: 'server 計算', a: 'server 計算' },
  { field: '進場訊息',    s: '留空', r: '✓', a: '✓' },
  { field: '出場訊息',    s: '原「訊息」欄', r: '✓', a: '✓' },
]

// ─── 交易數量模式資料 ───────────────────────────────────────────────────────────

const VOLUME_MODES = [
  { mode: '腳本',   desc: '由交易腳本自行指定買賣數量，server 直接使用，不做換算', fixed: '依腳本邏輯', platform: '僅自動交易' },
  { mode: '等額',   desc: '每筆進場使用固定 10 萬元換算股數（= ROUNDDOWN(100,000 ÷ 進場價格 ÷ Lots)）；期貨同公式換算口數（= ROUNDDOWN(100,000 ÷ 合約報價 ÷ Lots)），結果取整數口數', fixed: '固定 10 萬元', platform: '全平台' },
  { mode: '等量',   desc: '每筆進場固定 1 張（= 1,000 股 ÷ Lots）；期貨固定 1 口', fixed: '固定 1 張 / 1 口', platform: '全平台' },
  { mode: '等比',   desc: '依「最大同時持有筆數」比例分配，每筆佔回測部位 1/N；無固定進場金額，強制搭配時間加權報酬率', fixed: '—', platform: '全平台' },
  { mode: '依紀錄', desc: '直接採用 CSV 中的 NumberOfTrades 欄位值；若 CSV 含 -1，不可選取此模式（即時錯誤提示）', fixed: '依欄位值', platform: '僅使用者匯入' },
]

const MINUS1_RULES = [
  { src: '選股中心 / 策略雷達', rule: '固定輸出 -1', convert: '依回測設定換算' },
  { src: '自動交易（腳本自訂）', rule: '輸出實際數量', convert: '直接使用' },
  { src: '使用者匯入（依紀錄模式）', rule: 'CSV 含 -1 時不可選取', convert: '需改選其他模式' },
  { src: '使用者匯入（其他模式）', rule: '全部依選定模式重算', convert: '忽略 CSV 原始值' },
]

// ─── 驗證規則資料 ──────────────────────────────────────────────────────────────

const VALIDATION_RULES = [
  { field: '商品代碼', rule: '非空字串' },
  { field: '進場時間', rule: '符合 yyyy/MM/dd 或 yyyy/MM/dd HH:mm:ss' },
  { field: '進場價格', rule: '可解析為 double，且 > 0' },
  { field: '出場時間', rule: '符合時間格式（不接受 --；使用者上傳不支援持倉中交易）' },
  { field: '出場價格', rule: '可解析為 double，且 > 0；不得為空或 --' },
  { field: '出場資料完整性', rule: '出場時間與出場價格須同時有值，任一缺漏視為格式錯誤' },
  { field: '交易數量', rule: '可解析為 integer；-1 為合法值' },
  { field: '進場方向', rule: '若存在，需為 買進 / B / 賣出 / S' },
  { field: '時間先後', rule: '出場時間非 -- 時，出場時間需 ≥ 進場時間' },
]

const ERROR_MESSAGES = [
  { type: '必要欄位缺失', msg: '缺少必要欄位：[欄位1]、[欄位2]，請確認後重新上傳。' },
  { type: '欄位重複', msg: '欄位重複：[欄位名稱]，請確認後重新上傳。' },
  { type: '格式錯誤', msg: '請確認 [欄位名稱] 的格式。' },
  { type: '時間順序錯誤', msg: '第 [行號] 筆：出場時間不得早於進場時間。' },
  { type: '出場資料不一致', msg: '第 [行號] 筆：出場時間與出場價格僅填入其中一欄，請修正後重新上傳。' },
  { type: '依紀錄模式格式錯誤', msg: 'CSV 中含有 NumberOfTrades = -1，無法使用「依紀錄」模式。請改選其他交易數量模式。' },
]

// ─── 主元件 ───────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'csv-fields',   label: '欄位規格',   tag: '§2' },
  { id: 'volume-rules', label: '交易數量規則', tag: '§3' },
  { id: 'import-spec',  label: 'CSV 匯入',   tag: '§4' },
  { id: 'btreport',     label: 'BTReportNew', tag: '§6' },
]

export default function TradeRecordsPage() {
  const [section, setSection] = useState('csv-fields')
  const [showUpload, setShowUpload] = useState(false)

  return (
    <div style={s.page}>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h2 style={s.pageTitle}>PRD 03 — 交易紀錄格式規範</h2>
          <p style={s.pageSubtitle}>統一 CSV 欄位定義（server 輸入 / 輸出共用）・CSV 匯入規格・BTReportNew 相容規格</p>
        </div>
      </div>

      {/* Section tabs */}
      <div style={s.tabBar}>
        {SECTIONS.map(sec => (
          <button
            key={sec.id}
            onClick={() => setSection(sec.id)}
            style={{
              ...s.tab,
              ...(section === sec.id ? s.tabActive : {}),
            }}
          >
            <span style={s.tabTag}>{sec.tag}</span>
            {sec.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div style={s.content}>
        <div style={{ paddingTop: 24 }}>
          {section === 'csv-fields'   && <CsvFieldsSection />}
          {section === 'volume-rules' && <VolumeRulesSection />}
          {section === 'import-spec'  && <ImportSpecSection onOpenDialog={() => setShowUpload(true)} />}
          {section === 'btreport'     && <BtReportSection />}
        </div>
      </div>

      {showUpload && <UploadBacktestDialog onClose={() => setShowUpload(false)} />}
    </div>
  )
}

// ─── §2 欄位規格 ──────────────────────────────────────────────────────────────

function CsvFieldsSection() {
  const [showMapping, setShowMapping] = useState(false)

  const srcColor = (src) => {
    if (src === 'server 計算') return '#8b5cf6'
    if (src === '系統自動推算') return '#0891b2'
    if (src === '系統依商品代碼查詢' || src === '系統自動產生') return '#0891b2'
    return 'var(--color-text)'
  }

  return (
    <div>
      <SectionHeader
        title="統一 CSV 欄位規格"
        desc="整份系統的唯一 CSV 格式參考來源。上傳時只需提供必要欄位；計算欄位由 server 重算（上傳時填入也會被覆蓋）。"
      />

      <div style={s.legendRow}>
        <span style={{ ...s.chip, background: '#f0fdf4', color: '#15803d', borderColor: '#86efac' }}>必要欄位</span>
        <span style={{ ...s.chip, background: '#f5f3ff', color: '#6d28d9', borderColor: '#c4b5fd' }}>server 計算</span>
        <span style={{ ...s.chip, background: '#ecfeff', color: '#0e7490', borderColor: '#67e8f9' }}>系統推算</span>
        <span style={{ ...s.chip, background: 'var(--color-bg)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}>選填</span>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={{ ...s.th, width: 36 }}>#</th>
            <th style={{ ...s.th, width: 140 }}>欄位 ID</th>
            <th style={s.th}>欄位名稱</th>
            <th style={s.th}>格式 / 說明</th>
            <th style={{ ...s.th, width: 80, textAlign: 'center' }}>上傳必要</th>
            <th style={s.th}>來源</th>
          </tr>
        </thead>
        <tbody>
          {FIELDS.map(f => (
            <tr key={f.id} style={{ borderLeft: f.required ? '3px solid #86efac' : '3px solid transparent', background: f.required ? '#f0fdf4' : 'transparent' }}>
              <td style={{ ...s.td, color: 'var(--color-text-secondary)', textAlign: 'center' }}>{f.n}</td>
              <td style={s.td}><code style={s.code}>{f.id}</code></td>
              <td style={{ ...s.td, fontWeight: f.required ? 600 : 400 }}>{f.name}</td>
              <td style={{ ...s.td, color: 'var(--color-text-secondary)' }}>{f.fmt}</td>
              <td style={{ ...s.td, textAlign: 'center' }}>
                {f.required ? <span style={s.reqBadge}>✓</span> : ''}
              </td>
              <td style={{ ...s.td, color: srcColor(f.src), fontSize: 14 }}>{f.src}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 24 }}>
        <button style={s.toggleBtn} onClick={() => setShowMapping(v => !v)}>
          {showMapping ? '▾' : '▸'} 三平台欄位對照表
        </button>
        {showMapping && (
          <table style={{ ...s.table, marginTop: 12 }}>
            <thead>
              <tr>
                <th style={s.th}>公版欄位</th>
                <th style={{ ...s.th, textAlign: 'center' }}>選股中心</th>
                <th style={{ ...s.th, textAlign: 'center' }}>策略雷達</th>
                <th style={{ ...s.th, textAlign: 'center' }}>自動交易</th>
              </tr>
            </thead>
            <tbody>
              {PLATFORM_MAPPING.map(r => (
                <tr key={r.field}>
                  <td style={s.td}>{r.field}</td>
                  {[r.s, r.r, r.a].map((v, i) => (
                    <td key={i} style={{
                      ...s.td, textAlign: 'center', fontSize: 14,
                      color: v === '✓' ? '#15803d'
                        : v.startsWith('固定') || v.startsWith('留空') ? 'var(--color-text-secondary)'
                        : v === 'server 計算' ? '#8b5cf6'
                        : 'var(--color-text)',
                    }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <InfoBox>
        <strong>選股中心訊息欄位：</strong>選股中心原始格式僅有單欄「訊息」（語意為出場條件），統一對應至第 19 欄「出場訊息」；第 18 欄「進場訊息」留空。
      </InfoBox>
    </div>
  )
}

// ─── §3 交易數量規則 ──────────────────────────────────────────────────────────

function VolumeRulesSection() {
  return (
    <div>
      <SectionHeader
        title="交易數量規則"
        desc="交易數量決定每筆進場時買入多少股（或口），影響獲利金額、報酬率等所有金額類欄位的計算結果。"
      />

      <h4 style={s.subTitle}>五種模式</h4>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={{ ...s.th, width: 80 }}>模式</th>
            <th style={s.th}>說明</th>
            <th style={{ ...s.th, width: 110 }}>固定值</th>
            <th style={{ ...s.th, width: 110 }}>適用來源</th>
          </tr>
        </thead>
        <tbody>
          {VOLUME_MODES.map(m => (
            <tr key={m.mode} style={{ background: m.mode === '依紀錄' ? '#eff6ff' : 'transparent' }}>
              <td style={{ ...s.td, fontWeight: 700 }}>{m.mode}</td>
              <td style={{ ...s.td, color: 'var(--color-text-secondary)' }}>{m.desc}</td>
              <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 14 }}>{m.fixed}</td>
              <td style={{
                ...s.td, fontSize: 14,
                color: m.platform === '僅自動交易' || m.platform === '僅使用者匯入' ? '#d4720a' : 'var(--color-text)',
              }}>{m.platform}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ ...s.subTitle, marginTop: 28 }}>特殊值 <code style={s.code}>-1</code> 的各來源處理規則</h4>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>來源</th>
            <th style={s.th}>規則</th>
            <th style={s.th}>server 處理</th>
          </tr>
        </thead>
        <tbody>
          {MINUS1_RULES.map(r => (
            <tr key={r.src}>
              <td style={{ ...s.td, fontWeight: 500 }}>{r.src}</td>
              <td style={{ ...s.td, color: 'var(--color-text-secondary)' }}>{r.rule}</td>
              <td style={{ ...s.td, color: '#8b5cf6', fontSize: 14 }}>{r.convert}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <InfoBox type="warning">
        <strong>等比模式限制：</strong>等比模式無固定進場金額，無法計算金額欄位。選擇等比模式時，報酬率算法強制鎖定「時間加權報酬率」，其他選項不可選取。
      </InfoBox>
    </div>
  )
}

// ─── §4 匯入規格 ──────────────────────────────────────────────────────────────

function ImportSpecSection({ onOpenDialog }) {
  return (
    <div>
      <SectionHeader
        title="CSV 匯入規格"
        desc="上傳流程、欄位驗證規則與錯誤訊息規格。"
      />

      {/* 選單入口示意 */}
      <div style={s.menuBlock}>
        <div style={s.menuTitle}>XScript 編輯器 — 選單入口</div>
        <div style={s.menuBody}>
          <div style={s.menuItem}>新增(N)</div>
          <div style={s.menuItem}>開啟(O)...</div>
          <div style={s.menuDivider} />
          <div style={s.menuItem}>儲存(S)</div>
          <div style={s.menuDivider} />
          <div style={{ ...s.menuItem, ...s.menuItemActive }}>開啟回測報告...</div>
          <div style={{ ...s.menuItem, ...s.menuItemHighlight }}>
            上傳交易紀錄...
            <span style={s.menuNew}>NEW</span>
          </div>
          <div style={s.menuDivider} />
          <div style={s.menuItem}>匯出</div>
          <div style={s.menuItem}>匯入</div>
        </div>
        <div style={s.menuNote}>「開啟回測報告」與「上傳交易紀錄」同屬一個選單區塊</div>
      </div>

      {/* 上傳流程 */}
      <h4 style={s.subTitle}>上傳流程</h4>
      <div style={s.flowRow}>
        {['點擊「上傳交易紀錄...」', 'Browse 選取 .csv', '格式驗證', '確認回測設定', '開始計算'].map((step, i) => (
          <div key={i} style={s.flowStep}>
            <div style={s.flowNum}>{i + 1}</div>
            <div style={s.flowLabel}>{step}</div>
            {i < 4 && <div style={s.flowArrow}>→</div>}
          </div>
        ))}
      </div>

      {/* 驗證規則 */}
      <h4 style={{ ...s.subTitle, marginTop: 28 }}>欄位驗證規則</h4>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={{ ...s.th, width: 120 }}>欄位</th>
            <th style={s.th}>驗證規則</th>
          </tr>
        </thead>
        <tbody>
          {VALIDATION_RULES.map(r => (
            <tr key={r.field}>
              <td style={{ ...s.td, fontWeight: 500 }}>{r.field}</td>
              <td style={{ ...s.td, color: 'var(--color-text-secondary)' }}>{r.rule}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 錯誤訊息 */}
      <h4 style={{ ...s.subTitle, marginTop: 28 }}>錯誤訊息規格</h4>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={{ ...s.th, width: 140 }}>錯誤類型</th>
            <th style={s.th}>顯示訊息</th>
          </tr>
        </thead>
        <tbody>
          {ERROR_MESSAGES.map(r => (
            <tr key={r.type}>
              <td style={{ ...s.td, fontWeight: 500 }}>{r.type}</td>
              <td style={{ ...s.td, color: 'var(--color-text-secondary)', fontStyle: r.type === '出場資料不一致' ? 'italic' : 'normal' }}>{r.msg}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Demo 入口 */}
      <div style={s.demoBlock}>
        <div style={s.demoBlockTitle}>Prototype 示範</div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 14px' }}>
          點擊下方按鈕開啟上傳回測設定對話框，可互動示範：等比鎖定、格式錯誤清單（含出場資料不一致、依紀錄模式錯誤）。
        </p>
        <button style={s.demoOpenBtn} onClick={onOpenDialog}>
          ↑ 開啟上傳交易紀錄對話框
        </button>
      </div>
    </div>
  )
}

// ─── §6 BTReportNew ───────────────────────────────────────────────────────────

function BtReportSection() {
  const formats = [
    { ext: '.BTReport',    ver: '舊版', how: '以舊版 UI 開啟（功能受限）', note: '點「重新回測」→ 新版回測流程' },
    { ext: '.BTReportNew', ver: '新版', how: '以新版 Web UI 直接開啟', note: '支援所有報告功能，不需重新計算' },
  ]

  return (
    <div>
      <SectionHeader
        title="BTReportNew"
        desc="BTReport / BTReportNew 從 XScript 編輯器選單開啟，系統依副檔名決定開啟方式。「開啟回測報告」直接 Browse 選取檔案，不需設定；「上傳交易紀錄」才開啟對話框設定計算參數。"
      />

      {/* 選單示意 */}
      <div style={s.menuBlock}>
        <div style={s.menuTitle}>XScript 編輯器 — 入口</div>
        <div style={s.menuBody}>
          <div style={{ ...s.menuItem, ...s.menuItemHighlight }}>
            開啟回測報告...
            <span style={{ ...s.menuNew, background: '#f0fdf4', color: '#15803d' }}>.btreport / .btreportnew</span>
          </div>
          <div style={{ ...s.menuItem, ...s.menuItemActive }}>
            上傳交易紀錄...
            <span style={s.menuNew}>.csv</span>
          </div>
        </div>
        <div style={s.menuNote}>「開啟回測報告」直接開啟，無對話框；「上傳交易紀錄」開啟設定對話框</div>
      </div>

      <h4 style={s.subTitle}>副檔名判斷</h4>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={{ ...s.th, width: 140 }}>副檔名</th>
            <th style={{ ...s.th, width: 80 }}>版本</th>
            <th style={s.th}>開啟方式</th>
            <th style={s.th}>備註</th>
          </tr>
        </thead>
        <tbody>
          {formats.map(r => (
            <tr key={r.ext}>
              <td style={s.td}><code style={s.code}>{r.ext}</code></td>
              <td style={{ ...s.td, color: r.ver === '新版' ? '#15803d' : 'var(--color-text-secondary)' }}>{r.ver}</td>
              <td style={s.td}>{r.how}</td>
              <td style={{ ...s.td, color: 'var(--color-text-secondary)', fontSize: 14 }}>{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ ...s.subTitle, marginTop: 28 }}>舊版 BTReport 相容流程</h4>
      <div style={s.flowRow}>
        {[
          '開啟回測報告...',
          '選取 .BTReport',
          '以舊版 UI 開啟',
          '點擊「重新回測」',
          '新版執行回測對話框',
          '產出回測報表',
          '匯出 .BTReportNew',
        ].map((step, i) => (
          <div key={i} style={s.flowStep}>
            <div style={{
              ...s.flowNum,
              background: i >= 3 ? '#dbeafe' : '#f5f3ff',
              color: i >= 3 ? '#1d4ed8' : '#6d28d9',
              borderColor: i >= 3 ? '#93c5fd' : '#c4b5fd',
            }}>{i + 1}</div>
            <div style={s.flowLabel}>{step}</div>
            {i < 6 && <div style={s.flowArrow}>→</div>}
          </div>
        ))}
      </div>

      <InfoBox>
        <strong>BTReportNew 匯入：</strong>不需要重新執行報表統計即可直接使用所有報告功能。
      </InfoBox>
    </div>
  )
}

// ─── 共用小元件 ───────────────────────────────────────────────────────────────

function SectionHeader({ title, desc }) {
  return (
    <div style={s.sectionHeader}>
      <h3 style={s.sectionTitle}>{title}</h3>
      <p style={s.sectionDesc}>{desc}</p>
    </div>
  )
}

function InfoBox({ children, type = 'info' }) {
  const colors = {
    info:    { bg: '#eff6ff', border: '#bfdbfe', icon: 'ℹ', iconColor: '#1d4ed8' },
    warning: { bg: '#fffbeb', border: '#fde68a', icon: '⚠', iconColor: '#92400e' },
  }
  const c = colors[type]
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6, padding: '12px 14px', marginTop: 16, display: 'flex', gap: 10 }}>
      <span style={{ color: c.iconColor, fontSize: 15, flexShrink: 0 }}>{c.icon}</span>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text)', lineHeight: 1.65 }}>{children}</p>
    </div>
  )
}

// ─── 樣式 ──────────────────────────────────────────────────────────────────────

const s = {
  page: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },

  pageHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '20px 28px 0',
  },
  pageTitle: { fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: 0 },
  pageSubtitle: { fontSize: 14, color: 'var(--color-text-secondary)', margin: '4px 0 0' },

  tabBar: {
    display: 'flex', gap: 0,
    borderBottom: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    padding: '0 20px', marginTop: 16, flexShrink: 0,
  },
  tab: {
    padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
    fontSize: 14, color: 'var(--color-text-secondary)', borderBottom: '2px solid transparent',
    marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
  },
  tabActive: {
    color: 'var(--color-primary)', fontWeight: 700,
    borderBottomColor: 'var(--color-primary)',
  },
  tabTag: {
    fontSize: 14, fontWeight: 700, color: 'var(--color-text-secondary)',
    background: 'var(--color-bg)', border: '1px solid var(--color-border)',
    borderRadius: 3, padding: '1px 5px',
  },

  content: { flex: 1, overflowY: 'auto', padding: '0 28px 40px' },

  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' },
  sectionDesc: { fontSize: 14, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 },

  legendRow: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  chip: {
    fontSize: 14, padding: '2px 8px', borderRadius: 4,
    border: '1px solid', fontWeight: 500,
  },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: {
    position: 'sticky', top: 0, zIndex: 2,
    background: '#ffffff', padding: '9px 12px',
    textAlign: 'left', fontWeight: 600, fontSize: 13,
    color: 'var(--color-text-secondary)',
    borderTop: '1px solid var(--color-border)',
    boxShadow: 'inset 0 -1px 0 var(--color-border)',
  },
  td: { padding: '9px 12px', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' },
  code: {
    background: 'var(--color-bg)', padding: '2px 6px', borderRadius: 3,
    fontSize: 14, fontFamily: 'monospace', border: '1px solid var(--color-border)',
  },
  reqBadge: {
    display: 'inline-block', padding: '1px 8px', borderRadius: 10,
    background: '#dcfce7', color: '#15803d', fontSize: 13, fontWeight: 700,
  },

  toggleBtn: {
    fontSize: 14, padding: '6px 14px', cursor: 'pointer',
    border: '1px solid var(--color-border)', borderRadius: 4,
    background: 'var(--color-surface)', color: 'var(--color-text)',
  },

  subTitle: { fontSize: 15, fontWeight: 600, color: 'var(--color-text)', margin: '20px 0 10px' },

  flowRow: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  flowStep: { display: 'flex', alignItems: 'center', gap: 4 },
  flowNum: {
    width: 24, height: 24, borderRadius: '50%',
    background: '#f5f3ff', border: '1px solid #c4b5fd',
    color: '#6d28d9', fontSize: 14, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  flowLabel: { fontSize: 13, color: 'var(--color-text)', maxWidth: 110, lineHeight: 1.3 },
  flowArrow: { fontSize: 15, color: 'var(--color-text-secondary)', margin: '0 2px' },

  menuBlock: {
    border: '1px solid var(--color-border)', borderRadius: 6,
    overflow: 'hidden', marginBottom: 24, display: 'inline-block', minWidth: 280,
  },
  menuTitle: {
    fontSize: 14, fontWeight: 700, color: 'var(--color-text-secondary)',
    background: 'var(--color-bg)', padding: '6px 12px',
    borderBottom: '1px solid var(--color-border)',
  },
  menuBody: { background: 'var(--color-surface)', padding: '4px 0' },
  menuItem: {
    padding: '5px 16px', fontSize: 14, color: 'var(--color-text)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  menuItemActive: { color: 'var(--color-text-secondary)' },
  menuItemHighlight: { background: '#eff6ff', color: 'var(--color-primary)', fontWeight: 600 },
  menuDivider: { height: 1, background: 'var(--color-border)', margin: '3px 0' },
  menuNew: {
    fontSize: 13, fontWeight: 700, color: '#fff',
    background: 'var(--color-primary)', borderRadius: 3,
    padding: '1px 5px',
  },
  menuNote: {
    fontSize: 14, color: 'var(--color-text-secondary)',
    padding: '6px 12px', background: 'var(--color-bg)',
    borderTop: '1px solid var(--color-border)',
  },

  demoBlock: {
    marginTop: 24, padding: '16px 20px',
    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
    borderRadius: 6,
  },
  demoBlockTitle: {
    fontSize: 14, fontWeight: 700, color: 'var(--color-text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
  },
  demoOpenBtn: {
    height: 36, padding: '0 20px', fontSize: 14, fontWeight: 600,
    background: 'var(--color-primary)', color: '#fff',
    border: 'none', borderRadius: 4, cursor: 'pointer',
  },
}
