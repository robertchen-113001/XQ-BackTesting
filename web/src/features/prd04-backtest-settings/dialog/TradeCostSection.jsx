export default function TradeCostSection({ form, onChange }) {
  return (
    <fieldset style={s.fieldset}>
      <legend style={s.legend}>交易成本</legend>
      <div style={s.grid}>
        <div style={s.row}>
          <label style={s.label}>股票手續費</label>
          <input type="number" value={form.stockFeeRate} step="0.0001"
            onChange={e => onChange('stockFeeRate', Number(e.target.value))}
            style={s.numInput} />
          <span style={s.unit}>%</span>
          <label style={{ ...s.label, marginLeft: 16 }}>股票交易稅</label>
          <input type="number" value={form.stockTaxRate} step="0.01"
            onChange={e => onChange('stockTaxRate', Number(e.target.value))}
            style={s.numInput} />
          <span style={s.unit}>%</span>
        </div>
        <div style={s.row}>
          <label style={s.label}>期貨手續費</label>
          <input type="number" value={form.futuresFee} step="1"
            onChange={e => onChange('futuresFee', Number(e.target.value))}
            style={s.numInput} />
          <span style={s.unit}>元/口</span>
          <label style={{ ...s.label, marginLeft: 16 }}>期貨交易稅</label>
          <input type="number" value={form.futuresTaxRate} step="0.01"
            onChange={e => onChange('futuresTaxRate', Number(e.target.value))}
            style={s.numInput} />
          <span style={s.unit}>%</span>
        </div>
      </div>
    </fieldset>
  )
}

const s = {
  fieldset: { border: '1px solid var(--color-border)', borderRadius: 6, padding: '10px 14px', margin: 0 },
  legend: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', padding: '0 6px' },
  grid: { display: 'flex', flexDirection: 'column', gap: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  label: { width: 72, fontSize: 13, color: 'var(--color-text)', flexShrink: 0 },
  numInput: { width: 80, fontSize: 13, padding: '4px 6px', border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-surface)', color: 'var(--color-text)' },
  unit: { fontSize: 12, color: 'var(--color-text-secondary)' },
}
