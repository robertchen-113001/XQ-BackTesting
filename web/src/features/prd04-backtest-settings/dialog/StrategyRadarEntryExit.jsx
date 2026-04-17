import { TP_SL_UNITS_STOCK, TP_SL_UNITS_FUTURE } from '../constants'

const MOCK_ENTRY_PARAMS = [
  { name: '上漲幅度門檻', value: 2.0 },
  { name: '連續陽線天數', value: 5 },
]

export default function StrategyRadarEntryExit({ form, onChange }) {
  return (
    <div style={s.twoCol}>
      {/* 左：進場設定 */}
      <fieldset style={s.fieldset}>
        <legend style={s.legend}>進場設定</legend>
        <div style={s.body}>
          <label style={s.checkLabel}>
            <input type="checkbox" checked={form.enableEntryScript}
              onChange={e => onChange('enableEntryScript', e.target.checked)} style={{ marginRight: 6 }} />
            進場腳本
          </label>
          {form.enableEntryScript && (
            <div style={s.scriptBox}>
              <div style={s.scriptName}>{form.entryScriptName}</div>
              <table style={s.paramTable}>
                <tbody>
                  {MOCK_ENTRY_PARAMS.map(p => (
                    <tr key={p.name}>
                      <td style={s.paramName}>{p.name}</td>
                      <td><input type="number" defaultValue={p.value} style={s.paramInput} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={s.row}>
            <label style={s.checkLabel}>
              <input type="checkbox" checked={form.enableEntryDataCount}
                onChange={e => onChange('enableEntryDataCount', e.target.checked)} style={{ marginRight: 6 }} />
              資料讀取筆數
            </label>
            <input type="number" value={form.entryDataCountRadar} disabled={!form.enableEntryDataCount}
              onChange={e => onChange('entryDataCountRadar', Number(e.target.value))}
              style={{ ...s.numInput, background: form.enableEntryDataCount ? 'var(--color-surface)' : '#f5f5f5' }} />
            <label style={s.checkLabel}>
              <input type="checkbox" checked={form.simEntryTick}
                onChange={e => onChange('simEntryTick', e.target.checked)} style={{ marginRight: 6 }} />
              模擬逐筆洗價
            </label>
          </div>
          <div style={s.row}>
            <label style={s.checkLabel}>
              <input type="checkbox" checked={form.enableMaxEntryCount}
                onChange={e => onChange('enableMaxEntryCount', e.target.checked)} style={{ marginRight: 6 }} />
              最大同時進場次數
            </label>
            <input type="number" value={form.maxEntryCount} disabled={!form.enableMaxEntryCount}
              onChange={e => onChange('maxEntryCount', Number(e.target.value))}
              style={{ ...s.numInput, background: form.enableMaxEntryCount ? 'var(--color-surface)' : '#f5f5f5' }} />
          </div>
          <div style={s.row}>
            <span style={s.inlineLabel}>進場價格</span>
            {['下期開盤價', '當期收盤價'].map(v => (
              <label key={v} style={s.radioLabel}>
                <input type="radio" checked={form.entryPriceType === v}
                  onChange={() => onChange('entryPriceType', v)} style={{ marginRight: 4 }} />
                {v}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* 右：出場設定 */}
      <fieldset style={s.fieldset}>
        <legend style={s.legend}>出場設定</legend>
        <div style={s.body}>
          <label style={s.checkLabel}>
            <input type="checkbox" checked={form.enableExitScript}
              onChange={e => onChange('enableExitScript', e.target.checked)} style={{ marginRight: 6 }} />
            出場腳本
          </label>
          {form.enableExitScript && (
            <input type="text" value={form.exitScriptName}
              onChange={e => onChange('exitScriptName', e.target.value)}
              placeholder="選擇出場腳本" style={s.textInput} />
          )}

          <div style={s.row}>
            <label style={s.checkLabel}>
              <input type="checkbox" checked={form.enableExitDataCount}
                onChange={e => onChange('enableExitDataCount', e.target.checked)} style={{ marginRight: 6 }} />
              資料讀取筆數
            </label>
            <input type="number" value={form.exitDataCount} disabled={!form.enableExitDataCount}
              onChange={e => onChange('exitDataCount', Number(e.target.value))}
              style={{ ...s.numInput, background: form.enableExitDataCount ? 'var(--color-surface)' : '#f5f5f5' }} />
            <label style={s.checkLabel}>
              <input type="checkbox" checked={form.simExitTick}
                onChange={e => onChange('simExitTick', e.target.checked)} style={{ marginRight: 6 }} />
              模擬逐筆洗價
            </label>
          </div>

          <label style={s.checkLabel}>
            <input type="checkbox" checked={form.enableTakeProfit}
              onChange={e => onChange('enableTakeProfit', e.target.checked)} style={{ marginRight: 6 }} />
            停利
          </label>
          {form.enableTakeProfit && (
            <div style={s.tpslRow}>
              <span style={s.tpslSub}>股票</span>
              <input type="number" value={form.tpStockValue}
                onChange={e => onChange('tpStockValue', Number(e.target.value))} style={s.numInput} />
              <select value={form.tpStockUnit} onChange={e => onChange('tpStockUnit', e.target.value)} style={s.select}>
                {TP_SL_UNITS_STOCK.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <span style={s.tpslSub}>期貨</span>
              <input type="number" value={form.tpFutureValue}
                onChange={e => onChange('tpFutureValue', Number(e.target.value))} style={s.numInput} />
              <select value={form.tpFutureUnit} onChange={e => onChange('tpFutureUnit', e.target.value)} style={s.select}>
                {TP_SL_UNITS_FUTURE.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          )}

          <label style={s.checkLabel}>
            <input type="checkbox" checked={form.enableStopLoss}
              onChange={e => onChange('enableStopLoss', e.target.checked)} style={{ marginRight: 6 }} />
            停損
          </label>
          {form.enableStopLoss && (
            <div style={s.tpslRow}>
              <span style={s.tpslSub}>股票</span>
              <input type="number" value={form.slStockValue}
                onChange={e => onChange('slStockValue', Number(e.target.value))} style={s.numInput} />
              <select value={form.slStockUnit} onChange={e => onChange('slStockUnit', e.target.value)} style={s.select}>
                {TP_SL_UNITS_STOCK.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <span style={s.tpslSub}>期貨</span>
              <input type="number" value={form.slFutureValue}
                onChange={e => onChange('slFutureValue', Number(e.target.value))} style={s.numInput} />
              <select value={form.slFutureUnit} onChange={e => onChange('slFutureUnit', e.target.value)} style={s.select}>
                {TP_SL_UNITS_FUTURE.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          )}

          <label style={s.checkLabel}>
            <input type="checkbox" checked={form.enableMaxHoldTime}
              onChange={e => onChange('enableMaxHoldTime', e.target.checked)} style={{ marginRight: 6 }} />
            最大持有時間
          </label>
          {form.enableMaxHoldTime && (
            <div style={s.row}>
              <input type="number" value={form.maxHoldTime}
                onChange={e => onChange('maxHoldTime', Number(e.target.value))} style={s.numInput} />
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>期</span>
            </div>
          )}

          <div style={s.row}>
            <span style={s.inlineLabel}>出場價格</span>
            {['下期開盤價', '當期收盤價'].map(v => (
              <label key={v} style={s.radioLabel}>
                <input type="radio" checked={form.exitPriceType === v}
                  onChange={() => onChange('exitPriceType', v)} style={{ marginRight: 4 }} />
                {v}
              </label>
            ))}
          </div>
        </div>
      </fieldset>
    </div>
  )
}

const s = {
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  fieldset: { border: '1px solid var(--color-border)', borderRadius: 6, padding: '10px 14px', margin: 0 },
  legend: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', padding: '0 6px' },
  body: { display: 'flex', flexDirection: 'column', gap: 8 },
  scriptBox: { background: '#fafafa', border: '1px solid var(--color-border)', borderRadius: 4, padding: 10 },
  scriptName: { fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 },
  paramTable: { width: '100%', borderCollapse: 'collapse' },
  paramName: { fontSize: 12, color: 'var(--color-text)', padding: '2px 8px 2px 0' },
  paramInput: { width: 70, fontSize: 12, padding: '2px 4px', border: '1px solid var(--color-border)', borderRadius: 3 },
  row: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  tpslRow: { display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 20, flexWrap: 'wrap' },
  tpslSub: { fontSize: 12, color: 'var(--color-text-secondary)', width: 28 },
  checkLabel: { fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)' },
  radioLabel: { fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)' },
  inlineLabel: { fontSize: 13, color: 'var(--color-text-secondary)', width: 56, flexShrink: 0 },
  numInput: { width: 60, fontSize: 13, padding: '3px 6px', border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-surface)' },
  select: { fontSize: 13, padding: '3px 6px', border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-surface)' },
  textInput: { fontSize: 13, padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 4, width: '100%', background: 'var(--color-surface)' },
}
