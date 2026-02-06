/* Vitest en Testing Library importeren voor testen */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react' 
import { FilterBar } from './FilterBar'

/* Beschrijving van de test suite voor FilterBar component */
describe('FilterBar Component', () => {

  /* Test: alle filter elementen worden weergegeven */
  it('renders all filter controls', () => {
    const mockCallback = vi.fn()           // mock functie om veranderingen te checken
    render(<FilterBar onFilterChange={mockCallback} />)
    
    // Check dat de Region select zichtbaar is
    expect(screen.getByLabelText('Region')).toBeInTheDocument()
    // Check dat From Year input zichtbaar is
    expect(screen.getByLabelText('From Year')).toBeInTheDocument()
    // Check dat To Year input zichtbaar is
    expect(screen.getByLabelText('To Year')).toBeInTheDocument()
  })

  /* Test: onFilterChange wordt aangeroepen bij Apply Filters */
  it('calls onFilterChange when Apply Filters is clicked', () => {
    const mockCallback = vi.fn()
    render(<FilterBar onFilterChange={mockCallback} />)
    
    const applyButton = screen.getByText('Apply Filters')
    fireEvent.click(applyButton)          // Simuleer klik op Apply Filters
    
    expect(mockCallback).toHaveBeenCalled() // Controleer dat functie is aangeroepen
  })

  /* Test: reset knop zet filters terug */
  it('resets filters when Reset is clicked', () => {
    const mockCallback = vi.fn()
    render(<FilterBar onFilterChange={mockCallback} />)
    
    const resetButton = screen.getByText('Reset')
    fireEvent.click(resetButton)          // Simuleer klik op Reset
    
    expect(mockCallback).toHaveBeenCalledWith({}) // Controleer dat callback met lege filters komt
  })

  /* Test: country select verschijnt bij keuze van region */
  it('shows country select when region is selected', () => {
    const mockCallback = vi.fn()
    render(<FilterBar onFilterChange={mockCallback} />)
    
    const regionSelect = screen.getByLabelText('Region')
    fireEvent.change(regionSelect, { target: { value: 'Europe' } }) // Kies een regio
    
    expect(screen.getByLabelText('Country')).toBeInTheDocument()    // Country select moet nu zichtbaar zijn
  })
})