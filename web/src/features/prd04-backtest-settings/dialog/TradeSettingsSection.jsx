import { VOLUME_TYPES, VOLUME_LABELS, RETURN_ALGORITHMS, ENTRY_ORDER_TYPES } from '../constants'

export default function TradeSettingsSection({ platform, form, onChange }) {
  const isProportional = form.volumeType === '等比'

  const handleVolumeChange = (val) => {
    onChange('volumeType', val)
    if (val === '等比') {
      onChange('returnAlgorithm', '時間加權報酬率')
    }
  }

  const handleEnableMaxConcurrent = (checked) => {
    onChange('enableMaxConcurrent', checked)
    if (checked && (!form.maxConcurrentTrades || form.maxConcurrentTrades === 0)) {
      onChange('maxConcurrentTrades', 10)
    }
  }

  return (
    <fieldset style={s.fieldset}>
      <legend style={s.legend}>交易設定</legend>
      <div style={s.body}>

        {/* 最大同時交易筆數 */}
        <div style={s.row}>
          <label style={s.checkLabel}>
            <input
              type="checkbox"
              checked={form.enableMaxConcurrent}
              onChange={e => handleEnableMaxConcurrent(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            最大同時交易筆數
          </label>
          <input
            type="number"
            value={form.maxConcurrentTrades}
            disabled={!form.enableMaxConcurrent}
            min={1}
            onChange={e => onChange('maxConcurrentTrades', Number(e.target.value))}
            style={{
              ...s.input,
              width: 60,
              background: form.enableMaxConcurrent ? 'var(--color-surface)' : '#f5f5f5',
              color: form.enableMaxConcurrent ? 'var(--color-text)' : '#aaa',
              cursor: form.enableMaxConcurrent ? 'text' : 'not-allowed',
            }}
          />
          <span style={s.unit}>筆</span>
          <span style={s.tooltip} title="達到最大同時交易筆數上限後，新訊號將被略過。範例：設為 10 筆時，最多同時持有 10 個部位。">
            ⓘ
          </span>
        </div>

        {/* 交易數量 */}
        <div style={s.row}>
          <label style={s.fixedLabel}>交易數量</label>
          <div style={s.selectWrap}>
            <select
              value={form.volumeType}
              onChange={e => handleVolumeChange(e.target.value)}
              style={s.select}
            >
              {VOLUME_TYPES[platform].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            {VOLUME_LABELS[form.volumeType] && (
              <span style={s.fixedHint}>{VOLUME_LABELS[form.volumeType]}</span>
            )}
          </div>
        </div>

        {/* 報酬率算法 */}
        <div style={s.row}>
          <label style={s.fixedLabel}>報酬率算法</label>
          <select
            value={form.returnAlgorithm}
            disabled={isProportional}
            onChange={e => onChange('returnAlgorithm', e.target.value)}
            style={{
              ...s.select,
              background: isProportional ? '#f5f5f5' : 'var(--color-surface)',
              color: isProportional ? '#aaa' : 'var(--color-text)',
              cursor: isProportional ? 'not-allowed' : 'default',
            }}
          >
            {RETURN_ALGORITHMS.map(algo => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </div>
        {isProportional && (
          <p style={s.hint}>⚠️ 等比模式無固定進場金額，強制使用「時間加權報酬率」。</p>
        )}

        {/* 進場順序 */}
        <div style={s.row}>
          <label style={s.fixedLabel}>進場順序</label>
          <select
            value={form.entryOrderType}
            onChange={e => onChange('entryOrderType', e.target.value)}
            style={s.select}
          >
            {ENTRY_ORDER_TYPES[platform].options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {form.entryOrderType === '自訂' && (
            <span style={s.inlineHint}>→ 開啟 XS 函數列表視窗</span>
          )}
        </div>

      </div>
    </fieldset>
  )
}

const s = {
  fieldset: { border: '1px solid var(--color-border)', borderRadius: 6, padding: '10px 14px', margin: 0 },
  legend: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', padding: '0 6px' },
  body: { display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  fixedLabel: { width: 72, fontSize: 13, color: 'var(--color-text)', flexShrink: 0 },
  checkLabel: { fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)' },
  select: { fontSize: 13, padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-surface)', color: 'var(--color-text)' },
  input: { fontSize: 13, padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 4 },
  unit: { fontSize: 13, color: 'var(--color-text-secondary)' },
  tooltip: { fontSize: 13, color: 'var(--color-primary)', cursor: 'help' },
  selectWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  fixedHint: { fontSize: 12, color: '#aaa', background: '#f5f5f5', padding: '3px 8px', borderRadius: 3, border: '1px solid #eee' },
  hint: { fontSize: 12, color: '#d46b08', margin: '2px 0 0 0', background: '#fff7e6', padding: '4px 8px', borderRadius: 3 },
  inlineHint: { fontSize: 12, color: 'var(--color-primary)' },
}
