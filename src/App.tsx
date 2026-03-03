import { useEffect, useState } from 'react'
import { Heart, Search, Menu, X, PawPrint, Home, Loader2, User as UserIcon, LogOut, Plus } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import type { Pet } from './mockData'
import { AuthModal } from './components/AuthModal'
import { AdoptionModal } from './components/AdoptionModal'
import { AddPetModal } from './components/AddPetModal'
import { LazyImage } from './components/LazyImage'
import { FeatureCard } from './components/FeatureCard'
import { SearchBar } from './components/SearchBar'
import { usePetStore } from './stores/usePetStore'
import { useUIStore } from './stores/useUIStore'
import { filterPets } from './utils/filterPets'

import { CommunityLayout } from './components/Community/CommunityLayout'

import { DonationModal } from './components/DonationModal'
import { NotificationBell } from './components/NotificationBell'
import './i18n' // Init i18n

function App() {
  const { 
    pets, 
    favorites, 
    isLoading, 
    activeCategory, 
    searchQuery,
    ageFilter,
    user,
    setCategory,
    fetchPets,
    toggleFavorite,
    initializeAuth,
    signOut
  } = usePetStore()

  const {
    isMenuOpen,
    isAuthModalOpen,
    adoptionPet,
    setMenuOpen,
    setAuthModalOpen,
    setAdoptionPet,
    currentView,
    setCurrentView
  } = useUIStore()
  
  // Local state for Modals
  const [isAddPetModalOpen, setAddPetModalOpen] = useState(false)
  const [isDonationModalOpen, setDonationModalOpen] = useState(false)

  // Initialize Data & Auth
  useEffect(() => {
    initializeAuth()
    fetchPets()
  }, [])

  const handleLogout = async () => {
    await signOut()
    setMenuOpen(false)
  }

  const handleAdoptClick = (pet: Pet) => {
    if (!user) {
      setAuthModalOpen(true)
    } else {
      setAdoptionPet(pet)
    }
  }

  const handleFavoriteClick = async (petId: number) => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    await toggleFavorite(petId)
  }

  const filteredPets = filterPets(pets, {
    activeCategory,
    searchQuery,
    ageFilter
  })

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Helmet>
        <title>宠乐园 (Pet Haven) - 遇见你的新家人</title>
        <meta name="description" content="连接充满爱心的家庭与等待归宿的可爱宠物。浏览狗狗、猫咪和小兔，在线申请领养，为它们带去一份温暖。" />
        <meta property="og:title" content="宠乐园 (Pet Haven)" />
        <meta property="og:description" content="遇见你的新家人。我们致力于连接充满爱心的家庭与等待归宿的可爱宠物。" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80" />
      </Helmet>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      <AdoptionModal 
        isOpen={!!adoptionPet}
        onClose={() => setAdoptionPet(null)}
        pet={adoptionPet}
        user={user}
      />
      <AddPetModal 
        isOpen={isAddPetModalOpen}
        onClose={() => setAddPetModalOpen(false)}
      />
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setDonationModalOpen(false)}
      />

      {/* Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="clay-card px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--color-primary)] p-2 rounded-xl text-white shadow-lg">
              <PawPrint size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-[var(--color-text-main)]">宠乐园 (Pet Haven)</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-bold text-[var(--color-text-main)]">
            <button 
              onClick={() => setCurrentView('home')} 
              className={`hover:text-[var(--color-primary)] transition-colors ${currentView === 'home' ? 'text-[var(--color-primary)]' : ''}`}
            >
              首页
            </button>
            <a href="#pets" onClick={() => setCurrentView('home')} className="hover:text-[var(--color-primary)] transition-colors">领养中心</a>
            <button 
              onClick={() => setCurrentView('community')} 
              className={`hover:text-[var(--color-primary)] transition-colors ${currentView === 'community' ? 'text-[var(--color-primary)]' : ''}`}
            >
              交流中心
            </button>
            <button
              onClick={() => setDonationModalOpen(true)}
              className="text-pink-500 hover:text-pink-600 transition-colors font-bold flex items-center gap-1"
            >
              <Heart size={16} fill="currentColor" />
              爱心捐赠
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-sm">
                  <UserIcon size={16} />
                  <span className="truncate max-w-[150px]">{user.email}</span>
                </div>
                <button 
                  onClick={() => setAddPetModalOpen(true)}
                  className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                  title="发布送养"
                >
                  <Plus size={20} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="退出登录"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="clay-button text-sm py-2 px-6"
              >
                登录 / 注册
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[var(--color-text-main)]"
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="clay-card mt-4 p-4 flex flex-col gap-4 md:hidden mx-auto max-w-7xl animate-in slide-in-from-top-4 duration-300">
            {user && (
              <div className="px-4 py-2 bg-orange-50 rounded-lg text-sm font-bold text-gray-600 mb-2 truncate">
                {user.email}
              </div>
            )}
            <button onClick={() => { setCurrentView('home'); setMenuOpen(false) }} className="text-left font-bold text-[var(--color-text-main)] py-2">首页</button>
            <button onClick={() => { setCurrentView('community'); setMenuOpen(false) }} className="text-left font-bold text-[var(--color-text-main)] py-2">交流中心</button>
            {user ? (
              <>
                <button onClick={() => setAddPetModalOpen(true)} className="text-left font-bold text-[var(--color-primary)] py-2">发布送养</button>
                <button onClick={handleLogout} className="text-left font-bold text-red-500 py-2">退出登录</button>
              </>
            ) : (
              <button onClick={() => { setAuthModalOpen(true); setMenuOpen(false) }} className="clay-button w-full">登录 / 注册</button>
            )}
          </div>
        )}
      </nav>

      {/* Main Content based on currentView */}
      {currentView === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="pt-32 pb-16 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="inline-block px-4 py-1 rounded-full bg-white/50 border border-white text-[var(--color-primary)] font-bold text-sm mb-2 shadow-sm">
                遇见你的新家人 🐾
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight text-[var(--color-text-main)]">
                为你的家<br/>带去<span className="text-[var(--color-primary)]">一份温暖</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0 font-medium">
                我们致力于连接充满爱心的家庭与等待归宿的可爱宠物。今天就开始领养，改变它们的生命！
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <a href="#pets" className="clay-button text-lg text-center">寻找宠物</a>
                <button className="px-6 py-3 rounded-xl font-display font-bold text-[var(--color-primary)] bg-white border-2 border-white shadow-[4px_4px_10px_#e5e7eb,-4px_-4px_10px_#ffffff] hover:shadow-[inset_2px_2px_5px_#e5e7eb,inset_-2px_-2px_5px_#ffffff] transition-all cursor-pointer">
                  领养流程
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-[var(--color-primary)] opacity-10 blur-3xl rounded-full"></div>
              <LazyImage 
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80" 
                alt="Happy dog" 
                className="relative z-10 rounded-[3rem] border-8 border-white shadow-[16px_16px_32px_rgba(249,115,22,0.2)] transform rotate-2 hover:rotate-0 transition-transform duration-500 w-full aspect-square"
              />
              <div className="absolute -bottom-6 -left-6 clay-card p-4 flex items-center gap-3 z-20 animate-bounce">
                <div className="bg-red-100 p-2 rounded-full text-red-500">
                  <Heart fill="currentColor" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold">已获救生命</p>
                  <p className="text-xl font-black text-[var(--color-text-main)]">12,000+</p>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Pets Section */}
          <section id="pets" className="py-16 px-4 max-w-7xl mx-auto min-h-[600px]">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-[var(--color-text-main)] mb-4">结识我们的伙伴</h2>
              <p className="text-gray-600 font-medium mb-8">它们正满怀期待，等着你带它们回家</p>
              
              <div className="max-w-2xl mx-auto">
                <SearchBar />
              </div>

              <div className="flex justify-center gap-4 mt-8 flex-wrap">
                {['全部', '狗狗', '猫咪', '小兔'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat as any)}
                    className={`px-6 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      activeCategory === cat 
                        ? 'bg-[var(--color-primary)] text-white shadow-lg scale-105' 
                        : 'bg-white text-gray-500 shadow-sm hover:bg-orange-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
                <p className="font-bold text-gray-500">正在寻找小伙伴...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPets.map((pet) => (
                  <PetCard 
                    key={pet.id} 
                    pet={pet} 
                    isFavorite={favorites.has(pet.id)}
                    onFavorite={() => handleFavoriteClick(pet.id)}
                    onAdopt={() => handleAdoptClick(pet)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* About Section */}
          <section id="about" className="py-16 px-4 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Home size={32} />} 
                title="温馨庇护所" 
                desc="我们为所有获救的宠物提供舒适、安全的居住环境。"
              />
              <FeatureCard 
                icon={<Heart size={32} />} 
                title="专业医疗" 
                desc="每只宠物在领养前都会接受全面的身体检查和疫苗接种。"
              />
              <FeatureCard 
                icon={<Search size={32} />} 
                title="精准匹配" 
                desc="我们的专家会根据您的生活方式，为您匹配最合适的伙伴。"
              />
            </div>
          </section>
        </>
      ) : (
        <div className="pt-24 min-h-screen">
          <CommunityLayout />
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 bg-white mt-12 border-t border-orange-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--color-primary)] p-2 rounded-xl text-white">
              <PawPrint size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-[var(--color-text-main)]">宠乐园 (Pet Haven)</span>
          </div>
          <div className="text-gray-500 font-medium text-center md:text-right">
            <p>© 2026 宠乐园. 用爱筑家 🧡</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface PetCardProps {
  pet: Pet
  isFavorite: boolean
  onFavorite: () => void
  onAdopt: () => void
}

function PetCard({ pet, isFavorite, onFavorite, onAdopt }: PetCardProps) {
  return (
    <div className="clay-card p-4 flex flex-col h-full group">
      <div className="relative overflow-hidden rounded-xl h-64 mb-4">
        <LazyImage 
          src={pet.image} 
          alt={pet.name} 
          className="w-full h-full"
          imageClassName="transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--color-primary)] shadow-sm">
          {pet.age}
        </div>
      </div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-2xl font-black text-[var(--color-text-main)]">{pet.name}</h3>
          <p className="text-gray-500 font-bold text-sm">{pet.breed}</p>
        </div>
        <button 
          onClick={onFavorite}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isFavorite 
              ? 'bg-red-100 text-red-500' 
              : 'bg-red-50 text-red-300 hover:bg-red-100 hover:text-red-400'
          }`}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{pet.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {pet.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-bold">
            {tag}
          </span>
        ))}
      </div>
      <button 
        onClick={onAdopt}
        className="clay-button w-full py-2 text-base"
      >
        领养 {pet.name}
      </button>
    </div>
  )
}

export default App
