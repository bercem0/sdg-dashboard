import { notFound } from 'next/navigation' // Als SDG niet bestaat, laat 404 pagina zien
import type { Metadata } from 'next'      // Voor SEO titels en beschrijvingen
import { getSDGById } from '@/lib/data'   // Haal SDG info (nummer, titel, kleur, icon)
import { prisma } from '@/lib/prisma'     // Database verbinding
import { SDGDetailClient } from './SDGDetailClient' // Frontend component voor SDG detail
import type { SDGMetric } from '@/lib/types' // Type voor metrics

// --- Welke SDG pagina's gaan we statisch maken ---
export async function generateStaticParams() {
  // Hier maken we 4 pagina's: SDG 3,4,7,11
  return [{ id: '3' }, { id: '4' }, { id: '7' }, { id: '11' }]
}

type PageProps = { params: { id: string } } // Props van de pagina

// --- Metadata voor SEO ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = Number(params.id) // Zet id string om naar nummer
  const sdg = Number.isFinite(id) ? getSDGById(id) : undefined // Haal SDG info op

  if (!sdg) {
    // Als SDG niet bestaat, titel 'Niet gevonden'
    return { title: 'SDG Niet Gevonden' }
  }

  // Als SDG bestaat, zet titel en beschrijving voor SEO
  return {
    title: `SDG ${sdg.number}: ${sdg.title} | SDG Dashboard`,
    description: sdg.description,
  }
}

// --- Data ophalen van database ---
async function getSDGData(sdgNumber: number) {
  const metrics: SDGMetric[] = [] // Hier bewaren we alle metrics

  // Haal alle data op van prisma (database)
  const data = await prisma.sdgvalue.findMany({
    where: {
      sdgserie: {
        indicator: {
          startsWith: `${sdgNumber}.`, // Alleen de indicatoren voor deze SDG
        },
      },
    },
    include: {
      sdgserie: true,    // Haal ook info over de serie (indicator, source)
      sdgcountry: true,  // Haal ook land info
    },
    orderBy: {
      year: "asc", // Sorteer op jaar van oud naar nieuw
    },
  })

  // --- Welke indicatoren horen bij welke SDG ---
  const metricMapping: Record<number, string[]> = {
    3: ["3.1", "3.2"],   // SDG 3 heeft 2 indicatoren
    4: ["4.1", "4.2"],   // SDG 4
    7: ["7.1", "7.2"],   // SDG 7
    11: ["11.1", "11.6"],// SDG 11
  }

  // --- Zet indicator codes om naar metricKeys voor frontend ---
  const metricKeys: Record<string, string> = {
    "3.1": "maternalmortality_rate", // moedersterfte
    "3.2": "lifeexpectancy",         // levensverwachting
    "4.1": "literacy_rate",          // alfabetisering
    "4.2": "school_enrollment_rate", // school inschrijving
    "7.1": "energy_access_percent",  // energie toegang
    "7.2": "renewable_energy_percent", // hernieuwbare energie
    "11.1": "urban_population_percent", // stedelijke bevolking
    "11.6": "pm25_air_pollution",       // luchtkwaliteit
  }

  const expectedIndicators = metricMapping[sdgNumber] // Welke indicators verwachten we

  // --- Maak echte metrics van de database data ---
  const realMetrics = data.map((item) => {
    const indicator = item.sdgserie?.indicator ?? "" // haal indicator code
    const foundPrefix = expectedIndicators.find((pref) =>
      indicator.startsWith(pref) // check of indicator erbij hoort
    )

    return {
      id: String(item.id),
      sdgNumber,                       // SDG nummer
      country: item.sdgcountry?.name ?? "Unknown", // land naam
      year: item.year ?? 0,             // jaar
      metricKey: foundPrefix ? metricKeys[foundPrefix] : "unknown", // frontend key
      value: item.value ? Number(item.value) : null, // waarde als nummer
      source: item.sdgserie?.source ?? null, // bron
    }
  })

  metrics.push(...realMetrics) // voeg toe aan metrics array

  // --- Voeg placeholder metrics toe als er geen data is ---
  expectedIndicators.forEach((indicatorPrefix) => {
    const metricKey = metricKeys[indicatorPrefix]

    const exists = metrics.some((m) => m.metricKey === metricKey)
    if (!exists) {
      // Als metric nog niet bestaat, voeg lege placeholder toe
      metrics.push({
        id: `placeholder-${metricKey}`,
        sdgNumber,
        country: "Unknown",
        year: 0,
        metricKey,
        value: null,
        source: null,
      })
    }
  })

  return metrics
}

// --- Hoofd pagina component ---
export default async function SDGDetailPage({ params }: PageProps) {
  const sdgNumber = Number(params.id)
  if (!Number.isFinite(sdgNumber)) {
    notFound() // Als id geen nummer is, laat 404 zien
  }

  const sdg = getSDGById(sdgNumber) // Haal SDG info
  if (!sdg || !sdg.implemented) {
    notFound() // Als SDG niet geïmplementeerd, 404
  }

  const metrics = await getSDGData(sdgNumber) // Haal metrics van DB

  // --- Stuur data naar frontend component ---
  return (
    <SDGDetailClient
      sdg={sdg}
      metrics={metrics}   
      isAuthenticated={true} // gebruiker is niet ingelogd
      isFavorite={true}      // nog geen favoriet
    />
  )
}