#!/usr/bin/env python3
"""
memory_sync.py — AI 大腦同步腳本
將 memory/stm.md 的短期記憶萃取精華後，追加至 memory/ltm.md，並清空 stm.md。

使用方式：
    python scripts/memory_sync.py

需求：
    - Claude CLI 已安裝並可在終端機執行（`claude -p "..."` 可用）
    - 在專案根目錄下執行此腳本
"""

import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

STM_PATH = Path("memory/stm.md")
LTM_PATH = Path("memory/ltm.md")
APPEND_MARKER = "<!-- memory_sync.py 追加區域（勿手動修改以下內容）-->"

EXTRACT_PROMPT = """你是一個專業的知識萃取助理。以下是今日工作階段的短期記憶紀錄（STM）。
請從中萃取出具有長期參考價值的決策、架構選擇、重要發現或已解決的問題。
輸出格式：
- 每條萃取結果以 Markdown bullet point 呈現
- 只保留有實質意義的內容，過濾掉臨時性、已過期或無關緊要的資訊
- 使用繁體中文（台灣用語）
- 輸出純文字，不要加入多餘的說明

STM 內容如下：
---
{stm_content}
---

請直接輸出萃取結果（無需前言）："""


def read_stm() -> str:
    """讀取 STM 內容，過濾掉空白與注解。"""
    if not STM_PATH.exists():
        print(f"[ERROR] {STM_PATH} 不存在。請確認路徑正確。")
        sys.exit(1)

    content = STM_PATH.read_text(encoding="utf-8").strip()
    # 過濾掉 HTML 注解與空行
    lines = [
        line for line in content.splitlines()
        if line.strip() and not line.strip().startswith("<!--") and not line.strip().startswith("#")
    ]
    return "\n".join(lines)


def extract_insights(stm_content: str) -> str:
    """呼叫 Claude CLI 進行決策與經驗萃取。"""
    prompt = EXTRACT_PROMPT.format(stm_content=stm_content)

    print("[INFO] 正在呼叫 Claude CLI 進行內容萃取...")
    # 移除 CLAUDECODE 環境變數，避免在 Claude Code 工作階段內觸發巢狀啟動限制
    env = os.environ.copy()
    env.pop("CLAUDECODE", None)
    try:
        result = subprocess.run(
            ["claude", "-p", prompt],
            capture_output=True,
            text=True,
            timeout=120,
            encoding="utf-8",
            env=env,
        )
        if result.returncode != 0:
            print(f"[ERROR] Claude CLI 執行失敗：\n{result.stderr}")
            sys.exit(1)
        return result.stdout.strip()
    except FileNotFoundError:
        print("[ERROR] 找不到 `claude` 指令。請確認 Claude CLI 已安裝並在 PATH 中。")
        sys.exit(1)
    except subprocess.TimeoutExpired:
        print("[ERROR] Claude CLI 執行逾時（120 秒）。")
        sys.exit(1)


def append_to_ltm(insights: str) -> None:
    """將萃取結果以時間戳記追加至 ltm.md。"""
    if not LTM_PATH.exists():
        print(f"[ERROR] {LTM_PATH} 不存在。請先建立此檔案。")
        sys.exit(1)

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    entry = f"\n### [{timestamp}] memory_sync 自動萃取\n\n{insights}\n"

    ltm_content = LTM_PATH.read_text(encoding="utf-8")

    if APPEND_MARKER in ltm_content:
        # 在標記之後插入
        updated = ltm_content.replace(APPEND_MARKER, APPEND_MARKER + entry)
    else:
        # 標記不存在，直接追加至結尾
        updated = ltm_content + f"\n{APPEND_MARKER}{entry}"

    LTM_PATH.write_text(updated, encoding="utf-8")
    print(f"[OK] 已成功追加至 {LTM_PATH}（時間戳記：{timestamp}）")


def clear_stm() -> None:
    """清空 stm.md，保留標頭。"""
    STM_PATH.write_text(
        "# 短期記憶與報錯紀錄\n\n"
        "> 此檔案為每日工作的暫存區。執行 `/memory-sync` 後，內容將由 Python 腳本自動萃取並追加至 `ltm.md`，並在成功後自動清空本檔。\n\n---\n\n"
        "<!-- 在此記錄本次工作階段的重要決策、報錯、待追蹤事項 -->\n",
        encoding="utf-8",
    )
    print(f"[OK] {STM_PATH} 已清空。")


def main():
    print("=== memory_sync.py 開始執行 ===")

    # 步驟 1：讀取 STM
    stm_content = read_stm()
    if not stm_content:
        print("[INFO] STM 為空，無需萃取。直接退出。")
        sys.exit(0)

    print(f"[INFO] 讀取到 {len(stm_content)} 個字元的 STM 內容。")

    # 步驟 2：呼叫 Claude CLI 萃取
    insights = extract_insights(stm_content)
    if not insights:
        print("[WARN] Claude CLI 回傳空結果，不寫入 LTM。")
        sys.exit(1)

    print(f"[INFO] 萃取完成，共 {len(insights)} 個字元。")

    # 步驟 3：追加至 LTM
    append_to_ltm(insights)

    # 步驟 4：清空 STM
    clear_stm()

    print("=== memory_sync.py 執行完成 ===")


if __name__ == "__main__":
    main()
