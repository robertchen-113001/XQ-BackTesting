import { useState } from 'react'
import {
  PLATFORMS,
  VOLUME_TYPES,
  RETURN_ALGORITHMS,
  BENCHMARK_INDICES,
  OVERLAY_OPTIONS,
  DEFAULT_SYSTEM_PARAMS,
} from './constants'

// 初始三平台各自一份設定
function initSettings() {
  const s = {}
  PLATFORMS.forEach(p => { s[p] = { ...DEFAULT_SYSTEM_PARAMS } })
  return s
}

export default function SystemParamsPanel() {
  const [platform, setPlatform] = useState('選股中心')
  const [settings, setSettings] = useState(initSettings())

  const cur = settings[platform]

  const UNIQUE_OVERLAYS = ['基準指標', '買進持有報酬率']

  const update = (field, value) => {
    setSettings(prev => {
      const next = { ...prev[platform], [field]: value }
      // 等比 → 強制鎖定時間加權報酬率
      if (field === 'volumeType' && value === '等比') {
        next.returnAlgorithm = '時間加權報酬率'
      }
      // 疊加指標互斥：基準指標、買進持有報酬率各只能出現一次
      if (field === 'overlayIndex1' && UNIQUE_OVERLAYS.includes(value) && next.overlayIndex2 === value) {
        next.overlayIndex2 = '不疊加'
      }
      if (field === 'overlayIndex2' && UNIQUE_OVERLAYS.includes(value) && next.overlayIndex1 === value) {
        next.overlayIndex1 = '不疊加'
      }
      return { ...prev, [platform]: next }
    })
  }

  const isProportional = cur.volumeType === '等比'

  const overlay1Options = OVERLAY_OPTIONS.filter(o => !UNIQUE_OVERLAYS.includes(o) || o !== cur.overlayIndex2)
  const overlay2Options = OVERLAY_OPTIONS.filter(o => !UNIQUE_OVERLAYS.includes(o) || o !== cur.overlayIndex1)

  return (
    <div style={{ padding: 24 }}>
      {/* 標題 */}
      <h3 style={styles.sectionTitle}>§2 系統參數設定（S → K → P → R）</h3>
      <p style={styles.desc}>
        路徑：系統 (S) → 設定 (K) → 系統參數 (P) → 回測報告 (R)。
        三個平台的設定值各自獨立儲存，切換分頁即切換平台。
      </p>

      {/* 平台 Tab */}
      <div style={styles.platformTabs}>
        {PLATFORMS.map(p => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            style={{
              ...styles.platformTab,
              background: platform === p ? 'var(--color-surface)' : 'transparent',
              borderBottom: platform === p ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: platform === p ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: platform === p ? 600 : 400,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 設定內容 */}
      <div style={styles.panelBody}>

        {/* 回測設定 */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>回測設定</legend>

          {/* 交易數量 */}
          <div style={styles.row}>
            <label style={styles.label}>交易數量</label>
            <div style={styles.radioGroup}>
              {VOLUME_TYPES[platform].map(v => (
                <label key={v} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`volumeType-${platform}`}
                    value={v}
                    checked={cur.volumeType === v}
                    onChange={() => update('volumeType', v)}
                    style={{ marginRight: 4 }}
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>

          {/* 報酬率算法 */}
          <div style={styles.row}>
            <label style={styles.label}>報酬率算法</label>
            <div style={styles.radioGroup}>
              {RETURN_ALGORITHMS.map(algo => {
                const disabled = isProportional && algo !== '時間加權報酬率'
                return (
                  <label
                    key={algo}
                    style={{
                      ...styles.radioLabel,
                      opacity: disabled ? 0.4 : 1,
                      background: disabled ? '#f5f5f5' : 'transparent',
                      padding: '2px 8px',
                      borderRadius: 3,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name={`returnAlgorithm-${platform}`}
                      value={algo}
                      checked={cur.returnAlgorithm === algo}
                      disabled={disabled}
                      onChange={() => !disabled && update('returnAlgorithm', algo)}
                      style={{ marginRight: 4 }}
                    />
                    {algo}
                    {algo === '金額加權報酬率' && (
                      <span style={{ fontSize: 12, color: '#aaa', marginLeft: 3 }}>（評估中）</span>
                    )}
                  </label>
                )
              })}
            </div>
          </div>
          {isProportional && (
            <p style={styles.hint}>
              ⚠️ 「等比」模式下，系統強制鎖定「時間加權報酬率」，其他選項灰底不可點擊。
            </p>
          )}
        </fieldset>

        {/* 基準指標 */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>績效比較圖 — 基準指標</legend>
          <div style={styles.row}>
            <label style={styles.label}>基準指標</label>
            <select
              value={cur.benchmarkIndex}
              onChange={e => update('benchmarkIndex', e.target.value)}
              style={styles.select}
            >
              {BENCHMARK_INDICES.map(idx => (
                <option key={idx} value={idx}>{idx}</option>
              ))}
            </select>
          </div>
          <p style={styles.hint}>基準指標用於計算 beta 等欄位，並自動顯示於績效圖。選項由系統維護（10 檔），使用者不可自訂標的。</p>
        </fieldset>

        {/* 疊加指標 */}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>績效比較圖 — 疊加指標</legend>
          <div style={styles.row}>
            <label style={styles.label}>第一疊加</label>
            <select
              value={cur.overlayIndex1}
              onChange={e => update('overlayIndex1', e.target.value)}
              style={styles.select}
            >
              {overlay1Options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {cur.overlayIndex1 === '自選商品' && (
              <span style={styles.overlayHint}>→ 開啟 XQ 商品搜尋框</span>
            )}
          </div>
          <div style={styles.row}>
            <label style={styles.label}>第二疊加</label>
            <select
              value={cur.overlayIndex2}
              onChange={e => update('overlayIndex2', e.target.value)}
              style={styles.select}
            >
              {overlay2Options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {cur.overlayIndex2 === '自選商品' && (
              <span style={styles.overlayHint}>→ 開啟 XQ 商品搜尋框</span>
            )}
          </div>
          <p style={styles.hint}>
            選「基準指標」時自動帶入上方設定的標的；選「自選商品」時系統彈出 XQ 商品搜尋框，選取後自動回填。
            績效比較圖最多疊加兩個指標。
          </p>
          {(cur.overlayIndex1 === '基準指標' || cur.overlayIndex2 === '基準指標') && (
            <p style={{ ...styles.hint, color: 'var(--color-primary)' }}>
              目前基準指標：{cur.benchmarkIndex}
            </p>
          )}
        </fieldset>

      </div>
    </div>
  )
}

const styles = {
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: 4,
    marginTop: 0,
  },
  desc: {
    fontSize: 13,
    color: 'var(--color-text-secondary)',
    marginBottom: 16,
    marginTop: 0,
  },
  platformTabs: {
    display: 'flex',
    borderBottom: '1px solid var(--color-border)',
    marginBottom: 20,
  },
  platformTab: {
    padding: '8px 20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    transition: 'all 0.15s',
  },
  panelBody: {
    maxWidth: 700,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  fieldset: {
    border: '1px solid var(--color-border)',
    borderRadius: 6,
    padding: '12px 16px',
    margin: 0,
  },
  legend: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    padding: '0 6px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  label: {
    width: 80,
    fontSize: 13,
    color: 'var(--color-text)',
    flexShrink: 0,
  },
  radioGroup: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
  },
  radioLabel: {
    fontSize: 13,
    color: 'var(--color-text)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
  },
  select: {
    fontSize: 13,
    padding: '4px 8px',
    border: '1px solid var(--color-border)',
    borderRadius: 4,
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    minWidth: 200,
  },
  hint: {
    fontSize: 14,
    color: 'var(--color-text-secondary)',
    margin: '4px 0 0 0',
    lineHeight: 1.5,
  },
  overlayHint: {
    fontSize: 14,
    color: 'var(--color-primary)',
    marginLeft: 8,
  },
}
