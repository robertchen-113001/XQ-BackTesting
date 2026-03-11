import { useState } from 'react'

const FORMATS = [
  { fmt: 'XLSX', desc: 'Excel 多分頁報表，含所有統計與交易紀錄', icon: '📊' },
  { fmt: 'CSV',  desc: '純文字逗號分隔，僅含交易紀錄明細', icon: '📄' },
  { fmt: 'PDF',  desc: '列印用報告（規劃中）', icon: '📋', planned: true },
]

const XLSX_SHEETS = [
  '整體統計總覽', '每日報表', '商品損益明細', '最大連續獲利/虧損',
  '月績效分析', '年績效分析', '因子分析', '商品別統計',
  '交易明細', '回測設定參數', '商品篩選結果',
]

const EXPORT_OPTIONS = [
  { id: 'all',      label: '全部匯出' },
  { id: 'selected', label: '僅匯出選取分頁' },
  { id: 'current',  label: '僅匯出目前頁籤' },
]

export default function ExportPage() {
  const [selected, setSelected] = useState('all')

  return (
    <div style={{ padding: 32, maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
        PRD 06 — 匯出功能
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: 14 }}>
        支援的匯出格式、XLSX 分頁規格，以及匯出範圍選項設計
      </p>

      <h3 style={sectionTitle}>支援格式</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        {FORMATS.map(f => (
          <div key={f.fmt} style={{
            ...card, flex: 1, opacity: f.planned ? 0.55 : 1,
            borderStyle: f.planned ? 'dashed' : 'solid',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{f.fmt}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{f.desc}</div>
            {f.planned && <div style={{ marginTop: 8, fontSize: 11, color: '#d97706' }}>規劃中</div>}
          </div>
        ))}
      </div>

      <h3 style={sectionTitle}>XLSX 分頁清單（共 11 頁）</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 32 }}>
        {XLSX_SHEETS.map((s, i) => (
          <div key={s} style={{ ...card, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', minWidth: 22 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ fontSize: 13, color: 'var(--color-text)' }}>{s}</span>
          </div>
        ))}
      </div>

      <h3 style={sectionTitle}>匯出範圍（模擬下拉選單）</h3>
      <div style={{ display: 'flex', gap: 12 }}>
        {EXPORT_OPTIONS.map(o => (
          <button key={o.id} onClick={() => setSelected(o.id)}
            style={{
              padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
              fontWeight: selected === o.id ? 600 : 400,
              background: selected === o.id ? 'var(--color-primary)' : 'var(--color-surface)',
              color: selected === o.id ? '#ffffff' : 'var(--color-text)',
              border: selected === o.id ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
            }}>
            {o.label}
          </button>
        ))}
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-secondary)' }}>
        目前選擇：<strong>{EXPORT_OPTIONS.find(o => o.id === selected)?.label}</strong>
      </p>
    </div>
  )
}

const sectionTitle = { fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12, marginTop: 0 }
const card = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 16 }
