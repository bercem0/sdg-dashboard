# Overview Pagina

Deze pagina toont een overzicht van alle 17 Duurzame Ontwikkelingsdoelen (SDGs).

## Wat moet deze pagina doen?

### 1. SDG Data Ophalen
- Gebruik de `getAllSDGs()` functie uit `@/lib/data`
- Dit geeft een array met alle 17 SDG's

### 2. SDG Cards Grid Weergeven
- Toon alle SDG's in een responsive grid
- Layout: 1 kolom (mobile), 2 kolommen (tablet), 3 kolommen (desktop)
- Gebruik de `Card` component uit `@/components/ui/Card`

### 3. Elke SDG Card Bevat

```
┌─────────────────────────────┐
│ [ICON]  SDG 7. Clean Energy │
│         Description...      │
│                             │
│         [Badge/Status]      │
└─────────────────────────────┘
```

**Informatie per SDG:**
- `sdg.icon` - Emoji icoon (⚡, 🌍, etc.)
- `sdg.number` - Nummer (1-17)
- `sdg.title` - Titel
- `sdg.description` - Beschrijving
- `sdg.color` - Kleur (gebruik voor icon achtergrond)
- `sdg.implemented` - Boolean (true = heeft dashboard)

**Badge:**
- Als `implemented === true`: Groene badge "Bekijk Dashboard →"
- Als `implemented === false`: Grijze badge "Binnenkort Beschikbaar"

### 4. Klikbaar maken
- Als SDG geïmplementeerd is: link naar `/sdg/{number}`
- Gebruik de `href` prop van de Card component
- Voeg hover effect toe

### 5. Styling Tips

**Grid Layout:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

**Icon met SDG kleur:**
```tsx
<div 
  className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
  style={{ backgroundColor: sdg.color }}
>
  {sdg.icon}
</div>
```

**Opacity voor niet-geïmplementeerde SDGs:**
```tsx
<Card className={sdg.implemented ? '' : 'opacity-60'}>
```

## Optioneel: Extra Features

### Favoriete SDG
Als je authenticatie hebt geïmplementeerd:
- Haal gebruikers favoriete SDG op
- Toon ster icoon bij favoriete SDG
- Sorteer om favoriete bovenaan te tonen

### Filter Functie
- Voeg filter toe: "Alleen geïmplementeerd"
- Zoekbalk voor SDG titel/nummer

### Info Sectie
Onderaan de pagina:
- Uitleg over dit dashboard
- Link naar externe bronnen
- Statistieken (bijv. "4 van 17 SDGs geïmplementeerd")

## Voorbeeld Structuur

```tsx
import { Card, CardContent } from '@/components/ui/Card'
import { getAllSDGs } from '@/lib/data'

export default async function OverviewPage() {
  const allSDGs = getAllSDGs()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Duurzame Ontwikkelingsdoelen
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            De 17 Duurzame Ontwikkelingsdoelen...
          </p>
        </div>

        {/* SDG Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSDGs.map((sdg) => (
            <Card key={sdg.number} href={...} hover={...}>
              {/* TODO: Card content */}
            </Card>
          ))}
        </div>

      </div>
    </div>
  )
}
```

## Metadata

Vergeet niet de metadata toe te voegen:

```tsx
export const metadata = {
  title: 'Overzicht | SDG Dashboard',
  description: 'Bekijk alle Duurzame Ontwikkelingsdoelen',
}
```

## Testen

1. Start dev server: `npm run dev`
2. Ga naar `http://localhost:3000`
3. Zou moeten redirecten naar `/overview`
4. Controleer:
   - [ ] Alle 17 SDGs worden getoond
   - [ ] Grid is responsive
   - [ ] Kleuren kloppen
   - [ ] Hover effects werken
   - [ ] Links naar detail pagina's werken

## Resources

- SDG data zit in: `data/sdg-info.json`
- Helper functie: `lib/data.ts` - `getAllSDGs()`
- Card component: `components/ui/Card.tsx`


