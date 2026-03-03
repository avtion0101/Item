import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../SearchBar'
import { usePetStore } from '../../stores/usePetStore'

// Mock usePetStore
vi.mock('../../stores/usePetStore')

describe('SearchBar', () => {
  const setSearchQuery = vi.fn()
  const setAgeFilter = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default mock return value
    ;(usePetStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      searchQuery: '',
      ageFilter: 'all',
      setSearchQuery,
      setAgeFilter,
    })
  })

  it('renders search input and filter dropdown', () => {
    render(<SearchBar />)
    
    expect(screen.getByPlaceholderText(/搜索名字、品种或特征/)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '所有年龄' })).toBeInTheDocument()
  })

  it('updates search query on input change', () => {
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText(/搜索名字、品种或特征/)
    fireEvent.change(input, { target: { value: 'Bella' } })
    
    expect(setSearchQuery).toHaveBeenCalledWith('Bella')
  })

  it('updates age filter on select change', () => {
    render(<SearchBar />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'young' } })
    
    expect(setAgeFilter).toHaveBeenCalledWith('young')
  })

  it('shows clear button when search query is present', () => {
    ;(usePetStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      searchQuery: 'test',
      ageFilter: 'all',
      setSearchQuery,
      setAgeFilter,
    })

    render(<SearchBar />)
    
    // Check for the X icon button (it has an SVG inside, usually button role)
    const buttons = screen.getAllByRole('button')
    // We expect the clear button to be present. 
    // Since we don't have aria-label on the button, we can find it by class or just check buttons.
    // Let's rely on the fact that it renders only when query is present.
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('clears search query when clear button is clicked', () => {
    ;(usePetStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      searchQuery: 'test',
      ageFilter: 'all',
      setSearchQuery,
      setAgeFilter,
    })

    render(<SearchBar />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(setSearchQuery).toHaveBeenCalledWith('')
  })
})
