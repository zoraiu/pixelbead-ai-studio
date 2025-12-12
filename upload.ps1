Write-Host "===================================" -ForegroundColor Cyan
Write-Host "正在上传到 GitHub..." -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# 配置 Git
git config --global user.email "zoraiu@github.com"
git config --global user.name "zoraiu"

# 添加并提交
git add -A
git commit -m "Initial commit - PixelBead AI Studio"

# 推送到 GitHub
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓✓✓ 上传成功！✓✓✓" -ForegroundColor Green
    Write-Host ""
    Write-Host "仓库地址: https://github.com/zoraiu/pixelbead-ai-studio" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "===================================" -ForegroundColor Cyan
    Write-Host "下一步：部署到 Vercel" -ForegroundColor Cyan
    Write-Host "===================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. 访问: https://vercel.com" -ForegroundColor White
    Write-Host "2. 用 GitHub 账号登录" -ForegroundColor White
    Write-Host "3. 点击 'Add New Project'" -ForegroundColor White
    Write-Host "4. 导入仓库: zoraiu/pixelbead-ai-studio" -ForegroundColor White
    Write-Host "5. 添加环境变量:" -ForegroundColor White
    Write-Host "   Name: VITE_GEMINI_API_KEY" -ForegroundColor Yellow
    Write-Host "   Value: 你的 Gemini API Key" -ForegroundColor Yellow
    Write-Host "6. 点击 Deploy" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "推送失败，请检查网络或 GitHub 仓库是否已创建" -ForegroundColor Red
}
