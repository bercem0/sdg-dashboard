import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Sample SDG 7: Clean Energy metrics
  const sdg7Metrics = [
    { country: 'Netherlands', year: 2022, metricKey: 'renewable_energy_percent', value: 16.8 },
    { country: 'Germany', year: 2022, metricKey: 'renewable_energy_percent', value: 21.4 },
  ]

  // Sample SDG 13: Climate Action metrics
  const sdg13Metrics = [
    { country: 'Netherlands', year: 2022, metricKey: 'co2_per_capita', value: 8.2 },
    { country: 'Germany', year: 2022, metricKey: 'co2_per_capita', value: 7.7 },
  ]

  const allMetrics = [
    ...sdg7Metrics.map(m => ({ ...m, sdgNumber: 7, source: 'IEA World Energy Statistics' })),
    ...sdg13Metrics.map(m => ({ ...m, sdgNumber: 13, source: 'Global Carbon Project' })),
  ]

  // Insert all metrics
  for (const metric of allMetrics) {
    await prisma.sdgMetric.upsert({
      where: {
        id: `${metric.sdgNumber}-${metric.country}-${metric.year}-${metric.metricKey}`,
      },
      update: metric,
      create: {
        id: `${metric.sdgNumber}-${metric.country}-${metric.year}-${metric.metricKey}`,
        ...metric,
      },
    })
  }

  console.log(`✅ Created ${allMetrics.length} sample SDG metrics`)
  
  // TODO: Students can add more seed data as needed
  // - Add more years of data for trend analysis
  // - Add more countries for regional comparisons
  // - Add more SDG goals (11, 15, etc.)
  // - Add user accounts if implementing authentication
  
  console.log('🌱 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

