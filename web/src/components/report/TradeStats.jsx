// 交易統計 Tab：報酬分佈（直方圖）+ 持倉效率（散佈圖）
function Histogram({ data }) {
  const max = Math.max(...data.map(d => d.count))
  return (
    <svg width="100%" viewBox="0 0 500 200" style={{ display: 'block' }}>
      {data.map((d, i) => {
        const x = 30 + i * (460 / data.length)
        const barH = (d.count / max) * 160
        const y = 175 - barH
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={460 / data.length - 2}
              height={barH}
              fill={d.isLoss ? '#52c41a' : '#ff4d4f'}
              opacity={0.8}
            />
          </g>
        )
      })}
      {/* 零線 */}
      <line x1={30} y1={175} x2={490} y2={175} stroke="#333" strokeWidth={1} />
      {/* Y軸 */}
      <line x1={30} y1={10} x2={30} y2={175} stroke="#333" strokeWidth={1} />
      {/* 標籤 */}
      {[-12, -8, -4, 0, 4, 8, 12, 16].map((v, i) => (
        <text key={i} x={30 + (i / 7) * 460} y={188} fontSize={9} fill="#999" textAnchor="middle">{v}%</text>
      ))}
    </svg>
  )
}

function ScatterPlot({ data }) {
  return (
    <svg width="100%" viewBox="0 0 500 220" style={{ display: 'block' }}>
      {/* 軸 */}
      <line x1={40} y1={10} x2={40} y2={195} stroke="#666" strokeWidth={1} />
      <line x1={40} y1={195} x2={490} y2={195} stroke="#666" strokeWidth={1} />
      {/* 零線 */}
      <line x1={40} y1={110} x2={490} y2={110} stroke="#ddd" strokeDasharray="3,3" />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={40 + (d.bars / 300) * 450}
          cy={110 - (d.ret / 100) * 100}
          r={4}
          fill={d.ret >= 0 ? '#ff4d4f' : '#52c41a'}
          opacity={0.7}
        />
      ))}
      {/* 軸標 */}
      <text x={265} y={210} fontSize={10} fill="#999" textAnchor="middle">持倉K線根數</text>
      <text x={16} y={110} fontSize={10} fill="#999" textAnchor="middle" transform="rotate(-90,16,110)">報酬率%</text>
    </svg>
  )
}

// 產生假資料
function genHistData() {
  return Array.from({ length: 20 }, (_, i) => {
    const x = -12 + i * 1.5
    const count = Math.round(300 * Math.exp(-0.5 * ((x - 2) / 3) ** 2))
    return { x, count, isLoss: x < 0 }
  })
}

function genScatterData() {
  return Array.from({ length: 200 }, () => ({
    bars: Math.random() * 280 + 20,
    ret: Math.random() * 200 - 30,
  }))
}

export default function TradeStats() {
  const histData = genHistData()
  const scatterData = genScatterData()

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 6, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>報酬分佈圖</span>
            <button style={{ padding: '1px 8px', fontSize: 'var(--font-size-xs)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 3 }}>報酬率/淨利</button>
          </div>
          <Histogram data={histData} />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            <span>■ <span style={{ color: '#ff4d4f' }}>獲利</span></span>
            <span>■ <span style={{ color: '#52c41a' }}>虧損</span></span>
          </div>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 6, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>持倉效率圖</span>
            <button style={{ padding: '1px 8px', fontSize: 'var(--font-size-xs)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 3 }}>報酬率/淨利</button>
          </div>
          <ScatterPlot data={scatterData} />
        </div>
      </div>
      {/* 右側欄位 */}
      <div style={{ width: 200, borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>欄位區（規劃中）</span>
      </div>
    </div>
  )
}
