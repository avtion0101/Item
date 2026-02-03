
# 宠乐园 (Pet Haven) 部署指南

为了以最小代价将网站发布出去，我们建议使用 **Vercel (前端托管)** + **Supabase (后端/数据库)** 的方案。这两个平台都有非常慷慨的免费额度。

## 1. 后端准备 (Supabase)

1.  访问 [Supabase 官网](https://supabase.com/) 并注册。
2.  创建一个新项目 (Project)。
3.  进入 **SQL Editor**，将项目根目录下的 `supabase_schema.sql` 内容粘贴并运行。
    *   这会自动创建 `pets` 表、设置访问权限 (RLS) 并插入初始数据。
4.  进入 **Project Settings -> API**，获取以下两个信息：
    *   `Project URL`
    *   `anon (public) API Key`

## 2. 前端配置

1.  在本地项目中创建 `.env.local` 文件（基于 `.env.example`）：
    ```env
    VITE_SUPABASE_URL=你的_Project_URL
    VITE_SUPABASE_ANON_KEY=你的_anon_Key
    ```
2.  运行 `npm run dev` 验证数据是否已从 Supabase 加载（你会看到一个加载动画）。

## 3. 发布部署 (Vercel)

1.  将代码推送到 GitHub。
2.  访问 [Vercel 官网](https://vercel.com/) 并连接你的 GitHub 账号。
3.  点击 **Add New -> Project**，选择你的宠物网站仓库。
4.  在 **Environment Variables** 区域，添加上述两个环境变量：
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
5.  点击 **Deploy**。

## 4. 维护与扩展

*   **管理宠物**：你可以直接在 Supabase 的 **Table Editor** 中添加或修改宠物信息，前端会自动更新。
*   **图片托管**：目前使用 Unsplash 链接，后续可以使用 Supabase 的 **Storage** 功能上传本地宠物图片。

---
祝你的“宠乐园”早日上线！🐾
