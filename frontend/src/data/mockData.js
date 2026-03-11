// 模擬資料 — 回測報告 Prototype
// 實際資料由後端 API 提供

// ===== 回測監控清單 =====
export const monitorList = [
  {
    id: 'bt-001',
    title: '自動交易DIF-MACD從負翻正',
    source: '自動交易',
    startTime: '2025/02/20 15:33:24',
    progress: 100,
    total: 1700,
    done: 1700,
    status: 'success', // success | running | paused | failed
  },
  {
    id: 'bt-002',
    title: 'KD低檔黃金交叉',
    source: '選股中心',
    startTime: '2025/02/20 15:33:24',
    progress: 20,
    total: 1700,
    done: 340,
    status: 'running',
  },
  {
    id: 'bt-003',
    title: 'MACD黃金交叉[台股]',
    source: '策略雷達',
    startTime: '2025/02/20 15:33:24',
    progress: 0.15,
    total: 1700,
    done: 1,
    status: 'paused',
  },
  {
    id: 'bt-004',
    title: 'RSI超賣反彈策略',
    source: '自動交易',
    startTime: '2025/02/16 15:33:24',
    progress: 0,
    total: 1700,
    done: 0,
    status: 'failed',
  },
]

// ===== 左側目錄資料夾結構 =====
export const folderTree = [
  {
    id: 'root',
    name: '我的回測報告',
    count: 4,
    expanded: true,
    children: [
      {
        id: 'folder-a',
        name: '專案A',
        count: 2,
        expanded: true,
        children: [
          { id: 'rep-1', name: '自動交易DIF-MACD從負翻正', type: 'report' },
          { id: 'rep-2', name: 'KD低檔黃金交叉', type: 'report' },
        ],
      },
      {
        id: 'folder-b',
        name: '專案B',
        count: 2,
        expanded: false,
        children: [
          { id: 'rep-3', name: 'MACD黃金交叉', type: 'report' },
          { id: 'rep-4', name: 'RSI超賣反彈策略', type: 'report' },
        ],
      },
    ],
  },
]

// ===== 回測報告主資料 =====
export const reportData = {
  id: 'rep-1',
  title: '自動交易DIF-MACD從負翻正回測報告',
  platform: '自動交易',
  dateRange: '2022/09/01 - 2023/02/28',
  successCount: 1513,
  failCount: 201,
  tradeQty: '等額',
  returnAlgo: '時間加權',
  direction: '多',

  // 置頂關鍵指標
  keyMetrics: {
    returnRate: '1000%',
    netProfit: '$188,188,188',
    winRate: '66%',
    winCount: 1266,
    lossCount: 1000,
    maxDrawdown: '-60%',
    mddRange: '2025/04/07 - 2025/04/23',
    tradeCount: 1235,
    avgTrade: 1000,
  },

  // 次要統計
  secondaryMetrics: [
    { label: '獲利因子', value: '-0.24' },
    { label: '續交易天數', value: '904' },
    { label: '最大單日獲利', value: '205' },
    { label: '虧損交易天數', value: '698' },
    { label: '毛利', value: '18.69%' },
    { label: '毛損', value: '-76.90%' },
    { label: '最大單日虧損', value: '1.34%' },
    { label: '最大單日虧損', value: '-1.19%' },
  ],

  // 右側欄位統計（整體統計頁）
  statsPanel: {
    利潤統計: [
      { label: '平均年化報酬率', pct: '16.25%', amt: '$10,345,322' },
      { label: '複利年化報酬率', pct: '16.25%', amt: '$10,345,322' },
      { label: '毛利', pct: '16.25%', amt: '$10,345,322' },
      { label: '毛損', pct: '-16.25%', amt: '-$1,345,322' },
      { label: '買進持有報酬率', pct: '18.25%', amt: '-$5,345,322' },
      { label: '大盤指數報酬率', pct: '18.25%', amt: '-$5,345,322' },
    ],
    績效指標: [
      { label: '夏普比率', value: '2.23' },
      { label: '索提諾比率', value: '0.93' },
      { label: '風報比', value: '-0.16' },
      { label: '獲利因子', value: '1.13' },
      { label: '超額報酬', value: '20.25%' },
      { label: 'Beta', value: '4.25' },
      { label: '標準差', value: '2.43' },
    ],
    最大統計: [
      { label: '最大投入金額', value: '$16,345,322' },
      { label: '最大區間獲利', pct: '16.25%', amt: '$20,345,322' },
      { label: '最大獲利交易', pct: '16.25%', amt: '$10,345,322' },
      { label: '最大虧損交易', pct: '-18.25%', amt: '$15,345,322' },
    ],
  },

  // 每日報表
  dailyReport: [
    { date: '2024-11-13', returnPct: '20.21%', returnAmt: '$12,235', dailyPct: '4.21%', dailyAmt: '$12,235', drawbackPct: '-14.21%', drawbackAmt: '-$12,235', mddPct: '-92.21%', mddAmt: '-$787,777', investAmt: '$12,318', maxInvestAmt: '$3,324,432', tradeCnt: 34 },
    { date: '2024-11-12', returnPct: '19.21%', returnAmt: '$11,235', dailyPct: '2.21%', dailyAmt: '$11,235', drawbackPct: '-2.21%', drawbackAmt: '-$2,235', mddPct: '-84.21%', mddAmt: '-$650,000', investAmt: '$21,326', maxInvestAmt: '$3,324,432', tradeCnt: 22 },
    { date: '2024-11-11', returnPct: '18.10%', returnAmt: '$10,520', dailyPct: '1.80%', dailyAmt: '$10,520', drawbackPct: '-1.20%', drawbackAmt: '-$1,100', mddPct: '-80.10%', mddAmt: '-$620,000', investAmt: '$18,500', maxInvestAmt: '$3,324,432', tradeCnt: 18 },
    { date: '2024-11-10', returnPct: '17.20%', returnAmt: '$9,800', dailyPct: '3.10%', dailyAmt: '$9,800', drawbackPct: '-3.50%', drawbackAmt: '-$3,200', mddPct: '-76.50%', mddAmt: '-$580,000', investAmt: '$16,200', maxInvestAmt: '$3,324,432', tradeCnt: 27 },
    { date: '2024-11-09', returnPct: '15.80%', returnAmt: '$8,900', dailyPct: '-0.40%', dailyAmt: '-$400', drawbackPct: '-0.50%', drawbackAmt: '-$500', mddPct: '-72.30%', mddAmt: '-$550,000', investAmt: '$14,800', maxInvestAmt: '$3,250,000', tradeCnt: 15 },
  ],
}

// ===== 商品統計資料 =====
export const productStats = [
  { code: '2330', name: '台積電', netProfitPct: '15.20%', netProfitAmt: '$234,567', grossProfit: '20.50%', profitFactor: 2.31, maxInvest: '$1,234,567', holdCnt: 8931, tradeCnt: 45 },
  { code: '2317', name: '鴻海', netProfitPct: '8.40%', netProfitAmt: '$124,234', grossProfit: '12.30%', profitFactor: 1.75, maxInvest: '$1,234,567', holdCnt: 5831, tradeCnt: 32 },
  { code: '2454', name: '聯發科', netProfitPct: '-3.20%', netProfitAmt: '-$48,234', grossProfit: '5.60%', profitFactor: 0.68, maxInvest: '$1,234,567', holdCnt: 3421, tradeCnt: 21 },
  { code: '2412', name: '中華電', netProfitPct: '4.50%', netProfitAmt: '$67,890', grossProfit: '8.20%', profitFactor: 1.23, maxInvest: '$1,234,567', holdCnt: 4567, tradeCnt: 18 },
  { code: '3045', name: '台灣大', netProfitPct: '6.70%', netProfitAmt: '$98,765', grossProfit: '9.80%', profitFactor: 1.54, maxInvest: '$1,234,567', holdCnt: 6234, tradeCnt: 28 },
  { code: '2393', name: '億光', netProfitPct: '2.30%', netProfitAmt: '$34,560', grossProfit: '6.10%', profitFactor: 1.08, maxInvest: '$1,234,567', holdCnt: 2890, tradeCnt: 14 },
  { code: '4904', name: '遠傳', netProfitPct: '-1.80%', netProfitAmt: '-$27,000', grossProfit: '3.40%', profitFactor: 0.85, maxInvest: '$1,234,567', holdCnt: 2345, tradeCnt: 11 },
  { code: '3029', name: '零壹', netProfitPct: '5.10%', netProfitAmt: '$76,500', grossProfit: '7.30%', profitFactor: 1.38, maxInvest: '$1,234,567', holdCnt: 3678, tradeCnt: 20 },
]

// ===== 週期分析資料 =====
export const periodData = {
  // 日頻率：1日~31日
  byDay: Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}日`,
    value: (Math.random() - 0.4) * 60,
    isProfit: Math.random() > 0.4,
  })),
  // 月頻率：1月~12月
  byMonth: Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    value: (Math.random() - 0.4) * 40,
    isProfit: Math.random() > 0.45,
  })),
  // 月報酬熱力圖 (簡化：2022~2024)
  heatmap: [
    { year: 2022, months: [0, 0, 0, 0, 0, 0, 0, 0, 0, -5.9, -13.1, -3.7] },
    { year: 2023, months: [-11.5, 11.1, 2.8, 5.0, -3.1, -15.0, -10.0, -5.7, -14.1, 1.8, 4.8, -7.4] },
    { year: 2024, months: [-7.3, 2.3, 20.2, 13.8, 16.3, -7.6, 14.5, -2.9, 12.4, 10.9, 6.2, 16.4] },
  ],
}
