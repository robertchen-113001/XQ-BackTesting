import { useState } from 'react'
import StickyHeader from './report/StickyHeader'
import OverallStats from './report/OverallStats'
import TradeStats from './report/TradeStats'
import PeriodAnalysis from './report/PeriodAnalysis'
import FactorAnalysis from './report/FactorAnalysis'
import ProductTrade from './report/ProductTrade'
import TradeConfig from './report/TradeConfig'
import { reportData } from '../data/mockData'

const TABS = [
  { id: 'overall', label: '整體統計' },
  { id: 'trade-stats', label: '交易統計' },
  { id: 'period', label: '週期分析' },
  { id: 'factor', label: '因子分析' },
  { id: 'products', label: '商品與交易' },
  { id: 'config', label: '交易設定' },
]

export default function ReportView({ reportId }) {
  const [activeTab, setActiveTab] = useState('overall')
  const [collapsed, setCollapsed] = useState(false)
  const report = reportData // 實際應依 reportId 取資料

  const renderContent = () => {
    switch (activeTab) {
      case 'overall':     return <OverallStats report={report} />
      case 'trade-stats': return <TradeStats report={report} />
      case 'period':      return <PeriodAnalysis report={report} />
      case 'factor':      return <FactorAnalysis report={report} />
      case 'products':    return <ProductTrade report={report} />
      case 'config':      return <TradeConfig report={report} />
      default:            return null
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <StickyHeader
        report={report}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(v => !v)}
        activeTab={activeTab}
        tabs={TABS}
        onTabChange={setActiveTab}
      />
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--color-bg)' }}>
        {renderContent()}
      </div>
    </div>
  )
}
