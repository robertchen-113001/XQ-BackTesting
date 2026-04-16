// 交易設定 Tab：回測設定資訊 + 策略腳本內容
import { useState } from 'react'

const MOCK_CONFIG = {
  basic: [
    { label: '平台', value: '自動交易' },
    { label: '回測區間', value: '2022/09/01 - 2023/02/28' },
    { label: '資料頻率', value: '日線' },
    { label: '初始資金', value: '$1,000,000' },
    { label: '交易數量模式', value: '等額' },
    { label: '報酬率算法', value: '時間加權' },
    { label: '交易方向', value: '多' },
  ],
  cost: [
    { label: '手續費（買）', value: '0.1425%' },
    { label: '手續費（賣）', value: '0.1425%' },
    { label: '證交稅', value: '0.3%' },
    { label: '最低手續費', value: '$20' },
    { label: '滑價設定', value: '0 檔' },
  ],
  system: [
    { label: '商品池', value: '台灣50成分股' },
    { label: '最大持倉商品數', value: '10' },
    { label: '每筆投入金額', value: '$100,000' },
    { label: '再平衡頻率', value: '每日' },
  ],
}

const MOCK_SCRIPT = `// 策略腳本：DIF-MACD 從負翻正
// 平台：自動交易
// 版本：v2.3.1

strategy("DIF-MACD 從負翻正策略", {
  capital: 1000000,
  tradeMode: "equal_amount",
  direction: "long",
  universe: "TW50",
  maxPositions: 10,
  rebalance: "daily",
})

// 指標設定
const fastLen = input.int(12, "快線週期", minval=1)
const slowLen = input.int(26, "慢線週期", minval=1)
const sigLen  = input.int(9,  "信號線週期", minval=1)

// MACD 計算
const [macdLine, signalLine, hist] = ta.macd(close, fastLen, slowLen, sigLen)

// 進場條件：DIF 從負值翻正
const entrySignal = ta.crossover(macdLine, 0)

// 出場條件：DIF 跌破零線
const exitSignal  = ta.crossunder(macdLine, 0)

// 執行邏輯
if (entrySignal) strategy.entry("Long", strategy.long)
if (exitSignal)  strategy.close("Long")
`

export default function TradeConfig() {
  const [showScript, setShowScript] = useState(false)

  function ConfigGroup({ title, items }) {
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: 4, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)', paddingBottom: 4 }}>
          {title}
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 'var(--font-size-xs)', borderBottom: '1px solid #f5f5f5' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
            <span style={{ fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* 左側：設定資訊 */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 6, padding: 12, maxWidth: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>回測設定</span>
            <button onClick={() => setShowScript(v => !v)} style={{ fontSize: 'var(--font-size-xs)' }}>
              {showScript ? '▲ 收起腳本' : '▼ 查看策略腳本'}
            </button>
          </div>

          <ConfigGroup title="基本設定" items={MOCK_CONFIG.basic} />
          <ConfigGroup title="成本設定" items={MOCK_CONFIG.cost} />
          <ConfigGroup title="系統設定" items={MOCK_CONFIG.system} />

          {showScript && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: 6, color: 'var(--color-text-secondary)' }}>
                策略腳本（唯讀）
              </div>
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: 12,
                borderRadius: 4,
                fontSize: 11,
                lineHeight: 1.6,
                overflow: 'auto',
                maxHeight: 400,
                fontFamily: 'Consolas, Monaco, monospace',
              }}>
                {MOCK_SCRIPT}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* 右側說明 */}
      <div style={{ width: 220, borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 12, flexShrink: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 'var(--font-size-sm)' }}>關於此報告</div>
        {[
          { label: '建立時間', value: '2024-11-13 14:22' },
          { label: '執行時間', value: '3分24秒' },
          { label: '資料筆數', value: '126,842' },
          { label: '策略版本', value: 'v2.3.1' },
          { label: '引擎版本', value: '5.1.8' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 'var(--font-size-xs)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
            <span style={{ fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 'var(--font-size-sm)' }}>快速操作</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button style={{ width: '100%', textAlign: 'left', padding: '4px 8px', fontSize: 'var(--font-size-xs)' }}>↺ 重新回測</button>
            <button style={{ width: '100%', textAlign: 'left', padding: '4px 8px', fontSize: 'var(--font-size-xs)' }}>📋 複製設定</button>
            <button style={{ width: '100%', textAlign: 'left', padding: '4px 8px', fontSize: 'var(--font-size-xs)' }}>⬆ 匯出報告</button>
          </div>
        </div>
      </div>
    </div>
  )
}
