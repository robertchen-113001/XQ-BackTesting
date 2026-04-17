import { useState } from 'react'
import SystemParamsPanel from './SystemParamsPanel'
import LaunchBacktestDialog from './dialog/LaunchBacktestDialog'
import TradeConfigTab from './TradeConfigTab'

const MAIN_TABS = [
  { id: 'system-params', label: '§2 系統參數設定', desc: 'S → K → P → R，三平台各自獨立儲存的全域預設值' },
  { id: 'dialog', label: '§3 執行回測對話框', desc: '每次啟動回測時的當次設定，帶入系統參數預設值' },
  { id: 'report-tab6', label: '§4 報告「交易設定」', desc: '回測完成後顯示本次使用的全部參數與腳本；左側腳本設定依平台條件渲染' },
]

export default function BacktestSettingsPage() {
  const [tab, setTab] = useState('system-params')

  return (
    <div style={s.page}>
      {/* 頁面標題 */}
      <div style={s.pageHeader}>
        <h2 style={s.pageTitle}>PRD 04 — 回測設定</h2>
        <p style={s.pageDesc}>
          設定流向：① 系統參數（全域預設）→ ② 執行回測對話框（每次微調）→ ③ 報告「交易設定」顯示本次參數
        </p>
      </div>

      {/* 主 Tab 切換 */}
      <div style={s.tabBar}>
        {MAIN_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              ...s.tabBtn,
              borderBottom: tab === t.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: tab === t.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: tab === t.id ? 600 : 400,
              background: tab === t.id ? 'var(--color-surface)' : 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 說明 */}
      <div style={s.tabDesc}>
        {MAIN_TABS.find(t => t.id === tab)?.desc}
      </div>

      {/* 內容 */}
      <div style={s.content}>
        {tab === 'system-params' && <SystemParamsPanel />}
        {tab === 'dialog' && <LaunchBacktestDialog />}
        {tab === 'report-tab6' && <TradeConfigTab />}
      </div>
    </div>
  )
}

const s = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    background: 'var(--color-bg)',
  },
  pageHeader: {
    padding: '16px 24px 0',
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--color-text)',
    margin: '0 0 4px 0',
  },
  pageDesc: {
    fontSize: 13,
    color: 'var(--color-text-secondary)',
    margin: '0 0 12px 0',
  },
  tabBar: {
    display: 'flex',
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
    paddingLeft: 24,
  },
  tabBtn: {
    padding: '8px 20px',
    fontSize: 13,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tabDesc: {
    padding: '6px 24px',
    fontSize: 12,
    color: 'var(--color-text-secondary)',
    background: '#fafafa',
    borderBottom: '1px solid var(--color-border)',
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
}
