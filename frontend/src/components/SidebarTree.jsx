import { useState } from 'react'

// A3 左側目錄：搜尋、資料夾樹、回測報告清單
function FolderNode({ node, depth = 0, onOpenReport, activeReportId }) {
  const [expanded, setExpanded] = useState(node.expanded !== false)

  if (node.type === 'report') {
    const isActive = activeReportId === node.id
    return (
      <div
        onDoubleClick={() => onOpenReport(node.id, node.name)}
        style={{
          padding: '4px 8px 4px ' + (16 + depth * 14) + 'px',
          fontSize: 'var(--font-size-sm)',
          cursor: 'pointer',
          color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
          background: isActive ? 'var(--color-primary-light)' : 'transparent',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          userSelect: 'none',
        }}
        title="雙擊開啟"
      >
        <span style={{ fontSize: 12, opacity: 0.6 }}>📄</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          padding: '5px 8px 5px ' + (8 + depth * 14) + 'px',
          fontSize: 'var(--font-size-sm)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          color: 'var(--color-text-secondary)',
          userSelect: 'none',
          fontWeight: depth === 0 ? 600 : 500,
        }}
      >
        <span style={{ fontSize: 10, transition: 'transform 0.2s', display: 'inline-block', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
        <span>{node.name}</span>
        {node.count !== undefined && (
          <span style={{
            marginLeft: 'auto',
            background: '#e8e8e8',
            borderRadius: 8,
            padding: '0 5px',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-secondary)',
          }}>{node.count}</span>
        )}
      </div>
      {expanded && node.children && (
        <div>
          {node.children.map(child => (
            <FolderNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onOpenReport={onOpenReport}
              activeReportId={activeReportId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SidebarTree({ tree, onOpenReport, activeReportId }) {
  const [searchText, setSearchText] = useState('')

  return (
    <div style={{
      width: 200,
      flexShrink: 0,
      background: 'var(--color-sidebar-bg)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* 搜尋列 */}
      <div style={{ padding: '8px 8px 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <input
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ flex: 1, height: 24, fontSize: 'var(--font-size-sm)' }}
        />
        <button style={{ width: 24, height: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🔍</button>
        <button style={{ width: 24, height: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', color: 'var(--color-primary)' }}>＋</button>
      </div>
      {/* 資料夾樹 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 4px 8px' }}>
        {tree.map(node => (
          <FolderNode
            key={node.id}
            node={node}
            depth={0}
            onOpenReport={onOpenReport}
            activeReportId={activeReportId}
          />
        ))}
      </div>
    </div>
  )
}
