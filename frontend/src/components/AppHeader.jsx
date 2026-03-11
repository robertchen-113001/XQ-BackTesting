// A1 + A2：頂部標題列與功能按鈕
export default function AppHeader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 12px',
      height: 36,
      background: 'var(--color-header-bg)',
      borderBottom: '1px solid var(--color-border)',
      flexShrink: 0,
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* A1 標題 */}
      <span style={{ fontWeight: 600, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
        回測報告 · XQ全球贏家(企業版)
      </span>
      {/* A2 功能 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>匯入回測報告</span>
            <span style={{ fontSize: 10 }}>▼</span>
          </button>
        </div>
        <button style={{ width: 26, height: 26, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>?</button>
        <button style={{ width: 26, height: 26, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>─</button>
        <button style={{ width: 26, height: 26, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>□</button>
        <button style={{ width: 26, height: 26, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d4f', fontWeight: 'bold' }}>✕</button>
      </div>
    </div>
  )
}
