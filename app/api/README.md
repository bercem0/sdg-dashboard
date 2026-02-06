# API Routes

In deze map maak je de API endpoints voor je SDG Dashboard.

## Next.js Route Handlers

Next.js 14 gebruikt **Route Handlers** in plaats van API Routes.

### Basis Structuur

Elk bestand `route.ts` in de `app/api/` map wordt een endpoint:

```
app/api/sdg/route.ts      →  /api/sdg
app/api/metrics/route.ts  →  /api/metrics
```

### HTTP Methods

Export functies met HTTP method namen:

```typescript
// GET request
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' })
}

// POST request
export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}

// PUT, DELETE, PATCH ook mogelijk
```

## Te Bouwen Endpoints

### 1. GET /api/sdg

Haal SDG metrics op met filters.

**Query Parameters:**
- `goal` - SDG nummer (1-17)
- `country` - Land naam
- `from` - Vanaf jaar
- `to` - Tot jaar

**Voorbeeld:**
```
GET /api/sdg?goal=7&country=Netherlands&from=2020&to=2022
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "filters": {
    "goal": 7,
    "country": "Netherlands",
    "from": 2020,
    "to": 2022
  },
  "data": [
    {
      "id": "...",
      "sdgNumber": 7,
      "country": "Netherlands",
      "year": 2020,
      "metricKey": "renewable_energy_percent",
      "value": 14.0,
      "source": "IEA"
    },
    // ...
  ]
}
```

**Implementatie Stappen:**

1. **Query Parameters Ophalen**
```typescript
const searchParams = request.nextUrl.searchParams
const goal = searchParams.get('goal')
const country = searchParams.get('country')
const from = searchParams.get('from')
const to = searchParams.get('to')
```

2. **Validatie met Zod**
```typescript
import { z } from 'zod'

const querySchema = z.object({
  goal: z.coerce.number().int().min(1).max(17).optional(),
  country: z.string().optional(),
  from: z.coerce.number().int().min(1900).max(2100).optional(),
  to: z.coerce.number().int().min(1900).max(2100).optional(),
})

const validated = querySchema.safeParse({...params})
if (!validated.success) {
  return NextResponse.json(
    { error: 'Invalid parameters' },
    { status: 400 }
  )
}
```

3. **Database Query**
```typescript
import { prisma } from '@/lib/prisma'

const whereClause: any = {}
if (validated.data.goal) {
  whereClause.sdgNumber = validated.data.goal
}
if (validated.data.country) {
  whereClause.country = validated.data.country
}
if (validated.data.from || validated.data.to) {
  whereClause.year = {}
  if (validated.data.from) whereClause.year.gte = validated.data.from
  if (validated.data.to) whereClause.year.lte = validated.data.to
}

const metrics = await prisma.sdgMetric.findMany({
  where: whereClause,
  orderBy: [{ year: 'asc' }, { country: 'asc' }],
})
```

4. **Response Formatteren**
```typescript
return NextResponse.json({
  success: true,
  count: metrics.length,
  filters: validated.data,
  data: metrics,
})
```

5. **Error Handling**
```typescript
try {
  // ... je code
} catch (error) {
  console.error('Error:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

---

### 2. GET /api/metrics

Haal specifieke metrics op.

**Query Parameters:**
- `goal` - SDG nummer
- `metricKey` - Metric type (bijv. "co2_per_capita")

**Voorbeeld:**
```
GET /api/metrics?goal=13&metricKey=co2_per_capita
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

---

### 3. POST /api/metrics

Maak nieuwe metric aan.

**Request Body:**
```json
{
  "sdgNumber": 7,
  "country": "Belgium",
  "year": 2023,
  "metricKey": "renewable_energy_percent",
  "value": 18.5,
  "source": "IEA"
}
```

**Validatie Schema:**
```typescript
const createMetricSchema = z.object({
  sdgNumber: z.number().int().min(1).max(17),
  country: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  metricKey: z.string().min(1),
  value: z.number().nullable(),
  source: z.string().optional(),
})
```

**Database Create:**
```typescript
const body = await request.json()
const validated = createMetricSchema.safeParse(body)

if (!validated.success) {
  return NextResponse.json(
    { error: 'Invalid data' },
    { status: 400 }
  )
}

const metric = await prisma.sdgMetric.create({
  data: validated.data,
})

return NextResponse.json(
  { success: true, data: metric },
  { status: 201 }
)
```

**Optioneel: Authenticatie Check**
```typescript
// Alleen als je authenticatie hebt geïmplementeerd
const session = await auth()
if (!session?.user) {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}
```

---

## Tips

### CORS Headers (optioneel)
```typescript
const response = NextResponse.json({ data })
response.headers.set('Access-Control-Allow-Origin', '*')
return response
```

### Request Body Lezen
```typescript
const body = await request.json()
```

### Headers Lezen
```typescript
const token = request.headers.get('Authorization')
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validatie fout)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

### TypeScript Types
```typescript
import { NextRequest, NextResponse } from 'next/server'
```

## Testen

### Met Browser
Open in browser:
```
http://localhost:3000/api/sdg?goal=7
```

### Met curl
```bash
# GET
curl http://localhost:3000/api/sdg?goal=7

# POST
curl -X POST http://localhost:3000/api/metrics \
  -H "Content-Type: application/json" \
  -d '{"sdgNumber": 7, "country": "Belgium", ...}'
```

### Met Thunder Client (VS Code Extension)
1. Installeer Thunder Client extension
2. Maak nieuwe request
3. Test je endpoints

### Met Postman
1. Download Postman
2. Maak nieuwe collection
3. Voeg requests toe

## Resources

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Validation](https://zod.dev/)
- [Prisma Queries](https://www.prisma.io/docs/concepts/components/prisma-client/crud)


