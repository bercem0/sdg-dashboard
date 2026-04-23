import type { Metadata } from "next";
import { getSDGById } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { SDGDetailClient } from "./SDGDetailClient";
import type { SDGMetric } from "@/lib/types";
import { notFound } from "next/navigation";

// Bu sayfanın build sırasında değil, sadece istek anında render edilmesini zorunlu tutar
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type PageProps = {
  params: { id: string };
};

// --- SEO ---
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const id = Number(params.id);
  const sdg = Number.isFinite(id) ? getSDGById(id) : undefined;

  if (!sdg) {
    return { title: "SDG Niet Gevonden" };
  }

  return {
    title: `SDG ${sdg.number}: ${sdg.title} | SDG Dashboard`,
    description: sdg.description,
  };
}

// --- SAFE DB FETCH ---
async function getSDGData(sdgNumber: number): Promise<SDGMetric[]> {
  try {
    const data = await prisma.sdgvalue.findMany({
      where: {
        sdgserie: {
          indicator: {
            startsWith: `${sdgNumber}.`,
          },
        },
      },
      select: {
        id: true,
        year: true,
        value: true,
        sdgserie: {
          select: {
            indicator: true,
            source: true,
          },
        },
        sdgcountry: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        year: "asc",
      },
    });

    const metricMapping: Record<number, string[]> = {
      3: ["3.1", "3.2"],
      4: ["4.1", "4.2"],
      7: ["7.1", "7.2"],
      11: ["11.1", "11.6"],
    };

    const metricKeys: Record<string, string> = {
      "3.1": "maternalmortality_rate",
      "3.2": "lifeexpectancy",
      "4.1": "literacy_rate",
      "4.2": "school_enrollment_rate",
      "7.1": "energy_access_percent",
      "7.2": "renewable_energy_percent",
      "11.1": "urban_population_percent",
      "11.6": "pm25_air_pollution",
    };

    const expectedIndicators = metricMapping[sdgNumber] || [];
    
    // Verileri işle
    const metrics: SDGMetric[] = data.map((item) => {
      const indicator = item.sdgserie?.indicator ?? "";
      const foundPrefix = expectedIndicators.find((pref) =>
        indicator.startsWith(pref)
      );

      return {
        id: String(item.id),
        sdgNumber,
        country: item.sdgcountry?.name ?? "Unknown",
        year: item.year ?? 0,
        metricKey: foundPrefix ? metricKeys[foundPrefix] : "unknown",
        value: item.value ? Number(item.value) : null,
        source: item.sdgserie?.source ?? null,
      };
    });

    // Eksik metrikler için placeholder ekle
    expectedIndicators.forEach((prefix) => {
      const metricKey = metricKeys[prefix];
      if (!metrics.some((m) => m.metricKey === metricKey)) {
        metrics.push({
          id: `placeholder-${metricKey}`,
          sdgNumber,
          country: "N/A",
          year: new Date().getFullYear(),
          metricKey,
          value: null,
          source: null,
        });
      }
    });

    return metrics;
  } catch (error) {
    console.error("SDG DB Error:", error);
    // Hata anında boş dizi dönmek build'in çökmesini engeller
    return [];
  }
}

// --- PAGE ---
export default async function SDGDetailPage({ params }: PageProps) {
  const sdgNumber = parseInt(params.id);

  if (isNaN(sdgNumber)) {
    notFound();
  }

  const sdg = getSDGById(sdgNumber);

  // Eğer SDG objesi yoksa veya implemente edilmemişse 404 göster
  if (!sdg || !sdg.implemented) {
    notFound();
  }

  const metrics = await getSDGData(sdgNumber);

  return (
    <SDGDetailClient
      sdg={sdg}
      metrics={metrics}
      isAuthenticated={true}
      isFavorite={true}
    />
  );
}