// 辅助函数：从URL提取Unsplash ID
export function extractUnsplashId(url: string): string {
  const match = url.match(/\/photo-([a-zA-Z0-9\-]+)(?:\?|$)/)
  return match ? `photo-${match[1]}` : url
}


📘 第三部分：性能收益与高级优化

6. 性能收益预估

const performanceGains = {
  // 文件大小对比
  fileSize: {
    original: '500KB',
    optimized: {
      webp: '150KB (-70%)',
      avif: '100KB (-80%)'
    }
  },
  
  // 加载时间对比 (3G网络)
  loadingTime: {
    original: '3-5秒',
    optimized: {
      firstImage: '0.5秒 (-85%)',
      allImages: '2秒 (-40%)'
    }
  },
  
  // 带宽节省
  bandwidth: {
    perImage: '节省 350KB',
    perPage: '节省 2.1MB (6张图片)',
    monthly: '节省 63GB (假设1000用户/天)'
  },
  
  // 用户体验指标
  userExperience: {
    lighthouseScore: '从 65 → 90+',
    firstContentfulPaint: '从 3s → 1s',
    timeToInteractive: '从 4s → 1.5s'
  }
}

7. 高级优化选项

7.1 CDN 图片服务 (Cloudinary/Imgix)

// 使用 Cloudinary 的高级优化
const cloudinaryUrl = `https://res.cloudinary.com/demo/image/fetch/
  f_auto,q_auto:good,w_800,h_600,c_fill/
  ${encodeURIComponent(pet.image)}`

7.2 渐进式加载 (Blur -> Sharp)

/* CSS 模糊到清晰效果 */
.progressive-image {
  filter: blur(20px);
  transition: filter 0.5s ease-out;
}

.progressive-image.loaded {
  filter: blur(0);
}

7.3 图片预加载策略

// 预加载首屏关键图片
const preloadImages = ['hero-image.jpg', 'featured-pet.jpg']

useEffect(() => {
  preloadImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}, [])

8. 测试与验证

8.1 性能测试工具

# Lighthouse 测试
npm install -g lighthouse
lighthouse https://localhost:5173 --view

# WebPageTest
# 访问 https://www.webpagetest.org/

# Chrome DevTools
# Network面板 + Coverage面板

8.2 监控指标

• LCP (Largest Contentful Paint)： < 2.5s
• FID (First Input Delay)： < 100ms
• CLS (Cumulative Layout Shift)： < 0.1
• Total Image Bytes： 尽可能小

📘 第四部分：其他优化与路线图

9. 其他高优先级优化

9.1 状态管理重构 (Zustand)

问题： 当前状态分散在 App.tsx，难以维护

解决方案：

// stores/petStore.ts
import { create } from 'zustand'

interface PetStore {
  pets: Pet[]
  favorites: Set<number>
  isLoading: boolean
  fetchPets: () => Promise<void>
  toggleFavorite: (petId: number) => Promise<void>
  addPet: (pet: Omit<Pet, 'id'>) => Promise<void>
  deletePet: (petId: number) => Promise<void>
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: [],
  favorites: new Set(),
  isLoading: false,
  
  fetchPets: async () => {
    set({ isLoading: true })
    // ... Supabase 查询
    set({ pets: data, isLoading: false })
  },
  
  toggleFavorite: async (petId) => {
    // ... 优化更新逻辑
  }
}))

9.2 错误边界与加载状态

// components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // 可发送到错误监控服务
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">出错了</h3>
          <button 
            onClick={() => window.location.reload()}
            className="clay-button"
          >
            刷新页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

10. 完整优化路线图

阶段 1：基础优化 (1-2周)

1. ✅ 图片懒加载与优化 (已完成)
2. ✅ 状态管理重构 (Zustand) (已完成)
3. ✅ 错误边界与加载状态 (已完成)
4. ✅ 基础测试框架 (Vitest) (已完成)
阶段 2：功能增强 (3-4周)

1. ✅ 高级搜索与过滤 (Local Filter Logic Implemented)
   - [x] Store update (searchQuery, ageFilter)
   - [x] SearchBar component
   - [x] Filtering logic utility & tests
2. ✅ 实时通知系统 (Supabase Realtime)
   - [x] Notifications Table & RLS
   - [x] Notification Store
   - [x] Notification Bell UI
3. ✅ 宠物健康档案
   - [x] Health Records Table & RLS
   - [x] Health Records Component
   - [x] Integrated into Pet Details
4. ✅ 移动端 PWA 支持
   - [x] vite-plugin-pwa installed
   - [x] Manifest configured

阶段 3：生态扩展 (4-6周)

1. 🔄 地图集成 (Leaflet/Mapbox)
2. 🔄 AI 宠物匹配推荐
3. ✅ 捐赠/赞助系统
   - [x] Donation Modal
   - [x] UI Integration
4. ✅ 多语言支持
   - [x] i18next setup
   - [x] Basic translations
11. 立即行动计划

今天可以开始：

1. 在现有图片标签添加 loading="lazy" 和优化参数
2. 创建 SmartImage 组件框架
3. 替换 1-2 个关键位置的图片进行测试
本周计划：
