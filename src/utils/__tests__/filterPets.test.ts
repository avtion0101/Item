import { describe, it, expect } from 'vitest'
import { filterPets } from '../filterPets'
import type { Pet } from '../../mockData'

const mockPets: Pet[] = [
  {
    id: 1,
    name: 'Bella',
    type: '狗狗',
    breed: 'Golden Retriever',
    age: '2 岁',
    image: '',
    description: 'Friendly dog',
    tags: ['friendly']
  },
  {
    id: 2,
    name: 'Luna',
    type: '猫咪',
    breed: 'Siamese',
    age: '1 岁',
    image: '',
    description: 'Quiet cat',
    tags: ['quiet']
  },
  {
    id: 3,
    name: 'Milo',
    type: '猫咪',
    breed: 'Tabby',
    age: '6 个月',
    image: '',
    description: 'Playful kitten',
    tags: ['playful']
  },
  {
    id: 4,
    name: 'Max',
    type: '狗狗',
    breed: 'German Shepherd',
    age: '5 岁',
    image: '',
    description: 'Loyal dog',
    tags: ['loyal']
  },
  {
    id: 5,
    name: 'Rocky',
    type: '狗狗',
    breed: 'Bulldog',
    age: '10 岁',
    image: '',
    description: 'Old dog',
    tags: ['lazy']
  }
]

describe('filterPets', () => {
  it('should filter by category', () => {
    const result = filterPets(mockPets, {
      activeCategory: '狗狗',
      searchQuery: '',
      ageFilter: 'all'
    })
    expect(result).toHaveLength(3)
    expect(result.map(p => p.name)).toEqual(['Bella', 'Max', 'Rocky'])
  })

  it('should filter by search query (name)', () => {
    const result = filterPets(mockPets, {
      activeCategory: '全部',
      searchQuery: 'Bella',
      ageFilter: 'all'
    })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Bella')
  })

  it('should filter by search query (description)', () => {
    const result = filterPets(mockPets, {
      activeCategory: '全部',
      searchQuery: 'Playful',
      ageFilter: 'all'
    })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Milo')
  })

  it('should filter by age (baby)', () => {
    const result = filterPets(mockPets, {
      activeCategory: '全部',
      searchQuery: '',
      ageFilter: 'baby'
    })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Milo')
  })

  it('should filter by age (young)', () => {
    const result = filterPets(mockPets, {
      activeCategory: '全部',
      searchQuery: '',
      ageFilter: 'young'
    })
    // 1-3 years: Bella (2), Luna (1)
    expect(result).toHaveLength(2)
    expect(result.map(p => p.name).sort()).toEqual(['Bella', 'Luna'].sort())
  })

  it('should filter by age (adult)', () => {
    const result = filterPets(mockPets, {
      activeCategory: '全部',
      searchQuery: '',
      ageFilter: 'adult'
    })
    // 3-8 years: Max (5)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Max')
  })

  it('should filter by age (senior)', () => {
    const result = filterPets(mockPets, {
      activeCategory: '全部',
      searchQuery: '',
      ageFilter: 'senior'
    })
    // > 8 years: Rocky (10)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Rocky')
  })

  it('should combine filters', () => {
    const result = filterPets(mockPets, {
      activeCategory: '狗狗',
      searchQuery: 'friendly',
      ageFilter: 'young'
    })
    // Dog + "friendly" + Young (1-3) => Bella (2, friendly)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Bella')
  })
})
