# 宠乐园 (Pet Haven) - v1.0.0

🐾 **宠乐园** 是一个致力于帮助流浪动物寻找温暖新家的社区平台。

## 🌟 核心功能 (v1.0.0)

- **宠物展示与筛选**：浏览待领养的狗狗、猫咪和小兔。
- **发布领养信息**：用户可以登录并发布待领养的宠物信息，包括照片、性格描述和联系方式。
- **领养申请**：通过内置表单直接向发布者提交领养意向。
- **宠友交流中心**：分享养宠心得、获取专业喂养指南，与其他宠主互动。
- **个人中心**：管理自己发布的宠物信息。

## 🛠️ 技术栈

- **前端**: React 19 + TypeScript + Vite
- **样式**: Tailwind CSS (Clay UI 风格)
- **后端**: Supabase (Auth, Database, RLS)
- **图标**: Lucide React

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd pet-haven
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
在项目根目录创建 `.env.local` 文件，填入你的 Supabase 配置：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 数据库准备
在 Supabase 的 SQL Editor 中运行项目中的 `supabase_schema.sql` 和 `supabase_schema_update.sql` 来初始化表结构。

### 5. 启动开发服务器
```bash
npm run dev
```

## 📄 部署

建议使用 Vercel 进行一键部署，详情请参阅 [DEPLOY.md](DEPLOY.md)。

---
让每一个小生命都能被温柔以待。🧡
