const FORMULA_GROUPS = [
  {
    group: '報酬率指標',
    color: '#2563eb',
    formulas: [
      { name: 'TWR（時間加權報酬率）', formula: 'TWRₜ = TWRₜ₋₁ × (1 + rₜ)', desc: '等比模式下，每日報酬率連乘累計，消除資金進出影響' },
      { name: 'MIR（最大投入報酬率）', formula: 'MIR = 總損益 / 最大投入資金', desc: '以最大曾投入資金為基底，計算整體策略報酬率' },
    ],
  },
  {
    group: '風險指標',
    color: '#dc2626',
    formulas: [
      { name: 'MDD（最大回撤）',     formula: 'MDD = max(Peakₜ − Troughₜ) / Peakₜ', desc: '從歷史高點到後續低點的最大跌幅百分比' },
      { name: 'Sharpe Ratio',        formula: 'Sharpe = (E[r] − Rf) / σ',             desc: '超額報酬除以標準差，衡量每單位風險所獲報酬' },
    ],
  },
  {
    group: '交易統計',
    color: '#059669',
    formulas: [
      { name: '勝率',     formula: '勝率 = 獲利筆數 / 總交易筆數',                  desc: '獲利交易佔全部交易的比例' },
      { name: '盈虧比',   formula: '盈虧比 = 平均獲利 / |平均虧損|',               desc: '平均獲利與平均虧損的絕對值比值' },
      { name: '期望值',   formula: '期望值 = 勝率 × 平均獲利 − (1−勝率) × |平均虧損|', desc: '每筆交易的理論期望損益' },
    ],
  },
]

const DAILY_FIELDS = [
  { name: 'date',         label: '日期',         source: '交易日曆' },
  { name: 'openPnl',      label: '未實現損益',   source: 'closePrice2 × Lots − costPrice × Lots' },
  { name: 'closePnl',     label: '已實現損益',   source: '平倉交易加總' },
  { name: 'totalPnl',     label: '當日總損益',   source: 'openPnl + closePnl' },
  { name: 'cumulPnl',     label: '累計損益',     source: '∑ totalPnl（截至當日）' },
  { name: 'dailyReturn',  label: '當日報酬率',   source: 'totalPnl / 期初資金' },
  { name: 'twrReturn',    label: 'TWR 報酬率',   source: 'TWRₜ − 1' },
  { name: 'maxDrawdown',  label: '當日最大回撤', source: '即時計算 MDD' },
]

export default function FieldCalculationPage() {
  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
        PRD 07 — 欄位計算規格
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: 14 }}>
        報表各計算欄位的公式定義與每日報表欄位來源
      </p>

      {FORMULA_GROUPS.map(g => (
        <div key={g.group} style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: g.color, marginBottom: 12 }}>{g.group}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {g.formulas.map(f => (
              <div key={f.name} style={{
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderLeft: `3px solid ${g.color}`, borderRadius: '0 8px 8px 0', padding: 14
              }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)', marginBottom: 6 }}>{f.name}</div>
                <code style={{
                  display: 'block', background: 'var(--color-bg)', padding: '6px 12px',
                  borderRadius: 4, fontSize: 13, fontFamily: 'monospace', color: g.color, marginBottom: 6
                }}>
                  {f.formula}
                </code>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>每日報表欄位</h3>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>欄位名稱</th><th style={th}>顯示標籤</th><th style={th}>計算來源</th>
          </tr>
        </thead>
        <tbody>
          {DAILY_FIELDS.map(f => (
            <tr key={f.name}>
              <td style={td}><code style={code}>{f.name}</code></td>
              <td style={{ ...td, fontWeight: 600 }}>{f.label}</td>
              <td style={{ ...td, fontFamily: 'monospace', fontSize: 12, color: '#7c3aed' }}>{f.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const table = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const th = { background: 'var(--color-surface)', padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }
const td = { padding: '10px 14px', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }
const code = { background: 'var(--color-bg)', padding: '1px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }
