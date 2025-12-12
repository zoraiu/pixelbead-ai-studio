@echo off
chcp 65001 >nul

echo ==================================
echo 正在准备上传到 GitHub...
echo ==================================
echo.

REM 初始化 Git（如果需要）
if not exist ".git" (
    echo 初始化 Git 仓库...
    git init
    echo.
)

REM 添加所有文件
echo 添加文件...
git add .

REM 提交
echo 提交更改...
git commit -m "Initial commit - PixelBead AI Studio"

echo.
echo ==================================
echo 接下来需要你的 GitHub 仓库 URL
echo ==================================
echo.
echo 请按以下步骤操作：
echo.
echo 1. 访问: https://github.com/new
echo 2. 仓库名填写: pixelbead-ai-studio
echo 3. 选择 Public (公开)
echo 4. 不要勾选任何初始化选项
echo 5. 点击 Create repository
echo 6. 复制页面上的仓库 URL
echo.
set /p repoUrl="请粘贴 GitHub 仓库 URL 后按回车: "

if "%repoUrl%"=="" (
    echo 未输入 URL，退出
    pause
    exit /b 1
)

echo.
echo 正在设置远程仓库...
git remote add origin %repoUrl% 2>nul
if errorlevel 1 (
    git remote set-url origin %repoUrl%
)

echo 正在推送到 GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ✓ 成功上传到 GitHub!
echo.
echo ==================================
echo 下一步：部署到 Vercel
echo ==================================
echo.
echo 1. 访问: https://vercel.com
echo 2. 用 GitHub 账号登录
echo 3. 点击 "Add New Project"
echo 4. 选择刚才的仓库: pixelbead-ai-studio
echo 5. 添加环境变量:
echo    Name: VITE_GEMINI_API_KEY
echo    Value: 你的 Gemini API Key
echo 6. 点击 Deploy
echo.
echo ✓ 完成！
echo.
pause
