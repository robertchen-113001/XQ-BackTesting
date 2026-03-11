const IMAGES = [
  { src: '/images/backtest-settings/_page_5_Figure_2.jpeg', label: '回測設定截圖（頁 5）' },
  { src: '/images/backtest-settings/_page_6_Figure_1.jpeg', label: '回測設定截圖（頁 6 — 圖 1）' },
  { src: '/images/backtest-settings/_page_6_Figure_3.jpeg', label: '回測設定截圖（頁 6 — 圖 2）' },
  { src: '/images/backtest-settings/_page_7_Figure_1.jpeg', label: '回測設定截圖（頁 7）' },
]

export default function BacktestSettingsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
        PRD 04 — 回測設定
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: 14 }}>
        以下為 Spec 原始截圖，涵蓋各平台回測參數設定規格。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        {IMAGES.map((img, i) => (
          <div key={img.src} style={{
            background: 'var(--color-surface)', borderRadius: 8,
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: 20, width: '100%', maxWidth: 900, boxSizing: 'border-box',
          }}>
            <img
              src={img.src}
              alt={img.label}
              style={{ display: 'block', maxWidth: '100%', margin: '0 auto' }}
            />
            <p style={{
              textAlign: 'center', marginTop: 10, fontSize: 12,
              color: 'var(--color-text-secondary)',
            }}>
              {i + 1}／{IMAGES.length}　{img.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
