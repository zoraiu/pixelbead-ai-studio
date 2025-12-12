# PixelBead AI Studio - 快速上传指南

## ✅ 环境变量问题已修复！

**修复内容：**
- ✅ 代码中统一使用 `import.meta.env.VITE_GEMINI_API_KEY`
- ✅ 与 Vercel 环境变量配置保持一致
- ✅ 移除了旧的 `process.env.API_KEY` 引用

---

## 🚀 立即上传到 GitHub

### 步骤 1: 创建 GitHub 仓库
1. 访问：https://github.com/new
2. Repository name: **pixelbead-ai-studio**
3. 选择：**Public**（公开）
4. ❌ **不要**勾选任何初始化选项
5. 点击：**Create repository**

### 步骤 2: 执行上传命令

在终端依次执行：

```bash
# 提交修复的代码
git add .
git commit -m "Fix: 统一环境变量为 VITE_GEMINI_API_KEY"

# 推送到 GitHub
git push -u origin main
```

如果提示远程仓库不存在，先执行：
```bash
git remote set-url origin https://github.com/zoraiu/pixelbead-ai-studio.git
```

---

## 📦 部署到 Vercel

### 步骤 1: 导入项目
1. 访问：https://vercel.com
2. 使用 GitHub 账号登录
3. 点击：**Add New Project**
4. 导入仓库：**zoraiu/pixelbead-ai-studio**

### 步骤 2: 配置环境变量（重要！）
在 "Environment Variables" 部分添加：

```
Name:  VITE_GEMINI_API_KEY
Value: 你的 Gemini API Key
```

⚠️ **注意**：环境变量名必须是 `VITE_GEMINI_API_KEY`（已修复）

### 步骤 3: 部署
- Framework Preset: **Vite**（自动检测）
- Build Command: `npm run build`（自动配置）
- Output Directory: `dist`（自动配置）
- 点击：**Deploy**

---

## 🎉 完成！

部署成功后，Vercel 会生成一个 URL，你就可以访问你的像素珠设计工具了！

### 后续更新
以后每次推送代码到 GitHub，Vercel 都会自动重新部署。

```bash
git add .
git commit -m "你的更新说明"
git push
```

---

## 📝 技术说明

**环境变量配置：**
- 本地开发：在 `.env` 文件中配置 `VITE_GEMINI_API_KEY`
- Vercel 部署：在 Vercel 控制台配置 `VITE_GEMINI_API_KEY`
- Vite 会自动将 `VITE_` 前缀的环境变量注入到客户端代码中

**文件：**
- `services/geminiService.ts` - 已修复为使用 `import.meta.env.VITE_GEMINI_API_KEY`
- `vite.config.ts` - 已简化配置，使用 Vite 默认环境变量处理
- `.env.example` - 环境变量模板
