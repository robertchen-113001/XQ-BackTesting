// PRD 04 — 回測設定 共用常數定義

export const PLATFORMS = ['選股中心', '策略雷達', '自動交易']

export const VOLUME_TYPES = {
  '選股中心': ['等額', '等量', '等比'],
  '策略雷達': ['等額', '等量', '等比'],
  '自動交易': ['等額', '等量', '等比', '腳本'],
}

export const VOLUME_LABELS = {
  '等額': '10 萬元',
  '等量': '1 張',
}

export const RETURN_ALGORITHMS = [
  '時間加權報酬率',
  '最大投入報酬率',
  '金額加權報酬率',
]

export const ENTRY_ORDER_TYPES = {
  '選股中心': {
    options: ['股號', '成交量', '市值', '股本', '自訂'],
    default: '股號',
  },
  '策略雷達': {
    options: ['時間', '股號', '成交量', '市值', '股本', '自訂'],
    default: '時間',
  },
  '自動交易': {
    options: ['時間', '股號', '成交量', '市值', '股本', '自訂'],
    default: '時間',
  },
}

export const FREQUENCY_OPTIONS = {
  '選股中心': ['日', '週', '月'],
  '策略雷達': ['日', '60分鐘', '30分鐘', '15分鐘', '5分鐘', '1分鐘'],
  '自動交易': ['1分鐘', '5分鐘', '15分鐘', '30分鐘', '60分鐘', '日'],
}

export const DEFAULT_FREQUENCY = {
  '選股中心': '日',
  '策略雷達': '日',
  '自動交易': '1分鐘',
}

export const BENCHMARK_INDICES = [
  '加權指數',
  '櫃買指數',
  '標普500',
  '納斯達克',
  '費城半導體',
  '道瓊工業',
  '日經225',
  '恆生指數',
  '滬深300',
  '韓國綜合',
]

export const OVERLAY_OPTIONS = [
  '不疊加',
  '基準指標',
  '投組買進持有報酬率',
  '任意標的',
]

// 系統參數預設值（三平台各自獨立）
export const DEFAULT_SYSTEM_PARAMS = {
  volumeType: '等量',
  returnAlgorithm: '時間加權報酬率',
  benchmarkIndex: '加權指數',
  overlayIndex1: '不疊加',
  overlayIndex2: '不疊加',
}

// 對話框預設值（含平台差異）
export function buildDialogDefaults(platform) {
  return {
    // 基本執行設定
    frequency: DEFAULT_FREQUENCY[platform],
    priceType: '原始值',
    startDate: '2025/12/31',
    endDate: '2026/03/31',
    // 選股中心專屬
    tradeDirection: '作多',
    market: '台股',
    universe: '普通股全部(系統)',
    // 策略雷達 / 自動交易
    targetSymbol: '',
    usMarketAll: false,
    // 自動交易專屬
    simTick: false,
    dailyReset: false,
    preRunBars: 200,
    // 交易設定
    enableMaxConcurrent: true,
    maxConcurrentTrades: 10,
    volumeType: '等量',
    returnAlgorithm: '時間加權報酬率',
    entryOrderType: ENTRY_ORDER_TYPES[platform].default,
    // 交易成本
    stockFeeRate: 0.1425,
    stockTaxRate: 0.3,
    futuresFee: 100,
    futuresTaxRate: 0.3,
    // 槓桿
    enableFuturesMargin: true,
    futuresMarginRate: 13.5,
    stockFinancingRate: 60,
    stockMarginRate: 90,
    // 系統設定
    enablePrint: false,
    // 進場設定（選股中心）
    enableEntryCondition: true,
    entryConditionName: '01. 三次到頂而破',
    entryDataCount: 10,
    enableMaxEntryCount: false,
    maxEntryCount: 1,
    entryPriceType: '下期開盤價',
    // 進場設定（策略雷達）
    enableEntryScript: true,
    entryScriptName: '大跌後的低檔五連陽',
    enableEntryDataCount: true,
    entryDataCountRadar: 200,
    simEntryTick: false,
    // 出場設定（共用）
    enableExitStrategy: false,
    exitStrategyName: '',
    enableExitScript: false,
    exitScriptName: '',
    enableExitDataCount: false,
    exitDataCount: 200,
    simExitTick: false,
    enableTakeProfit: false,
    tpStockValue: 8,
    tpStockUnit: '%',
    tpFutureValue: 50,
    tpFutureUnit: '點',
    enableStopLoss: false,
    slStockValue: 8,
    slStockUnit: '%',
    slFutureValue: 50,
    slFutureUnit: '點',
    enableMaxHoldTime: false,
    maxHoldTime: 20,
    exitPriceType: '下期開盤價',
    // 自動交易：交易腳本
    scriptName: '02-時間權重交易(TWAP)',
    // 自動交易：策略安全設定
    enableMaxPosition: true,
    maxPosition: 1,
    enableMaxDailyEntry: true,
    maxDailyEntry: 1,
    enableMaxTradePerMin: true,
    maxTradePerMin: 6,
    // 自動交易：預設委託
    defaultBuyBase: '觸發價',
    defaultBuyOffset: 1,
    defaultSellBase: '觸發價',
    defaultSellOffset: 1,
    directSubmit: false,
    // 自動交易：洗價觸發
    immediateFill: false,
  }
}

export const TP_SL_UNITS_STOCK = ['%', '元', '檔']
export const TP_SL_UNITS_FUTURE = ['點', '%', '元']
export const PRICE_BASE_OPTIONS = ['觸發價', '市價', '限價']
export const MARKET_OPTIONS = ['台股', '美股', '港股', '日股', '韓股']
export const UNIVERSE_OPTIONS = ['普通股全部(系統)', 'ETF全部(系統)', '上市普通股', '上櫃普通股', '自訂清單']
