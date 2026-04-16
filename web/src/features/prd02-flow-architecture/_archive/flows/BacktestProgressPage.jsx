import { useState, useEffect, useRef } from 'react'
import FlowStepIndicator from '../FlowStepIndicator'
import { FLOW_STEPS } from '../flowDefinitions'

const steps = FLOW_STEPS.flow1

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  padding: '16px 20px',
  marginBottom: 12,
}

export default function BacktestProgressPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [status, setStatus] = useState('idle') // idle | running | paused | success | failed
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  const startProgress = () => {
    if (status === 'running') return
    setStatus('running')
    setCurrentStep(2)
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearTimer()
          setStatus('success')
          setCurrentStep(5)
          return 100
        }
        return prev + 3
      })
    }, 200)
  }

  const pauseProgress = () => {
    if (status !== 'running') return
    clearTimer()
    setStatus('paused')
  }

  const resumeProgress = () => {
    if (status !== 'paused') return
    setStatus('running')
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearTimer()
          setStatus('success')
          setCurrentStep(5)
          return 100
        }
        return prev + 3
      })
    }, 200)
  }

  const failProgress = () => {
    clearTimer()
    setStatus('failed')
    setCurrentStep(4)
  }

  const reset = () => {
    clearTimer()
    setCurrentStep(1)
    setStatus('idle')
    setProgress(0)
  }

  const statusColor = {
    idle: 'var(--color-text-secondary)',
    running: '#1a56db',
    paused: '#d97706',
    success: '#059669',
    failed: 'var(--color-loss)',
  }

  const statusLabel = {
    idle: '待觸發',
    running: '▶ 執行中',
    paused: '⏸ 暫停',
    success: '✅ 成功',
    failed: '❌ 失敗',
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h3 style={{ marginBottom: 4, color: 'var(--color-text)' }}>流程 1：一般回測</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20, fontSize: 13 }}>
        AP（XQ）觸發回測 → Server 回傳 ID → Web UI 開啟 → Sinker 通訊 → 顯示報告
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
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>回測進度模擬</span>
          <span style={{ fontSize: 13, color: statusColor[status], fontWeight: 600 }}>
            {statusLabel[status]}
          </span>
        </div>

        {/* 進度條 */}
        <div style={{ background: '#e2e8f0', borderRadius: 4, height: 10, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: status === 'failed' ? 'var(--color-loss)' : status === 'success' ? '#059669' : '#1a56db',
            transition: 'width 0.2s ease',
            borderRadius: 4,
          }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
          {progress}%
        </div>

        {/* 操作按鈕 */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {status === 'idle' && (
            <button
              onClick={() => { startProgress(); setCurrentStep(1) }}
              style={{ padding: '6px 14px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
            >
              觸發回測
            </button>
          )}
          {status === 'running' && (
            <>
              <button
                onClick={pauseProgress}
                style={{ padding: '6px 14px', background: '#d97706', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
              >
                ⏸ 暫停
              </button>
              <button
                onClick={failProgress}
                style={{ padding: '6px 14px', background: 'var(--color-loss)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
              >
                模擬失敗
              </button>
            </>
          )}
          {status === 'paused' && (
            <button
              onClick={resumeProgress}
              style={{ padding: '6px 14px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
            >
              ▶ 繼續
            </button>
          )}
          {(status === 'success' || status === 'failed') && (
            <div style={{
              padding: '10px 16px',
              background: status === 'success' ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${status === 'success' ? '#a7f3d0' : '#fecaca'}`,
              borderRadius: 8,
              color: status === 'success' ? '#059669' : 'var(--color-loss)',
              fontWeight: 600,
              fontSize: 13,
              width: '100%',
            }}>
              {status === 'success' ? '✅ 回測完成，報告已顯示於 Web UI' : '❌ 回測失敗，請查看錯誤日誌'}
            </div>
          )}
        </div>
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
