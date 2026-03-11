const FIELDS = [
  { name: 'tradeDate',    type: 'Date',    desc: '交易日期（YYYY-MM-DD）' },
  { name: 'product',      type: 'String',  desc: '商品代碼（如 TX00、2330）' },
  { name: 'direction',    type: 'Enum',    desc: '方向：Buy / Sell / Short / Cover' },
  { name: 'lots',         type: 'Number',  desc: '交易口數 / 股數' },
  { name: 'costPrice',    type: 'Number',  desc: '成本價（建倉均價）' },
  { name: 'closePrice2',  type: 'Number',  desc: '平倉價（結算均價）' },
  { name: 'pnl',          type: 'Number',  desc: '單筆損益（含手續費）' },
  { name: 'strategyId',   type: 'String',  desc: '策略識別碼（對應回測 ID）' },
]

const SOURCES = [
  { platform: 'XQ 量化平台', format: 'JSON via Sinker', note: '透過 URL 帶入 backtestId，Sinker 推播結果' },
  { platform: 'XQ 全球贏家', format: 'JSON via Sinker', note: '同上，使用相同協定' },
  { platform: '匯入功能',   format: 'XLS / XLSX',     note: '使用者手動匯入，需通過格式驗證' },
]

export default function TradeRecordsPage() {
  return (
    <div style={{ padding: 32, maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
        PRD 03 — 交易紀錄格式
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: 14 }}>
        定義回測交易紀錄的來源管道、統一欄位格式，以及匯入驗證規格
      </p>

      <h3 style={sectionTitle}>來源管道</h3>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>平台</th><th style={th}>資料格式</th><th style={th}>備註</th>
          </tr>
        </thead>
        <tbody>
          {SOURCES.map(s => (
            <tr key={s.platform}>
              <td style={{ ...td, fontWeight: 600 }}>{s.platform}</td>
              <td style={td}><code style={code}>{s.format}</code></td>
              <td style={td}>{s.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ ...sectionTitle, marginTop: 32 }}>統一欄位格式</h3>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>欄位名稱</th><th style={th}>型別</th><th style={th}>說明</th>
          </tr>
        </thead>
        <tbody>
          {FIELDS.map(f => (
            <tr key={f.name}>
              <td style={td}><code style={code}>{f.name}</code></td>
              <td style={{ ...td, color: '#7c3aed', fontFamily: 'monospace' }}>{f.type}</td>
              <td style={td}>{f.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ ...sectionTitle, marginTop: 32 }}>匯入規格</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { title: '支援格式', content: 'XLS、XLSX（Excel 格式）' },
          { title: '必填欄位驗證', content: 'tradeDate、product、direction、lots、costPrice 均為必填' },
          { title: '錯誤處理', content: '格式不符時顯示詳細錯誤行號，不中斷整體匯入流程' },
          { title: '重複資料', content: '同一 strategyId + tradeDate + product 組合視為重複，提示使用者確認覆蓋' },
        ].map(c => (
          <div key={c.title} style={card}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)', marginBottom: 6 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{c.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const sectionTitle = { fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12, marginTop: 0 }
const card = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 16 }
const table = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const th = { background: 'var(--color-surface)', padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }
const td = { padding: '10px 14px', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }
const code = { background: 'var(--color-bg)', padding: '1px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }
