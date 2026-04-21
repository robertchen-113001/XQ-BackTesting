import { useState } from 'react'

const VOLUME_TYPES = ['依紀錄', '等額（10 萬）', '等量（1 張）', '等比']
const RETURN_ALGORITHMS = ['時間加權報酬率', '最大投入報酬率', '金額加權報酬率']

const DEMO_ERRORS = [
  '第 5 筆（2330.TW）：出場時間不得早於進場時間',
  '第 8 筆（2454.TW）：出場時間與出場價格僅填入其中一欄，請修正後重新上傳',
  '缺少必要欄位：ExitPrice，請確認後重新上傳',
]

export default function UploadBacktestDialog({ onClose }) {
  const [fileName, setFileName] = useState('')
  const [volumeType, setVolumeType] = useState('依紀錄')
  const [returnAlgorithm, setReturnAlgorithm] = useState('時間加權報酬率')
  const [stockFeeRate, setStockFeeRate] = useState('0.1425')
  const [stockTaxRate, setStockTaxRate] = useState('0.3')
  const [futuresFee, setFuturesFee] = useState('100')
  const [futuresTaxRate, setFuturesTaxRate] = useState('0.3')
  const [enableMargin, setEnableMargin] = useState(true)
  const [marginRate, setMarginRate] = useState('13.5')


  const isEquiRatio = volumeType === '等比'
  // 等比強制鎖定時間加權報酬率
  const effectiveAlgorithm = isEquiRatio ? '時間加權報酬率' : returnAlgorithm

  const handleVolumeChange = (v) => {
    setVolumeType(v)
    if (v === '等比') setReturnAlgorithm('時間加權報酬率')
  }

  const handleSubmit = () => {
    if (!fileName) return
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div style={s.overlay} onClick={onClose} />

      {/* Dialog */}
      <div style={s.dialog}>
        {/* Title */}
        <div style={s.titleBar}>
          <span style={s.titleText}>上傳交易紀錄</span>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        <div style={s.body}>
          {/* 檔案 */}
          <div style={s.section}>
            <div style={s.fieldRow}>
              <label style={s.label}>交易紀錄</label>
              <div style={s.browseRow}>
                <input
                  style={{ ...s.input, flex: 1, color: fileName ? 'var(--color-text)' : 'var(--color-text-secondary)' }}
                  value={fileName}
                  readOnly
                  placeholder="尚未選取檔案..."
                />
                <label style={s.browseBtn}>
                  Browse...
                  <input
                    type="file"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files[0]
                      if (f) setFileName(f.name)
                    }}
                  />
                </label>
              </div>
            </div>
            <div style={s.dateRow}>
              <span style={s.dateLabel}>回測日期</span>
              <input style={s.dateInput} value="2024/01/02" readOnly disabled />
              <span style={s.dateSep}>～</span>
              <input style={s.dateInput} value="2024/12/31" readOnly disabled />
            </div>
            <div style={s.hint}>回測日期自動取交易紀錄中最早進場日至最晚出場日</div>
          </div>

          {/* 交易設定 */}
          <div style={s.section}>
            <div style={s.sectionTitle}>交易設定</div>
            <div style={s.fieldRow}>
              <label style={s.label}>交易數量</label>
              <select style={s.select} value={volumeType} onChange={e => handleVolumeChange(e.target.value)}>
                {VOLUME_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div style={s.fieldRow}>
              <label style={s.label}>報酬率算法</label>
              <select
                style={{ ...s.select, opacity: isEquiRatio ? 0.45 : 1, cursor: isEquiRatio ? 'not-allowed' : 'pointer' }}
                value={effectiveAlgorithm}
                disabled={isEquiRatio}
                onChange={e => setReturnAlgorithm(e.target.value)}
              >
                {RETURN_ALGORITHMS.map(v => (
                  <option key={v} value={v}>
                    {v === '金額加權報酬率' ? `${v}（評估中）` : v}
                  </option>
                ))}
              </select>
            </div>
            {isEquiRatio && (
              <div style={{ ...s.hint, color: '#d4720a' }}>⚠ 等比模式強制鎖定「時間加權報酬率」</div>
            )}
          </div>

          {/* 交易費用 */}
          <div style={s.section}>
            <div style={s.sectionTitle}>交易費用</div>
            <div style={s.costGrid}>
              <span style={s.costLabel}>股票</span>
              <label style={s.costItem}>
                手續費
                <input style={s.costInput} value={stockFeeRate} onChange={e => setStockFeeRate(e.target.value)} />
                %
              </label>
              <label style={s.costItem}>
                交易稅
                <input style={s.costInput} value={stockTaxRate} onChange={e => setStockTaxRate(e.target.value)} />
                %
              </label>
            </div>
            <div style={s.costGrid}>
              <span style={s.costLabel}>期貨</span>
              <label style={s.costItem}>
                手續費
                <input style={s.costInput} value={futuresFee} onChange={e => setFuturesFee(e.target.value)} />
                元/口
              </label>
              <label style={s.costItem}>
                交易稅
                <input style={s.costInput} value={futuresTaxRate} onChange={e => setFuturesTaxRate(e.target.value)} />
                %
              </label>
            </div>
          </div>

          {/* 槓桿 */}
          <div style={s.section}>
            <div style={s.sectionTitle}>槓桿</div>
            <label style={s.fieldRow}>
              <input
                type="checkbox"
                checked={enableMargin}
                onChange={e => setEnableMargin(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              <span style={s.label}>期貨保證金成數</span>
              <input
                style={{ ...s.costInput, opacity: enableMargin ? 1 : 0.4, width: 60 }}
                value={marginRate}
                disabled={!enableMargin}
                onChange={e => setMarginRate(e.target.value)}
              />
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginLeft: 4 }}>%</span>
            </label>
          </div>

          {/* 格式錯誤清單（Demo：直接顯示） */}
          <div style={s.errorPanel}>
            <div style={s.errorHeader}>格式錯誤（{DEMO_ERRORS.length} 筆），請修正後重新上傳</div>
            {DEMO_ERRORS.map((e, i) => (
              <div key={i} style={s.errorRow}>・{e}</div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <button
            style={{
              ...s.btnPrimary,
              opacity: !fileName ? 0.4 : 1,
              cursor: !fileName ? 'not-allowed' : 'pointer',
            }}
            disabled={!fileName}
            onClick={handleSubmit}
          >
            開始計算
          </button>
          <button style={s.btnSecondary} onClick={onClose}>取消</button>
        </div>
      </div>

    </>
  )
}

const s = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.45)', zIndex: 1000,
  },
  dialog: {
    position: 'fixed', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 520, maxHeight: '90vh',
    background: 'var(--color-surface)',
    borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    display: 'flex', flexDirection: 'column',
    zIndex: 1001, overflow: 'hidden',
  },
  titleBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid var(--color-border)',
    flexShrink: 0,
  },
  titleText: { fontSize: 16, fontWeight: 700, color: 'var(--color-text)' },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, color: 'var(--color-text-secondary)', padding: '0 4px',
    lineHeight: 1,
  },
  body: {
    flex: 1, overflowY: 'auto', padding: '0 20px',
  },
  section: {
    borderBottom: '1px solid var(--color-border)',
    padding: '14px 0',
  },
  sectionTitle: {
    fontSize: 13, fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    marginBottom: 10,
  },
  fieldRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 8,
  },
  label: { fontSize: 14, color: 'var(--color-text)', minWidth: 80, flexShrink: 0 },
  browseRow: { display: 'flex', gap: 8, flex: 1 },
  input: {
    height: 32, padding: '0 10px', fontSize: 14,
    border: '1px solid var(--color-border)', borderRadius: 4,
    background: 'var(--color-bg)', color: 'var(--color-text)',
    outline: 'none',
  },
  browseBtn: {
    height: 32, padding: '0 14px', fontSize: 14,
    border: '1px solid var(--color-border)', borderRadius: 4,
    background: 'var(--color-surface)', color: 'var(--color-text)',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    flexShrink: 0, whiteSpace: 'nowrap',
  },
  hint: { fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4, paddingLeft: 2 },
  dateRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 },
  dateLabel: { fontSize: 13, color: 'var(--color-text)', minWidth: 72, flexShrink: 0 },
  dateInput: {
    height: 30, width: 110, padding: '0 10px', fontSize: 13, textAlign: 'center',
    border: '1px solid var(--color-border)', borderRadius: 4,
    background: 'var(--color-bg)', color: 'var(--color-text-secondary)',
    opacity: 0.7, cursor: 'not-allowed',
  },
  dateSep: { fontSize: 13, color: 'var(--color-text-secondary)', flexShrink: 0 },
  select: {
    height: 32, padding: '0 8px', fontSize: 14,
    border: '1px solid var(--color-border)', borderRadius: 4,
    background: 'var(--color-surface)', color: 'var(--color-text)',
    cursor: 'pointer', flex: 1,
  },
  costGrid: {
    display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8,
  },
  costLabel: { fontSize: 14, color: 'var(--color-text)', minWidth: 30 },
  costItem: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 14, color: 'var(--color-text)',
  },
  costInput: {
    height: 30, width: 70, padding: '0 8px', fontSize: 14, textAlign: 'right',
    border: '1px solid var(--color-border)', borderRadius: 4,
    background: 'var(--color-bg)', color: 'var(--color-text)',
  },
  errorPanel: {
    marginTop: 8,
    background: '#fff1f0', border: '1px solid #ffa39e',
    borderRadius: 6, padding: '10px 14px', marginBottom: 4,
  },
  errorHeader: { fontSize: 14, fontWeight: 600, color: '#a8071a', marginBottom: 6 },
  errorRow: { fontSize: 14, color: '#cf1322', lineHeight: 1.7 },
  footer: {
    display: 'flex', justifyContent: 'flex-end', gap: 8,
    padding: '12px 20px', borderTop: '1px solid var(--color-border)',
    flexShrink: 0,
  },
  btnPrimary: {
    height: 34, padding: '0 20px', fontSize: 14, fontWeight: 600,
    background: 'var(--color-primary)', color: '#fff',
    border: 'none', borderRadius: 4, cursor: 'pointer',
  },
  btnSecondary: {
    height: 34, padding: '0 20px', fontSize: 14,
    background: 'var(--color-surface)', color: 'var(--color-text)',
    border: '1px solid var(--color-border)', borderRadius: 4, cursor: 'pointer',
  },
}
