import { useState } from 'react'

// 簡易 SVG 折線圖
function LineChart({ data, width = 600, height = 200, color = '#ff4d4f', label }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 40) + 20
    const y = height - 20 - ((v - min) / range) * (height - 40)
    return `${x},${y}`
  }).join(' ')

  // 填色多邊形（面積圖）
  const zeroY = height - 20 - ((0 - min) / range) * (height - 40)
  const fillPts = `20,${zeroY} ${pts} ${(data.length - 1) / (data.length - 1) * (width - 40) + 20},${zeroY}`

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <polygon points={fillPts} fill={color} fillOpacity="0.15" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
      {/* 零線 */}
      <line x1={20} y1={zeroY} x2={width - 20} y2={zeroY} stroke="#ddd" strokeDasharray="3,3" />
      {/* 標籤 */}
      <text x={24} y={16} fontSize={10} fill="#999">{label}</text>
    </svg>
  )
}

// 產生假的報酬率曲線資料
function genReturnData(n = 100, trend = 0.3) {
  let v = 0
  return Array.from({ length: n }, () => {
    v += (Math.random() - 0.48 + trend / n) * 2
    return v
  })
}

// 統計面板（可收合）
function StatsGroup({ title, items }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '4px 0', fontWeight: 500, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }}
      >
        <span style={{ fontSize: 10 }}>{open ? '▼' : '▶'}</span>
        <span>{title}</span>
      </div>
      {open && items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 4px 4px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 'var(--font-size-xs)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
          <div style={{ textAlign: 'right' }}>
            {item.pct && <div style={{ fontWeight: 500 }}>{item.pct}</div>}
            {item.amt && <div style={{ color: 'var(--color-text-tertiary)' }}>{item.amt}</div>}
            {item.value && <div style={{ fontWeight: 500 }}>{item.value}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function OverallStats({ report }) {
  const [timeRange, setTimeRange] = useState('全部')
  const returnData = genReturnData(100, 5)
  const benchmarkData = genReturnData(100, 1.5)
  const bah = genReturnData(100, 2)
  const drawdownData = returnData.map((_, i) => {
    const peak = Math.max(...returnData.slice(0, i + 1))
    return -(peak - returnData[i]) * 0.6
  })

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* 左側：圖表 + 每日報表 */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* A1+A2 報酬率圖 */}
        <div style={{ background: 'var(--color-surface)', padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>報酬率圖</span>
            <button style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', background: 'var(--color-primary)', border: 'none', color: '#fff', borderRadius: 3 }}>報酬率</button>
            <button style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)' }}>淨值</button>
            <div style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 12, fontSize: 'var(--font-size-xs)' }}>
              {[
                { label: '策略報酬率 20%', color: '#ff4d4f' },
                { label: '大盤指數報酬率 20%', color: '#1677ff' },
                { label: '買進持有報酬率 -20%', color: '#888' },
              ].map((ind, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: ind.color }} />
                  <span style={{ color: ind.color }}>{ind.label}</span>
                </label>
              ))}
              <button style={{ fontSize: 'var(--font-size-xs)', padding: '1px 6px' }}>···</button>
            </div>
          </div>
          <LineChart data={returnData} color="#ff4d4f" label="策略報酬率" />
          <LineChart data={benchmarkData} color="#1677ff" label="大盤指數" />
          <LineChart data={bah} color="#888" label="買進持有" />

          {/* A3 副圖 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 4, fontSize: 'var(--font-size-xs)' }}>
            {['流動', '資金', '交易', '商品'].map(t => (
              <button key={t} style={{ padding: '1px 6px', fontSize: 'var(--font-size-xs)' }}>{t}</button>
            ))}
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#1677ff' }} />
              <span style={{ color: '#1677ff' }}>回檔 20%</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#52c41a' }} />
              <span style={{ color: '#52c41a' }}>最大區間虧損 -20%</span>
            </label>
          </div>
          <LineChart data={drawdownData} color="#52c41a" label="最大區間虧損" height={80} />

          {/* A5 時間軸 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <button style={{ padding: '2px 6px', fontSize: 'var(--font-size-xs)' }}>＜</button>
            <div style={{ flex: 1, height: 24, background: '#f5f5f5', borderRadius: 3, border: '1px solid var(--color-border)' }} />
            {['3月', '6月', '1年', '2年', '全部'].map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                style={{ padding: '2px 6px', fontSize: 'var(--font-size-xs)', background: timeRange === r ? 'var(--color-primary)' : '', color: timeRange === r ? '#fff' : '', border: timeRange === r ? 'none' : '' }}
              >{r}</button>
            ))}
          </div>
        </div>

        {/* B1 每日報表 */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: '8px 16px 4px', fontWeight: 600, fontSize: 'var(--font-size-md)', background: 'var(--color-surface)', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid var(--color-border)' }}>
            每日報表
          </div>
          <table>
            <thead>
              <tr>
                <th>日期 ↓</th>
                <th>報酬率</th>
                <th>當日損益</th>
                <th>回檔</th>
                <th>最大區間虧損</th>
                <th>投入金額</th>
                <th>最大投入金額</th>
                <th>交易筆數 B2</th>
              </tr>
            </thead>
            <tbody>
              {report.dailyReport.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td>
                    <div style={{ color: 'var(--color-profit)' }}>{row.returnPct}</div>
                    <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-xs)' }}>{row.returnAmt}</div>
                  </td>
                  <td>
                    <div style={{ color: parseFloat(row.dailyPct) >= 0 ? 'var(--color-profit)' : 'var(--color-loss)' }}>{row.dailyPct}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{row.dailyAmt}</div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--color-loss)' }}>{row.drawbackPct}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{row.drawbackAmt}</div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--color-loss)' }}>{row.mddPct}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{row.mddAmt}</div>
                  </td>
                  <td>{row.investAmt}</td>
                  <td>{row.maxInvestAmt}</td>
                  <td>
                    <span className="text-primary-color">{row.tradeCnt}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* A6 右側欄位統計 */}
      <div style={{ width: 220, flexShrink: 0, borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'auto', padding: '8px' }}>
        {Object.entries(report.statsPanel).map(([groupName, items]) => (
          <StatsGroup key={groupName} title={groupName} items={items} />
        ))}
      </div>
    </div>
  )
}
