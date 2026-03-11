import { useState } from 'react'
import FlowStepIndicator from '../FlowStepIndicator'
import { FLOW_STEPS } from '../flowDefinitions'

const steps = FLOW_STEPS.flow3

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  padding: '16px 20px',
  marginBottom: 12,
}

export default function RerunBacktestButton() {
  const [currentStep, setCurrentStep] = useState(1)
  const [clicked, setClicked] = useState(false)
  const [newTabOpen, setNewTabOpen] = useState(false)
  const [sinkerAnimating, setSinkerAnimating] = useState(false)

  const handleRerun = () => {
    setClicked(true)
    setCurrentStep(2)
    setSinkerAnimating(true)
    setTimeout(() => {
      setSinkerAnimating(false)
      setNewTabOpen(true)
      setCurrentStep(3)
    }, 1800)
  }

  const reset = () => {
    setCurrentStep(1)
    setClicked(false)
    setNewTabOpen(false)
    setSinkerAnimating(false)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h3 style={{ marginBottom: 4, color: 'var(--color-text)' }}>流程 3：重新回測</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20, fontSize: 13 }}>
        點選重新回測 → Sinker 傳 ID 給 XQ → 新 Tab 開啟（舊 UI 保留）
      </p>

      <div style={cardStyle}>
        <FlowStepIndicator steps={steps} currentStep={currentStep} />
        <p style={{ marginTop: 16, color: 'var(--color-text-secondary)', fontSize: 13, textAlign: 'center' }}>
          {steps[currentStep - 1]?.description}
        </p>
      </div>

      {/* 互動 Demo 主區 */}
      <div style={cardStyle}>
        <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 12 }}>回測報告頭部模擬</div>

        {/* 模擬報告頭部 */}
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 12,
        }}>
          <div style={{
            background: 'var(--color-bg)',
            padding: '10px 16px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>
              自動交易DIF-MACD — 回測報告
            </span>
            <button
              onClick={handleRerun}
              disabled={clicked}
              style={{
                padding: '5px 12px',
                background: clicked ? '#e2e8f0' : '#1a56db',
                color: clicked ? 'var(--color-text-secondary)' : '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: clicked ? 'default' : 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              🔄 重新回測
            </button>
          </div>
          <div style={{ padding: '10px 16px', fontSize: 12, color: 'var(--color-text-secondary)' }}>
            回測 ID：BT-20260311-0042 ｜ 商品數：8 ｜ 成功：6 / 失敗：2
          </div>
        </div>

        {/* Sinker 動畫 */}
        {sinkerAnimating && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 8,
            marginBottom: 12,
            fontSize: 13,
            color: '#1a56db',
          }}>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
            Sinker 呼叫中：傳送回測 ID BT-20260311-0042 給 XQ…
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Tab 並存示意 */}
        {newTabOpen && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Tab 並存示意：</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                border: '2px dashed #94a3b8',
                borderRadius: 8,
                padding: '10px 16px',
                flex: 1,
                opacity: 0.7,
              }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>舊 Tab（保留）</div>
                <div style={{ fontSize: 13, color: 'var(--color-text)' }}>自動交易DIF-MACD</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>BT-20260311-0042</div>
              </div>
              <div style={{
                border: '2px solid #1a56db',
                borderRadius: 8,
                padding: '10px 16px',
                flex: 1,
                background: '#eff6ff',
              }}>
                <div style={{ fontSize: 12, color: '#1a56db', marginBottom: 4, fontWeight: 600 }}>新 Tab（開啟中）</div>
                <div style={{ fontSize: 13, color: 'var(--color-text)' }}>自動交易DIF-MACD</div>
                <div style={{ fontSize: 11, color: '#1a56db' }}>BT-20260311-0043（新）</div>
              </div>
            </div>
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
