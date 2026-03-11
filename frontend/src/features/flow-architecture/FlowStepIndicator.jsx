// 共用 SVG 步驟指示器
// Props: steps: Array<{id, label}>, currentStep: number（1-based）
export default function FlowStepIndicator({ steps, currentStep }) {
  const nodeSpacing = 130
  const svgWidth = steps.length * nodeSpacing
  const svgHeight = 70
  const cy = 28
  const r = 14

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{ width: '100%', maxWidth: svgWidth, display: 'block', margin: '0 auto', overflow: 'visible' }}
    >
      <defs>
        <style>{`
          @keyframes pulse-ring {
            0% { r: 14; opacity: 1; }
            100% { r: 22; opacity: 0; }
          }
          .step-pulse { animation: pulse-ring 1.2s ease-out infinite; }
        `}</style>
      </defs>

      {/* 連線 */}
      {steps.map((step, i) => {
        if (i === steps.length - 1) return null
        const x1 = i * nodeSpacing + nodeSpacing / 2 + r
        const x2 = (i + 1) * nodeSpacing + nodeSpacing / 2 - r
        const isDone = step.id < currentStep
        return (
          <line
            key={`line-${i}`}
            x1={x1}
            y1={cy}
            x2={x2}
            y2={cy}
            stroke={isDone ? '#1a56db' : '#cbd5e1'}
            strokeWidth={2}
          />
        )
      })}

      {/* 節點 */}
      {steps.map((step, i) => {
        const cx = i * nodeSpacing + nodeSpacing / 2
        const isDone = step.id < currentStep
        const isCurrent = step.id === currentStep
        const isUpcoming = step.id > currentStep

        return (
          <g key={step.id}>
            {/* pulse 圓（當前步驟） */}
            {isCurrent && (
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="#1a56db"
                strokeWidth={2}
                opacity={0.4}
                className="step-pulse"
              />
            )}
            {/* 主圓 */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={isDone ? '#1a56db' : isCurrent ? '#ffffff' : '#f1f5f9'}
              stroke={isUpcoming ? '#cbd5e1' : '#1a56db'}
              strokeWidth={isCurrent ? 2.5 : 2}
            />
            {/* 勾號（完成） */}
            {isDone && (
              <text x={cx} y={cy + 5} textAnchor="middle" fontSize={14} fill="#ffffff" fontWeight="bold">✓</text>
            )}
            {/* 步驟號碼（當前 & 未完成） */}
            {!isDone && (
              <text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                fontSize={12}
                fill={isCurrent ? '#1a56db' : '#94a3b8'}
                fontWeight={isCurrent ? 'bold' : 'normal'}
              >
                {step.id}
              </text>
            )}
            {/* 標籤文字 */}
            <text
              x={cx}
              y={cy + 28}
              textAnchor="middle"
              fontSize={11}
              fill={isUpcoming ? '#94a3b8' : '#334155'}
              fontWeight={isCurrent ? '600' : 'normal'}
            >
              {step.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
