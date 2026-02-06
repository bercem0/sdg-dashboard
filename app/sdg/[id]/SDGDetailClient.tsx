// Component voor KPI weergave
"use client";

// Importeer React hooks en types
import { useState, useMemo } from 'react' // useState om de state bij te houden, useMemo om berekeningen te cachen en niet bij elke render opnieuw uit te voeren
import { SDGInfo, SDGMetric } from '@/lib/types' // Typen voor SDG informatie en metriek

// Importeer UI-componenten
import { Card, CardContent } from '@/components/ui/Card' // Kaart componenten voor layout
import { KPI } from '@/components/ui/KPI' // KPI component voor belangrijke statistieken
import { FilterBar } from '@/components/ui/FilterBar' // Component voor filters
import { LineChart } from '@/components/charts/LineChart' // Lijngrafiek component
import { BarChart } from '@/components/charts/BarChart' // Staafgrafiek component
import { PieChart } from '@/components/charts/PieChart' // Taartgrafiek component
import { Table } from '@/components/ui/Table' // Tabel component om data te tonen
import { Button } from '@/components/ui/Button' // Knop component

// Importeer helper functies
import { calculateAverage, formatMetricValue } from '@/lib/data' // calculateAverage om gemiddelde te berekenen, formatMetricValue om waarden netjes te tonen

// Props interface voor SDGDetailClient component
interface SDGDetailClientProps {
  sdg: SDGInfo // SDG informatie object
  metrics: SDGMetric[] // Lijst van metriek data
  isAuthenticated: boolean // Of de gebruiker ingelogd is
  isFavorite: boolean // Of deze SDG als favoriet is gemarkeerd
}

// Hoofdcomponent voor SDG detailpagina
export function SDGDetailClient({ sdg, metrics, isAuthenticated, isFavorite }: SDGDetailClientProps) {
  // State voor filters en favoriet status
  const [filters, setFilters] = useState<{
    country?: string;
    from?: number;
    to?: number
  }>({}) // Filters voor land en jaartallen
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false) // Geeft aan of favoriet toggle bezig is
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite) // Lokale favoriet status voor directe UI update

  // Memoized filtered metrics op basis van filters
  const filteredMetrics = useMemo(() => {
    let filtered = metrics

    if (filters.country) {
      filtered = filtered.filter((m) => m.country === filters.country) // Filter op geselecteerd land
    }
    if (filters.from !== undefined) {
      filtered = filtered.filter((m) => m.year >= filters.from!) // Filter vanaf geselecteerd jaar
    }
    if (filters.to !== undefined) {

      filtered = filtered.filter((m) => m.year <= filters.to!) // Filter tot geselecteerd jaar
    }

    return filtered
  }, [metrics, filters]) // Wordt opnieuw berekend als metrics of filters veranderen

  // Functie om favoriet status te toggelen
  const handleToggleFavorite = async () => {

    if (!isAuthenticated) {
      alert('Log in om favoriete SDG\'s op te slaan') // Waarschuw de gebruiker als ze niet ingelogd zijn
      return
    }

    setIsTogglingFavorite(true) // Zet toggle loading aan
    try {
      // Verstuur PUT request naar API
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favoriteSdg: localIsFavorite ? null : sdg.number }), // Stuur SDG nummer als favoriet of verwijder
      })

      if (response.ok) {
        setLocalIsFavorite(!localIsFavorite) // Update lokale state na succesvolle API call
      }
    } catch (error) {
      console.error('Failed to update favorite:', error) // Log eventuele fouten
    } finally {
      setIsTogglingFavorite(false) // Zet toggle loading uit
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950"> {/* Hoofd container met achtergrond, ondersteunt dark mode */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Centreren van content met padding */}
        {/* Hero sectie met SDG icoon, titel, beschrijving en favoriet knop */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6"> {/* Flex layout voor icoon en tekst */}
            <div
              className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl flex-shrink-0"
              style={{ backgroundColor: sdg.color }}
            >
              {sdg.icon} {/* SDG icoon wordt hier getoond */}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                SDG {sdg.number}: {sdg.title} {/* Titel van SDG */}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {sdg.description} {/* Beschrijving van SDG */}
              </p>
              {isAuthenticated && (
                <Button
                  onClick={handleToggleFavorite} // Klik event om favoriet te toggelen
                  disabled={isTogglingFavorite} // Knop uitgeschakeld tijdens toggle
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  {localIsFavorite ? '⭐ Favorieten' : '☆ Toevoegen aan Favorieten'} {/* Tekst verandert afhankelijk van favoriet status */}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* KPI sectie */}
        <SDGKPIs sdgNumber={sdg.number} metrics={filteredMetrics} /> {/* Toon belangrijke statistieken */}

        {/* Filter balk */}
        <div className="mb-8">
          <FilterBar onFilterChange={setFilters} /> {/* Component om filters te veranderen */}
        </div>

        {/* Grafieken sectie */}
        <SDGCharts sdgNumber={sdg.number} metrics={filteredMetrics} color={sdg.color} /> {/* Toon grafieken afhankelijk van SDG */}

        {/* Gegevens tabel */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Gegevenstabel
              </h3>
              <Table
                data={filteredMetrics.slice(0, 50)} // Maximaal 50 rijen tonen
                columns={[
                  { key: 'country', label: 'Land' }, // Kolom land

                  { key: 'year', label: 'Jaar' }, // Kolom jaar

                  { key: 'metricKey', label: 'Statistiek' }, // Kolom naam van statistiek
                  {
                    key: 'value',
                    label: 'Waarde',
                    render: (item) => formatMetricValue(item.value), // Waarde formatteren
                  },
                  { key: 'source', label: 'Bron' }, // Kolom bron
                ]}
                enableExport // Export knop tonen
                exportFilename={`sdg-${sdg.number}-data.csv`} // Bestandsnaam bij export
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

  )
}

function SDGKPIs({ metrics }: { sdgNumber: number; metrics: SDGMetric[] }) {
  // Bereken KPI waarden
  const kpis = useMemo(() => {
    if (metrics.length === 0) return [] // Als er geen data is, retourneer lege array

    const latestYear = Math.max(...metrics.map((m) => m.year)) // Vind het laatste jaar in de data
    const previousYear = latestYear - 1 // Vorig jaar voor vergelijking
    const latestMetrics = metrics.filter((m) => m.year === latestYear) // Data van het laatste jaar
    const previousMetrics = metrics.filter((m) => m.year === previousYear) // Data van vorig jaar

    const uniqueMetricKeys = [...new Set(metrics.map((m) => m.metricKey))] // Unieke metriek keys

    return uniqueMetricKeys.slice(0, 4).map((key) => {
      const current = latestMetrics.filter((m) => m.metricKey === key) // Huidige metriek data
      const previous = previousMetrics.filter((m) => m.metricKey === key) // Vorige metriek data

      const currentAvg = calculateAverage(current.map((m) => m.value)) // Gemiddelde huidige waarde
      const previousAvg = calculateAverage(previous.map((m) => m.value)) // Gemiddelde vorige waarde

      const trend: 'up' | 'down' | 'stable' = currentAvg > previousAvg ? 'up' : currentAvg < previousAvg ? 'down' : 'stable' // Bepaal trend
      const trendValue = Math.abs(currentAvg - previousAvg).toFixed(2) // Verschil voor trend tonen

      return {
        label: key.replace(/_/g, ' ').toUpperCase(), // Label met spaties en hoofdletters
        value: currentAvg.toFixed(2), // Gemiddelde waarde als string
        trend, // Trend indicator
        trendValue: `${trendValue}`, // Waarde van trend verschil
      }
    })
  }, [metrics]) // Memoize afhankelijk van metrics

  if (kpis.length === 0) return null // Als er geen KPI's zijn, render niks

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> {/* Grid layout voor KPI kaarten */}
      {kpis.map((kpi, idx) => (
        <KPI key={idx} {...kpi} /> // Render KPI component met props
      ))}
    </div>
  )
}

// Component voor SDG grafieken
function SDGCharts({
  sdgNumber,
  metrics,
  color,
}: {
  sdgNumber: number
  metrics: SDGMetric[]
  color: string
}) {
  // Groepeer metrics per key
  const chartData = useMemo(() => {
    if (metrics.length === 0) return null // Geen data beschikbaar

    const byMetricKey = metrics.reduce((acc, m) => {
      if (!acc[m.metricKey]) acc[m.metricKey] = [] // Maak array aan als key nog niet bestaat
      acc[m.metricKey].push(m) // Voeg metriek toe
      return acc
    }, {} as Record<string, SDGMetric[]>)

    return byMetricKey // Retourneer object met metricKey => array van data
  }, [metrics])

  if (!chartData) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Geen gegevens beschikbaar voor grafieken {/* Fallback bericht */}
        </CardContent>
      </Card>
    )
  }
  // Specifieke grafieken per SDG nummer
  switch (sdgNumber) {
    case 3:
      return <SDG3Charts chartData={chartData} color={color} />
    case 4:
      return <SDG4Charts chartData={chartData} color={color} />
    case 7:
      return <SDG7Charts chartData={chartData} color={color} />
    case 11:
      return <SDG11Charts chartData={chartData} color={color} />
    default:
      return null
  }
}

// SDG 3 grafieken
function SDG3Charts({ chartData, color }: { chartData: Record<string, SDGMetric[]>; color: string }) {
  const lifeExpectancyData = chartData['lifeexpectancy'] || [] // Levensverwachting data
  const maternalMortalityData = chartData['maternalmortality_rate'] || [] // Moedersterfte data

  // Line chart data voorbereiden voor levensverwachting
  const lineChartData = {
    labels: [...new Set(lifeExpectancyData.map((m) => m.year.toString()))], // Unieke jaren
    datasets: [...new Set(lifeExpectancyData.map((m) => m.country))].map((country, idx) => ({
      label: country, // Land naam
      data: [...new Set(lifeExpectancyData.map((m) => m.year))].map((year) => {
        const metric = lifeExpectancyData.find((m) => m.country === country && m.year === year)
        return metric?.value || 0 // Waarde of 0 als niet beschikbaar
      }),
      borderColor: idx === 0 ? color : '#10b981', // Lijnkleur
      backgroundColor: (idx === 0 ? color : '#10b981') + '20', // Transparante achtergrond
    })),
  }

  // Bar chart data voor moedersterfte
  const barChartData = {
    labels: [...new Set(maternalMortalityData.map((m) => m.country))], // Lijst van landen
    datasets: [
      {
        label: 'Moedersterfte (per 100.000 levendgeborenen)', // Label dataset
        data: [...new Set(maternalMortalityData.map((m) => m.country))].map((country) => {
          const latest = maternalMortalityData.filter((m) => m.country === country).sort((a, b) => b.year - a.year)[0]
          return latest?.value || 0 // Laatste waarde van elk land
        }),
        backgroundColor: color, // Staafkleur
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {/* Twee kolommen voor grafieken */}
      {/* Lijn grafiek kaart */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Levensverwachting Trends
          </h3>
          <LineChart data={lineChartData} height={300} /> {/* Lijngrafiek component */}
        </CardContent>
      </Card>
      {/* Staaf grafiek kaart */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Moedersterfte per Land
          </h3>
          <BarChart data={barChartData} height={300} /> {/* Staafgrafiek component */}
        </CardContent>
      </Card>
    </div>
  )
}

// SDG 4 grafieken
function SDG4Charts({ chartData, color }: { chartData: Record<string, SDGMetric[]>; color: string }) {
  const literacyData = chartData['literacy_rate'] || [] // Geletterdheids data
  const enrollmentData = chartData['school_enrollment_rate'] || [] // School inschrijving data

  // Bar chart voor alfabetisering
  const barChartData = {
    labels: [...new Set(literacyData.map((m) => m.country))], // Landen
    datasets: [
      {
        label: 'Geletterdheidspercentage (%)', // Dataset label
        data: [...new Set(literacyData.map((m) => m.country))].map((country) => {
          const latest = literacyData.filter((m) => m.country === country).sort((a, b) => b.year - a.year)[0]
          return latest?.value || 0 // Laatste waarde
        }),
        backgroundColor: color, // Staaf kleur
      },
    ],
  }

  // Line chart voor schoolinschrijving
  const lineChartData = {
    labels: [...new Set(enrollmentData.map((m) => m.year.toString()))], // Jaren
    datasets: [...new Set(enrollmentData.map((m) => m.country))].map((country, idx) => ({
      label: country, // Land
      data: [...new Set(enrollmentData.map((m) => m.year))].map((year) => {
        const metric = enrollmentData.find((m) => m.country === country && m.year === year)
        return metric?.value || 0 // Waarde of 0
      }),
      borderColor: idx === 0 ? color : '#f59e0b', // Lijn kleur
      backgroundColor: (idx === 0 ? color : '#f59e0b') + '20', // Achtergrond kleur
    })),
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Geletterdheid per Land
          </h3>
          <BarChart data={barChartData} height={300} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Schoolinschrijvingspercentages Trends
          </h3>
          <LineChart data={lineChartData} height={300} />
        </CardContent>
      </Card>
    </div>
  )
}

// SDG 7 grafieken
function SDG7Charts({ chartData, color }: { chartData: Record<string, SDGMetric[]>; color: string }) {
  const renewableData = chartData['renewable_energy_percent'] || [] // Hernieuwbare energie
  const accessData = chartData['energy_access_percent'] || [] // Energie toegang

  // Line chart voor hernieuwbare energie trends
  const lineChartData = {
    labels: [...new Set(renewableData.map((m) => m.year.toString()))], // Jaren
    datasets: renewableData.reduce((acc, m) => {
      const existing = acc.find((d) => d.label === m.country)
      const yearIndex = acc[0]?.data.length || 0

      if (!existing) {
        acc.push({
          label: m.country, // Land
          data: Array(yearIndex).fill(0).concat([m.value || 0]), // Data array
          borderColor: color,
          backgroundColor: color + '20',
        })
      } else {
        existing.data.push(m.value || 0)
      }
      return acc
    }, [] as any[]),
  }

  // Bar chart voor energie toegang
  const barChartData = {
    labels: [...new Set(accessData.map((m) => m.country))], // Landen
    datasets: [
      {
        label: 'Energietoegang (%)', // Dataset label
        data: [...new Set(accessData.map((m) => m.country))].map((country) => {
          const metric = accessData.find((m) => m.country === country)
          return metric?.value || 0
        }),
        backgroundColor: color,
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Trends Hernieuwbare Energie
          </h3>
          <LineChart data={lineChartData} height={300} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Energietoegang per Regio
          </h3>
          <BarChart data={barChartData} height={300} />
        </CardContent>
      </Card>
    </div>
  )
}

// SDG 11 grafieken
function SDG11Charts({ chartData, color }: { chartData: Record<string, SDGMetric[]>; color: string }) {
  const urbanData = chartData['urban_population_percent'] || [] // Stedelijke bevolking
  const airData = chartData['pm25_air_pollution'] || [] // Luchtvervuiling PM2.5

  // Pie chart voor stedelijk vs landelijk
  const pieChartData = {
    labels: ['Stedelijk', 'Landelijk'],
    datasets: [
      {
        data: urbanData.length > 0
          ? [urbanData[0].value || 0, 100 - (urbanData[0].value || 0)] // Verdeling
          : [92, 8], // Standaardverdeling
        backgroundColor: [color, '#e5e7eb'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  }

  // Line chart voor luchtkwaliteit
  const lineChartData = {
    labels: [...new Set(airData.map((m) => m.year.toString()))], // Jaren
    datasets: [...new Set(airData.map((m) => m.country))].map((country, idx) => ({
      label: country, // Land
      data: [...new Set(airData.map((m) => m.year))].map((year) => {
        const metric = airData.find((m) => m.country === country && m.year === year)
        return metric?.value || 0
      }),
      borderColor: idx === 0 ? color : '#6366f1',
      backgroundColor: (idx === 0 ? color : '#6366f1') + '20',
    })),
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Stedelijke vs Landelijke Bevolking
          </h3>
          <PieChart data={pieChartData} height={300} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Luchtkwaliteit Trends (PM2.5)
          </h3>
          <LineChart data={lineChartData} height={300} />
        </CardContent>
      </Card>
    </div>
  )
}