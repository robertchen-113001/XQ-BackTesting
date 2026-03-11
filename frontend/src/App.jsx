import { useState } from 'react'
import AppHeader from './components/AppHeader'
import SidebarTree from './components/SidebarTree'
import TabBar from './components/TabBar'
import MonitorTab from './components/MonitorTab'
import ReportView from './components/ReportView'
import FlowArchitectureDemo from './features/flow-architecture/FlowArchitectureDemo'
import { folderTree, monitorList } from './data/mockData'

export default function App() {
  const [activeTabId, setActiveTabId] = useState('monitor')
  const [openTabs, setOpenTabs] = useState([
    { id: 'monitor', label: '回測監控', closable: false },
    { id: 'rep-1', label: '自動交易DIF-MACD', closable: true },
    { id: 'rep-2', label: 'KD低檔黃金交叉', closable: true },
    { id: 'compare-1', label: '回測比較-1', closable: true },
    { id: 'flow-demo', label: '⬡ 流程示意圖', closable: false },
  ])

  const closeTab = (tabId) => {
    setOpenTabs(prev => prev.filter(t => t.id !== tabId))
    if (activeTabId === tabId) {
      setActiveTabId('monitor')
    }
  }

  const openReport = (repId, repName) => {
    if (!openTabs.find(t => t.id === repId)) {
      setOpenTabs(prev => [...prev, { id: repId, label: repName, closable: true }])
    }
    setActiveTabId(repId)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-bg)' }}>
      <AppHeader />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* A3 左側目錄 */}
        <SidebarTree
          tree={folderTree}
          onOpenReport={openReport}
          activeReportId={activeTabId}
        />
        {/* 右側主區域 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* A4 Tab 列 */}
          <TabBar
            tabs={openTabs}
            activeTabId={activeTabId}
            onSelect={setActiveTabId}
            onClose={closeTab}
          />
          {/* A5 內容區 */}
          <div style={{ flex: 1, overflow: 'hidden', background: 'var(--color-bg)' }}>
            {activeTabId === 'monitor' && (
              <MonitorTab
                list={monitorList}
                onOpenReport={openReport}
              />
            )}
            {activeTabId !== 'monitor' && activeTabId !== 'compare-1' && activeTabId !== 'flow-demo' && (
              <ReportView reportId={activeTabId} />
            )}
            {activeTabId === 'compare-1' && (
              <div style={{ padding: 24, color: 'var(--color-text-secondary)' }}>
                回測比較功能（規劃中）
              </div>
            )}
            {activeTabId === 'flow-demo' && <FlowArchitectureDemo />}
          </div>
        </div>
      </div>
    </div>
  )
}
