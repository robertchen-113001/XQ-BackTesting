import { PRICE_BASE_OPTIONS } from '../constants'

const MOCK_SCRIPT_PARAMS = [
  { name: '委託區間(秒)', value: 3600 },
  { name: '總委託數量', value: 100 },
  { name: '買賣方向', value: '買進', type: 'text' },
]

export default function AutoTradeModules({ form, onChange }) {
  return (
    <div style={s.twoCol}>
      {/* 左：交易腳本 */}
      <fieldset style={s.fieldset}>
        <legend style={s.legend}>交易腳本</legend>
        <div style={s.body}>
          <div style={s.row}>
            <select style={{ ...s.select, flex: 1 }} defaultValue={form.scriptName}>
              <option>{form.scriptName}</option>
              <option>01-固定時間買賣</option>
              <option>03-均值回歸</option>
            </select>
          </div>
          <div style={s.scriptBox}>
            <table style={s.paramTable}>
              <thead>
                <tr>
                  <th style={s.th}>參數名稱</th>
                  <th style={s.th}>值</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SCRIPT_PARAMS.map(p => (
                  <tr key={p.name}>
                    <td style={s.td}>{p.name}</td>
                    <td style={s.td}>
                      <input type={p.type || 'number'} defaultValue={p.value} style={s.paramInput} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </fieldset>

      {/* 右上：策略安全設定 */}
      <div style={s.rightCol}>
        <fieldset style={s.fieldset}>
          <legend style={s.legend}>策略安全設定</legend>
          <div style={s.body}>
            {[
              { field: 'enableMaxPosition', numField: 'maxPosition', label: '單一商品最大限制部位' },
              { field: 'enableMaxDailyEntry', numField: 'maxDailyEntry', label: '單一商品每日最多進場次數' },
              { field: 'enableMaxTradePerMin', numField: 'maxTradePerMin', label: '單一商品每分鐘最多交易次數' },
            ].map(({ field, numField, label }) => (
              <div key={field} style={s.row}>
                <label style={s.checkLabel}>
                  <input type="checkbox" checked={form[field]}
                    onChange={e => onChange(field, e.target.checked)} style={{ marginRight: 6 }} />
                  {label}
                </label>
                <input type="number" value={form[numField]} disabled={!form[field]}
                  onChange={e => onChange(numField, Number(e.target.value))}
                  style={{ ...s.numInput, background: form[field] ? 'var(--color-surface)' : '#f5f5f5' }} />
              </div>
            ))}
          </div>
        </fieldset>

        {/* 預設委託參數 */}
        <fieldset style={{ ...s.fieldset, marginTop: 8 }}>
          <legend style={s.legend}>預設委託參數（腳本未指定價格時依此委託）</legend>
          <div style={s.body}>
            <div style={s.row}>
              <span style={s.inlineLabel}>預設買進價</span>
              <select value={form.defaultBuyBase}
                onChange={e => onChange('defaultBuyBase', e.target.value)} style={s.select}>
                {PRICE_BASE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <span style={s.offsetLabel}>+/- 檔</span>
              <input type="number" value={form.defaultBuyOffset}
                onChange={e => onChange('defaultBuyOffset', Number(e.target.value))} style={s.numInput} />
            </div>
            <div style={s.row}>
              <span style={s.inlineLabel}>預設賣出價</span>
              <select value={form.defaultSellBase}
                onChange={e => onChange('defaultSellBase', e.target.value)} style={s.select}>
                {PRICE_BASE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <span style={s.offsetLabel}>+/- 檔</span>
              <input type="number" value={form.defaultSellOffset}
                onChange={e => onChange('defaultSellOffset', Number(e.target.value))} style={s.numInput} />
            </div>
            <label style={s.checkLabel}>
              <input type="checkbox" checked={form.directSubmit}
                onChange={e => onChange('directSubmit', e.target.checked)} style={{ marginRight: 6 }} />
              委託直接送出（不檢查漲跌停限制）
            </label>
          </div>
        </fieldset>

        {/* 洗價觸發設定 */}
        <fieldset style={{ ...s.fieldset, marginTop: 8 }}>
          <legend style={s.legend}>洗價觸發設定</legend>
          <label style={s.checkLabel}>
            <input type="checkbox" checked={form.immediateFill}
              onChange={e => onChange('immediateFill', e.target.checked)} style={{ marginRight: 6 }} />
            洗價觸發即判斷成交
          </label>
        </fieldset>
      </div>
    </div>
  )
}

const s = {
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' },
  rightCol: { display: 'flex', flexDirection: 'column' },
  fieldset: { border: '1px solid var(--color-border)', borderRadius: 6, padding: '10px 14px', margin: 0 },
  legend: { fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', padding: '0 6px' },
  body: { display: 'flex', flexDirection: 'column', gap: 8 },
  scriptBox: { background: '#fafafa', border: '1px solid var(--color-border)', borderRadius: 4, overflow: 'hidden' },
  paramTable: { width: '100%', borderCollapse: 'collapse' },
  th: { fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', padding: '6px 10px', background: '#f5f5f5', borderBottom: '1px solid var(--color-border)', textAlign: 'left' },
  td: { fontSize: 13, color: 'var(--color-text)', padding: '5px 10px', borderBottom: '1px solid var(--color-border)' },
  paramInput: { width: 90, fontSize: 14, padding: '2px 4px', border: '1px solid var(--color-border)', borderRadius: 3, background: 'var(--color-surface)' },
  row: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  checkLabel: { fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)' },
  inlineLabel: { width: 68, fontSize: 13, color: 'var(--color-text)', flexShrink: 0 },
  offsetLabel: { fontSize: 14, color: 'var(--color-text-secondary)' },
  numInput: { width: 60, fontSize: 13, padding: '3px 6px', border: '1px solid var(--color-border)', borderRadius: 4 },
  select: { fontSize: 13, padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-surface)' },
}
