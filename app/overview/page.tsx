import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { getAllSDGs } from '@/lib/data'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Overzicht | SDG Dashboard',
  description: 'Bekijk alle Duurzame Ontwikkelingsdoelen',
}

async function getUserFavorite(): Promise<number | null> {
  return null
}

export default async function OverviewPage() {
  const favoriteSdg = await getUserFavorite()
  const allSDGs = getAllSDGs()

  const sortedSDGs = favoriteSdg
    ? [
        ...allSDGs.filter((sdg) => sdg.number === favoriteSdg),
        ...allSDGs.filter((sdg) => sdg.number !== favoriteSdg),
      ]
    : allSDGs

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Duurzame Ontwikkelingsdoelen
          </h1>        
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          De 17 Duurzame Ontwikkelingsdoelen zijn een universele oproep tot actie om armoede te beëindigen, de planeet te beschermen en welvaart voor iedereen te waarborgen tegen 2030.
          </p>
          {favoriteSdg && (
            <p className="mt-4 text-sm text-blue-600 dark:text-blue-400">
              ⭐ Uw favoriete SDG wordt als eerste getoond
            </p>
          )}
        </div>

        {/* SDG Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSDGs.map((sdg) => {
            const isImplemented = !!sdg.implemented // Alleen moet het 3,4,7,11 zijn
            const content = (
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: sdg.color }}>
                    {sdg.icon ?? sdg.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {sdg.number}. {sdg.title}
                      </h3>
                      {favoriteSdg === sdg.number && <span className="text-yellow-500">⭐</span>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {sdg.description}
                    </p>
                    {isImplemented ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Bekijk Dashboard →
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        Binnenkort Beschikbaar
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>)
            return isImplemented ? (
              <Card
                key={sdg.number}
                href={`/sdg/${sdg.number}`}
                hover>
                {content}
              </Card>
            ) : (
              <Card
                key={sdg.number}
                className="opacity-60 cursor-not-allowed">
                {content}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}