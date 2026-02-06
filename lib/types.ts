export interface SDGInfo {
  number: number
  title: string
  description: string
  color: string
  icon: string
  implemented: boolean
}

export interface SDGMetric {
  id: string
  sdgNumber: number
  country: string
  year: number
  metricKey: string
  value: number | null
  source?: string | null
  createdAt?: Date
}

export interface SDGDataPoint {
  label: string
  value: number
  year?: number
  country?: string
}

export interface FilterOptions {
  goal?: number
  region?: string
  country?: string
  from?: number
  to?: number
}

export interface KPIData {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  unit?: string
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
  borderWidth?: number
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export type Region = 'Global' | 'Europe' | 'Asia' | 'Africa' | 'Americas' | 'Oceania'

export const REGIONS: Region[] = ['Global', 'Europe', 'Asia', 'Africa', 'Americas', 'Oceania']

export const COUNTRIES_BY_REGION: Record<Region, string[]> = {
  Global: ['All Countries'],
  Europe: ['Netherlands', 'Germany', 'France', 'United Kingdom', 'Spain', 'Italy'],
  Asia: ['China', 'India', 'Japan', 'South Korea', 'Indonesia'],
  Africa: ['Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Ethiopia'],
  Americas: ['United States', 'Brazil', 'Canada', 'Mexico', 'Argentina'],
  Oceania: ['Australia', 'New Zealand', 'Fiji'],
}

