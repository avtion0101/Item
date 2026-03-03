import { Search, X, Filter } from 'lucide-react'
import { usePetStore } from '../stores/usePetStore'

export function SearchBar() {
  const { searchQuery, setSearchQuery, ageFilter, setAgeFilter } = usePetStore()

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="搜索名字、品种或特征..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="flex items-center gap-2">
        <div className="relative min-w-[140px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value as any)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all appearance-none cursor-pointer text-sm"
          >
            <option value="all">所有年龄</option>
            <option value="baby">幼年 (&lt; 1岁)</option>
            <option value="young">青年 (1-3岁)</option>
            <option value="adult">成年 (3-8岁)</option>
            <option value="senior">老年 (&gt; 8岁)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
