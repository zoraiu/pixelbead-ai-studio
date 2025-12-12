# PixelBead AI Studio 部署指南

## 🚀 快速开始

### 第一步：安装 Git

#### Windows 系统安装 Git

1. **下载 Git**
   - 访问：https://git-scm.com/download/win
   - 下载最新版本的 Git for Windows

2. **安装 Git**
   - 运行下载的安装程序
   - 使用默认设置一路点击 "Next" 即可
   - 安装完成后**重启终端**（PowerShell 或命令提示符）

3. **验证安装**
   ```bash
   git --version
   ```
   如果显示版本号，说明安装成功！

### 第二步：一键部署

安装好 Git 后，直接运行部署脚本：

```bash
.\deploy.bat
```

或者使用 PowerShell 脚本：

```powershell
.\deploy.ps1
```

### 第三步：跟随脚本指引

脚本会自动完成以下步骤：

1. ✅ 检查 Git 是否安装
2. ✅ 初始化 Git 仓库
3. ✅ 引导你创建 GitHub 仓库
   - 访问 https://github.com/new
   - 仓库名建议：`pixelbead-ai-studio`
   - 设置为 **Public**（公开）
   - **不要**初始化 README、.gitignore 或 license
4. ✅ 输入仓库 URL（例如：`https://github.com/username/pixelbead-ai-studio.git`）
5. ✅ 自动提交并推送代码到 GitHub
6. ✅ 显示 Vercel 部署指引

### 手动部署步骤

如果你想手动部署，请按以下步骤：

#### 1. 上传到 GitHub

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 添加远程仓库（替换为你的仓库 URL）
git remote add origin https://github.com/username/pixelbead-ai-studio.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

#### 2. 部署到 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **Add New Project**
4. 导入你的 GitHub 仓库
5. 在 **Environment Variables** 中添加：
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: 你的 Gemini API Key
6. 点击 **Deploy** 开始部署

### 环境变量配置

项目需要配置 Gemini API Key：

- 在 Vercel 中配置：`VITE_GEMINI_API_KEY`
- 本地开发：复制 `.env.example` 为 `.env` 并填入你的 API Key

### 后续更新

部署完成后，每次推送代码到 GitHub，Vercel 会自动重新部署：

```bash
git add .
git commit -m "Update"
git push
```

或者使用一键脚本：

```powershell
.\deploy.ps1 -CommitMessage "Update"
```

## 注意事项

- 确保 GitHub 仓库设置为 **Public**（公开），Vercel 才能访问
- 不要将 `.env` 文件上传到 GitHub（已在 `.gitignore` 中排除）
- API Key 只在 Vercel 的环境变量中配置，不要硬编码在代码中
