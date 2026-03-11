import { useState } from 'react'
import FlowStepIndicator from '../FlowStepIndicator'
import { FLOW_STEPS } from '../flowDefinitions'

const steps = FLOW_STEPS.flow4

const MOCK_FAILED = [
  { code: '2454', name: '聯發科', reason: 'Connection timeout after 30s' },
  { code: '4904', name: '遠傳', reason: 'Request timeout: Server no response' },
  { code: '3008', name: '大立光', reason: 'Socket timeout' },
]

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  padding: '16px 20px',
  marginBottom: 12,
}

export default function FailedProductsRetryPanel() {
  const [currentStep, setCurrentStep] = useState(1)
  const [retrying, setRetrying] = useState(false)
  const [merging, setMerging] = useState(false)
  const [done, setDone] = useState(false)

  const handleRetry = () => {
    setRetrying(true)
    setCurrentStep(2)
    setTimeout(() => {
      setRetrying(false)
      setMerging(true)
      setCurrentStep(3)
      setTimeout(() => {
        setMerging(false)
        setDone(true)
        setCurrentStep(4)
      }, 1000)
    }, 1500)
  }

  const reset = () => {
    setCurrentStep(1)
    setRetrying(false)
    setMerging(false)
    setDone(false)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h3 style={{ marginBottom: 4, color: 'var(--color-text)' }}>流程 4：失敗商品 Retry</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20, fontSize: 13 }}>
        查看失敗清單 → 送 Retry（僅傳 ID）→ Server merge → 顯示完整報告
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
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>timeout 商品清單</span>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', background: '#fef9c3', padding: '2px 8px', borderRadius: 4, border: '1px solid #fde68a' }}>
            不可勾選特定商品
          </span>
        </div>

        {/* 失敗商品表格（無 checkbox） */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 12 }}>
          <thead>
            <tr style={{ background: 'var(--color-bg)' }}>
              <th style={{ padding: '7px 10px', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>商品代碼</th>
              <th style={{ padding: '7px 10px', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>商品名稱</th>
              <th style={{ padding: '7px 10px', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>狀態</th>
              <th style={{ padding: '7px 10px', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>說明</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_FAILED.map(p => (
              <tr key={p.code} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '7px 10px', color: 'var(--color-text)' }}>{p.code}</td>
                <td style={{ padding: '7px 10px', color: 'var(--color-text)' }}>{p.name}</td>
                <td style={{ padding: '7px 10px' }}>
                  <span style={{ color: 'var(--color-loss)', background: '#fef2f2', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                    ❌ timeout
                  </span>
                </td>
                <td style={{ padding: '7px 10px', color: 'var(--color-text-secondary)', fontSize: 12 }}>{p.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Retry 按鈕區 */}
        {!retrying && !merging && !done && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={handleRetry}
              style={{ padding: '6px 14px', background: 'var(--color-loss)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >
              重新回測失敗商品
            </button>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              只送 ID，不帶商品清單
            </span>
          </div>
        )}

        {retrying && (
          <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 13, color: '#1a56db' }}>
            ⟳ 送出回測 ID BT-20260311-0042 給 XQ，Web UI 暫時關閉中…
          </div>
        )}

        {merging && (
          <div style={{ padding: '10px 14px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 8, fontSize: 13, color: '#92400e' }}>
            ⟳ Server merge 回測結果中（3 個商品）…
          </div>
        )}

        {done && (
          <div style={{ padding: '10px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, fontSize: 13, color: '#059669', fontWeight: 600 }}>
            ✅ 所有商品回測完成，Web UI 重新喚醒，完整報告已顯示
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
