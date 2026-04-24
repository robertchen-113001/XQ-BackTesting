// A1：頂部標題列
export default function AppHeader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      height: 44,
      background: 'var(--color-header-bg)',
      borderBottom: '1px solid var(--color-border)',
      flexShrink: 0,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <span style={{ fontWeight: 700, fontSize: 22, color: 'var(--color-text-primary)' }}>
        回測報告 · XQ全球贏家(企業版)
      </span>
    </div>
  )
}
