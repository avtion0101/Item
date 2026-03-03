import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import App from '../App'
import { HelmetProvider } from 'react-helmet-async'
import { usePetStore } from '../stores/usePetStore'

// Mock Supabase to be null so fetchPets doesn't run and we use initial mockPets
vi.mock('../lib/supabase', () => ({
  supabase: null
}))

// Mock matchMedia for responsive checks if any
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('App Integration', () => {
  beforeEach(() => {
    // Reset store state
    usePetStore.setState({
      searchQuery: '',
      ageFilter: 'all',
      activeCategory: '全部',
    })
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders initial pets', async () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )
    
    // Check for some known pets from mockData
    expect(screen.getByText('贝拉 (Bella)')).toBeInTheDocument()
    expect(screen.getByText('露娜 (Luna)')).toBeInTheDocument()
  })

  it('filters pets when searching', async () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )

    // Search for "Bella"
    const searchInput = screen.getByPlaceholderText(/搜索名字、品种或特征/)
    fireEvent.change(searchInput, { target: { value: 'Bella' } })

    // Verify "Bella" is still there, but "Luna" is gone
    await waitFor(() => {
      expect(screen.getByText('贝拉 (Bella)')).toBeInTheDocument()
      expect(screen.queryByText('露娜 (Luna)')).not.toBeInTheDocument()
    })
  })

  it('filters pets when changing category', async () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )

    // Initially show all
    expect(screen.getByText('贝拉 (Bella)')).toBeInTheDocument() // Dog
    expect(screen.getByText('露娜 (Luna)')).toBeInTheDocument()  // Cat

    // Click "Cat" category (猫咪)
    // The category buttons are rendered in a map loop.
    const catButton = screen.getByRole('button', { name: '猫咪' })
    fireEvent.click(catButton)

    // Verify dogs are gone, cats remain
    await waitFor(() => {
      expect(screen.queryByText('贝拉 (Bella)')).not.toBeInTheDocument()
      expect(screen.getByText('露娜 (Luna)')).toBeInTheDocument()
    })
  })

  it('filters pets when changing age filter', async () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )

    // "Bella" is "2 岁" (Young: 1-3)
    // "Milo" is "6 个月" (Baby: <1)
    
    // Select "Young" (青年)
    const ageSelect = screen.getByRole('combobox')
    fireEvent.change(ageSelect, { target: { value: 'young' } })

    await waitFor(() => {
      expect(screen.getByText('贝拉 (Bella)')).toBeInTheDocument()
      // Milo is baby, should be gone
      expect(screen.queryByText('米洛 (Milo)')).not.toBeInTheDocument()
    })
  })
})
