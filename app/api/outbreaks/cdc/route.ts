import { NextResponse } from "next/server";
import { CDCStateData, US_STATE_COORDS } from "@/lib/outbreakTypes";

let cache: { data: CDCStateData[]; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Map CDC disease labels to VaxFact vaccine IDs
const CDC_DISEASE_MAP: { label: string; vaccineId: string; displayName: string }[] = [
  { label: "Measles", vaccineId: "mmr", displayName: "Measles" },
  { label: "Mumps", vaccineId: "mmr", displayName: "Mumps" },
  { label: "Rubella", vaccineId: "mmr", displayName: "Rubella" },
  { label: "Pertussis", vaccineId: "dtap", displayName: "Pertussis (Whooping Cough)" },
  { label: "Tetanus", vaccineId: "dtap", displayName: "Tetanus" },
  { label: "Hepatitis B, acute", vaccineId: "hepb", displayName: "Hepatitis B" },
  { label: "Hepatitis A, acute", vaccineId: "hepa", displayName: "Hepatitis A" },
  { label: "Haemophilus influenzae, invasive disease, Age <5 years, Serotype b", vaccineId: "hib", displayName: "Hib Disease" },
  { label: "Invasive pneumococcal disease, age <5 years, Confirmed", vaccineId: "pcv", displayName: "Pneumococcal Disease" },
  { label: "Varicella (Chickenpox)", vaccineId: "varicella", displayName: "Varicella (Chickenpox)" },
  { label: "Meningococcal disease, All serogroups", vaccineId: "menacwy", displayName: "Meningococcal Disease" },
  { label: "Poliomyelitis, paralytic", vaccineId: "ipv", displayName: "Polio" },
];

// Get current year and previous year
function getYears(): { current: string; prior: string } {
  const now = new Date();
  const y = now.getFullYear();
  return { current: String(y), prior: String(y - 1) };
}

interface CDCRecord {
  states: string;
  year: string;
  week?: string;
  label: string;
  m1?: string;
  m2?: string;
  m1_flag?: string;
  m2_flag?: string;
  location1?: string;
  geocode?: { type: string; coordinates: number[] };
}

async function fetchDiseaseData(label: string, year: string): Promise<CDCRecord[]> {
  const encodedLabel = encodeURIComponent(label);
  const url = `https://data.cdc.gov/resource/x9gk-5huc.json?$where=label='${encodedLabel}' AND year='${year}'&$limit=200`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({ states: cache.data, cached: true, lastUpdated: new Date(cache.timestamp).toISOString() });
    }

    const { current, prior } = getYears();

    // Build state data map
    const stateMap: { [stateName: string]: CDCStateData } = {};

    // Initialize all states
    for (const [stateName, coords] of Object.entries(US_STATE_COORDS)) {
      stateMap[stateName] = {
        state: stateName,
        stateCode: coords.code,
        lat: coords.lat,
        lng: coords.lng,
        diseases: {},
      };
    }

    // Fetch data for each key disease
    for (const diseaseMapping of CDC_DISEASE_MAP) {
      try {
        const [currentRecords, priorRecords] = await Promise.all([
          fetchDiseaseData(diseaseMapping.label, current),
          fetchDiseaseData(diseaseMapping.label, prior),
        ]);

        // Aggregate current year totals by state
        const currentByState: { [state: string]: number } = {};
        const weeklyByState: { [state: string]: { week: number; cases: number }[] } = {};

        for (const record of currentRecords) {
          // Only process actual US states (has location1/geocode), skip region aggregates
          const stateName = record.states?.toUpperCase();
          if (!stateName || !US_STATE_COORDS[stateName]) continue;

          const cases = parseInt(record.m2 || record.m1 || "0") || 0;
          currentByState[stateName] = (currentByState[stateName] || 0) + cases;

          if (record.week) {
            if (!weeklyByState[stateName]) weeklyByState[stateName] = [];
            weeklyByState[stateName].push({ week: parseInt(record.week), cases });
          }
        }

        // Aggregate prior year totals by state
        const priorByState: { [state: string]: number } = {};
        for (const record of priorRecords) {
          const stateName = record.states?.toUpperCase();
          if (!stateName || !US_STATE_COORDS[stateName]) continue;
          const cases = parseInt(record.m2 || record.m1 || "0") || 0;
          priorByState[stateName] = (priorByState[stateName] || 0) + cases;
        }

        // Populate state data
        for (const stateName of Object.keys(US_STATE_COORDS)) {
          const casesThis = currentByState[stateName] || 0;
          const casesPrior = priorByState[stateName] || 0;
          const trend: "rising" | "falling" | "stable" =
            casesThis > casesPrior * 1.1 ? "rising" :
            casesThis < casesPrior * 0.9 ? "falling" : "stable";

          if (stateMap[stateName]) {
            stateMap[stateName].diseases[diseaseMapping.vaccineId] = {
              label: diseaseMapping.displayName,
              casesThisYear: casesThis,
              casesPriorYear: casesPrior,
              trend,
              weeklyData: weeklyByState[stateName] || [],
            };
          }
        }
      } catch (err) {
        console.error(`Error fetching ${diseaseMapping.label}:`, err);
      }
    }

    const stateData = Object.values(stateMap);
    cache = { data: stateData, timestamp: Date.now() };

    return NextResponse.json({
      states: stateData,
      cached: false,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("CDC API error:", err);
    if (cache) {
      return NextResponse.json({ states: cache.data, cached: true, stale: true, lastUpdated: new Date(cache.timestamp).toISOString() });
    }
    return NextResponse.json({ error: "Failed to fetch CDC data" }, { status: 500 });
  }
}