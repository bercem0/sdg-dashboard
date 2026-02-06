import React from 'react'
// KPIData type importeren, dit vertelt wat een KPI nodig heeft
import { KPIData } from '@/lib/types'

// KPIProps = KPIData + optioneel className
interface KPIProps extends KPIData {
  className?: string  // Je kan extra CSS class geven als je wilt
}

// --- KPI Component ---
export function KPI({ label, value, trend, trendValue, unit, className = '' }: KPIProps) {

  // --- Functie om trend icoon te kiezen ---
  const getTrendIcon = () => {
    if (!trend) return null            // Als er geen trend is → niks tonen
    if (trend === 'up') return '↑'     // Up → pijltje omhoog
    if (trend === 'down') return '↓'   // Down → pijltje omlaag
    return '→'                          // Stable → pijltje naar rechts
  }

  // --- Functie om trend kleur te kiezen ---
  const getTrendColor = () => {
    if (!trend) return ''                                // Geen trend → geen kleur
    if (trend === 'up') return 'text-green-600 dark:text-green-400'   // Up → groen
    if (trend === 'down') return 'text-red-600 dark:text-red-400'     // Down → rood
    return 'text-gray-600 dark:text-gray-400'                          // Stable → grijs
  }

  return (
    // --- Container div van de KPI ---
    <div className={`
      bg-white dark:bg-gray-800       // Wit in lichtmode, donker in darkmode
      rounded-lg                     // Ronde hoeken
      shadow                         // Schaduw effect
      p-6                            // Padding rondom
      border border-gray-200 dark:border-gray-700 // Rand kleur
      ${className}                   // Extra styling als className is meegegeven
    `}>
      
      {/* Label boven de waarde */}
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {label} {/* Naam van KPI, bv. "Levensverwachting" */}
      </p>
      
      {/* Waarde en trend */}
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {value}  {/* KPI waarde, bv. 78.5 */}
          {unit && <span className="text-xl ml-1">{unit}</span>} {/* Eenheid, bv. jaar of % */}
        </p>

        {/* Trend tonen als aanwezig */}
        {trend && (
          <span className={`text-sm font-medium flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()} {/* Trend icoon: ↑, ↓ of → */}
            {trendValue && <span>{trendValue}</span>} {/* Verschil van vorig jaar, bv. +1.2 */}
          </span>
        )}
      </div>
    </div>
  )
}