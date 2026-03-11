import { useState } from 'react'
import FlowStepIndicator from '../FlowStepIndicator'
import { FLOW_STEPS } from '../flowDefinitions'

const steps = FLOW_STEPS.flow2

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  padding: '16px 20px',
  marginBottom: 12,
}

export default function BacktestErrorBanner() {
  const [currentStep, setCurrentStep] = useState(1)
  const [errorVisible, setErrorVisible] = useState(false)
  const [hasId, setHasId] = useState(null) // null | true | false

  const triggerExpiry = () => {
    setErrorVisible(true)
    setCurrentStep(2)
    setHasId(null)
  }

  const reset = () => {
    setCurrentStep(1)
    setErrorVisible(false)
    setHasId(null)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h3 style={{ marginBottom: 4, color: 'var(--color-text)' }}>流程 2：Server 紀錄逾期</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20, fontSize: 13 }}>
        偵測逾期 → 顯示錯誤橫幅 → 情境分岔（A：XQ 有 ID / B：XQ 無 ID）
      </p>

      <div style={cardStyle}>
        <FlowStepIndicator steps={steps} currentStep={currentStep} />
        <p style={{ marginTop: 16, color: 'var(--color-text-secondary)', fontSize: 13, textAlign: 'center' }}>
          {steps[currentStep - 1]?.description}
        </p>
      </div>

      {/* 互動 Demo 主區 */}
      <div style={cardStyle}>
        <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 12 }}>逾期模擬</div>

        {!errorVisible && (
          <button
            onClick={triggerExpiry}
            style={{ padding: '6px 14px', background: 'var(--color-loss)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
          >
            模擬 Server 逾期
          </button>
        )}

        {errorVisible && (
          <div>
            {/* 錯誤橫幅 */}
            <div style={{
              borderLeft: '4px solid var(--color-loss)',
              background: '#fef2f2',
              padding: '12px 16px',
              borderRadius: '0 6px 6px 0',
              marginBottom: 16,
            }}>
              <div style={{ fontWeight: 600, color: 'var(--color-loss)', marginBottom: 4 }}>
                ⚠️ Server 紀錄逾期
              </div>
              <div style={{ fontSize: 13, color: '#7f1d1d' }}>
                回測 Session 已逾期，Web UI 已關閉。錯誤訊息已顯示於 XQ。
              </div>
            </div>

            {/* 情境選擇 */}
            {hasId === null && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                  請選擇情境以查看後續處理：
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => { setHasId(true); setCurrentStep(3) }}
                    style={{ padding: '6px 14px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
                  >
                    情境 A：XQ 有回測 ID
                  </button>
                  <button
                    onClick={() => { setHasId(false); setCurrentStep(3) }}
                    style={{ padding: '6px 14px', background: '#475569', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
                  >
                    情境 B：XQ 無回測 ID
                  </button>
                </div>
              </div>
            )}

            {/* 情境 A */}
            {hasId === true && (
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  flex: 1,
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 8,
                  padding: '12px 16px',
                }}>
                  <div style={{ fontWeight: 600, color: '#1a56db', marginBottom: 6 }}>情境 A：XQ 有 ID ✓</div>
                  <ul style={{ fontSize: 12, color: '#1e40af', paddingLeft: 16, margin: 0 }}>
                    <li>XQ 將回測資料送回 Server</li>
                    <li>Server 繼續處理殘餘回測任務</li>
                    <li>完成後重新喚醒 Web UI</li>
                  </ul>
                </div>
                <div style={{
                  flex: 1,
                  background: '#f8fafc',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  padding: '12px 16px',
                  opacity: 0.5,
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>情境 B：XQ 無 ID</div>
                  <ul style={{ fontSize: 12, color: 'var(--color-text-secondary)', paddingLeft: 16, margin: 0 }}>
                    <li>無法恢復既有回測</li>
                    <li>重新開始回測流程</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 情境 B */}
            {hasId === false && (
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  flex: 1,
                  background: '#f8fafc',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  padding: '12px 16px',
                  opacity: 0.5,
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>情境 A：XQ 有 ID</div>
                  <ul style={{ fontSize: 12, color: 'var(--color-text-secondary)', paddingLeft: 16, margin: 0 }}>
                    <li>XQ 將回測資料送回 Server</li>
                    <li>Server 繼續處理</li>
                  </ul>
                </div>
                <div style={{
                  flex: 1,
                  background: '#fef9c3',
                  border: '1px solid #fde68a',
                  borderRadius: 8,
                  padding: '12px 16px',
                }}>
                  <div style={{ fontWeight: 600, color: '#92400e', marginBottom: 6 }}>情境 B：XQ 無 ID ✓</div>
                  <ul style={{ fontSize: 12, color: '#78350f', paddingLeft: 16, margin: 0 }}>
                    <li>無法恢復既有回測</li>
                    <li>重新開始完整回測流程</li>
                  </ul>
                </div>
              </div>
            )}
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
