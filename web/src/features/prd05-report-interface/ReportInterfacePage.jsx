import { useState } from 'react'
import SidebarTree from '../../components/SidebarTree'
import TabBar from '../../components/TabBar'
import MonitorTab from '../../components/MonitorTab'
import ReportView from '../../components/ReportView'
import { folderTree, monitorList } from '../../data/mockData'

export default function ReportInterfacePage() {
  const [activeTabId, setActiveTabId] = useState('monitor')
  const [openTabs, setOpenTabs] = useState([
    { id: 'monitor', label: '回測監控', closable: false },
    { id: 'rep-1', label: '自動交易DIF-MACD', closable: true },
    { id: 'rep-2', label: 'KD低檔黃金交叉', closable: true },
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
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '100%' }}>
      {/* 左側目錄 */}
      <SidebarTree
        tree={folderTree}
        onOpenReport={openReport}
        activeReportId={activeTabId}
      />
      {/* 右側主區域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TabBar
          tabs={openTabs}
          activeTabId={activeTabId}
          onSelect={setActiveTabId}
          onClose={closeTab}
        />
        <div style={{ flex: 1, overflow: 'hidden', background: 'var(--color-bg)' }}>
          {activeTabId === 'monitor' && (
            <MonitorTab list={monitorList} onOpenReport={openReport} />
          )}
          {activeTabId !== 'monitor' && activeTabId !== 'compare-1' && (
            <ReportView reportId={activeTabId} />
          )}
          {activeTabId === 'compare-1' && (
            <div style={{ padding: 24, color: 'var(--color-text-secondary)' }}>
              回測比較功能（規劃中）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
