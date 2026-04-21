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
      {/* A2 視窗控制 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button style={{ width: 26, height: 26, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}>─</button>
        <button style={{ width: 26, height: 26, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}>□</button>
        <button style={{ width: 26, height: 26, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f', fontWeight: 'bold' }}>✕</button>
      </div>
    </div>
  )
}
