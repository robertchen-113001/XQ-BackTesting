import { useState } from 'react'
import CfdDiagram from './CfdDiagram'
import DfdDiagram from './DfdDiagram'

const TABS = [
  { id: 'cfd', label: 'CFD 系統情境圖' },
  { id: 'dfd', label: 'DFD Level-1 資料流圖' },
]

export default function FlowArchitecturePage() {
  const [active, setActive] = useState('cfd')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg)' }}>
      {/* 子頁籤列 */}
      <div style={{
        display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)', padding: '0 24px'
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            style={{
              padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: active === t.id ? 600 : 400,
              color: active === t.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: active === t.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 圖表區 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
        <div style={{
          background: 'var(--color-surface)', borderRadius: 8,
          border: '1px solid var(--color-border)', padding: '24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          {active === 'cfd' ? <CfdDiagram /> : <DfdDiagram />}
        </div>

        {/* 說明文字 */}
        <div style={{
          marginTop: 16, padding: '12px 16px', background: 'var(--color-surface)',
          borderRadius: 6, border: '1px solid var(--color-border)',
          fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6
        }}>
          {active === 'cfd' ? (
            <>
              <strong style={{ color: 'var(--color-text)' }}>CFD 說明：</strong>
              本圖展示回測報告系統與外部實體的互動邊界。灰色矩形為外部實體，藍色圓角矩形為核心系統。
              共 9 條資料流涵蓋從觸發回測到取得報告的完整生命週期。Hover 節點可查看詳細說明。
            </>
          ) : (
            <>
              <strong style={{ color: 'var(--color-text)' }}>DFD 說明：</strong>
              本圖展示系統內部資料流動與處理流程。藍色橢圓為處理程序（P1~P6），矩形為外部實體，
              雙橫線為資料儲存（DS1~DS4）。Hover 程序節點可查看處理邏輯說明。
            </>
          )}
        </div>
      </div>
    </div>
  )
}
