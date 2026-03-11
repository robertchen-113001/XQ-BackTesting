const MOSCOW = [
  { level: 'Must Have',   color: '#dc2626', items: ['回測結果報表核心頁面', '整體統計數據顯示', '每日報表欄位展示', '回測進度監控'] },
  { level: 'Should Have', color: '#d97706', items: ['多回測結果比較', '匯出 XLSX 報表', '商品篩選與重新回測', '匯入回測設定'] },
  { level: 'Could Have',  color: '#2563eb', items: ['客製化圖表顯示', '歷史回測記錄查詢', '快捷鍵操作支援'] },
  { level: 'Won\'t Have', color: '#6b7280', items: ['即時盤中回測', '多使用者協作功能', '雲端同步儲存'] },
]

const SCOPE = [
  { item: '平台', value: 'XQ 全球贏家 / XQ 量化回測平台' },
  { item: '前端框架', value: 'Vite + React 18（JSX）' },
  { item: '整合方式', value: 'XQ AP 透過 URL 參數傳遞回測 ID，Web UI 透過 Sinker 機制通訊' },
  { item: '主要使用者', value: '使用 XQ 平台進行策略回測的量化交易者' },
  { item: '核心訴求', value: '將回測結果視覺化呈現，提升策略分析效率' },
]

export default function OverviewPage() {
  return (
    <div style={{ padding: 32, maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
        PRD 01 — 產品概覽
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: 14 }}>
        回測報告 Web UI 的產品定位、功能範疇與 MoSCoW 優先級總覽
      </p>

      {/* MoSCoW */}
      <h3 style={sectionTitle}>MoSCoW 優先級</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {MOSCOW.map(m => (
          <div key={m.level} style={card}>
            <div style={{ ...badge, background: m.color }}>{m.level}</div>
            <ul style={{ margin: 0, paddingLeft: 18, marginTop: 10 }}>
              {m.items.map(i => (
                <li key={i} style={{ fontSize: 13, color: 'var(--color-text)', marginBottom: 4 }}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 適用範圍 */}
      <h3 style={sectionTitle}>適用範圍</h3>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>項目</th>
            <th style={th}>說明</th>
          </tr>
        </thead>
        <tbody>
          {SCOPE.map(s => (
            <tr key={s.item}>
              <td style={{ ...td, fontWeight: 600, whiteSpace: 'nowrap' }}>{s.item}</td>
              <td style={td}>{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const sectionTitle = { fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12, marginTop: 0 }
const card = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 16 }
const badge = { display: 'inline-block', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 12 }
const table = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const th = { background: 'var(--color-surface)', padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }
const td = { padding: '10px 14px', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }
