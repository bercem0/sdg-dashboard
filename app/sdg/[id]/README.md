# SDG Detail Pagina

Deze pagina toont gedetailleerde informatie en visualisaties voor een specifiek SDG.

## Structuur

Deze map bevat twee bestanden:
- **`page.tsx`** - Server Component (data fetching)
- **`SDGDetailClient.tsx`** - Client Component (interactiviteit)

## page.tsx - Server Component

Dit bestand:
1. Haalt SDG informatie op
2. Haalt metrics data uit database
3. Geeft data door aan Client Component

### Taken

**1. SDG Validatie**
```typescript
const sdgNumber = parseInt(params.id)
const sdg = getSDGById(sdgNumber)

if (!sdg || !sdg.implemented) {
  notFound() // Toon 404 pagina
}
```

**2. Data Ophalen**
```typescript
// Haal metrics uit database voor dit SDG
const metrics = await prisma.sdgMetric.findMany({
  where: { sdgNumber },
  orderBy: [{ year: 'asc' }, { country: 'asc' }],
})
```

**3. Metadata Genereren**
```typescript
export async function generateMetadata({ params }: { params: { id: string } }) {
  const sdg = getSDGById(parseInt(params.id))
  return {
    title: `SDG ${sdg.number}: ${sdg.title}`,
    description: sdg.description,
  }
}
```

**4. Static Params**
Geef aan welke SDG's geïmplementeerd zijn:
```typescript
export async function generateStaticParams() {
  return [
    { id: '7' },
    { id: '11' },
    { id: '13' },
    { id: '15' },
  ]
}
```

## SDGDetailClient.tsx - Client Component

Dit bestand bevat alle interactieve elementen:

### 1. Hero Section
```
┌────────────────────────────────────┐
│ [ICON]  SDG 13: Klimaatactie      │
│         Beschrijving...            │
│         [☆ Favoriet Knop]         │
└────────────────────────────────────┘
```

**Elementen:**
- Grote SDG icon met kleur achtergrond
- SDG nummer en titel
- Beschrijving
- Favoriet knop (optioneel, bij authenticatie)

### 2. KPI Section
Toon 4 belangrijke statistieken:
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ KPI 1    │ │ KPI 2    │ │ KPI 3    │ │ KPI 4    │
│ 42.5%    │ │ 8.2      │ │ 100      │ │ 15.3%    │
│ ↑ 2.3    │ │ ↓ 0.5    │ │ →        │ │ ↑ 1.2    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Berekeningen:**
- Vind laatste jaar in data
- Vind vorig jaar
- Bereken gemiddelde per metric key
- Bereken trend (up/down/stable)
- Gebruik `KPI` component

**Helper functies:**
```typescript
import { calculateAverage, calculateTrend } from '@/lib/data'
```

### 3. Filter Bar
```
[ Land ▼ ] [ Van: 2018 ] [ Tot: 2023 ] [ Reset ]
```

**State Management:**
```typescript
const [filters, setFilters] = useState<{
  country?: string
  from?: number
  to?: number
}>({})
```

**Filter Logica:**
```typescript
const filteredMetrics = useMemo(() => {
  let filtered = metrics
  
  if (filters.country) {
    filtered = filtered.filter(m => m.country === filters.country)
  }
  if (filters.from) {
    filtered = filtered.filter(m => m.year >= filters.from)
  }
  if (filters.to) {
    filtered = filtered.filter(m => m.year <= filters.to)
  }
  
  return filtered
}, [metrics, filters])
```

### 4. Charts Section

**Groupeer data per metric key:**
```typescript
const chartData = useMemo(() => {
  if (metrics.length === 0) return null

  const byMetricKey = metrics.reduce((acc, m) => {
    if (!acc[m.metricKey]) acc[m.metricKey] = []
    acc[m.metricKey].push(m)
    return acc
  }, {} as Record<string, SDGMetric[]>)

  return byMetricKey
}, [filteredMetrics])
```

**Maak charts per SDG:**

**SDG 7 (Clean Energy):**
- Line chart: Hernieuwbare energie % per land over tijd
- Bar chart: Energietoegang % per land

**SDG 11 (Sustainable Cities):**
- Pie chart: Stedelijke vs Landelijke bevolking
- Line chart: Luchtkwaliteit (PM2.5) over tijd

**SDG 13 (Climate Action):**
- Line chart: CO2 uitstoot per capita over tijd (meerdere landen)

**SDG 15 (Life on Land):**
- Bar chart: Bosbedekking % per land
- Bar chart: Biodiversiteitsindex

**Voorbeeld LineChart data:**
```typescript
const lineChartData = {
  labels: ['2018', '2019', '2020', '2021', '2022'],
  datasets: [
    {
      label: 'Nederland',
      data: [9.8, 9.3, 8.5, 8.8, 8.2],
      borderColor: sdg.color,
      backgroundColor: sdg.color + '20',
    },
    {
      label: 'Duitsland',
      data: [9.1, 8.6, 7.8, 8.1, 7.7],
      borderColor: '#6366f1',
      backgroundColor: '#6366f120',
    },
  ],
}
```

### 5. Data Table

```
┌────────────────────────────────────────────────┐
│ Land      │ Jaar │ Metric        │ Waarde      │
├────────────────────────────────────────────────┤
│ Nederland │ 2022 │ co2_per_capita│ 8.2         │
│ Duitsland │ 2022 │ co2_per_capita│ 7.7         │
│ ...       │ ...  │ ...           │ ...         │
└────────────────────────────────────────────────┘
                            [Export CSV]
```

**Gebruik Table component:**
```typescript
<Table
  data={filteredMetrics}
  columns={[
    { key: 'country', label: 'Land' },
    { key: 'year', label: 'Jaar' },
    { key: 'metricKey', label: 'Metric' },
    { 
      key: 'value', 
      label: 'Waarde',
      render: (item) => formatMetricValue(item.value)
    },
    { key: 'source', label: 'Bron' },
  ]}
  enableExport
  exportFilename={`sdg-${sdg.number}-data.csv`}
/>
```

## Data Flow

```
Database (Prisma)
    ↓
page.tsx (Server Component)
    ↓ props
SDGDetailClient.tsx (Client Component)
    ↓ state
FilterBar → filteredMetrics → Charts & Table
```

## State Management

```typescript
// Filter state
const [filters, setFilters] = useState<FilterOptions>({})

// Derived state
const filteredMetrics = useMemo(() => {
  // filter logic
}, [metrics, filters])

// Chart data
const chartData = useMemo(() => {
  // group by metric key
}, [filteredMetrics])
```

## Optioneel: Favorieten

Als je authenticatie hebt:

```typescript
const [isFavorite, setIsFavorite] = useState(props.isFavorite)

async function handleToggleFavorite() {
  const response = await fetch('/api/user/preferences', {
    method: 'PUT',
    body: JSON.stringify({ 
      favoriteSdg: isFavorite ? null : sdg.number 
    }),
  })
  
  if (response.ok) {
    setIsFavorite(!isFavorite)
  }
}
```

## Tips

### Chart Colors
Gebruik de SDG kleur voor primaire dataset:
```typescript
borderColor: sdg.color
backgroundColor: sdg.color + '20' // 20 = opacity
```

### Responsive Layout
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card>{/* Chart 1 */}</Card>
  <Card>{/* Chart 2 */}</Card>
</div>
```

### Loading States
```typescript
if (metrics.length === 0) {
  return <div>Geen data beschikbaar</div>
}
```

### Error Handling
```typescript
try {
  const response = await fetch('...')
  if (!response.ok) throw new Error('Failed')
} catch (error) {
  console.error(error)
  // Toon error message
}
```

## Testen

1. Ga naar `/sdg/7` (of ander geïmplementeerd SDG)
2. Controleer:
   - [ ] Hero section toont SDG info
   - [ ] KPIs worden berekend en getoond
   - [ ] Filters werken
   - [ ] Charts tonen data correct
   - [ ] Table toont alle metrics
   - [ ] Export naar CSV werkt

## Resources

- Helper functies: `lib/data.ts`
- Types: `lib/types.ts`
- Prisma client: `lib/prisma.ts`
- Chart componenten: `components/charts/`
- UI componenten: `components/ui/`


