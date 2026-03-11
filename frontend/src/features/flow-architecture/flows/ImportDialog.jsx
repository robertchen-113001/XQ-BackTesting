import { useState, useRef } from 'react'
import FlowStepIndicator from '../FlowStepIndicator'
import { FLOW_STEPS } from '../flowDefinitions'

const steps = FLOW_STEPS.flow6

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  padding: '16px 20px',
  marginBottom: 12,
}

export default function ImportDialog() {
  const [currentStep, setCurrentStep] = useState(1)
  const [importType, setImportType] = useState(null) // 'BTReportNew' | 'csv'
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [title, setTitle] = useState('')
  const [validating, setValidating] = useState(false)
  const [validError, setValidError] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file.name)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file.name)
  }

  const handleFile = (name) => {
    setFileName(name)
    setTitle(importType === 'BTReportNew' ? name.replace(/\.[^.]+$/, '') : name.replace(/\.[^.]+$/, ''))
    setCurrentStep(3)
  }

  const simulateError = () => {
    setValidating(true)
    setCurrentStep(3)
    setTimeout(() => {
      setValidating(false)
      setValidError(true)
    }, 800)
  }

  const simulateSuccess = () => {
    setValidating(true)
    setCurrentStep(3)
    setTimeout(() => {
      setValidating(false)
      setValidError(false)
      setSuccess(true)
      setCurrentStep(4)
    }, 800)
  }

  const reset = () => {
    setCurrentStep(1)
    setImportType(null)
    setDragOver(false)
    setFileName(null)
    setTitle('')
    setValidating(false)
    setValidError(false)
    setSuccess(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h3 style={{ marginBottom: 4, color: 'var(--color-text)' }}>流程 6：手動上傳</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20, fontSize: 13 }}>
        選類型 → 上傳檔案 → 格式驗證 → 開啟報告
      </p>

      <div style={cardStyle}>
        <FlowStepIndicator steps={steps} currentStep={currentStep} />
        <p style={{ marginTop: 16, color: 'var(--color-text-secondary)', fontSize: 13, textAlign: 'center' }}>
          {steps[currentStep - 1]?.description}
        </p>
      </div>

      {/* 互動 Demo 主區 */}
      <div style={cardStyle}>
        <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 14 }}>手動匯入對話框</div>

        {/* 步驟 1：選類型 */}
        {!importType && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 10 }}>選擇匯入類型：</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setImportType('BTReportNew'); setCurrentStep(2) }}
                style={{ flex: 1, padding: '12px', background: '#eff6ff', border: '2px solid #bfdbfe', borderRadius: 8, cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1a56db' }}>.BTReportNew</div>
                <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 2 }}>直接開啟，無需重新計算</div>
              </button>
              <button
                onClick={() => { setImportType('csv'); setCurrentStep(2) }}
                style={{ flex: 1, padding: '12px', background: '#f8fafc', border: '2px solid var(--color-border)', borderRadius: 8, cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)' }}>.csv 交易紀錄</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>需驗證欄位格式</div>
              </button>
            </div>
          </div>
        )}

        {/* 步驟 2：上傳區 */}
        {importType && !fileName && !success && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                匯入類型：<strong style={{ color: 'var(--color-text)' }}>.{importType}</strong>
              </span>
              <button
                onClick={() => { setImportType(null); setCurrentStep(1) }}
                style={{ fontSize: 11, color: '#1a56db', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                變更
              </button>
            </div>

            {/* 拖放區 */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? '#1a56db' : 'var(--color-border)'}`,
                borderRadius: 10,
                padding: '28px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? '#eff6ff' : 'var(--color-bg)',
                transition: 'all 0.2s',
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>📂</div>
              <div style={{ fontSize: 13, color: 'var(--color-text)' }}>
                拖放檔案至此，或 <span style={{ color: '#1a56db', textDecoration: 'underline' }}>點擊選取</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                接受：.{importType === 'BTReportNew' ? 'BTReportNew' : 'csv'}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={importType === 'BTReportNew' ? '.BTReportNew' : '.csv'}
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />

            {/* csv 快速模擬按鈕 */}
            {importType === 'csv' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  onClick={() => { setFileName('demo_trades.csv'); setTitle('demo_trades'); setCurrentStep(3) }}
                  style={{ fontSize: 12, padding: '5px 10px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 6, cursor: 'pointer', color: 'var(--color-text)' }}
                >
                  模擬上傳 demo.csv
                </button>
              </div>
            )}
            {importType === 'BTReportNew' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  onClick={() => { setFileName('report_20260311.BTReportNew'); setTitle('report_20260311'); setCurrentStep(3); setTimeout(() => { setSuccess(true); setCurrentStep(4) }, 600) }}
                  style={{ fontSize: 12, padding: '5px 10px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 6, cursor: 'pointer', color: 'var(--color-text)' }}
                >
                  模擬上傳 .BTReportNew
                </button>
              </div>
            )}
          </div>
        )}

        {/* 步驟 3：驗證（僅 csv） */}
        {importType === 'csv' && fileName && !validating && !validError && !success && (
          <div>
            <div style={{ padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 6, marginBottom: 10, fontSize: 13 }}>
              已選取：<strong>{fileName}</strong>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>標題（可修改）</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ padding: '5px 10px', border: '1px solid var(--color-border)', borderRadius: 6, fontSize: 13, width: '100%', background: 'var(--color-bg)', color: 'var(--color-text)', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={simulateError}
                style={{ padding: '6px 12px', background: 'var(--color-loss)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
              >
                模擬格式錯誤
              </button>
              <button
                onClick={simulateSuccess}
                style={{ padding: '6px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
              >
                模擬格式正確
              </button>
            </div>
          </div>
        )}

        {validating && (
          <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 13, color: '#1a56db' }}>
            ⟳ 驗證欄位格式中…
          </div>
        )}

        {validError && !validating && (
          <div>
            <div style={{
              borderLeft: '4px solid var(--color-loss)',
              background: '#fef2f2',
              padding: '12px 16px',
              borderRadius: '0 6px 6px 0',
              marginBottom: 10,
            }}>
              <div style={{ fontWeight: 600, color: 'var(--color-loss)', marginBottom: 4 }}>格式驗證失敗</div>
              <div style={{ fontSize: 12, color: '#7f1d1d' }}>缺少必要欄位：<code>openDate, closeDate, lots, openPrice</code></div>
            </div>
            <button
              onClick={() => { setValidError(false); setFileName(null) }}
              style={{ fontSize: 12, padding: '5px 10px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6, cursor: 'pointer', color: 'var(--color-text)' }}
            >
              重新上傳
            </button>
          </div>
        )}

        {success && (
          <div style={{ padding: '10px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, fontSize: 13, color: '#059669', fontWeight: 600 }}>
            ✅ 已開啟回測報告：{title || fileName}
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
