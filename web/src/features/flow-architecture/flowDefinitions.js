// 各流程步驟定義（純資料層）
export const FLOW_STEPS = {
  flow1: [
    { id: 1, label: 'AP觸發', description: '使用者在 XQ（AP）中觸發回測，AP 送出回測請求至 Server。', actionLabel: '觸發回測' },
    { id: 2, label: 'Server回傳ID', description: 'Server 接收請求後，回傳回測 ID 給 AP。', actionLabel: null },
    { id: 3, label: '開啟WebUI', description: 'AP 以帶有回測 ID 的 URL 參數開啟 Web UI。', actionLabel: null },
    { id: 4, label: 'Sinker通訊', description: 'Web UI 透過 Sinker 將回測 ID 回傳給 AP，建立雙向連線。', actionLabel: null },
    { id: 5, label: '顯示報告', description: 'Server 推送回測進度與結果，Web UI 顯示完整回測報告。', actionLabel: null },
  ],
  flow2: [
    { id: 1, label: '偵測逾期', description: 'Server 紀錄逾期，系統偵測到 session 逾期事件。', actionLabel: '模擬逾期' },
    { id: 2, label: '顯示錯誤橫幅', description: 'Web UI 顯示錯誤橫幅，關閉 UI，錯誤訊息顯示於 XQ。', actionLabel: null },
    { id: 3, label: '情境分岔 A/B', description: '情境 A：XQ 有 ID → 將資料送回 Server 繼續處理。情境 B：XQ 無 ID → 重新開始回測。', actionLabel: null },
  ],
  flow3: [
    { id: 1, label: '點選重新回測', description: '使用者點選「重新回測」按鈕，Web UI 準備傳送回測 ID。', actionLabel: '點選重新回測' },
    { id: 2, label: '傳ID給XQ', description: 'Web UI 透過 Sinker 將目前的回測 ID 傳給 XQ，XQ 帶出對應回測參數。', actionLabel: null },
    { id: 3, label: '新Tab開啟', description: '進入一般回測流程，新的回測報告在新 Tab 開啟；舊 UI 保留不關閉。', actionLabel: null },
  ],
  flow4: [
    { id: 1, label: '查看失敗商品', description: '使用者查看 timeout 的失敗商品清單（無法勾選特定商品）。', actionLabel: '查看清單' },
    { id: 2, label: '送出Retry', description: 'Web UI 僅送回測 ID 給 XQ（不帶商品清單），Web UI 暫時關閉。', actionLabel: '送出 Retry' },
    { id: 3, label: '重新回測', description: 'XQ 對所有 timeout 商品重新回測，Server merge 回測結果。', actionLabel: null },
    { id: 4, label: '顯示完整報告', description: 'Server 完成 merge 後，重新喚醒 Web UI 顯示完整回測報告。', actionLabel: null },
  ],
  flow5: [
    { id: 1, label: '點選匯出', description: '使用者點選工具列的「匯出」按鈕，開啟格式選單。', actionLabel: '點選匯出' },
    { id: 2, label: '選擇格式', description: '從下拉選單選擇匯出格式：.BTReportNew / .xlsx / .csv。', actionLabel: null },
    { id: 3, label: '下載', description: '系統呼叫後端匯出 API，取得 Blob 後觸發瀏覽器下載。', actionLabel: null },
  ],
  flow6: [
    { id: 1, label: '選擇類型', description: '使用者選擇手動匯入類型：.BTReportNew 或 .csv 交易紀錄。', actionLabel: '開啟匯入' },
    { id: 2, label: '上傳檔案', description: '透過拖放或點擊選取檔案，支援 .BTReportNew 與 .csv 格式。', actionLabel: null },
    { id: 3, label: '格式驗證', description: '.csv 需驗證欄位格式；.BTReportNew 直接開啟。csv 錯誤時顯示錯誤訊息。', actionLabel: null },
    { id: 4, label: '開啟報告', description: '驗證通過後執行報表統計，開啟回測報告。', actionLabel: null },
  ],
  flow7: [
    { id: 1, label: '勾選商品', description: '使用者在商品統計表中勾選欲篩選的特定商品。', actionLabel: '勾選商品' },
    { id: 2, label: '點選重新統計', description: '勾選後出現「重新統計」按鈕，點擊後觸發篩選。', actionLabel: null },
    { id: 3, label: '重新計算', description: '系統篩選對應商品的交易紀錄，重新計算回測統計數據。', actionLabel: null },
    { id: 4, label: '新Tab開啟', description: '計算完成後，在新 Tab 彈出新的回測報告。', actionLabel: null },
  ],
}
