import type { Pet } from '../mockData'

export interface FilterOptions {
  activeCategory: '全部' | '狗狗' | '猫咪' | '小兔'
  searchQuery: string
  ageFilter: 'all' | 'baby' | 'young' | 'adult' | 'senior'
}

export function filterPets(pets: Pet[], options: FilterOptions): Pet[] {
  const { activeCategory, searchQuery, ageFilter } = options

  return pets.filter(pet => {
    // 1. Category Filter
    if (activeCategory !== '全部' && pet.type !== activeCategory) return false

    // 2. Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchName = pet.name.toLowerCase().includes(query)
      const matchBreed = pet.breed.toLowerCase().includes(query)
      const matchDesc = pet.description.toLowerCase().includes(query)
      const matchTags = pet.tags?.some(tag => tag.toLowerCase().includes(query))
      
      if (!matchName && !matchBreed && !matchDesc && !matchTags) return false
    }

    // 3. Age Filter
    if (ageFilter !== 'all') {
      const isMonths = pet.age.includes('个月')
      // Extract number from string like "2 岁"
      const ageNum = parseInt(pet.age)
      
      if (ageFilter === 'baby') {
        // < 1 year (months)
        if (!isMonths) return false
      } else if (ageFilter === 'young') {
        // 1-3 years
        // If it's months, it's baby, so not young
        // If ageNum < 1, it's baby (unless user typed "0 岁" which is unlikely but possible)
        if (isMonths || ageNum < 1 || ageNum >= 3) return false
      } else if (ageFilter === 'adult') {
        // 3-8 years
        if (isMonths || ageNum < 3 || ageNum >= 8) return false
      } else if (ageFilter === 'senior') {
        // >= 8 years
        if (isMonths || ageNum < 8) return false
      }
    }

    return true
  })
}
