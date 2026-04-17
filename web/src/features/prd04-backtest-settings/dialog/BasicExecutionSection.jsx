import { FREQUENCY_OPTIONS, MARKET_OPTIONS, UNIVERSE_OPTIONS } from '../constants'

export default function BasicExecutionSection({ platform, form, onChange }) {
  return (
    <fieldset style={s.fieldset}>
      <legend style={s.legend}>基本執行設定</legend>

      <div style={s.grid}>
        {/* 選股中心：作多 / 作空 */}
        {platform === '選股中心' && (
          <div style={s.row}>
            <label style={s.label}>交易方向</label>
            <div style={s.btnGroup}>
              {['作多', '作空'].map(d => (
                <button
                  key={d}
                  onClick={() => onChange('tradeDirection', d)}
                  style={{
                    ...s.toggleBtn,
                    background: form.tradeDirection === d ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: form.tradeDirection === d ? '#fff' : 'var(--color-text)',
                    borderColor: form.tradeDirection === d ? 'var(--color-primary)' : 'var(--color-border)',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 執行頻率 */}
        <div style={s.row}>
          <label style={s.label}>執行頻率</label>
          <select value={form.frequency} onChange={e => onChange('frequency', e.target.value)} style={s.select}>
            {FREQUENCY_OPTIONS[platform].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* 價格資料 */}
        <div style={s.row}>
          <label style={s.label}>價格資料</label>
          <div style={s.radioGroup}>
            {['原始值', '還原值'].map(v => (
              <label key={v} style={s.radioLabel}>
                <input type="radio" checked={form.priceType === v}
                  onChange={() => onChange('priceType', v)} style={{ marginRight: 4 }} />
                {v}
              </label>
            ))}
          </div>
        </div>

        {/* 日期範圍 */}
        <div style={s.row}>
          <label style={s.label}>開始日期</label>
          <input type="text" value={form.startDate}
            onChange={e => onChange('startDate', e.target.value)} style={{ ...s.input, width: 120 }} />
          <label style={{ ...s.label, width: 'auto', marginLeft: 12 }}>結束日期</label>
          <input type="text" value={form.endDate}
            onChange={e => onChange('endDate', e.target.value)} style={{ ...s.input, width: 120 }} />
        </div>

        {/* 選股中心：市場別 + 執行範圍 */}
        {platform === '選股中心' && (
          <>
            <div style={s.row}>
              <label style={s.label}>市場別</label>
              <select value={form.market} onChange={e => onChange('market', e.target.value)} style={s.select}>
                {MARKET_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div style={s.row}>
              <label style={s.label}>執行範圍</label>
              <select value={form.universe} onChange={e => onChange('universe', e.target.value)} style={{ ...s.select, minWidth: 220 }}>
                {UNIVERSE_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </>
        )}

        {/* 策略雷達 / 自動交易：執行商品 */}
        {(platform === '策略雷達' || platform === '自動交易') && (
          <div style={s.row}>
            <label style={s.label}>執行商品</label>
            <select style={{ ...s.select, width: 80, marginRight: 4 }}>
              <option>商品</option>
            </select>
            <input type="text" value={form.targetSymbol}
              onChange={e => onChange('targetSymbol', e.target.value)}
              placeholder="輸入商品代碼" style={{ ...s.input, width: 160 }} />
          </div>
        )}

        {/* 美股全部時段 */}
        {(platform === '策略雷達' || platform === '自動交易') && (
          <div style={s.row}>
            <label style={s.checkLabel}>
              <input type="checkbox" checked={form.usMarketAll}
                onChange={e => onChange('usMarketAll', e.target.checked)} style={{ marginRight: 6 }} />
              美股全部時段（盤前 + 盤中 + 盤後）
            </label>
          </div>
        )}

        {/* 自動交易專屬 */}
        {platform === '自動交易' && (
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <label style={s.checkLabel}>
              <input type="checkbox" checked={form.simTick}
                onChange={e => onChange('simTick', e.target.checked)} style={{ marginRight: 6 }} />
              模擬逐筆洗價
            </label>
            <label style={s.checkLabel}>
              <input type="checkbox" checked={form.dailyReset}
                onChange={e => onChange('dailyReset', e.target.checked)} style={{ marginRight: 6 }} />
              每日部位歸零
            </label>
            <div style={s.row}>
              <label style={{ ...s.label, width: 'auto', whiteSpace: 'nowrap' }}>預先執行筆數</label>
              <input type="number" value={form.preRunBars}
                onChange={e => onChange('preRunBars', Number(e.target.value))}
                style={{ ...s.input, width: 70 }} />
            </div>
          </div>
        )}
      </div>
    </fieldset>
  )
}

const s = {
  fieldset: { border: '1px solid var(--color-border)', borderRadius: 6, padding: '10px 14px', margin: 0 },
  legend: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', padding: '0 6px' },
  grid: { display: 'flex', flexDirection: 'column', gap: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  label: { width: 80, fontSize: 13, color: 'var(--color-text)', flexShrink: 0 },
  radioGroup: { display: 'flex', gap: 12 },
  radioLabel: { fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)' },
  checkLabel: { fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)' },
  select: { fontSize: 13, padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-surface)', color: 'var(--color-text)', minWidth: 120 },
  input: { fontSize: 13, padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-surface)', color: 'var(--color-text)' },
  btnGroup: { display: 'flex', gap: 0 },
  toggleBtn: { padding: '4px 14px', fontSize: 13, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', firstChild: { borderRadius: '4px 0 0 4px' } },
}
