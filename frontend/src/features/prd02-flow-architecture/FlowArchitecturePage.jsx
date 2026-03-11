import { useState } from 'react'

const FLOW_TABS = [
  {
    id: 'backtest',
    label: '回測流程',
    desc: 'AP 與 webUI 互動流程：使用者在 webUI 觸發回測後，AP 取得商品清單並交由 XQ 執行回測，完成後將結果回傳 webUI 顯示。',
    images: [
      '/images/flow/_page_0_Figure_5.jpeg',
      '/images/flow/_page_1_Figure_0.jpeg',
    ],
  },
  {
    id: 'server-timeout',
    label: 'Server 紀錄逾期流程',
    desc: '當使用者關閉 webUI 或連線中斷時，XQ 透過 Server 紀錄辨識未完成的回測任務 ID，避免任務遺失或重複執行。',
    images: [
      '/images/flow/_page_2_Figure_0.jpeg',
      '/images/flow/_page_3_Figure_0.jpeg',
    ],
  },
  {
    id: 're-backtest',
    label: '重新回測流程',
    desc: 'webUI 傳送既有任務 ID 給 XQ 重新執行回測；舊有 webUI 視窗不需關閉，可直接在原頁面更新結果。',
    images: [
      '/images/flow/_page_4_Picture_0.jpeg',
      '/images/flow/_page_5_Figure_0.jpeg',
    ],
  },
  {
    id: 'retry',
    label: '失敗商品 Retry 流程',
    desc: '針對回測逾時或失敗的商品，僅重送該批 timeout 商品給 XQ，不重跑全部商品清單，降低資源浪費。',
    images: [
      '/images/flow/_page_6_Figure_0.jpeg',
      '/images/flow/_page_7_Figure_0.jpeg',
    ],
  },
  {
    id: 'export',
    label: '匯出報告流程',
    desc: '使用者可從 webUI 將回測報告匯出為 CSV 或 Excel 格式，AP 負責資料整理並回傳檔案下載連結。',
    images: [
      '/images/flow/_page_8_Figure_0.jpeg',
      '/images/flow/_page_9_Figure_0.jpeg',
    ],
  },
  {
    id: 'manual-upload',
    label: '手動上傳流程',
    desc: '提供 XQ 入口供使用者手動上傳回測結果；相關參數設定（如商品代碼、起訖日期）在此流程中討論與確認。',
    images: [
      '/images/flow/_page_10_Figure_0.jpeg',
      '/images/flow/_page_11_Figure_0.jpeg',
    ],
  },
  {
    id: 'small-range',
    label: '小範圍篩選回測流程',
    desc: '針對特定條件（如特定商品或日期區間）執行小範圍篩選回測，減少全量回測的等待時間。',
    images: [
      '/images/flow/_page_12_Figure_1.jpeg',
      '/images/flow/_page_13_Figure_0.jpeg',
    ],
  },
]

export default function FlowArchitecturePage() {
  const [active, setActive] = useState('backtest')
  const current = FLOW_TABS.find(t => t.id === active)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg)' }}>
      {/* 子頁籤列 */}
      <div style={{
        display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)', padding: '0 24px', overflowX: 'auto', flexShrink: 0,
      }}>
        {FLOW_TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            style={{
              padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: active === t.id ? 600 : 400, whiteSpace: 'nowrap',
              color: active === t.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: active === t.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 內容區 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
        {/* 說明文字 */}
        <div style={{
          padding: '12px 16px', background: 'var(--color-surface)',
          borderRadius: 6, border: '1px solid var(--color-border)',
          fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7,
          marginBottom: 24,
        }}>
          <strong style={{ color: 'var(--color-text)' }}>{current.label}說明：</strong>
          {current.desc}
        </div>

        {/* PNG 圖片 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {current.images.map((src, i) => (
            <div key={src} style={{
              background: 'var(--color-surface)', borderRadius: 8,
              border: '1px solid var(--color-border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: 16, width: '100%', maxWidth: 900, boxSizing: 'border-box',
            }}>
              <img
                src={src}
                alt={`${current.label} 流程圖 ${i + 1}`}
                style={{ display: 'block', maxWidth: '100%', margin: '0 auto' }}
              />
              <p style={{
                textAlign: 'center', marginTop: 8, fontSize: 12,
                color: 'var(--color-text-secondary)',
              }}>
                圖 {i + 1}／2
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
