# Chart Componenten

In deze map maak je de grafiek componenten voor het visualiseren van SDG data.

## Voorbeeldcomponent

**`BarChart.tsx`** is al gemaakt als voorbeeld. Dit laat zien hoe je Chart.js integreert in een React component.

### Hoe werkt BarChart.tsx?

1. Importeert Chart.js componenten
2. Registreert benodigde Chart.js modules
3. Accepteert `data` prop met labels en datasets
4. Configureert responsive gedrag
5. Rendert de chart

## Te Bouwen Componenten

### 1. LineChart.tsx

Een lijngrafiek voor het tonen van trends over tijd.

**Props:**
```typescript
interface LineChartProps {
  data: {
    labels: string[]  // bijv. ['2018', '2019', '2020']
    datasets: {
      label: string
      data: number[]
      borderColor?: string
      backgroundColor?: string
      borderWidth?: number
    }[]
  }
  height?: number
  className?: string
}
```

### 2. PieChart.tsx

Een taartdiagram voor het tonen van verhoudingen.

**Props:**
```typescript
interface PieChartProps {
  data: {
    labels: string[]
    datasets: {
      data: number[]
      backgroundColor?: string[]
      borderColor?: string[]
      borderWidth?: number
    }[]
  }
  height?: number
  className?: string
}
```

---

## Tips

- [Chart.js Documentatie](https://www.chartjs.org/docs/)
- [react-chartjs-2 Documentatie](https://react-chartjs-2.js.org/)
- [Chart.js Voorbeelden](https://www.chartjs.org/docs/latest/samples/)
- [Kleuren Kiezen](https://colorhunt.co/)


