@echo off
echo 正在上传到 GitHub...
git add .
git commit -m "Fix: 统一环境变量为 VITE_GEMINI_API_KEY"
git remote set-url origin https://github.com/zoraiu/pixelbead-ai-studio.git 2>nul
git push -u origin main --force
echo.
echo 上传完成！
echo 仓库地址: https://github.com/zoraiu/pixelbead-ai-studio
echo.
echo 下一步: 访问 https://vercel.com 部署
echo 环境变量名: VITE_GEMINI_API_KEY
pause
