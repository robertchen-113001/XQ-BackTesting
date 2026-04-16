import { useState } from 'react'
import FlowStepIndicator from '../FlowStepIndicator'
import { FLOW_STEPS } from '../flowDefinitions'
import { productStats } from '../../../data/mockData'

const steps = FLOW_STEPS.flow7

// 只取前 5 筆
const PRODUCTS = productStats.slice(0, 5)

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  padding: '16px 20px',
  marginBottom: 12,
}

export default function ProductFilterRerunButton() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selected, setSelected] = useState(new Set())
  const [recalculating, setRecalculating] = useState(false)
  const [newTabOpen, setNewTabOpen] = useState(false)

  const allChecked = selected.size === PRODUCTS.length
  const someChecked = selected.size > 0 && !allChecked

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set())
    } else {
      setSelected(new Set(PRODUCTS.map(p => p.code)))
    }
    setCurrentStep(1)
  }

  const toggleItem = (code) => {
    const next = new Set(selected)
    if (next.has(code)) {
      next.delete(code)
    } else {
      next.add(code)
      setCurrentStep(1)
    }
    setSelected(next)
  }

  const handleRerun = () => {
    setRecalculating(true)
    setCurrentStep(2)
    setTimeout(() => {
      setCurrentStep(3)
      setTimeout(() => {
        setRecalculating(false)
        setNewTabOpen(true)
        setCurrentStep(4)
      }, 1000)
    }, 800)
  }

  const reset = () => {
    setCurrentStep(1)
    setSelected(new Set())
    setRecalculating(false)
    setNewTabOpen(false)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h3 style={{ marginBottom: 4, color: 'var(--color-text)' }}>流程 7：小範圍篩選回測</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20, fontSize: 13 }}>
        勾選商品 → 點選重新統計 → 重新計算 → 新 Tab 開啟
      </p>

      <div style={cardStyle}>
        <FlowStepIndicator steps={steps} currentStep={currentStep} />
        <p style={{ marginTop: 16, color: 'var(--color-text-secondary)', fontSize: 13, textAlign: 'center' }}>
          {steps[currentStep - 1]?.description}
        </p>
      </div>

      {/* 互動 Demo 主區 */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>商品統計表</span>
          {/* 重新統計按鈕（條件渲染） */}
          <div style={{ opacity: selected.size > 0 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            <button
              onClick={handleRerun}
              disabled={selected.size === 0 || recalculating}
              style={{
                padding: '5px 12px',
                background: '#1a56db',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: selected.size === 0 || recalculating ? 'not-allowed' : 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              重新統計（{selected.size}）
            </button>
          </div>
        </div>

        {/* 商品表格 */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--color-bg)' }}>
              <th style={{ padding: '7px 10px', borderBottom: '1px solid var(--color-border)', width: 36 }}>
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={el => { if (el) el.indeterminate = someChecked }}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th style={{ padding: '7px 10px', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>商品</th>
              <th style={{ padding: '7px 10px', textAlign: 'right', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>淨利率</th>
              <th style={{ padding: '7px 10px', textAlign: 'right', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>獲利因子</th>
              <th style={{ padding: '7px 10px', textAlign: 'right', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>交易筆數</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map(p => {
              const isSelected = selected.has(p.code)
              const isNeg = p.netProfitPct.startsWith('-')
              return (
                <tr
                  key={p.code}
                  onClick={() => toggleItem(p.code)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? '#eff6ff' : 'transparent',
                    borderBottom: '1px solid var(--color-border)',
                    transition: 'background 0.15s',
                  }}
                >
                  <td style={{ padding: '7px 10px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem(p.code)}
                      style={{ cursor: 'pointer' }}
                      onClick={e => e.stopPropagation()}
                    />
                  </td>
                  <td style={{ padding: '7px 10px', color: 'var(--color-text)' }}>
                    <span style={{ fontWeight: 600 }}>{p.code}</span> {p.name}
                  </td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', color: isNeg ? 'var(--color-loss)' : 'var(--color-profit)', fontWeight: 600 }}>
                    {p.netProfitPct}
                  </td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', color: p.profitFactor >= 1 ? 'var(--color-profit)' : 'var(--color-loss)' }}>
                    {p.profitFactor.toFixed(2)}
                  </td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', color: 'var(--color-text)' }}>
                    {p.tradeCnt}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* 狀態訊息 */}
        {recalculating && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 13, color: '#1a56db' }}>
            ⟳ 重新計算中：篩選 {selected.size} 支商品的交易紀錄…
          </div>
        )}
        {newTabOpen && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, fontSize: 13, color: '#059669', fontWeight: 600 }}>
            ✅ 新的回測報告已在新 Tab 開啟（篩選商品：{Array.from(selected).join(', ')}）
          </div>
        )}
      </div>

      {/* 步驟導航 */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
          disabled={currentStep === 1}
          style={{ padding: '6px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6, cursor: currentStep === 1 ? 'not-allowed' : 'pointer', color: 'var(--color-text)', fontSize: 13, opacity: currentStep === 1 ? 0.4 : 1 }}
        >
          ← 上一步
        </button>
        <button
          onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))}
          disabled={currentStep === steps.length}
          style={{ padding: '6px 14px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 6, cursor: currentStep === steps.length ? 'not-allowed' : 'pointer', fontSize: 13, opacity: currentStep === steps.length ? 0.4 : 1 }}
        >
          下一步 →
        </button>
        <button
          onClick={reset}
          style={{ padding: '6px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6, cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 13 }}
        >
          重置
        </button>
      </div>
    </div>
  )
}
