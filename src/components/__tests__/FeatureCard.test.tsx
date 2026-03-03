import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FeatureCard } from '../FeatureCard'

describe('FeatureCard', () => {
  it('renders title and description', () => {
    render(
      <FeatureCard 
        icon={<span>Icon</span>} 
        title="Test Title" 
        desc="Test Description" 
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Icon')).toBeInTheDocument()
  })
})
