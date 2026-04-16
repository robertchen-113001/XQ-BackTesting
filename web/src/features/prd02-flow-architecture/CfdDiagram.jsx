import { useState } from 'react'

const NODES = {
  user:   { x: 60,  y: 200, w: 110, h: 50, label: '使用者',       type: 'external', tip: '觸發回測、查看報告、下達操作指令的終端使用者' },
  xqap:   { x: 390, y: 60,  w: 120, h: 50, label: 'XQ AP',        type: 'external', tip: 'XQ 交易平台應用程式，負責發送回測請求與傳遞回測 ID' },
  server: { x: 720, y: 200, w: 130, h: 50, label: '回測 Server',   type: 'external', tip: '執行回測運算、推播進度與結果的後端服務' },
  webui:  { x: 390, y: 340, w: 160, h: 55, label: '回測報告 Web UI', type: 'system', tip: '核心系統：整合 Sinker 通訊、進度顯示、報告呈現與匯出功能' },
}

const FLOWS = [
  { id: 'f1', from: 'user',   to: 'xqap',   path: 'M170,225 C280,200 310,150 390,110', label: '①觸發回測',       lx: 250, ly: 165 },
  { id: 'f2', from: 'xqap',   to: 'server', path: 'M510,85  C620,70  660,120 720,200',  label: '②回測請求',       lx: 618, ly: 110 },
  { id: 'f3', from: 'server', to: 'xqap',   path: 'M720,210 C650,170 590,100 510,95',   label: '③回測 ID',        lx: 612, ly: 140 },
  { id: 'f4', from: 'xqap',   to: 'webui',  path: 'M450,110 C445,200 445,280 450,340',  label: '④URL 帶 ID',      lx: 460, ly: 225 },
  { id: 'f5', from: 'webui',  to: 'xqap',   path: 'M500,340 C510,270 500,170 500,110',  label: '⑤Sinker 回傳 ID', lx: 516, ly: 230 },
  { id: 'f6', from: 'server', to: 'webui',  path: 'M720,225 C640,280 580,330 550,355',  label: '⑥進度與結果推播', lx: 630, ly: 270 },
  { id: 'f7', from: 'webui',  to: 'user',   path: 'M390,375 C280,390 220,330 170,250',  label: '⑦顯示回測報告',   lx: 255, ly: 385 },
  { id: 'f8', from: 'user',   to: 'webui',  path: 'M170,240 C250,290 320,350 390,365',  label: '⑧操作指令',       lx: 252, ly: 315 },
  { id: 'f9', from: 'webui',  to: 'server', path: 'M550,365 C620,370 680,320 720,240',  label: '⑨匯出請求',       lx: 633, ly: 378 },
]

function arrowHead(path, toNode) {
  const n = NODES[toNode]
  const cx = n.x + n.w / 2
  const cy = n.y + n.h / 2
  return `M${cx - 6},${cy - 4} L${cx + 6},${cy} L${cx - 6},${cy + 4}`
}

export default function CfdDiagram() {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <svg viewBox="0 0 900 500" style={{ width: '100%', maxWidth: 900, display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id="arrow-cfd" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#6b8cba" />
          </marker>
          <marker id="arrow-cfd-hover" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
          </marker>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000030" />
          </filter>
        </defs>

        {/* 背景標題 */}
        <text x="450" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#374151">
          CFD — 系統情境圖 (Context Flow Diagram)
        </text>

        {/* 資料流箭頭 */}
        {FLOWS.map(f => {
          const isHov = hovered === f.id
          return (
            <g key={f.id} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(f.id)}
              onMouseLeave={() => setHovered(null)}>
              <path d={f.path} fill="none"
                stroke={isHov ? '#f59e0b' : '#6b8cba'}
                strokeWidth={isHov ? 2.5 : 1.5}
                markerEnd={isHov ? 'url(#arrow-cfd-hover)' : 'url(#arrow-cfd)'}
                strokeDasharray={isHov ? '0' : '5,3'}
              />
              <text x={f.lx} y={f.ly} textAnchor="middle" fontSize="11"
                fill={isHov ? '#b45309' : '#4b5563'}
                fontWeight={isHov ? 'bold' : 'normal'}
                style={{ userSelect: 'none' }}>
                {f.label}
              </text>
            </g>
          )
        })}

        {/* 節點 */}
        {Object.entries(NODES).map(([key, n]) => {
          const isHov = hovered === key
          const isSystem = n.type === 'system'
          return (
            <g key={key} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}>
              {isSystem ? (
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10"
                  fill={isHov ? '#1d4ed8' : '#2563eb'}
                  stroke={isHov ? '#93c5fd' : '#1e40af'}
                  strokeWidth="2" filter="url(#shadow)" />
              ) : (
                <rect x={n.x} y={n.y} width={n.w} height={n.h}
                  fill={isHov ? '#6b7280' : '#9ca3af'}
                  stroke={isHov ? '#374151' : '#6b7280'}
                  strokeWidth="1.5" filter="url(#shadow)" />
              )}
              <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 4}
                textAnchor="middle" fontSize="13" fontWeight="600"
                fill={isSystem ? '#ffffff' : '#1f2937'}
                style={{ userSelect: 'none' }}>
                {n.label}
              </text>
            </g>
          )
        })}

        {/* Tooltip */}
        {hovered && (NODES[hovered]) && (() => {
          const n = NODES[hovered]
          const tx = Math.min(n.x + n.w / 2, 700)
          const ty = n.y > 250 ? n.y - 55 : n.y + n.h + 10
          return (
            <g>
              <rect x={tx - 10} y={ty} width={220} height={42} rx="6"
                fill="#1f2937" opacity="0.92" />
              <foreignObject x={tx - 6} y={ty + 4} width="212" height="36">
                <div xmlns="http://www.w3.org/1999/xhtml"
                  style={{ fontSize: 11, color: '#f9fafb', lineHeight: '1.4', padding: '0 2px' }}>
                  {n.tip}
                </div>
              </foreignObject>
            </g>
          )
        })()}

        {/* 圖例 */}
        <g transform="translate(640, 430)">
          <rect x="0" y="0" width="14" height="14" fill="#9ca3af" />
          <text x="20" y="12" fontSize="11" fill="#6b7280">外部實體</text>
          <rect x="90" y="0" width="14" height="14" fill="#2563eb" rx="3" />
          <text x="110" y="12" fontSize="11" fill="#6b7280">中心系統</text>
          <line x1="180" y1="7" x2="208" y2="7" stroke="#6b8cba" strokeWidth="1.5"
            strokeDasharray="4,2" markerEnd="url(#arrow-cfd)" />
          <text x="214" y="12" fontSize="11" fill="#6b7280">資料流</text>
        </g>
      </svg>
    </div>
  )
}
