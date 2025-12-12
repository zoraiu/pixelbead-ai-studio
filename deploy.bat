@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==================================
echo PixelBead AI Studio 一键部署工具
echo ==================================
echo.

REM 检查 Git 是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到 Git，请先安装 Git:
    echo    下载地址: https://git-scm.com/download/win
    echo.
    echo 安装完成后请重启终端再运行此脚本。
    pause
    exit /b 1
)

echo ✓ Git 已安装
echo.

REM 初始化 Git 仓库（如果需要）
if not exist ".git" (
    echo 初始化 Git 仓库...
    git init
    echo ✓ Git 仓库初始化完成
    echo.
)

REM 检查是否设置了远程仓库
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  尚未设置 GitHub 远程仓库
    echo.
    echo 请按以下步骤操作:
    echo 1. 前往 GitHub 创建新仓库: https://github.com/new
    echo    - 仓库名建议: pixelbead-ai-studio
    echo    - 设置为 Public（公开）以便 Vercel 访问
    echo    - 不要初始化 README、.gitignore 或 license
    echo.
    echo 2. 创建完成后，输入仓库 URL（例如: https://github.com/username/pixelbead-ai-studio.git）
    echo.
    set /p repoUrl="请输入 GitHub 仓库 URL: "
    
    if "!repoUrl!"=="" (
        echo ❌ 未输入仓库 URL，退出部署
        pause
        exit /b 1
    )
    
    git remote add origin !repoUrl!
    echo ✓ 已添加远程仓库: !repoUrl!
    echo.
) else (
    for /f "delims=" %%i in ('git remote get-url origin') do set remoteUrl=%%i
    echo ✓ 远程仓库: !remoteUrl!
    echo.
)

REM 添加所有文件
echo 添加文件到 Git...
git add .

REM 提交更改
echo 提交更改...
set commitMsg=%1
if "%commitMsg%"=="" set commitMsg=Update project
git commit -m "%commitMsg%"

REM 检查当前分支
for /f "delims=" %%i in ('git branch --show-current 2^>nul') do set currentBranch=%%i
if "!currentBranch!"=="" (
    git branch -M main
    set currentBranch=main
)

echo ✓ 当前分支: !currentBranch!
echo.

REM 推送到 GitHub
echo 推送到 GitHub...
git push -u origin !currentBranch! 2>nul
if errorlevel 1 (
    echo 尝试首次推送...
    git push -u origin !currentBranch! --force
)

echo ✓ 成功推送到 GitHub!
echo.

REM Vercel 部署指引
echo ==================================
echo 下一步: 部署到 Vercel
echo ==================================
echo.
echo 请按以下步骤在 Vercel 上部署:
echo.
echo 1. 访问 Vercel: https://vercel.com
echo 2. 使用 GitHub 账号登录
echo 3. 点击 'Add New Project'
echo 4. 导入刚才推送的 GitHub 仓库
echo 5. 在 'Environment Variables' 中添加:
echo    - Name: VITE_GEMINI_API_KEY
echo    - Value: 你的 Gemini API Key
echo 6. 点击 'Deploy' 开始部署
echo.
echo ✓ 部署完成后，Vercel 会自动生成网站 URL
echo.
echo 提示: 以后每次推送到 GitHub，Vercel 会自动重新部署
echo.

pause
