@echo off
chcp 65001 >nul

echo ==================================
echo 正在上传到 GitHub...
echo ==================================
echo.

REM 配置 Git 用户信息
git config --global user.email "zoraiu@github.com"
git config --global user.name "zoraiu"

REM 初始化并添加文件
git init
git add -A
git commit -m "Initial commit - PixelBead AI Studio"

REM 设置远程仓库并推送
git remote add origin https://github.com/zoraiu/pixelbead-ai-studio.git
git branch -M main
git push -u origin main --force

echo.
echo ✓✓✓ 上传成功！✓✓✓
echo.
echo 仓库地址: https://github.com/zoraiu/pixelbead-ai-studio
echo.
echo ==================================
echo 下一步：部署到 Vercel
echo ==================================
echo.
echo 1. 访问: https://vercel.com
echo 2. 用 GitHub 账号登录
echo 3. 点击 "Add New Project"
echo 4. 导入仓库: zoraiu/pixelbead-ai-studio
echo 5. 添加环境变量:
echo    Name: VITE_GEMINI_API_KEY
echo    Value: 你的 Gemini API Key
echo 6. 点击 Deploy
echo.
echo 完成！
echo.
pause
