你的任務是執行 Git 版控流程。請嚴格遵守以下 SOP：

1. **檢查變更**：
   - 執行 `git status` 查看所有變更的檔案
   - 執行 `git diff` 查看具體的內容差異
   - 分析變更的性質（新功能、文件更新、Bug 修正、重構等）

2. **生成 Commit Message**：
   根據 Conventional Commits 規範，自動生成精準的 Commit Message：
   - `feat:` — 新功能
   - `fix:` — Bug 修正
   - `docs:` — 文件更新（PRD、Spec、README 等）
   - `refactor:` — 程式碼重構（不影響功能）
   - `style:` — 樣式調整（CSS、排版）
   - `chore:` — 維護性工作（設定檔、腳本等）

   格式範例：
   - `docs: 更新個股新聞 Spec v6 延伸新聞內容格式`
   - `feat: 新增今日焦點手風琴展開功能`
   - `chore: 建立 memory/ 認知大腦架構`

3. **暫存並提交**：
   - 執行 `git add .`（若有特定檔案需排除，請先告知）
   - 執行 `git commit -m "<生成的 Commit Message>"`

4. **回報結果**：
   - 向我回報 Commit 的 hash、Message 與異動檔案清單

**重要限制**：
- **絕對不執行 `git push`**，推送由使用者手動完成
- 提交前確認 `.env`、`venv/`、`node_modules/` 均已在 `.gitignore` 中
- 若有不確定是否應提交的檔案，先列出並詢問使用者
- Commit Message 必須極度乾淨。絕對不允許在結尾加入 `Co-Authored-By`、`Signed-off-by` 或任何提及 Claude、AI 的簽名與後綴。必須維持看起來是 100% 由單一真人開發者提交的狀態。
- 若新增的內容涵蓋多個面向，可適當拆分多個 commit
