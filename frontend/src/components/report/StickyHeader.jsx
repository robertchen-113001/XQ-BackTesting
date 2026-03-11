import { useState } from 'react'

// 置頂區：標題、控制設定、關鍵指標、頁籤
export default function StickyHeader({ report, collapsed, onToggleCollapse, activeTab, tabs, onTabChange }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(report.title)
  const [tradeQty, setTradeQty] = useState(report.tradeQty)
  const [returnAlgo, setReturnAlgo] = useState(report.returnAlgo)
  const [direction, setDirection] = useState(report.direction)
  const [showNote, setShowNote] = useState(false)

  const km = report.keyMetrics

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      flexShrink: 0,
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* A1 策略標題 + A2 功能按鈕 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 4px' }}>
        {/* A1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {editingTitle ? (
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
              autoFocus
              style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, width: 360, height: 28 }}
            />
          ) : (
            <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>{title}</span>
          )}
          <button
            onClick={() => setEditingTitle(true)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 2px', fontSize: 14, color: 'var(--color-text-tertiary)' }}
            title="編輯標題"
          >✏️</button>
        </div>
        {/* A2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* 備註 */}
          <button onClick={() => setShowNote(v => !v)} title="備註">📝 備註</button>
          {/* 匯出 */}
          <div style={{ position: 'relative' }}>
            <button title="匯出">⬆ 匯出 ▾</button>
          </div>
          {/* 重新回測 */}
          <button className="primary">↺ 重新回測</button>
        </div>
      </div>

      {/* A3 計算設定 + 基本資訊 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 16px', flexWrap: 'wrap' }}>
        <select value={tradeQty} onChange={e => setTradeQty(e.target.value)}>
          <option>原始</option>
          <option>等額</option>
          <option>等量</option>
          <option>等比</option>
        </select>
        <select
          value={returnAlgo}
          onChange={e => setReturnAlgo(e.target.value)}
          disabled={tradeQty === '等比'}
        >
          <option>時間加權</option>
          <option disabled={tradeQty === '等比'}>最大投入</option>
        </select>
        {report.platform === '自動交易' && (
          <select value={direction} onChange={e => setDirection(e.target.value)}>
            <option>多·空</option>
            <option>多</option>
            <option>空</option>
          </select>
        )}
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          {report.dateRange}
        </span>
        <span>
          成功商品 <span className="text-primary-color font-bold">{report.successCount}</span>
        </span>
        <span>
          失敗商品 <span style={{ color: '#ff4d4f', fontWeight: 600, cursor: 'pointer' }}>{report.failCount}</span>
        </span>
      </div>

      {/* A5 關鍵指標 — 僅在未收合時顯示 */}
      {!collapsed && (
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { label: '報酬率', value: km.returnRate, sub: `淨利 ${km.netProfit}` },
              { label: '勝率', value: km.winRate, sub: `獲利 ${km.winCount}筆 虧損 ${km.lossCount}筆` },
              { label: '最大區間虧損', value: km.maxDrawdown, sub: `區間 ${km.mddRange}` },
              { label: '交易次數', value: km.tradeCount + '筆', sub: `年均交易 ${km.avgTrade}筆` },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1,
                padding: '8px 16px',
                borderRight: i < 3 ? '1px solid var(--color-border)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--color-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}>
                  {i === 0 ? '📈' : i === 1 ? '🎯' : i === 2 ? '📉' : '📊'}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{item.label}</div>
                  <div style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 700,
                    color: i === 2 ? 'var(--color-loss)' : 'var(--color-profit)',
                    lineHeight: 1.2,
                  }}>{item.value}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
          {/* 次要指標列 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            borderTop: '1px solid var(--color-border)',
            marginTop: 8,
            paddingTop: 6,
          }}>
            {report.secondaryMetrics.map((m, i) => (
              <div key={i} style={{ padding: '2px 8px', borderRight: i < 7 ? '1px solid var(--color-border)' : 'none' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{m.label}</div>
                <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 收合按鈕 */}
      <div
        onClick={onToggleCollapse}
        style={{ textAlign: 'center', padding: '2px 0', cursor: 'pointer', fontSize: 12, color: 'var(--color-text-tertiary)' }}
      >
        {collapsed ? '▼' : '▲'}
      </div>

      {/* B 頁籤 */}
      <div style={{ display: 'flex', padding: '0 16px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              border: 'none',
              borderBottom: tab.id === activeTab ? '2px solid var(--color-primary)' : '2px solid transparent',
              borderRadius: 0,
              background: 'transparent',
              padding: '8px 16px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: tab.id === activeTab ? 700 : 400,
              color: tab.id === activeTab ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 備註側邊欄 */}
      {showNote && (
        <div style={{
          position: 'fixed',
          right: 0,
          top: 36,
          bottom: 0,
          width: 280,
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          padding: 12,
          zIndex: 100,
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>備註</div>
          <textarea
            style={{ flex: 1, resize: 'none', border: '1px solid var(--color-border)', borderRadius: 4, padding: 8, fontFamily: 'inherit', fontSize: 'var(--font-size-sm)' }}
            placeholder="在此記錄文字，自動儲存..."
          />
        </div>
      )}
    </div>
  )
}
