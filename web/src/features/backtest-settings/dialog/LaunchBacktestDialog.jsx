import { useState, useEffect } from 'react'
import { PLATFORMS, buildDialogDefaults, ENTRY_ORDER_TYPES, DEFAULT_FREQUENCY } from '../constants'
import BasicExecutionSection from './BasicExecutionSection'
import TradeSettingsSection from './TradeSettingsSection'
import TradeCostSection from './TradeCostSection'
import LeverageSection from './LeverageSection'
import SystemSettingsSection from './SystemSettingsSection'
import StockScreenerEntryExit from './StockScreenerEntryExit'
import StrategyRadarEntryExit from './StrategyRadarEntryExit'
import AutoTradeModules from './AutoTradeModules'

const PLATFORM_TITLES = {
  '選股中心': '執行回測[選股] : 三次到頂而破[台股]',
  '策略雷達': '執行回測[策略] : 大跌後的低檔五連陽(系統)',
  '自動交易': '執行回測[策略] : 02-時間權重交易(TWAP)(系統)',
}

export default function LaunchBacktestDialog() {
  const [platform, setPlatform] = useState('選股中心')
  const [form, setForm] = useState(() => buildDialogDefaults('選股中心'))

  // 切換平台時重設平台相關預設值（保留使用者修改的共用欄位）
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      frequency: DEFAULT_FREQUENCY[platform],
      entryOrderType: ENTRY_ORDER_TYPES[platform].default,
    }))
  }, [platform])

  const onChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={s.wrapper}>
      {/* 平台切換 */}
      <div style={s.platformBar}>
        <span style={s.platformBarLabel}>平台：</span>
        {PLATFORMS.map(p => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            style={{
              ...s.platformBtn,
              background: platform === p ? 'var(--color-primary)' : 'var(--color-surface)',
              color: platform === p ? '#fff' : 'var(--color-text)',
              borderColor: platform === p ? 'var(--color-primary)' : 'var(--color-border)',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 對話框容器 */}
      <div style={s.dialog}>
        {/* 標題列 */}
        <div style={s.dialogTitle}>
          <span style={s.dialogTitleText}>{PLATFORM_TITLES[platform]}</span>
        </div>

        {/* 基本執行設定（全寬）— 僅供檢視 */}
        <div style={{ ...s.section, ...s.staticSection }}>
          <span style={s.staticBadge}>僅供檢視</span>
          <BasicExecutionSection platform={platform} form={form} onChange={onChange} />
        </div>

        {/* 平台差異：進出場 / 交易腳本 — 僅供檢視 */}
        <div style={{ ...s.section, ...s.staticSection }}>
          <span style={s.staticBadge}>僅供檢視</span>
          {platform === '選股中心' && (
            <StockScreenerEntryExit form={form} onChange={onChange} />
          )}
          {platform === '策略雷達' && (
            <StrategyRadarEntryExit form={form} onChange={onChange} />
          )}
          {platform === '自動交易' && (
            <AutoTradeModules form={form} onChange={onChange} />
          )}
        </div>

        {/* 共用模組：交易設定 + 交易成本 + 槓桿 */}
        <div style={s.bottomGrid}>
          <div style={s.bottomLeft}>
            <TradeSettingsSection platform={platform} form={form} onChange={onChange} />
          </div>
          <div style={s.bottomRight}>
            <TradeCostSection form={form} onChange={onChange} />
            <LeverageSection form={form} onChange={onChange} />
          </div>
        </div>

        {/* 底部：系統設定（僅供檢視）+ 按鈕 */}
        <div style={s.footer}>
          <div style={s.staticSection}>
            <span style={s.staticBadge}>僅供檢視</span>
            <SystemSettingsSection form={form} onChange={onChange} />
          </div>
          <div style={s.footerBtns}>
            <button style={s.btnPrimary}>開始回測</button>
            <button style={s.btnSecondary}>取消</button>
          </div>
        </div>
      </div>

      {/* 目前表單狀態摘要（開發輔助） */}
      <FormSummary platform={platform} form={form} />
    </div>
  )
}

function FormSummary({ platform, form }) {
  const [show, setShow] = useState(false)
  return (
    <div style={s.summary}>
      <button onClick={() => setShow(v => !v)} style={s.summaryToggle}>
        {show ? '▾' : '▸'} 表單狀態（開發輔助）
      </button>
      {show && (
        <pre style={s.summaryPre}>
          平台：{platform}{'\n'}
          每筆交易：{form.volumeType}{form.volumeType === '等額' ? '（10萬元）' : form.volumeType === '等量' ? '（1張）' : ''}{'\n'}
          報酬率算法：{form.returnAlgorithm}{form.volumeType === '等比' ? ' ← 鎖定' : ''}{'\n'}
          基準指標：{form.benchmarkIndex}{'\n'}
          最大同時交易筆數：{form.enableMaxConcurrent ? form.maxConcurrentTrades + ' 筆' : '停用'}{'\n'}
          進場順序：{form.entryOrderType}{'\n'}
          執行頻率：{form.frequency}
        </pre>
      )}
    </div>
  )
}

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 12, padding: 24 },
  platformBar: { display: 'flex', alignItems: 'center', gap: 8 },
  platformBarLabel: { fontSize: 13, color: 'var(--color-text-secondary)' },
  platformBtn: { padding: '5px 16px', fontSize: 13, border: '1px solid', borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s' },
  dialog: {
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    background: 'var(--color-surface)',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
  },
  dialogTitle: {
    background: 'var(--color-primary)',
    padding: '10px 16px',
  },
  dialogTitleText: { fontSize: 14, fontWeight: 600, color: '#fff' },
  section: { padding: '12px 16px', borderBottom: '1px solid var(--color-border)' },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '1px solid var(--color-border)',
  },
  bottomLeft: { display: 'flex', flexDirection: 'column', gap: 0 },
  bottomRight: { display: 'flex', flexDirection: 'column', gap: 8 },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'var(--color-bg)',
  },
  footerBtns: { display: 'flex', gap: 8 },
  btnPrimary: { padding: '6px 20px', fontSize: 13, background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 },
  btnSecondary: { padding: '6px 16px', fontSize: 13, background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 4, cursor: 'pointer' },
  staticSection: {
    pointerEvents: 'none',
    opacity: 0.6,
    background: '#f9f9f9',
    position: 'relative',
  },
  staticBadge: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: 12,
    background: '#e0e0e0',
    color: '#666',
    padding: '1px 6px',
    borderRadius: 3,
    zIndex: 1,
  },
  summary: { marginTop: 8 },
  summaryToggle: { fontSize: 14, color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  summaryPre: { fontSize: 14, background: '#f5f5f5', padding: '8px 12px', borderRadius: 4, color: 'var(--color-text-secondary)', marginTop: 4, lineHeight: 1.8 },
}
