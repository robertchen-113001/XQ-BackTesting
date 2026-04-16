// 因子分析 Tab：因子分組績效對比
import { useState } from 'react'

function genFactorGroups(n = 5) {
  return Array.from({ length: n }, (_, i) => ({
    group: `Q${i + 1}`,
    returnPct: ((i - 2) * 8 + (Math.random() - 0.5) * 6).toFixed(2),
    winRate: (40 + i * 5 + (Math.random() - 0.5) * 5).toFixed(1),
    tradeCnt: Math.round(200 + Math.random() * 300),
    profitFactor: (0.8 + i * 0.3 + (Math.random() - 0.5) * 0.2).toFixed(2),
    maxDrawdown: (-(20 - i * 2) - Math.random() * 5).toFixed(1),
  }))
}

function genCumReturnData(n = 100, slope = 0) {
  let v = 0
  return Array.from({ length: n }, () => {
    v += (Math.random() - 0.48 + slope / n) * 3
    return v
  })
}

function MultiLineChart({ series, height = 160 }) {
  const allVals = series.flatMap(s => s.data)
  const min = Math.min(...allVals)
  const max = Math.max(...allVals)
  const range = max - min || 1
  const w = 460
  const h = height

  return (
    <svg width="100%" viewBox={`0 0 ${w + 40} ${h + 30}`} style={{ display: 'block' }}>
      {/* 零線 */}
      <line
        x1={30} y1={h - ((0 - min) / range) * h + 10}
        x2={w + 30} y2={h - ((0 - min) / range) * h + 10}
        stroke="#ddd" strokeDasharray="3,3"
      />
      {/* Y軸 */}
      <line x1={30} y1={10} x2={30} y2={h + 10} stroke="#ccc" strokeWidth={1} />
      {series.map((s, si) => {
        const pts = s.data.map((v, i) => {
          const x = 30 + (i / (s.data.length - 1)) * w
          const y = h + 10 - ((v - min) / range) * h
          return `${x},${y}`
        }).join(' ')
        return <polyline key={si} points={pts} fill="none" stroke={s.color} strokeWidth={1.5} opacity={0.85} />
      })}
      {/* 圖例 */}
      {series.map((s, si) => (
        <g key={si}>
          <line x1={30 + si * 80} y1={h + 24} x2={50 + si * 80} y2={h + 24} stroke={s.color} strokeWidth={2} />
          <text x={54 + si * 80} y={h + 27} fontSize={9} fill="#666">{s.label}</text>
        </g>
      ))}
    </svg>
  )
}

const FACTORS = ['動能因子', '價值因子', '品質因子', '成長因子', '規模因子']
const COLORS = ['#ff4d4f', '#1677ff', '#52c41a', '#fa8c16', '#722ed1']

export default function FactorAnalysis() {
  const [activeFactor, setActiveFactor] = useState('動能因子')
  const groups = genFactorGroups(5)

  const series = groups.map((g, i) => ({
    label: g.group,
    color: COLORS[i],
    data: genCumReturnData(80, (i - 2) * 3),
  }))

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 因子切換 */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 6, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>因子分析</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {FACTORS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFactor(f)}
                  style={{
                    padding: '2px 10px',
                    fontSize: 'var(--font-size-xs)',
                    background: activeFactor === f ? 'var(--color-primary)' : '',
                    color: activeFactor === f ? '#fff' : '',
                    border: activeFactor === f ? 'none' : '',
                  }}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* 累積報酬折線圖 */}
          <div style={{ marginBottom: 8, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            {activeFactor} — 分組累積報酬率（Q1=低分位 / Q5=高分位）
          </div>
          <MultiLineChart series={series} />
        </div>

        {/* 分組績效表格 */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 6, padding: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>分組績效統計</div>
          <table>
            <thead>
              <tr>
                <th>分組</th>
                <th>報酬率</th>
                <th>勝率</th>
                <th>交易筆數</th>
                <th>獲利因子</th>
                <th>最大區間虧損</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g, i) => (
                <tr key={i}>
                  <td>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: COLORS[i], marginRight: 6 }} />
                    {g.group}
                  </td>
                  <td>
                    <span style={{ color: parseFloat(g.returnPct) >= 0 ? 'var(--color-profit)' : 'var(--color-loss)', fontWeight: 500 }}>
                      {parseFloat(g.returnPct) >= 0 ? '+' : ''}{g.returnPct}%
                    </span>
                  </td>
                  <td>{g.winRate}%</td>
                  <td>{g.tradeCnt}</td>
                  <td style={{ color: parseFloat(g.profitFactor) >= 1 ? 'var(--color-profit)' : 'var(--color-loss)' }}>{g.profitFactor}</td>
                  <td style={{ color: 'var(--color-loss)' }}>{g.maxDrawdown}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 右側欄位 */}
      <div style={{ width: 200, borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>欄位區（規劃中）</span>
      </div>
    </div>
  )
}
