import { useState } from 'react'

const PLATFORMS = ['XQ 量化平台', 'XQ 全球贏家', '通用設定']

const SETTINGS = {
  'XQ 量化平台': [
    { field: '回測起始日', type: 'Date', default: '策略設定日', desc: '回測的起始交易日' },
    { field: '回測結束日', type: 'Date', default: '最新交易日', desc: '回測的結束交易日' },
    { field: '初始資金',   type: 'Number', default: '1,000,000', desc: '模擬帳戶初始資本' },
    { field: '滑點設定',   type: 'Number', default: '0',         desc: '每筆交易模擬滑點點數' },
  ],
  'XQ 全球贏家': [
    { field: '回測起始日', type: 'Date',   default: '策略設定日', desc: '回測的起始交易日' },
    { field: '回測結束日', type: 'Date',   default: '最新交易日', desc: '回測的結束交易日' },
    { field: '初始資金',   type: 'Number', default: '1,000,000', desc: '模擬帳戶初始資本' },
    { field: '商品清單',   type: 'Array',  default: '策略商品池', desc: '參與回測的商品列表' },
  ],
  '通用設定': [
    { field: '手續費率',       type: 'Number',  default: '0.1425%',   desc: '股票買賣手續費率' },
    { field: '證交稅',         type: 'Number',  default: '0.3%',      desc: '賣出時收取（股票）' },
    { field: '期貨手續費',     type: 'Number',  default: '50 元/口',  desc: '期貨每口手續費' },
    { field: '報酬率計算模式', type: 'Enum',    default: '等比模式',  desc: 'TWR 時間加權（等比）或 MIR 最大投入報酬率' },
    { field: '交易單位',       type: 'Enum',    default: '口數 Lots', desc: '以口數或股數計算損益' },
  ],
}

export default function BacktestSettingsPage() {
  const [active, setActive] = useState('XQ 量化平台')

  return (
    <div style={{ padding: 32, maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
        PRD 04 — 回測設定
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: 14 }}>
        各平台回測參數設定規格，以及通用交易費率與計算模式設定
      </p>

      {/* 平台子頁籤 */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: 24 }}>
        {PLATFORMS.map(p => (
          <button key={p} onClick={() => setActive(p)}
            style={{
              padding: '8px 18px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: active === p ? 600 : 400,
              color: active === p ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: active === p ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: -1,
            }}>
            {p}
          </button>
        ))}
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>欄位</th><th style={th}>型別</th><th style={th}>預設值</th><th style={th}>說明</th>
          </tr>
        </thead>
        <tbody>
          {SETTINGS[active].map(s => (
            <tr key={s.field}>
              <td style={{ ...td, fontWeight: 600 }}>{s.field}</td>
              <td style={{ ...td, color: '#7c3aed', fontFamily: 'monospace', fontSize: 12 }}>{s.type}</td>
              <td style={td}><code style={code}>{s.default}</code></td>
              <td style={td}>{s.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {active === '通用設定' && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--color-surface)', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
          ⚠️ <strong style={{ color: 'var(--color-text)' }}>注意：</strong>等比模式強制搭配 TWR 時間加權報酬率，不可切換為 MIR 最大投入報酬率。
        </div>
      )}
    </div>
  )
}

const table = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const th = { background: 'var(--color-surface)', padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }
const td = { padding: '10px 14px', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }
const code = { background: 'var(--color-bg)', padding: '1px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }
