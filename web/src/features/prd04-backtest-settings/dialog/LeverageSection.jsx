export default function LeverageSection({ form, onChange }) {
  return (
    <fieldset style={s.fieldset}>
      <legend style={s.legend}>槓桿</legend>
      <div style={s.body}>
        <div style={s.row}>
          <label style={s.checkLabel}>
            <input type="checkbox" checked={form.enableFuturesMargin}
              onChange={e => onChange('enableFuturesMargin', e.target.checked)} style={{ marginRight: 6 }} />
            期貨保證金成數
          </label>
          <input type="number" value={form.futuresMarginRate} step="0.5"
            disabled={!form.enableFuturesMargin}
            onChange={e => onChange('futuresMarginRate', Number(e.target.value))}
            style={{
              ...s.numInput,
              background: form.enableFuturesMargin ? 'var(--color-surface)' : '#f5f5f5',
              color: form.enableFuturesMargin ? 'var(--color-text)' : '#aaa',
              cursor: form.enableFuturesMargin ? 'text' : 'not-allowed',
            }} />
          <span style={s.unit}>%</span>
        </div>
        <div style={{ ...s.row, opacity: 0.5 }}>
          <label style={s.label}>股票融資成數</label>
          <input type="number" value={form.stockFinancingRate} disabled style={{ ...s.numInput, background: '#f5f5f5', color: '#aaa' }} />
          <span style={s.unit}>%</span>
          <span style={s.tag}>UI 保留，暫不使用</span>
        </div>
        <div style={{ ...s.row, opacity: 0.5 }}>
          <label style={s.label}>股票融券保證金</label>
          <input type="number" value={form.stockMarginRate} disabled style={{ ...s.numInput, background: '#f5f5f5', color: '#aaa' }} />
          <span style={s.unit}>%</span>
          <span style={s.tag}>UI 保留，暫不使用</span>
        </div>
      </div>
    </fieldset>
  )
}

const s = {
  fieldset: { border: '1px solid var(--color-border)', borderRadius: 6, padding: '10px 14px', margin: 0 },
  legend: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', padding: '0 6px' },
  body: { display: 'flex', flexDirection: 'column', gap: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 8 },
  label: { width: 92, fontSize: 13, color: 'var(--color-text)', flexShrink: 0 },
  checkLabel: { width: 112, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)', flexShrink: 0 },
  numInput: { width: 70, fontSize: 13, padding: '4px 6px', border: '1px solid var(--color-border)', borderRadius: 4 },
  unit: { fontSize: 12, color: 'var(--color-text-secondary)' },
  tag: { fontSize: 11, background: '#f0f0f0', color: '#888', padding: '1px 6px', borderRadius: 3 },
}
