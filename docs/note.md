

# 優化方向
* 給予「接續回測」的流程
# 參考文件
* UI部份：https://docs.google.com/document/d/1eB_L-6F33nTh0kFcVT-O5G6Pl4rAhrnMHDoSECGtT0E/edit?tab=t.0#bookmark=id.8wpp4nq9khsh
* 核心計算參考：https://docs.google.com/document/d/1uwWhphWQWR1WXrZgx7l35PQQUBBhwJCNwIETsw2shU4/edit?tab=t.0#heading=h.s663na61f6yx


# 目前有這幾個
1. retry(接續執行), 實作難度較高
2. 排程回測給予較長的timeout時間限制
3. 依vip level給予不同timeout時間限制
4. 揭示timeout可能原因的數據: 交易日數/bar數 跑bar完成度 getfield次數 bb不夠retry次數


* 記住回測Timeout原因
* 進入接續模式時，依據上次Timeout原因，給予合適的處理時間和資源
* 如果又再Timeout，在繼續放寬
* (以提供User跑完為主要目標)


# 提供「回測執行失敗」商品，接續回測的入口
在retry時，增加處理時間及資源
尖峰時間，依據bar數、計算次數，給出timeout的合理值(也是給予資源時的依據)


# 先討論「根本解法」這個章節
* 商品預估值
* 整體策略預估值

# 先確認規格，找時間討論細節部分
