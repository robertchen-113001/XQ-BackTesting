import { useState } from 'react'
import AppHeader from './components/AppHeader'
import ReportInterfacePage from './features/prd05-report-interface/ReportInterfacePage'
import FlowArchitecturePage from './features/prd02-flow-architecture/FlowArchitecturePage'
import OverviewPage from './features/prd01-overview/OverviewPage'
import TradeRecordsPage from './features/prd03-trade-records/TradeRecordsPage'
import BacktestSettingsPage from './features/prd04-backtest-settings/BacktestSettingsPage'
import ExportPage from './features/prd06-export/ExportPage'
import FieldCalculationPage from './features/prd07-field-calc/FieldCalculationPage'

const PRD_TABS = [
  { id: 'prd-01', label: 'PRD 01 產品概覽' },
  { id: 'prd-02', label: 'PRD 02 流程架構' },
  { id: 'prd-03', label: 'PRD 03 交易紀錄' },
  { id: 'prd-04', label: 'PRD 04 回測設定' },
  { id: 'prd-05', label: 'PRD 05 報告介面' },
  { id: 'prd-06', label: 'PRD 06 匯出功能' },
  { id: 'prd-07', label: 'PRD 07 欄位計算' },
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
            fontSize: 13, fontWeight: activeTabId === t.id ? 700 : 400, whiteSpace: 'nowrap',
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
  const [activeTabId, setActiveTabId] = useState('prd-05')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-bg)' }}>
      <AppHeader />
      <TabBar activeTabId={activeTabId} onSelect={setActiveTabId} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTabId === 'prd-05' ? (
          <ReportInterfacePage />
        ) : (
          <div style={{ flex: 1, overflow: 'auto' }}>
            {activeTabId === 'prd-01' && <OverviewPage />}
            {activeTabId === 'prd-02' && <FlowArchitecturePage />}
            {activeTabId === 'prd-03' && <TradeRecordsPage />}
            {activeTabId === 'prd-04' && <BacktestSettingsPage />}
            {activeTabId === 'prd-06' && <ExportPage />}
            {activeTabId === 'prd-07' && <FieldCalculationPage />}
          </div>
        )}
      </div>
    </div>
  )
}
