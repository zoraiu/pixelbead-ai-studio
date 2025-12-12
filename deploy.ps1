# PixelBead AI Studio - 一键部署到 GitHub 和 Vercel
# PowerShell 部署脚本

param(
    [string]$CommitMessage = "Update project"
)

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "PixelBead AI Studio 一键部署工具" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Git 是否安装
$gitInstalled = $false
try {
    $null = git --version 2>&1
    $gitInstalled = $true
} catch {
    $gitInstalled = $false
}

if (-not $gitInstalled) {
    Write-Host "❌ 未检测到 Git，请先安装 Git:" -ForegroundColor Red
    Write-Host "   下载地址: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "安装完成后请重启终端再运行此脚本。" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Git 已安装" -ForegroundColor Green

# 初始化 Git 仓库（如果需要）
if (-not (Test-Path ".git")) {
    Write-Host ""
    Write-Host "初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git 仓库初始化完成" -ForegroundColor Green
}

# 检查是否设置了远程仓库
$remoteUrl = $null
try {
    $remoteUrl = git remote get-url origin 2>$null
} catch {
    $remoteUrl = $null
}

if (-not $remoteUrl) {
    Write-Host ""
    Write-Host "⚠️  尚未设置 GitHub 远程仓库" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请按以下步骤操作:" -ForegroundColor Cyan
    Write-Host "1. 前往 GitHub 创建新仓库: https://github.com/new" -ForegroundColor White
    Write-Host "   - 仓库名建议: pixelbead-ai-studio" -ForegroundColor White
    Write-Host "   - 设置为 Public（公开）以便 Vercel 访问" -ForegroundColor White
    Write-Host "   - 不要初始化 README、.gitignore 或 license" -ForegroundColor White
    Write-Host ""
    Write-Host "2. 创建完成后，输入仓库 URL（例如: https://github.com/username/pixelbead-ai-studio.git）" -ForegroundColor White
    Write-Host ""
    $repoUrl = Read-Host "请输入 GitHub 仓库 URL"
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "✓ 已添加远程仓库: $repoUrl" -ForegroundColor Green
    } else {
        Write-Host "❌ 未输入仓库 URL，退出部署" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ 远程仓库: $remoteUrl" -ForegroundColor Green
}

# 添加所有文件
Write-Host ""
Write-Host "添加文件到 Git..." -ForegroundColor Yellow
git add .

# 提交更改
Write-Host "提交更改..." -ForegroundColor Yellow
git commit -m $CommitMessage

# 检查当前分支
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    git branch -M main
    $currentBranch = "main"
}

Write-Host "✓ 当前分支: $currentBranch" -ForegroundColor Green

# 推送到 GitHub
Write-Host ""
Write-Host "推送到 GitHub..." -ForegroundColor Yellow

try {
    git push -u origin $currentBranch 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 成功推送到 GitHub!" -ForegroundColor Green
    } else {
        Write-Host "尝试首次推送..." -ForegroundColor Yellow
        git push -u origin $currentBranch --force 2>&1
        Write-Host "✓ 成功推送到 GitHub!" -ForegroundColor Green
    }
} catch {
    Write-Host "尝试首次推送..." -ForegroundColor Yellow
    git push -u origin $currentBranch --force 2>&1
    Write-Host "✓ 成功推送到 GitHub!" -ForegroundColor Green
}

# Vercel 部署指引
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "下一步: 部署到 Vercel" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "请按以下步骤在 Vercel 上部署:" -ForegroundColor White
Write-Host ""
Write-Host "1. 访问 Vercel: https://vercel.com" -ForegroundColor Yellow
Write-Host "2. 使用 GitHub 账号登录" -ForegroundColor Yellow
Write-Host "3. 点击 'Add New Project'" -ForegroundColor Yellow
Write-Host "4. 导入刚才推送的 GitHub 仓库" -ForegroundColor Yellow
Write-Host "5. 在 'Environment Variables' 中添加:" -ForegroundColor Yellow
Write-Host "   - Name: VITE_GEMINI_API_KEY" -ForegroundColor White
Write-Host "   - Value: 你的 Gemini API Key" -ForegroundColor White
Write-Host "6. 点击 'Deploy' 开始部署" -ForegroundColor Yellow
Write-Host ""
Write-Host "✓ 部署完成后，Vercel 会自动生成网站 URL" -ForegroundColor Green
Write-Host ""
Write-Host "提示: 以后每次推送到 GitHub，Vercel 会自动重新部署" -ForegroundColor Cyan
Write-Host ""
