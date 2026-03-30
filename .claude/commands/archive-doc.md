# archive-doc

將 `docs/` 下指定文件封存至 `archive/docs/`，並自動更新 `docs/MANIFEST.md`。

## 用法

```
/archive-doc <來源路徑> <封存理由>
```

**參數說明**：
- `<來源路徑>`：相對於專案根目錄的文件路徑（例如 `docs/report.md`）
- `<封存理由>`：記錄於 MANIFEST.md 的封存原因（例如「已被 stock-news-spec 取代」）

## 執行步驟

1. **確認來源檔案存在**：確認 `<來源路徑>` 存在，若不存在則中止並回報錯誤。

2. **決定封存目標路徑**：
   - 將來源路徑的 `docs/` 前綴替換為 `archive/docs/`
   - 例：`docs/report.md` → `archive/docs/report.md`
   - 若為子目錄（例 `docs/prd/xxx.md`），則封存至 `archive/docs/prd/xxx.md`
   - 若目標目錄不存在，先以 `mkdir -p` 建立

3. **搬移檔案**：使用 Bash 工具執行 `cp <來源> <目標> && rm <來源>`

4. **更新 MANIFEST.md**：
   - 開啟 `docs/MANIFEST.md`
   - 在「### Docs（`archive/docs/`）」段落的表格最末列新增一行：
     ```
     | `{封存後的相對路徑}` | {封存理由} |
     ```
   - 若來源路徑在「Deprecated（待歸檔）」段落中有記錄，同步移除該行

5. **回報結果**：條列說明「封存路徑」與「MANIFEST.md 更新內容」

## 注意事項

- 只封存文件類檔案（`.md`、`.txt` 等），不適用於 scripts 或前端原始碼
- 封存後原始路徑即失效，請確認已無其他文件引用該路徑
- 若 MANIFEST.md 尚無「Archive → Docs」段落，需先新增再插入紀錄
