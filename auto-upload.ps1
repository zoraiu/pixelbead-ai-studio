# 自动上传脚本
$ErrorActionPreference = "Continue"

"====================================" | Tee-Object -FilePath "upload-log.txt"
"开始上传到 GitHub" | Tee-Object -FilePath "upload-log.txt" -Append
"====================================" | Tee-Object -FilePath "upload-log.txt" -Append
"" | Tee-Object -FilePath "upload-log.txt" -Append

# 步骤 1: 配置 Git
"步骤 1: 配置 Git 用户" | Tee-Object -FilePath "upload-log.txt" -Append
git config --global user.email "zoraiu@github.com" 2>&1 | Tee-Object -FilePath "upload-log.txt" -Append
git config --global user.name "zoraiu" 2>&1 | Tee-Object -FilePath "upload-log.txt" -Append

# 步骤 2: 添加文件
"步骤 2: 添加所有文件" | Tee-Object -FilePath "upload-log.txt" -Append
git add -A 2>&1 | Tee-Object -FilePath "upload-log.txt" -Append

# 步骤 3: 提交
"步骤 3: 提交更改" | Tee-Object -FilePath "upload-log.txt" -Append  
git commit -m "Initial commit - PixelBead AI Studio" 2>&1 | Tee-Object -FilePath "upload-log.txt" -Append

# 步骤 4: 推送
"步骤 4: 推送到 GitHub" | Tee-Object -FilePath "upload-log.txt" -Append
git push -u origin main 2>&1 | Tee-Object -FilePath "upload-log.txt" -Append

"" | Tee-Object -FilePath "upload-log.txt" -Append
"完成！查看 upload-log.txt 了解详情" | Tee-Object -FilePath "upload-log.txt" -Append
"" | Tee-Object -FilePath "upload-log.txt" -Append
"仓库地址: https://github.com/zoraiu/pixelbead-ai-studio" | Tee-Object -FilePath "upload-log.txt" -Append
""  | Tee-Object -FilePath "upload-log.txt" -Append
"下一步: 访问 https://vercel.com 部署" | Tee-Object -FilePath "upload-log.txt" -Append

Read-Host "按回车键退出"
