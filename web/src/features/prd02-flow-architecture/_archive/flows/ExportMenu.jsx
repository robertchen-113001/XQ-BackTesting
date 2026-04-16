import { useState, useRef } from 'react'
import FlowStepIndicator from '../FlowStepIndicator'
import { FLOW_STEPS } from '../flowDefinitions'

const steps = FLOW_STEPS.flow5

const FORMATS = [
  { id: 'BTReportNew', label: '.BTReportNew', desc: '新版格式，依 Server 格式儲存' },
  { id: 'xlsx', label: '.xlsx', desc: '完整回測報告（所有分頁資料）' },
  { id: 'csv', label: '.csv', desc: '僅包含純交易紀錄' },
]

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  padding: '16px 20px',
  marginBottom: 12,
}

export default function ExportMenu() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const btnRef = useRef(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })

  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 4, left: rect.left })
    }
    setIsOpen(true)
    setCurrentStep(2)
  }

  const selectFormat = (fmt) => {
    setSelectedFormat(fmt)
    setIsOpen(false)
    setDownloading(true)
    setCurrentStep(3)
    setTimeout(() => {
      setDownloading(false)
      setDownloaded(true)
    }, 1200)
  }

  const reset = () => {
    setCurrentStep(1)
    setIsOpen(false)
    setSelectedFormat(null)
    setDownloading(false)
    setDownloaded(false)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h3 style={{ marginBottom: 4, color: 'var(--color-text)' }}>流程 5：匯出報告</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20, fontSize: 13 }}>
        點選匯出 → 選擇格式（.BTReportNew / .xlsx / .csv）→ 觸發下載
      </p>

      <div style={cardStyle}>
        <FlowStepIndicator steps={steps} currentStep={currentStep} />
        <p style={{ marginTop: 16, color: 'var(--color-text-secondary)', fontSize: 13, textAlign: 'center' }}>
          {steps[currentStep - 1]?.description}
        </p>
      </div>

      {/* 互動 Demo 主區 */}
      <div style={cardStyle}>
        <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 12 }}>匯出操作模擬</div>

        {/* 模擬工具列 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', flex: 1 }}>
            回測報告工具列
          </span>
          <button
            ref={btnRef}
            onClick={openMenu}
            disabled={isOpen || downloading}
            style={{
              padding: '5px 12px',
              background: '#1a56db',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: isOpen || downloading ? 'default' : 'pointer',
              fontSize: 12,
              fontWeight: 600,
              opacity: isOpen || downloading ? 0.7 : 1,
            }}
          >
            ↓ 匯出
          </button>
        </div>

        {/* 下拉選單（position: fixed 避免 overflow 裁切） */}
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              zIndex: 9999,
              minWidth: 220,
            }}
          >
            <div style={{ padding: '6px 0' }}>
              {FORMATS.map(fmt => (
                <button
                  key={fmt.id}
                  onClick={() => selectFormat(fmt)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{fmt.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{fmt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* 點選其他處關閉選單 */}
        {isOpen && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* 下載中 */}
        {downloading && (
          <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 13, color: '#1a56db' }}>
            ⟳ 呼叫後端匯出 API，準備 {selectedFormat?.label} 檔案…
          </div>
        )}

        {/* 下載完成 */}
        {downloaded && (
          <div style={{ padding: '10px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, fontSize: 13, color: '#059669', fontWeight: 600 }}>
            ✅ 已下載：回測報告{selectedFormat?.label}
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
