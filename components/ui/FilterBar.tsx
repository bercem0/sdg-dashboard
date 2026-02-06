'use client'

import React, { useState } from 'react'
import { Select } from './Select'
import { Input } from './Input'
import { Button } from './Button'
import { REGIONS, COUNTRIES_BY_REGION, Region } from '@/lib/types'

/* Props voor FilterBar: functie die filters doorgeeft en wat we willen laten zien */
interface FilterBarProps {
  /* Functie die aangeroepen wordt als filters veranderen */
  onFilterChange: (filters: {
    region?: string
    country?: string
    from?: number
    to?: number
  }) => void
  /* Laat Region dropdown zien? */
  showRegion?: boolean
  /* Laat Country dropdown zien? */
  showCountry?: boolean
  /* Laat Jaar bereik inputs zien? */
  showYearRange?: boolean
}

/* FilterBar component */
export function FilterBar({
  onFilterChange,
  showRegion = true,
  showCountry = true,
  showYearRange = true,
}: FilterBarProps) {

  /* State voor geselecteerde filters */
  const [region, setRegion] = useState<Region>('Global') // start met Global
  const [country, setCountry] = useState<string>('')      // start leeg
  const [yearFrom, setYearFrom] = useState<string>('2018')// default van jaar
  const [yearTo, setYearTo] = useState<string>('2022')    // default tot jaar

  /* Functie om filters toe te passen */
  const handleApplyFilters = () => {
    onFilterChange({
      region: region !== 'Global' ? region : undefined,  // Global betekent geen regio filter
      country: country || undefined,                     // lege string wordt undefined
      from: yearFrom ? parseInt(yearFrom) : undefined,   // string naar nummer
      to: yearTo ? parseInt(yearTo) : undefined,
    })
  }

  /* Functie om filters te resetten naar default */
  const handleReset = () => {
    setRegion('Global')
    setCountry('')
    setYearFrom('2018')
    setYearTo('2022')
    onFilterChange({}) // lege object betekent geen filter
  }

  /* Bepaal welke landen beschikbaar zijn voor de geselecteerde regio */
  const availableCountries = region === 'Global' 
    ? []
    : COUNTRIES_BY_REGION[region] || []

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      
      {/* Titel van de filter sectie */}
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Filters</h3>
      
      {/* Grid voor filter inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Region select dropdown */}
        {showRegion && (
          <Select
            label="Regio"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value as Region)
              setCountry('') // als regio verandert, reset country
            }}
            options={REGIONS.map((r) => ({ value: r, label: r }))}
          />
        )}

        {/* Country select dropdown, alleen zichtbaar als regio niet Global is */}
        {showCountry && region !== 'Global' && (
          <Select
            label="Land"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            options={[
              { value: '', label: 'Alle Landen' },
              ...availableCountries.map((c) => ({ value: c, label: c })),
            ]}
          />
        )}

        {/* Jaar bereik inputs */}
        {showYearRange && (
          <>
            <Input
              label="Vanaf Jaar"
              type="number"
              min="1990"
              max="2030"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
            />
            <Input
              label="Tot Jaar"
              type="number"
              min="1990"
              max="2030"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
            />
          </>
        )}
      </div>

      {/* Knoppen voor Apply en Reset filters */}
      <div className="flex gap-3 mt-4">
        <Button onClick={handleApplyFilters} size="sm">
          Filters Toepassen
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm">
          Reset
        </Button>
      </div>
    </div>
  )
}