# 🚀 Vercel 部署指南

本指南详细说明如何将 Time Machine 项目部署到 Vercel。

## 前置条件

- GitHub 账户（项目代码已在 GitHub 上）
- Vercel 账户（免费注册：https://vercel.com/signup）
- 项目的 GitHub 仓库访问权限

---

## 部署步骤

### 1️⃣ 创建 Vercel 账户并关联 GitHub

1. 访问 https://vercel.com/signup
2. 选择 "Continue with GitHub"
3. 授权 Vercel 访问你的 GitHub 账户

### 2️⃣ 导入项目到 Vercel

1. 登录 Vercel Dashboard（https://vercel.com/dashboard）
2. 点击 "Add New" → "Project"
3. 在 "Import Git Repository" 中找到 `time-machine` 项目
4. 点击 "Import"

### 3️⃣ 配置部署设置

在 "Configure Project" 页面：

**基本设置：**
```
框架预设：Next.js ✓（自动检测）
根目录：Issues/time-machine
构建命令：npm run build ✓（默认）
输出目录：.next ✓（默认）
安装命令：npm install ✓（默认）
```

**环境变量：**
- 当前项目无需任何环境变量
- 如果将来添加 API 密钥，在此添加

### 4️⃣ 点击"Deploy"

部署通常需要 2-5 分钟。完成后你会看到：
- ✅ 部署成功提示
- 🔗 自动生成的 URL（如：`https://time-machine-xxxx.vercel.app`）
- 📊 部署统计和性能指标

---

## 设置自动部署（CI/CD）

Vercel 会自动配置 GitHub 集成，当你：
- 合并 PR 到 `main` 分支 → 生产部署
- 推送到其他分支 → 预览部署

**验证自动部署：**
```bash
# 本地提交并推送
git add .
git commit -m "test deployment"
git push origin main

# 前往 Vercel Dashboard 观察自动触发的构建
```

---

## 环境变量管理

### 本地开发：
```bash
# 复制模板文件
cp .env.example .env.local

# 在 .env.local 中填写本地值（Git 会忽略此文件）
```

### 生产环境（Vercel）：
1. Vercel Dashboard → 项目 → Settings → Environment Variables
2. 添加生产环境变量（仅在需要时）
3. 重新部署或手动触发构建

---

## 验证部署

### 功能验证清单：

- [ ] 访问部署 URL（在新浏览器/设备上）
- [ ] 地图组件加载正常
- [ ] 所有历史照片显示正确
- [ ] 位置切换功能正常
- [ ] 时间线交互有效
- [ ] 响应式设计在手机上显示正常
- [ ] 页面加载性能良好（使用 Lighthouse）

### 验证命令：
```bash
# 在部署 URL 上运行 Lighthouse 审计
# Chrome DevTools → Lighthouse → 生成报告
```

---

## 生产 URL 配置

部署完成后：
- **生产 URL**：`https://time-machine-xxxx.vercel.app`
- **自定义域名**（可选）：
  1. Vercel Dashboard → Settings → Domains
  2. 添加自定义域名
  3. 更新 DNS 记录（按 Vercel 提示）

---

## 故障排查

### 构建失败
**症状**：部署日志显示 "Build failed"
**解决**：
```bash
# 1. 本地构建测试
npm run build

# 2. 检查构建日志中的具体错误
# 3. 修复问题并推送更新
git push origin main
```

### 环境变量未生效
**症状**：应用无法访问 API 密钥
**解决**：
1. 确保变量以 `NEXT_PUBLIC_` 开头（前端可访问）
2. 在 Vercel Dashboard 重新设置变量
3. 触发手动重新部署

### 页面加载缓慢
**症状**：访问 URL 响应慢
**解决**：
1. 检查 Vercel Analytics（Performance 选项卡）
2. 优化大型图片资源
3. 使用 CDN 缓存（Vercel 默认启用）

---

## 监控和维护

### 部署后监控：
- **Vercel Analytics**：https://vercel.com/docs/analytics
- **性能指标**：Dashboard → Analytics
- **错误日志**：Dashboard → Deployments → 选择部署 → Logs

### 更新部署：
```bash
# 任何推送到 main 分支的更改都会自动触发部署
git add .
git commit -m "update: description"
git push origin main
```

---

## 回滚部署

如果需要恢复到之前的版本：
1. Vercel Dashboard → Deployments
2. 找到要回滚的部署
3. 点击 "Promote to Production"

---

## 安全建议

✅ **已实施：**
- 环境变量不在代码库中公开
- `.env.example` 作为模板供参考

⚠️ **建议：**
- 定期检查依赖更新（`npm audit`）
- 在生产前测试所有更改
- 监控部署日志中的错误和警告

---

## 相关资源

- [Vercel Next.js 部署文档](https://vercel.com/docs/frameworks/nextjs)
- [Next.js 部署指南](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel 环境变量文档](https://vercel.com/docs/projects/environment-variables)
- [GitHub Actions + Vercel 集成](https://vercel.com/docs/git/vercel-for-github)
