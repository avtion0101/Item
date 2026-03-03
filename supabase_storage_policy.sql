-- 1. 创建 Storage Bucket
-- 注意：这一步通常需要在 Supabase Dashboard 中手动完成，或者使用 API。
-- 但如果使用 Supabase CLI 或 Migration，可以尝试插入 storage.buckets 表
insert into storage.buckets (id, name, public)
values ('pet-images', 'pet-images', true)
on conflict (id) do nothing;

-- 2. 开启 RLS (虽然 storage.objects 默认开启，但明确一下是个好习惯)
-- Storage 的策略是挂在 storage.objects 表上的

-- 3. 创建 Storage 访问策略

-- 允许所有人查看图片 (SELECT)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'pet-images' );

-- 允许认证用户上传图片 (INSERT)
create policy "Authenticated users can upload images"
on storage.objects for insert
with check (
  bucket_id = 'pet-images' 
  and auth.role() = 'authenticated'
);

-- 允许用户更新自己的图片 (UPDATE) - 可选
create policy "Users can update own images"
on storage.objects for update
using (
  bucket_id = 'pet-images' 
  and auth.uid() = owner
);

-- 允许用户删除自己的图片 (DELETE) - 可选
create policy "Users can delete own images"
on storage.objects for delete
using (
  bucket_id = 'pet-images' 
  and auth.uid() = owner
);

-- 4. 允许用户向 pets 表插入数据 (发布送养)
-- 之前只有 SELECT 权限，现在需要 INSERT 权限
create policy "Authenticated users can insert pets"
on public.pets
for insert
with check (
  auth.role() = 'authenticated'
);

-- 还需要给 pets 表添加 owner_id 字段，以便记录是谁发布的
alter table public.pets 
add column if not exists owner_id uuid references auth.users;

-- 更新 pets 表策略：允许用户更新/删除自己发布的宠物
create policy "Users can update own pets"
on public.pets for update
using (auth.uid() = owner_id);

create policy "Users can delete own pets"
on public.pets for delete
using (auth.uid() = owner_id);
