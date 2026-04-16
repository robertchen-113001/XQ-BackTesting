import { useState } from 'react'

// 外部實體
const EXTERNALS = [
  { id: 'xqap',   x: 30,  y: 250, w: 100, h: 45, label: 'XQ AP' },
  { id: 'server', x: 960, y: 250, w: 110, h: 45, label: '回測 Server' },
  { id: 'user',   x: 490, y: 30,  w: 100, h: 45, label: '使用者' },
]

// 程序（橢圓）
const PROCESSES = [
  { id: 'p1', cx: 200, cy: 180, rx: 85, ry: 35, label: 'P1', sub: '接收回測請求', tip: '接收來自 XQ AP 的 URL 參數，解析回測 ID 並初始化狀態' },
  { id: 'p2', cx: 200, cy: 320, rx: 85, ry: 35, label: 'P2', sub: 'Sinker 通訊',  tip: '透過 Sinker 機制與 XQ AP 建立雙向通訊，回傳已接收的回測 ID' },
  { id: 'p3', cx: 540, cy: 180, rx: 85, ry: 35, label: 'P3', sub: '顯示進度',    tip: '接收 Server 推播的進度事件，更新進度條與狀態文字' },
  { id: 'p4', cx: 540, cy: 400, rx: 85, ry: 35, label: 'P4', sub: '呈現報告',    tip: '將回測結果資料渲染為各頁籤報表（整體統計、每日報表等）' },
  { id: 'p5', cx: 860, cy: 180, rx: 85, ry: 35, label: 'P5', sub: '使用者操作',  tip: '處理使用者點擊操作：重新回測、匯出、篩選商品等指令' },
  { id: 'p6', cx: 860, cy: 400, rx: 85, ry: 35, label: 'P6', sub: '匯入驗證',    tip: '驗證匯入的回測設定檔格式，轉換後填入對應欄位' },
]

// 資料儲存（雙橫線）
const DATASTORES = [
  { id: 'ds1', x: 340, y: 245, w: 140, h: 36, label: 'DS1', sub: '回測 ID 暫存' },
  { id: 'ds2', x: 340, y: 310, w: 140, h: 36, label: 'DS2', sub: '報告快取' },
  { id: 'ds3', x: 670, y: 245, w: 140, h: 36, label: 'DS3', sub: '使用者設定' },
  { id: 'ds4', x: 670, y: 310, w: 140, h: 36, label: 'DS4', sub: '本機儲存' },
]

// 連線 [fromX,fromY → toX,toY, label]
const FLOWS = [
  { id: 'df1',  d: 'M130,250 L200,215',             label: '回測 ID',       lx: 148, ly: 238 },
  { id: 'df2',  d: 'M200,285 L130,300',             label: 'Sinker ACK',    lx: 148, ly: 298 },
  { id: 'df3',  d: 'M200,215 L200,285',             label: '',              lx: 215, ly: 253 },
  { id: 'df4',  d: 'M200,180 L340,263',             label: '寫入 ID',       lx: 258, ly: 213 },
  { id: 'df5',  d: 'M340,263 L455,185',             label: '讀取 ID',       lx: 385, ly: 213 },
  { id: 'df6',  d: 'M960,270 L625,195',             label: '進度/結果推播', lx: 780, ly: 218 },
  { id: 'df7',  d: 'M540,145 L540,75',              label: '查詢/操作',     lx: 555, ly: 108 },
  { id: 'df8',  d: 'M540,75  L860,145',             label: '操作指令',      lx: 700, ly: 95 },
  { id: 'df9',  d: 'M860,145 L960,268',             label: '匯出請求',      lx: 930, ly: 195 },
  { id: 'df10', d: 'M540,215 L540,365',             label: '寫入快取',      lx: 555, ly: 285 },
  { id: 'df11', d: 'M480,400 L340,328',             label: '讀取快取',      lx: 395, ly: 355 },
  { id: 'df12', d: 'M810,180 L810,263',             label: '讀取設定',      lx: 825, ly: 222 },
  { id: 'df13', d: 'M810,263 L810,365',             label: '寫入設定',      lx: 825, ly: 315 },
]

export default function DfdDiagram() {
  const [hovered, setHovered] = useState(null)
  const hovProc = PROCESSES.find(p => p.id === hovered)

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox="0 0 1100 620" style={{ width: '100%', maxWidth: 1100, display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id="arrow-dfd" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#6b7280" />
          </marker>
          <marker id="arrow-dfd-h" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
          </marker>
        </defs>

        <text x="550" y="24" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#374151">
          DFD Level-1 — 資料流圖 (Data Flow Diagram)
        </text>

        {/* 資料流 */}
        {FLOWS.map(f => (
          <g key={f.id}>
            <path d={f.d} fill="none" stroke="#9ca3af" strokeWidth="1.5"
              markerEnd="url(#arrow-dfd)" />
            {f.label && (
              <text x={f.lx} y={f.ly} textAnchor="middle" fontSize="10" fill="#6b7280"
                style={{ userSelect: 'none' }}>
                {f.label}
              </text>
            )}
          </g>
        ))}

        {/* 資料儲存 */}
        {DATASTORES.map(ds => (
          <g key={ds.id}>
            <line x1={ds.x} y1={ds.y} x2={ds.x + ds.w} y2={ds.y} stroke="#374151" strokeWidth="1.5" />
            <line x1={ds.x} y1={ds.y + ds.h} x2={ds.x + ds.w} y2={ds.y + ds.h} stroke="#374151" strokeWidth="1.5" />
            <rect x={ds.x} y={ds.y} width={ds.w} height={ds.h} fill="#f9fafb" stroke="none" />
            <text x={ds.x + 6} y={ds.y + 22} fontSize="11" fontWeight="bold" fill="#374151">{ds.label}</text>
            <text x={ds.x + 34} y={ds.y + 22} fontSize="11" fill="#4b5563">{ds.sub}</text>
          </g>
        ))}

        {/* 外部實體 */}
        {EXTERNALS.map(e => (
          <g key={e.id}>
            <rect x={e.x} y={e.y} width={e.w} height={e.h} fill="#e5e7eb" stroke="#6b7280" strokeWidth="1.5" />
            <text x={e.x + e.w / 2} y={e.y + e.h / 2 + 5} textAnchor="middle" fontSize="12"
              fontWeight="600" fill="#1f2937" style={{ userSelect: 'none' }}>
              {e.label}
            </text>
          </g>
        ))}

        {/* 程序（橢圓） */}
        {PROCESSES.map(p => {
          const isHov = hovered === p.id
          return (
            <g key={p.id} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}>
              <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry}
                fill={isHov ? '#1d4ed8' : '#3b82f6'}
                stroke={isHov ? '#93c5fd' : '#1e40af'}
                strokeWidth="1.5" />
              <text x={p.cx} y={p.cy - 5} textAnchor="middle" fontSize="11"
                fontWeight="bold" fill="#ffffff" style={{ userSelect: 'none' }}>
                {p.label}
              </text>
              <text x={p.cx} y={p.cy + 10} textAnchor="middle" fontSize="11"
                fill="#e0e7ff" style={{ userSelect: 'none' }}>
                {p.sub}
              </text>
            </g>
          )
        })}

        {/* Tooltip for processes */}
        {hovProc && (
          <g>
            <rect x={hovProc.cx - 120} y={hovProc.cy + hovProc.ry + 6}
              width="240" height="44" rx="6" fill="#1f2937" opacity="0.93" />
            <foreignObject x={hovProc.cx - 116} y={hovProc.cy + hovProc.ry + 10}
              width="232" height="40">
              <div xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: 11, color: '#f9fafb', lineHeight: '1.45', padding: '0 2px' }}>
                {hovProc.tip}
              </div>
            </foreignObject>
          </g>
        )}

        {/* 圖例（右下角） */}
        <g transform="translate(720, 530)">
          <rect x="0" y="0" width="360" height="72" rx="6" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
          <text x="12" y="20" fontSize="11" fontWeight="bold" fill="#374151">圖例</text>
          {/* 橢圓 */}
          <ellipse cx="32" cy="42" rx="22" ry="14" fill="#3b82f6" />
          <text x="60" y="47" fontSize="11" fill="#4b5563">程序（Process）</text>
          {/* 矩形 */}
          <rect x="170" y="30" width="32" height="22" fill="#e5e7eb" stroke="#6b7280" strokeWidth="1" />
          <text x="208" y="47" fontSize="11" fill="#4b5563">外部實體</text>
          {/* 雙橫線 */}
          <line x1="12" y1="62" x2="55" y2="62" stroke="#374151" strokeWidth="1.5" />
          <line x1="12" y1="70" x2="55" y2="70" stroke="#374151" strokeWidth="1.5" />
          <text x="60" y="70" fontSize="11" fill="#4b5563">資料儲存（Data Store）</text>
        </g>
      </svg>
    </div>
  )
}
