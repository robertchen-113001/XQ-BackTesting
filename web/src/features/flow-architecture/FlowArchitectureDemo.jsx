import { useState } from 'react'
import BacktestProgressPage from './flows/BacktestProgressPage'
import BacktestErrorBanner from './flows/BacktestErrorBanner'
import RerunBacktestButton from './flows/RerunBacktestButton'
import FailedProductsRetryPanel from './flows/FailedProductsRetryPanel'
import ExportMenu from './flows/ExportMenu'
import ImportDialog from './flows/ImportDialog'
import ProductFilterRerunButton from './flows/ProductFilterRerunButton'

const TABS = [
  { id: 0, label: '① 一般回測' },
  { id: 1, label: '② Server 逾期' },
  { id: 2, label: '③ 重新回測' },
  { id: 3, label: '④ 失敗 Retry' },
  { id: 4, label: '⑤ 匯出報告' },
  { id: 5, label: '⑥ 手動上傳' },
  { id: 6, label: '⑦ 小範圍篩選' },
]

const FLOWS = [
  BacktestProgressPage,
  BacktestErrorBanner,
  RerunBacktestButton,
  FailedProductsRetryPanel,
  ExportMenu,
  ImportDialog,
  ProductFilterRerunButton,
]

export default function FlowArchitectureDemo() {
  const [activeFlow, setActiveFlow] = useState(0)
  const ActiveComponent = FLOWS[activeFlow]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Tab 切換列 */}
      <div style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        overflowX: 'auto',
        flexShrink: 0,
        padding: '0 16px',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFlow(tab.id)}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeFlow === tab.id ? '2px solid #1a56db' : '2px solid transparent',
              color: activeFlow === tab.id ? '#1a56db' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeFlow === tab.id ? 600 : 400,
              whiteSpace: 'nowrap',
              marginBottom: -1,
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 流程元件內容區 */}
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--color-bg)' }}>
        <ActiveComponent />
      </div>
    </div>
  )
}
