// 週期分析 Tab：日/週/月/季/年 頻率長條圖 + 月份熱力圖
import { useState } from 'react'
import { periodData } from '../../data/mockData'

function BarChart({ data, height = 160 }) {
  const maxAbs = Math.max(...data.map(d => Math.abs(d.value)), 1)
  const zeroY = height * 0.6
  return (
    <svg width="100%" viewBox={`0 0 ${Math.max(data.length * 18, 300)} ${height + 30}`} style={{ display: 'block' }}>
      {/* 零線 */}
      <line x1={0} y1={zeroY} x2={data.length * 18} y2={zeroY} stroke="#ccc" strokeWidth={1} />
      {data.map((d, i) => {
        const barH = (Math.abs(d.value) / maxAbs) * (height * 0.55)
        const isProfit = d.value >= 0
        const x = i * 18 + 2
        const y = isProfit ? zeroY - barH : zeroY
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={14}
              height={barH}
              fill={isProfit ? '#ff4d4f' : '#52c41a'}
              opacity={0.85}
            />
            <text x={x + 7} y={height + 20} fontSize={8} fill="#999" textAnchor="middle">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function Heatmap({ data }) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const allVals = data.flatMap(r => r.months.filter(v => v !== 0))
  const maxAbs = Math.max(...allVals.map(Math.abs), 1)

  function getColor(v) {
    if (v === 0) return '#f5f5f5'
    const intensity = Math.min(Math.abs(v) / maxAbs, 1)
    if (v > 0) {
      const r = Math.round(255 - intensity * 50)
      const g = Math.round(255 - intensity * 180)
      const b = Math.round(255 - intensity * 180)
      return `rgb(${r},${g},${b})`
    } else {
      const r = Math.round(255 - intensity * 180)
      const g = Math.round(255 - intensity * 50)
      const b = Math.round(255 - intensity * 50)
      return `rgb(${r},${g},${b})`
    }
  }

  const cellW = 52
  const cellH = 28

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={cellW * 13 + 4} height={(data.length + 1) * cellH + 4} style={{ display: 'block' }}>
        {/* 月份標題 */}
        {months.map((m, i) => (
          <text key={i} x={(i + 1) * cellW + cellW / 2} y={16} fontSize={10} fill="#999" textAnchor="middle">{m}</text>
        ))}
        {data.map((row, ri) => (
          <g key={ri}>
            {/* 年份標籤 */}
            <text x={cellW / 2} y={(ri + 1) * cellH + cellH / 2 + 5} fontSize={10} fill="#666" textAnchor="middle">{row.year}</text>
            {row.months.map((v, mi) => (
              <g key={mi}>
                <rect
                  x={(mi + 1) * cellW + 2}
                  y={(ri + 1) * cellH + 2}
                  width={cellW - 4}
                  height={cellH - 4}
                  rx={2}
                  fill={getColor(v)}
                />
                {v !== 0 && (
                  <text
                    x={(mi + 1) * cellW + cellW / 2}
                    y={(ri + 1) * cellH + cellH / 2 + 4}
                    fontSize={9}
                    fill={Math.abs(v) > maxAbs * 0.5 ? '#fff' : '#333'}
                    textAnchor="middle"
                  >
                    {v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}%
                  </text>
                )}
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  )
}

const FREQ_OPTIONS = [
  { id: 'byDay', label: '日' },
  { id: 'byWeek', label: '週' },
  { id: 'byMonth', label: '月' },
  { id: 'byQuarter', label: '季' },
  { id: 'byYear', label: '年' },
]

function genWeekData() {
  return ['週一', '週二', '週三', '週四', '週五'].map(label => ({
    label,
    value: (Math.random() - 0.4) * 40,
    isProfit: Math.random() > 0.4,
  }))
}

function genQuarterData() {
  return ['Q1', 'Q2', 'Q3', 'Q4'].map(label => ({
    label,
    value: (Math.random() - 0.4) * 50,
    isProfit: Math.random() > 0.4,
  }))
}

function genYearData() {
  return ['2022', '2023', '2024'].map(label => ({
    label,
    value: (Math.random() - 0.4) * 60,
    isProfit: Math.random() > 0.4,
  }))
}

export default function PeriodAnalysis() {
  const [freq, setFreq] = useState('byMonth')

  const dataMap = {
    byDay: periodData.byDay,
    byWeek: genWeekData(),
    byMonth: periodData.byMonth,
    byQuarter: genQuarterData(),
    byYear: genYearData(),
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 頻率切換 */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 6, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>週期分析</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>各週期平均報酬率</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              {FREQ_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFreq(opt.id)}
                  style={{
                    padding: '2px 10px',
                    fontSize: 'var(--font-size-xs)',
                    background: freq === opt.id ? 'var(--color-primary)' : '',
                    color: freq === opt.id ? '#fff' : '',
                    border: freq === opt.id ? 'none' : '',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <BarChart data={dataMap[freq]} />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 8 }}>
            <span>■ <span style={{ color: '#ff4d4f' }}>獲利</span></span>
            <span>■ <span style={{ color: '#52c41a' }}>虧損</span></span>
          </div>
        </div>

        {/* 月報酬熱力圖 */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 6, padding: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>月報酬熱力圖</div>
          <Heatmap data={periodData.heatmap} />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 8 }}>
            <span style={{ color: '#999' }}>□ 無資料</span>
            <span>■ <span style={{ color: '#ff4d4f' }}>獲利（紅）</span></span>
            <span>■ <span style={{ color: '#52c41a' }}>虧損（綠）</span></span>
          </div>
        </div>
      </div>

      {/* 右側欄位 */}
      <div style={{ width: 200, borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 'var(--font-size-sm)' }}>週期統計</div>
        {[
          { label: '最佳月份', value: '3月 +20.2%' },
          { label: '最差月份', value: '6月 -15.0%' },
          { label: '正報酬月數', value: '8 月' },
          { label: '負報酬月數', value: '4 月' },
          { label: '月平均報酬', value: '+3.8%' },
          { label: '月報酬標準差', value: '9.2%' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 'var(--font-size-xs)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
            <span style={{ fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
