// A4 Tab 列
export default function TabBar({ tabs, activeTabId, onSelect, onClose }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      background: '#ebebeb',
      borderBottom: '1px solid var(--color-border)',
      flexShrink: 0,
      padding: '0 0 0 4px',
      height: 34,
      overflowX: 'auto',
      overflowY: 'hidden',
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTabId
        return (
          <div
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 12px',
              height: 30,
              marginTop: 4,
              cursor: 'pointer',
              background: isActive ? 'var(--color-surface)' : 'transparent',
              borderTop: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              borderLeft: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
              borderRight: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
              borderBottom: isActive ? '1px solid var(--color-surface)' : '1px solid transparent',
              borderRadius: '4px 4px 0 0',
              whiteSpace: 'nowrap',
              fontSize: 'var(--font-size-sm)',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: isActive ? 600 : 400,
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</span>
            {tab.closable && (
              <button
                onClick={e => { e.stopPropagation(); onClose(tab.id) }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '0 2px',
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  fontSize: 11,
                  color: 'var(--color-text-tertiary)',
                  flexShrink: 0,
                }}
                title="關閉"
              >
                ✕
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
