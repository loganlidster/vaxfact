import { NextResponse } from "next/server";
import { WHOOutbreakItem, DISEASE_VACCINE_MAP, COUNTRY_COORDS } from "@/lib/outbreakTypes";

// Cache WHO data for 1 hour to avoid hammering their API
let cache: { data: WHOOutbreakItem[]; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function mapDiseaseToVaccine(title: string): string | null {
  const lower = title.toLowerCase();
  for (const [keyword, vaccineId] of Object.entries(DISEASE_VACCINE_MAP)) {
    if (lower.includes(keyword)) return vaccineId;
  }
  return null;
}

function extractCountry(title: string): string {
  // WHO titles typically end with "– Country Name" or "- Country Name"
  const match = title.match(/[–\-]\s*([^–\-]+)$/);
  if (match) return match[1].trim();
  return "Global";
}

function getCountryCoords(country: string): { lat: number; lng: number } | null {
  // Direct match
  if (COUNTRY_COORDS[country]) return COUNTRY_COORDS[country];
  // Partial match
  for (const [name, coords] of Object.entries(COUNTRY_COORDS)) {
    if (country.toLowerCase().includes(name.toLowerCase()) || 
        name.toLowerCase().includes(country.toLowerCase())) {
      return coords;
    }
  }
  return null;
}

export async function GET() {
  try {
    // Return cached data if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({ outbreaks: cache.data, cached: true, lastUpdated: new Date(cache.timestamp).toISOString() });
    }

    // Fetch last 2 years of WHO outbreak news
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const dateFilter = twoYearsAgo.toISOString().split("T")[0];

    const whoUrl = `https://www.who.int/api/news/diseaseoutbreaknews?$top=50&$orderby=PublicationDateAndTime+desc&$filter=PublicationDateAndTime+gt+${dateFilter}T00:00:00Z`;
    
    const res = await fetch(whoUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`WHO API returned ${res.status}`);
    }

    const json = await res.json();
    const items = json.value || [];

    const outbreaks: WHOOutbreakItem[] = items.map((item: Record<string, string>) => {
      const title = item.Title || "";
      const country = extractCountry(title);
      const coords = getCountryCoords(country);
      const diseaseKey = mapDiseaseToVaccine(title);

      return {
        id: item.Id || item.DonId || Math.random().toString(36).slice(2),
        title,
        publicationDate: item.PublicationDateAndTime || item.PublicationDate || "",
        country,
        region: item.WhoRegionCode || "",
        summary: item.Summary
          ? item.Summary.replace(/<[^>]+>/g, "").slice(0, 300)
          : "",
        url: `https://www.who.int/emergencies/disease-outbreak-news/${item.UrlName || ""}`,
        diseaseKey,
        lat: coords?.lat,
        lng: coords?.lng,
      };
    });

    // Update cache
    cache = { data: outbreaks, timestamp: Date.now() };

    return NextResponse.json({
      outbreaks,
      cached: false,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("WHO API error:", err);
    // Return stale cache if available
    if (cache) {
      return NextResponse.json({
        outbreaks: cache.data,
        cached: true,
        stale: true,
        lastUpdated: new Date(cache.timestamp).toISOString(),
      });
    }
    return NextResponse.json({ error: "Failed to fetch WHO data" }, { status: 500 });
  }
}