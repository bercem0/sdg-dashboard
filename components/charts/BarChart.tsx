"use client";

import React from 'react'
// Import de onderdelen van Chart.js
import {
  Chart as ChartJS,        // Hoofd ChartJS klasse
  CategoryScale,           // Categorie schaal (bijv. x-as)
  LinearScale,             // Lineaire schaal (bijv. y-as)
  BarElement,              // Staaf element
  Title,                   // Titel plugin
  Tooltip,                 // Tooltip plugin
  Legend,                  // Legenda plugin
  ChartOptions,            // Type voor opties
} from 'chart.js'
import { Bar } from 'react-chartjs-2' // React component voor staafdiagram

// Registreer ChartJS onderdelen
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Definieer de props van de BarChart
interface BarChartProps {
  data: {
    labels: string[]                    // Namen van de categorieën
    datasets: Array<{
      label: string                      // Naam van de dataset
      data: (number | null)[]            // Data waarden
      backgroundColor?: string | string[] // Kleur van de staven
      borderColor?: string | string[]     // Randkleur van de staven
      borderWidth?: number                // Dikte van de rand
    }>
  }
  title?: string                         // Titel van de grafiek
  loading?: boolean                      // Staat de data nog inladen?
  error?: string                         // Foutmelding
  height?: number                        // Hoogte van de grafiek
  horizontal?: boolean                   // Horizontaal of verticaal
}

// Definieer de BarChart component
export function BarChart({
  data,
  title,
  loading,
  error,
  height = 300,    // Standaard hoogte is 300px
  horizontal = false, // Standaard verticale grafiek
}: BarChartProps) {
  // Opties voor de grafiek
  const options: ChartOptions<'bar'> = {
    responsive: true,          // Grafiek past zich aan scherm aan
    maintainAspectRatio: false,// Hoogte en breedte kunnen worden aangepast
    indexAxis: horizontal ? 'y' : 'x', // Horizontaal of verticaal
    plugins: {
      legend: {
        position: 'top' as const,      // Legenda bovenaan
      },
      title: {
        display: !!title,              // Toon titel als die er is
        text: title,                   // Tekst van de titel
      },
    },
    scales: {
      y: {
        beginAtZero: true,            // Y-as begint bij 0
      },
    },
  }

  // Als data nog laden
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500 dark:text-gray-400">Grafiek wordt geladen...</div>
      </div>
    )
  }

  // Als er een fout is
  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-red-600 dark:text-red-400">Fout: {error}</div>
      </div>
    )
  }

  // Als er geen data is
  if (!data.datasets.length || !data.labels.length) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500 dark:text-gray-400">Geen data beschikbaar</div>
      </div>
    )
  }

  // Toon de grafiek
  return (
    <div style={{ height }}>
      <Bar options={options} data={data} />
    </div>
  )
}