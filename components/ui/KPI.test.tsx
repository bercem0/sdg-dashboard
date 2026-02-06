import { describe, it, expect } from 'vitest' // Test framework
import { render, screen } from '@testing-library/react' // DOM test library
import { KPI } from './KPI' // Component die we willen testen

// --- Groep tests voor KPI component ---
describe('KPI Component', () => {
  
  // Test 1: Label en value worden goed weergegeven
  it('renders label and value correctly', () => {
    render(<KPI label="Test Metric" value="100" />) // Render component
    
    // Kijk of label op de pagina staat
    expect(screen.getByText('Test Metric')).toBeInTheDocument()
    // Kijk of value op de pagina staat
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  // Test 2: Trend indicator wordt weergegeven als meegegeven
  it('displays trend indicator when provided', () => {
    render(<KPI label="Metric" value="50" trend="up" trendValue="5" />)
    
    // ↑ pijl moet op de pagina staan
    expect(screen.getByText('↑')).toBeInTheDocument()
    // Trend value moet op de pagina staan
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  // Test 3: Unit wordt weergegeven als meegegeven
  it('shows unit when provided', () => {
    render(<KPI label="Temperature" value="25" unit="°C" />)
    
    // °C moet op de pagina staan
    expect(screen.getByText('°C')).toBeInTheDocument()
  })

  // Test 4: Trend heeft juiste kleur class
  it('applies correct trend color classes', () => {
    const { container } = render(<KPI label="Metric" value="50" trend="down" />)
    
    // Kijk of de rode kleur class aanwezig is bij dalende trend
    const trendElement = container.querySelector('.text-red-600')
    expect(trendElement).toBeInTheDocument()
  })
})