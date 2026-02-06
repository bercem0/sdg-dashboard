/* Deze pagina/component draait in de browser, client-side */
'use client';

/* React importeren om componenten te maken */
import React from 'react';

/* Chart.js modules importeren voor line chart */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

/* React wrapper voor Chart.js line chart */
import { Line } from 'react-chartjs-2';

/* Registreren van Chart.js onderdelen zodat chart werkt */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/* Props voor LineChart component */
/* Data = labels en datasets voor de chart */
/* Title = optioneel, tekst boven de chart */
/* Loading = true als chart nog laadt */
/* Error = foutmelding als er iets mis gaat */
/* Height = hoogte van chart container */
interface LineChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }>;
  };
  title?: string;
  loading?: boolean;
  error?: string;
  height?: number;
}

/* LineChart component maken */
/* Dit toont een line chart met de gegeven data */
export function LineChart({ data, title, loading, error, height = 300 }: LineChartProps) {
  /* Chart.js opties instellen */
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  /* Toon loading tekst als chart nog niet klaar is */
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
      </div>
    );
  }

  /* Toon error als er iets mis is gegaan */
  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  /* Toon no data als labels of datasets leeg zijn */
  if (!data.datasets.length || !data.labels.length) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500 dark:text-gray-400">No data available</div>
      </div>
    );
  }

  /* Toon de chart */
  return (
    <div style={{ height }}>
      <Line options={options} data={data} />
    </div>
  );
}