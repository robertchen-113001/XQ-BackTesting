import os
import sys
import shutil
import subprocess
import re
from pathlib import Path

def convert_pdf(pdf_filename):
    # 1. 定義你專屬的完美路徑架構
    base_dir = Path.cwd()
    pdf_source_dir = base_dir / "docs/reference/pdf"
    output_base_dir = base_dir / "docs/reference/pdf-convert"
    
    # 支援直接打檔名 (自動去 pdf 資料夾找)
    pdf_path = Path(pdf_filename)
    if not pdf_path.is_absolute():
        pdf_path = pdf_source_dir / pdf_path.name
        
    if not pdf_path.exists():
        print(f"❌ 找不到 PDF 檔案：{pdf_path}")
        print(f"💡 請確保檔案放在 {pdf_source_dir} 底下")
        sys.exit(1)

    pdf_name = pdf_path.stem  # 取得 xxx (不含副檔名)
    print(f"🚀 開始處理：{pdf_name}.pdf")

    # 2. 建立隱藏暫存區 (讓固執的 Marker 有地方發揮)
    temp_dir = output_base_dir / f"temp_{pdf_name}"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    # 你期望的最終路徑
    final_md_path = output_base_dir / f"{pdf_name}.md"
    final_img_dir = output_base_dir / f"{pdf_name}_png"

    # 3. 呼叫 Marker 執行轉換
    print("⏳ AI 模型正在解析排版與圖片，這可能需要一到兩分鐘...")
    
    # 🌟 修正點 1：加上 --output_dir 標籤，符合最新版 Marker 語法
    command = [
        "marker_single",
        str(pdf_path),
        "--output_dir", str(temp_dir),
        "--output_format", "markdown"
    ]

    try:
        subprocess.run(command, check=True, text=True)
        
        # 4. 開始施展 Python 魔法：動態尋找檔案與搬移
        print("🪄 正在重新組織資料夾與圖片連結...")
        
        # 🌟 修正點 2：不管 Marker 把檔案塞在哪層，直接用 rglob 遞迴尋找 Markdown 檔
        md_files = list(temp_dir.rglob("*.md"))
        if not md_files:
            print("❌ 轉換失敗：找不到生成的 Markdown 檔案。")
            sys.exit(1)
            
        marker_md_path = md_files[0]
        marker_out_dir = marker_md_path.parent
        
        # 建立專屬圖片資料夾
        final_img_dir.mkdir(parents=True, exist_ok=True)
        
        # 讀取原本的 Markdown 內容
        md_content = marker_md_path.read_text(encoding='utf-8')
        
        # 找出所有圖片 (包含 PNG 或 JPG)
        for img_file in marker_out_dir.rglob("*.*"):
            if img_file.suffix.lower() in ['.png', '.jpg', '.jpeg']:
                # 搬移圖片到 xxx_png/
                shutil.move(str(img_file), str(final_img_dir / img_file.name))
                
                # 自動把 Markdown 裡面的圖片連結改成你的新路徑
                # 使用 Regex 替換，不管原本是 ](image.png) 還是 ](folder/image.png)，通通精準替換
                safe_img_name = re.escape(img_file.name)
                md_content = re.sub(rf"\]\([^\)]*{safe_img_name}\)", f"]({pdf_name}_png/{img_file.name})", md_content)

        # 把修改好的 Markdown 寫到最終位置
        final_md_path.write_text(md_content, encoding='utf-8')
        
        # 5. 銷毀證據 (刪除暫存區)
        shutil.rmtree(temp_dir)
        
        print("\n✅ 轉換與歸檔完美達成！")
        print(f"📄 Markdown: docs/reference/pdf-convert/{pdf_name}.md")
        print(f"🖼️ 圖片資料夾: docs/reference/pdf-convert/{pdf_name}_png/")
        
    except subprocess.CalledProcessError as e:
        print("\n❌ 轉換失敗，Marker 錯誤訊息：")
        print(e.stderr)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("💡 用法: python scripts/convert_pdf.py <PDF檔名>")
        sys.exit(1)
    
    convert_pdf(sys.argv[1])