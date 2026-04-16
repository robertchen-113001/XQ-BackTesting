// 商品與交易 Tab：商品統計列表 + 選中商品的交易明細
import { useState } from 'react'
import { productStats } from '../../data/mockData'

function genTrades(code) {
  return Array.from({ length: 8 }, (_, i) => {
    const ret = (Math.random() - 0.4) * 20
    return {
      id: i + 1,
      code,
      entryDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      exitDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      entryPrice: (Math.random() * 500 + 50).toFixed(1),
      exitPrice: (Math.random() * 500 + 50).toFixed(1),
      qty: Math.round(Math.random() * 10 + 1) * 1000,
      ret: ret.toFixed(2),
      pnl: (ret * 1000).toFixed(0),
      holdBars: Math.round(Math.random() * 30 + 1),
    }
  })
}

export default function ProductTrade() {
  const [selectedCode, setSelectedCode] = useState(null)
  const [sortKey, setSortKey] = useState('netProfitPct')
  const [sortAsc, setSortAsc] = useState(false)

  const sorted = [...productStats].sort((a, b) => {
    const av = parseFloat(a[sortKey]) || 0
    const bv = parseFloat(b[sortKey]) || 0
    return sortAsc ? av - bv : bv - av
  })

  function handleSort(key) {
    if (sortKey === key) setSortAsc(v => !v)
    else { setSortKey(key); setSortAsc(false) }
  }

  function SortTh({ col, label }) {
    const active = sortKey === col
    return (
      <th onClick={() => handleSort(col)} style={{ cursor: 'pointer', userSelect: 'none' }}>
        {label} {active ? (sortAsc ? '↑' : '↓') : ''}
      </th>
    )
  }

  const trades = selectedCode ? genTrades(selectedCode) : []
  const selected = productStats.find(p => p.code === selectedCode)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* 左側：商品統計表 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '8px 16px 4px', fontWeight: 600, fontSize: 'var(--font-size-md)', background: 'var(--color-surface)', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid var(--color-border)' }}>
          商品統計
          <span style={{ marginLeft: 8, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 400 }}>點擊商品查看交易明細</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>商品</th>
              <SortTh col="netProfitPct" label="淨利率" />
              <SortTh col="netProfitAmt" label="淨利" />
              <SortTh col="grossProfit" label="毛利率" />
              <SortTh col="profitFactor" label="獲利因子" />
              <SortTh col="maxInvest" label="最大投入" />
              <SortTh col="holdCnt" label="持倉K線數" />
              <SortTh col="tradeCnt" label="交易筆數" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const isSelected = p.code === selectedCode
              const isProfit = parseFloat(p.netProfitPct) >= 0
              return (
                <tr
                  key={i}
                  onClick={() => setSelectedCode(p.code === selectedCode ? null : p.code)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? 'var(--color-primary-bg, #e6f4ff)' : '',
                    borderLeft: isSelected ? '2px solid var(--color-primary)' : '2px solid transparent',
                  }}
                >
                  <td>
                    <span className="text-primary-color" style={{ fontWeight: 500 }}>{p.code}</span>
                    <span style={{ marginLeft: 4, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{p.name}</span>
                  </td>
                  <td style={{ color: isProfit ? 'var(--color-profit)' : 'var(--color-loss)', fontWeight: 500 }}>{p.netProfitPct}</td>
                  <td style={{ color: isProfit ? 'var(--color-profit)' : 'var(--color-loss)' }}>{p.netProfitAmt}</td>
                  <td>{p.grossProfit}</td>
                  <td style={{ color: parseFloat(p.profitFactor) >= 1 ? 'var(--color-profit)' : 'var(--color-loss)' }}>{p.profitFactor}</td>
                  <td>{p.maxInvest}</td>
                  <td>{p.holdCnt.toLocaleString()}</td>
                  <td><span className="text-primary-color">{p.tradeCnt}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 右側：交易明細面板 */}
      <div style={{ width: 420, borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'auto', flexShrink: 0 }}>
        {selectedCode ? (
          <>
            <div style={{ padding: '8px 12px 4px', fontWeight: 600, fontSize: 'var(--font-size-md)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: 'var(--color-surface)', zIndex: 1 }}>
              {selected?.code} {selected?.name} — 交易明細
            </div>
            <table style={{ fontSize: 'var(--font-size-xs)' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>進場日</th>
                  <th>出場日</th>
                  <th>進場價</th>
                  <th>出場價</th>
                  <th>報酬率</th>
                  <th>持倉根數</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t, i) => {
                  const isProfit = parseFloat(t.ret) >= 0
                  return (
                    <tr key={i}>
                      <td style={{ color: 'var(--color-text-tertiary)' }}>{t.id}</td>
                      <td>{t.entryDate}</td>
                      <td>{t.exitDate}</td>
                      <td>{t.entryPrice}</td>
                      <td>{t.exitPrice}</td>
                      <td style={{ color: isProfit ? 'var(--color-profit)' : 'var(--color-loss)', fontWeight: 500 }}>
                        {isProfit ? '+' : ''}{t.ret}%
                      </td>
                      <td>{t.holdBars}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
            點擊左側商品查看交易明細
          </div>
        )}
      </div>
    </div>
  )
}
