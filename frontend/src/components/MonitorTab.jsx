// A5 回測監控 Tab
const STATUS_CONFIG = {
  success: { icon: '✅', label: '成功', color: '#52c41a' },
  running: { icon: '▶', label: '執行中', color: '#1677ff' },
  paused:  { icon: '⏸', label: '暫停中', color: '#fa8c16' },
  failed:  { icon: '●', label: '失敗', color: '#ff4d4f' },
}

function ProgressCell({ progress, done, total, status }) {
  if (status === 'failed') {
    return <span style={{ color: '#ff4d4f', fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>回測失敗</span>
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 160 }}>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${progress}%`,
            background: progress === 100 ? '#52c41a' : 'var(--color-primary)',
          }}
        />
      </div>
      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
        {done}/{total} ({progress.toFixed(2)}%)
      </span>
    </div>
  )
}

export default function MonitorTab({ list, onOpenReport }) {
  return (
    <div style={{ height: '100%', overflow: 'auto', background: 'var(--color-surface)', padding: 16 }}>
      <table>
        <thead>
          <tr>
            <th>回測報告</th>
            <th>來源</th>
            <th>執行時間</th>
            <th>執行進度</th>
            <th style={{ textAlign: 'center' }}>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map(item => {
            const cfg = STATUS_CONFIG[item.status]
            return (
              <tr key={item.id}>
                <td>
                  <span
                    className="text-primary-color"
                    onClick={() => item.status === 'success' && onOpenReport(item.id, item.title)}
                  >
                    {item.title}
                  </span>
                </td>
                <td className="text-secondary">{item.source}</td>
                <td className="text-secondary text-sm">{item.startTime}</td>
                <td>
                  <ProgressCell
                    progress={item.progress}
                    done={item.done}
                    total={item.total}
                    status={item.status}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 18, color: cfg.color }}>{cfg.icon}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {item.status === 'paused' ? (
                      <button>繼續</button>
                    ) : (
                      <button disabled={item.status === 'failed'}>暫停</button>
                    )}
                    <button>刪除</button>
                    <button className="primary">重新執行</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
