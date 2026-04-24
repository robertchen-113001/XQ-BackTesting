import { useState } from 'react'
import AppHeader from './components/AppHeader'
import TradeRecordsPage from './features/trade-records/TradeRecordsPage'
import BacktestSettingsPage from './features/backtest-settings/BacktestSettingsPage'
import ExportPage from './features/export/ExportPage'

const PRD_TABS = [
  { id: 'trade-records', label: '交易紀錄' },
  { id: 'backtest-settings', label: '回測設定' },
  { id: 'export', label: '匯出功能' },
]

function TabBar({ activeTabId, onSelect }) {
  return (
    <div style={{
      display: 'flex', borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)', padding: '0 16px',
      overflowX: 'auto', flexShrink: 0,
    }}>
      {PRD_TABS.map(t => (
        <button key={t.id} onClick={() => onSelect(t.id)}
          style={{
            padding: '11px 16px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: activeTabId === t.id ? 700 : 400, whiteSpace: 'nowrap',
            color: activeTabId === t.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            borderBottom: activeTabId === t.id ? '2px solid var(--color-primary)' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s',
          }}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [activeTabId, setActiveTabId] = useState('trade-records')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-bg)' }}>
      <AppHeader />
      <TabBar activeTabId={activeTabId} onSelect={setActiveTabId} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeTabId === 'trade-records' && <TradeRecordsPage />}
          {activeTabId === 'backtest-settings' && <BacktestSettingsPage />}
          {activeTabId === 'export' && <ExportPage />}
        </div>
      </div>
    </div>
  )
}
