"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { WHOOutbreakItem, CDCStateData, TravelLocation, LocationRisk } from "@/lib/outbreakTypes";

// ---------- Types ----------
interface OutbreakMapProps {
  onBack: () => void;
}

interface GeoResult {
  displayName: string;
  country: string;
  countryCode: string;
  stateOrRegion: string;
  lat: number;
  lng: number;
  isUS: boolean;
}

// ---------- Helpers ----------
function getRiskColor(cases: number, max: number): string {
  if (cases === 0) return "#e8f0fb";
  const ratio = cases / max;
  if (ratio < 0.1) return "#c8ddf7";
  if (ratio < 0.25) return "#93bcef";
  if (ratio < 0.5) return "#5691d8";
  if (ratio < 0.75) return "#2b5ba8";
  return "#172c6e";
}

function getRiskLabel(score: number): { label: string; color: string } {
  if (score === 0) return { label: "No reported cases", color: "var(--good)" };
  if (score < 10) return { label: "Very Low", color: "#2b7a4b" };
  if (score < 30) return { label: "Low", color: "#5a9a3f" };
  if (score < 60) return { label: "Moderate", color: "#b26a00" };
  if (score < 85) return { label: "High", color: "#c0392b" };
  return { label: "Very High", color: "#8b0000" };
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

const VACCINE_NAMES: { [id: string]: string } = {
  mmr: "MMR (Measles, Mumps, Rubella)",
  dtap: "DTaP (Diphtheria, Tetanus, Pertussis)",
  hepb: "Hepatitis B",
  hepa: "Hepatitis A",
  hib: "Hib",
  pcv: "Pneumococcal (PCV)",
  ipv: "Polio (IPV)",
  varicella: "Varicella (Chickenpox)",
  menacwy: "Meningococcal",
  rotavirus: "Rotavirus",
  flu: "Influenza",
  mpox: "Mpox",
  yellowfever: "Yellow Fever",
  dengue: "Dengue",
  typhoid: "Typhoid",
};

// ---------- US SVG Map Path Data (simplified state paths) ----------
// We'll use a bubble/dot map approach since full SVG paths are too complex
// Instead rendering positioned state bubbles on a US outline

const US_STATE_POSITIONS: { [code: string]: { x: number; y: number } } = {
  AL: { x: 610, y: 390 }, AK: { x: 150, y: 450 }, AZ: { x: 220, y: 360 },
  AR: { x: 565, y: 370 }, CA: { x: 130, y: 300 }, CO: { x: 310, y: 300 },
  CT: { x: 770, y: 210 }, DE: { x: 745, y: 255 }, FL: { x: 645, y: 430 },
  GA: { x: 635, y: 390 }, HI: { x: 280, y: 470 }, ID: { x: 215, y: 210 },
  IL: { x: 580, y: 280 }, IN: { x: 610, y: 275 }, IA: { x: 540, y: 250 },
  KS: { x: 450, y: 320 }, KY: { x: 625, y: 310 }, LA: { x: 565, y: 415 },
  ME: { x: 800, y: 155 }, MD: { x: 735, y: 265 }, MA: { x: 785, y: 200 },
  MI: { x: 605, y: 220 }, MN: { x: 510, y: 185 }, MS: { x: 585, y: 395 },
  MO: { x: 545, y: 310 }, MT: { x: 275, y: 175 }, NE: { x: 435, y: 270 },
  NV: { x: 175, y: 280 }, NH: { x: 785, y: 185 }, NJ: { x: 755, y: 245 },
  NM: { x: 295, y: 375 }, NY: { x: 740, y: 205 }, NC: { x: 685, y: 330 },
  ND: { x: 425, y: 175 }, OH: { x: 655, y: 265 }, OK: { x: 445, y: 355 },
  OR: { x: 145, y: 220 }, PA: { x: 715, y: 245 }, RI: { x: 780, y: 210 },
  SC: { x: 665, y: 355 }, SD: { x: 430, y: 215 }, TN: { x: 620, y: 345 },
  TX: { x: 420, y: 400 }, UT: { x: 240, y: 295 }, VT: { x: 770, y: 180 },
  VA: { x: 705, y: 295 }, WA: { x: 150, y: 165 }, WV: { x: 685, y: 285 },
  WI: { x: 560, y: 215 }, WY: { x: 295, y: 230 }, DC: { x: 738, y: 268 },
};

// ---------- Component ----------
export default function OutbreakMap({ onBack }: OutbreakMapProps) {
  const [view, setView] = useState<"us" | "global">("us");
  const [selectedDisease, setSelectedDisease] = useState<string>("mmr");
  const [whoOutbreaks, setWhoOutbreaks] = useState<WHOOutbreakItem[]>([]);
  const [cdcStates, setCdcStates] = useState<CDCStateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredState, setHoveredState] = useState<CDCStateData | null>(null);
  const [hoveredOutbreak, setHoveredOutbreak] = useState<WHOOutbreakItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [lastUpdated, setLastUpdated] = useState("");
  const [activeTab, setActiveTab] = useState<"map" | "travel">("map");

  // Travel Risk state
  const [locations, setLocations] = useState<(TravelLocation | null)[]>([null, null, null]);
  const [locationQueries, setLocationQueries] = useState(["", "", ""]);
  const [locationSuggestions, setLocationSuggestions] = useState<GeoResult[][]>([[], [], []]);
  const [locationRisks, setLocationRisks] = useState<(LocationRisk | null)[]>([null, null, null]);
  const [geocodeLoading, setGeocodelLoading] = useState([false, false, false]);
  const debounceTimers = useRef<(ReturnType<typeof setTimeout> | null)[]>([null, null, null]);

  const locationLabels = ["Where I Live", "Where Family Lives", "Travel Destination"];
  const locationIcons = ["🏠", "👨‍👩‍👧", "✈️"];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [whoRes, cdcRes] = await Promise.all([
          fetch("/api/outbreaks/who"),
          fetch("/api/outbreaks/cdc"),
        ]);
        const whoData = await whoRes.json();
        const cdcData = await cdcRes.json();
        setWhoOutbreaks(whoData.outbreaks || []);
        setCdcStates(cdcData.states || []);
        setLastUpdated(whoData.lastUpdated || cdcData.lastUpdated || "");
      } catch (e) {
        console.error("Failed to load outbreak data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute max cases for color scale
  const maxCases = Math.max(1, ...cdcStates.map(s => s.diseases[selectedDisease]?.casesThisYear || 0));

  // Geocode search with debounce
  const handleLocationQuery = useCallback((idx: number, query: string) => {
    const newQueries = [...locationQueries];
    newQueries[idx] = query;
    setLocationQueries(newQueries);

    if (debounceTimers.current[idx]) clearTimeout(debounceTimers.current[idx]!);
    if (query.trim().length < 3) {
      const newSuggs = [...locationSuggestions];
      newSuggs[idx] = [];
      setLocationSuggestions(newSuggs);
      return;
    }

    debounceTimers.current[idx] = setTimeout(async () => {
      const newLoading = [...geocodeLoading];
      newLoading[idx] = true;
      setGeocodelLoading(newLoading);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        const newSuggs = [...locationSuggestions];
        newSuggs[idx] = data.locations || [];
        setLocationSuggestions(newSuggs);
      } finally {
        const newLoading2 = [...geocodeLoading];
        newLoading2[idx] = false;
        setGeocodelLoading(newLoading2);
      }
    }, 400);
  }, [locationQueries, locationSuggestions, geocodeLoading]);

  // Select a location and compute its risk
  const selectLocation = useCallback((idx: number, geo: GeoResult) => {
    const loc: TravelLocation = {
      label: locationLabels[idx],
      query: locationQueries[idx],
      displayName: geo.displayName,
      country: geo.country,
      countryCode: geo.countryCode,
      stateOrRegion: geo.stateOrRegion,
      lat: geo.lat,
      lng: geo.lng,
      isUS: geo.isUS,
    };

    const newLocations = [...locations];
    newLocations[idx] = loc;
    setLocations(newLocations);

    const newQueries = [...locationQueries];
    newQueries[idx] = geo.displayName.split(",").slice(0, 2).join(",");
    setLocationQueries(newQueries);

    const newSuggs = [...locationSuggestions];
    newSuggs[idx] = [];
    setLocationSuggestions(newSuggs);

    // Compute risk for this location
    computeLocationRisk(idx, loc, newLocations);
  }, [locations, locationQueries, locationSuggestions, cdcStates, whoOutbreaks]);

  function computeLocationRisk(idx: number, loc: TravelLocation, allLocs: (TravelLocation | null)[]) {
    const risksByVaccine: LocationRisk["risksByVaccine"] = {};

    // Check CDC data if US location
    if (loc.isUS) {
      const stateData = cdcStates.find(s => s.stateCode === loc.countryCode || 
        s.state === loc.stateOrRegion ||
        s.stateCode === loc.stateOrRegion.slice(0, 2));

      if (stateData) {
        for (const [vaccineId, diseaseData] of Object.entries(stateData.diseases)) {
          const cases = diseaseData.casesThisYear;
          const trend = diseaseData.trend;
          let riskScore = Math.min(100, (cases / Math.max(1, maxCases)) * 100);
          if (trend === "rising") riskScore *= 1.3;
          riskScore = Math.min(100, Math.round(riskScore));

          const riskLevel =
            riskScore === 0 ? "very-low" :
            riskScore < 15 ? "low" :
            riskScore < 40 ? "moderate" :
            riskScore < 70 ? "high" : "very-high";

          risksByVaccine[vaccineId] = {
            vaccineName: VACCINE_NAMES[vaccineId] || vaccineId,
            riskLevel,
            riskScore,
            activeOutbreak: trend === "rising" && cases > 5,
            casesNearby: cases,
            multiplierApplied: riskScore > 50 ? 2.0 : riskScore > 25 ? 1.5 : 1.0,
          };
        }
      }
    }

    // Check WHO global outbreaks for any location
    for (const outbreak of whoOutbreaks) {
      if (!outbreak.diseaseKey) continue;
      const isRelevant =
        outbreak.country.toLowerCase().includes(loc.country.toLowerCase()) ||
        loc.country.toLowerCase().includes(outbreak.country.toLowerCase()) ||
        (loc.isUS && outbreak.country.toLowerCase().includes("united states"));

      if (isRelevant) {
        const existing = risksByVaccine[outbreak.diseaseKey];
        const daysAgo = Math.floor((Date.now() - new Date(outbreak.publicationDate).getTime()) / 86400000);
        const recency = daysAgo < 30 ? 1.5 : daysAgo < 90 ? 1.2 : 1.0;
        const baseScore = 60 * recency;

        if (!existing || existing.riskScore < baseScore) {
          risksByVaccine[outbreak.diseaseKey] = {
            vaccineName: VACCINE_NAMES[outbreak.diseaseKey] || outbreak.diseaseKey,
            riskLevel: baseScore > 70 ? "high" : "moderate",
            riskScore: Math.round(baseScore),
            activeOutbreak: true,
            outbreakTitle: outbreak.title,
            multiplierApplied: recency,
          };
        }
      }
    }

    const scores = Object.values(risksByVaccine).map(r => r.riskScore);
    const maxScore = scores.length ? Math.max(...scores) : 0;
    const overallLevel =
      maxScore === 0 ? "very-low" :
      maxScore < 15 ? "low" :
      maxScore < 40 ? "moderate" :
      maxScore < 70 ? "high" : "very-high";

    const risk: LocationRisk = {
      location: loc,
      risksByVaccine,
      overallRiskLevel: overallLevel,
    };

    const newRisks = [...locationRisks];
    newRisks[idx] = risk;
    setLocationRisks(newRisks);
  }

  const clearLocation = (idx: number) => {
    const newLocations = [...locations]; newLocations[idx] = null; setLocations(newLocations);
    const newQueries = [...locationQueries]; newQueries[idx] = ""; setLocationQueries(newQueries);
    const newRisks = [...locationRisks]; newRisks[idx] = null; setLocationRisks(newRisks);
  };

  // Filter WHO outbreaks by selected disease
  const filteredOutbreaks = whoOutbreaks.filter(o => !selectedDisease || o.diseaseKey === selectedDisease || !o.diseaseKey);

  return (
    <div className="vf-container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
          ← Back
        </button>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem,3vw,2rem)", color: "var(--text)", margin: 0 }}>
            Live Outbreak Map & Travel Risk
          </h1>
          {lastUpdated && (
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: "0.25rem 0 0" }}>
              Data updated {timeAgo(lastUpdated)} &middot; CDC NNDSS + WHO Disease Outbreak News
            </p>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "2px solid var(--border)", paddingBottom: "0" }}>
        {(["map", "travel"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none", border: "none", padding: "0.75rem 1.25rem",
              fontFamily: "var(--font-inter)", fontSize: "0.95rem", fontWeight: 600,
              cursor: "pointer",
              color: activeTab === tab ? "var(--primary)" : "var(--muted)",
              borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
              marginBottom: "-2px", transition: "all 0.15s",
            }}
          >
            {tab === "map" ? "🗺️ Outbreak Map" : "✈️ Travel Risk Calculator"}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p>Loading live outbreak data from CDC & WHO…</p>
        </div>
      ) : (
        <>
          {activeTab === "map" && (
            <MapTab
              view={view} setView={setView}
              selectedDisease={selectedDisease} setSelectedDisease={setSelectedDisease}
              cdcStates={cdcStates} whoOutbreaks={whoOutbreaks}
              filteredOutbreaks={filteredOutbreaks}
              maxCases={maxCases}
              hoveredState={hoveredState} setHoveredState={setHoveredState}
              hoveredOutbreak={hoveredOutbreak} setHoveredOutbreak={setHoveredOutbreak}
              tooltipPos={tooltipPos} setTooltipPos={setTooltipPos}
            />
          )}
          {activeTab === "travel" && (
            <TravelTab
              locations={locations} locationQueries={locationQueries}
              locationSuggestions={locationSuggestions} locationRisks={locationRisks}
              geocodeLoading={geocodeLoading}
              locationLabels={locationLabels} locationIcons={locationIcons}
              onQueryChange={handleLocationQuery}
              onSelectLocation={selectLocation}
              onClearLocation={clearLocation}
            />
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// MAP TAB
// ============================================================
interface MapTabProps {
  view: "us" | "global";
  setView: (v: "us" | "global") => void;
  selectedDisease: string;
  setSelectedDisease: (d: string) => void;
  cdcStates: CDCStateData[];
  whoOutbreaks: WHOOutbreakItem[];
  filteredOutbreaks: WHOOutbreakItem[];
  maxCases: number;
  hoveredState: CDCStateData | null;
  setHoveredState: (s: CDCStateData | null) => void;
  hoveredOutbreak: WHOOutbreakItem | null;
  setHoveredOutbreak: (o: WHOOutbreakItem | null) => void;
  tooltipPos: { x: number; y: number };
  setTooltipPos: (p: { x: number; y: number }) => void;
}

function MapTab({
  view, setView, selectedDisease, setSelectedDisease,
  cdcStates, whoOutbreaks, filteredOutbreaks, maxCases,
  hoveredState, setHoveredState, hoveredOutbreak, setHoveredOutbreak,
  tooltipPos, setTooltipPos,
}: MapTabProps) {
  const diseaseOptions = [
    { id: "mmr", label: "Measles / Mumps / Rubella" },
    { id: "dtap", label: "Pertussis (Whooping Cough)" },
    { id: "hepb", label: "Hepatitis B" },
    { id: "hepa", label: "Hepatitis A" },
    { id: "varicella", label: "Varicella (Chickenpox)" },
    { id: "menacwy", label: "Meningococcal Disease" },
    { id: "ipv", label: "Polio" },
    { id: "hib", label: "Hib Disease" },
    { id: "pcv", label: "Pneumococcal Disease" },
  ];

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className={`btn ${view === "us" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setView("us")}
            style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
          >
            🇺🇸 United States
          </button>
          <button
            className={`btn ${view === "global" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setView("global")}
            style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
          >
            🌍 Global WHO Alerts
          </button>
        </div>
        {view === "us" && (
          <select
            value={selectedDisease}
            onChange={e => setSelectedDisease(e.target.value)}
            style={{
              padding: "0.5rem 1rem", borderRadius: "var(--radius)", border: "1px solid var(--border)",
              fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "var(--text)",
              background: "white", cursor: "pointer",
            }}
          >
            {diseaseOptions.map(d => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        )}
      </div>

      {/* Map Container */}
      <div style={{ position: "relative", background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden", padding: "1rem" }}>
        {view === "us" ? (
          <USBubbleMap
            cdcStates={cdcStates}
            selectedDisease={selectedDisease}
            maxCases={maxCases}
            onHoverState={(s, e) => {
              setHoveredState(s);
              setHoveredOutbreak(null);
              if (e) setTooltipPos({ x: e.clientX, y: e.clientY });
            }}
          />
        ) : (
          <GlobalOutbreakMap
            outbreaks={filteredOutbreaks}
            selectedDisease={selectedDisease}
            onHoverOutbreak={(o, e) => {
              setHoveredOutbreak(o);
              setHoveredState(null);
              if (e) setTooltipPos({ x: e.clientX, y: e.clientY });
            }}
          />
        )}

        {/* Tooltip */}
        {(hoveredState || hoveredOutbreak) && (
          <div style={{
            position: "fixed", left: tooltipPos.x + 12, top: tooltipPos.y - 10,
            background: "white", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "0.75rem 1rem",
            boxShadow: "var(--shadow-md)", zIndex: 1000, maxWidth: "260px",
            pointerEvents: "none",
          }}>
            {hoveredState && (
              <>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                  {hoveredState.state.replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                {hoveredState.diseases[selectedDisease] ? (
                  <>
                    <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                      {VACCINE_NAMES[selectedDisease]}
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary)", margin: "0.25rem 0" }}>
                      {hoveredState.diseases[selectedDisease].casesThisYear} cases this year
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                      {hoveredState.diseases[selectedDisease].casesPriorYear} cases last year
                    </div>
                    <div style={{
                      fontSize: "0.8rem", fontWeight: 600, marginTop: "0.25rem",
                      color: hoveredState.diseases[selectedDisease].trend === "rising" ? "#c0392b" :
                             hoveredState.diseases[selectedDisease].trend === "falling" ? "#1f7a4d" : "var(--muted)",
                    }}>
                      {hoveredState.diseases[selectedDisease].trend === "rising" ? "↑ Rising trend" :
                       hoveredState.diseases[selectedDisease].trend === "falling" ? "↓ Falling trend" : "→ Stable"}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>No reported cases</div>
                )}
              </>
            )}
            {hoveredOutbreak && (
              <>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: "0.35rem", lineHeight: 1.3 }}>
                  {hoveredOutbreak.title}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
                  📍 {hoveredOutbreak.country} · {timeAgo(hoveredOutbreak.publicationDate)}
                </div>
                {hoveredOutbreak.summary && (
                  <div style={{ fontSize: "0.8rem", color: "var(--text)", lineHeight: 1.4 }}>
                    {hoveredOutbreak.summary.slice(0, 150)}…
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      {view === "us" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>Cases this year:</span>
          {["No cases", "1–5", "6–20", "21–50", "51–100", "100+"].map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                background: ["#e8f0fb", "#c8ddf7", "#93bcef", "#5691d8", "#2b5ba8", "#172c6e"][i],
                border: "1px solid rgba(0,0,0,0.1)",
              }} />
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* WHO Outbreak List */}
      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--text)", marginBottom: "1rem" }}>
          Recent WHO Disease Alerts {view === "us" ? "" : `· ${filteredOutbreaks.length} active alerts`}
        </h3>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {whoOutbreaks.slice(0, 10).map(outbreak => (
            <OutbreakAlertCard key={outbreak.id} outbreak={outbreak} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- US Bubble Map ----------
function USBubbleMap({ cdcStates, selectedDisease, maxCases, onHoverState }: {
  cdcStates: CDCStateData[];
  selectedDisease: string;
  maxCases: number;
  onHoverState: (s: CDCStateData | null, e: MouseEvent | null) => void;
}) {
  const stateByCode: { [code: string]: CDCStateData } = {};
  for (const s of cdcStates) stateByCode[s.stateCode] = s;

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox="0 0 900 540"
        style={{ width: "100%", height: "auto", display: "block" }}
        onMouseLeave={() => onHoverState(null, null)}
      >
        {/* Background */}
        <rect width="900" height="540" fill="#f0f4fa" rx="8" />
        
        {/* US outline - simplified decorative rectangle */}
        <rect x="110" y="140" width="720" height="320" rx="6" fill="#dce8f8" stroke="#b0c4e8" strokeWidth="1.5" />

        {/* State bubbles */}
        {Object.entries(US_STATE_POSITIONS).map(([code, pos]) => {
          const stateData = stateByCode[code];
          const cases = stateData?.diseases[selectedDisease]?.casesThisYear || 0;
          const trend = stateData?.diseases[selectedDisease]?.trend;
          const color = getRiskColor(cases, maxCases);
          const bubbleSize = cases === 0 ? 16 : Math.max(18, Math.min(36, 18 + (cases / maxCases) * 22));

          return (
            <g
              key={code}
              transform={`translate(${pos.x}, ${pos.y})`}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => stateData && onHoverState(stateData, e.nativeEvent)}
              onMouseLeave={() => onHoverState(null, null)}
            >
              {/* Rising trend pulse ring */}
              {trend === "rising" && cases > 0 && (
                <circle r={bubbleSize / 2 + 6} fill="none" stroke="#e74c3c" strokeWidth="2" opacity="0.4" />
              )}
              <circle r={bubbleSize / 2} fill={color} stroke="white" strokeWidth="1.5" />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={bubbleSize < 22 ? "8" : "9"}
                fontWeight="600"
                fill={cases > maxCases * 0.4 ? "white" : "#2346a0"}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {code}
              </text>
              {cases > 0 && (
                <text
                  y={bubbleSize / 2 + 9}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#666"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {cases}
                </text>
              )}
            </g>
          );
        })}

        {/* Alaska & Hawaii labels */}
        <text x="150" y="490" textAnchor="middle" fontSize="9" fill="#888">AK shown above</text>
        <text x="280" y="490" textAnchor="middle" fontSize="9" fill="#888">HI shown above</text>
      </svg>
    </div>
  );
}

// ---------- Global Outbreak Map ----------
function GlobalOutbreakMap({ outbreaks, selectedDisease, onHoverOutbreak }: {
  outbreaks: WHOOutbreakItem[];
  selectedDisease: string;
  onHoverOutbreak: (o: WHOOutbreakItem | null, e: MouseEvent | null) => void;
}) {
  // Simple equirectangular projection
  function latLngToXY(lat: number, lng: number): { x: number; y: number } {
    const x = ((lng + 180) / 360) * 860 + 20;
    const y = ((90 - lat) / 180) * 420 + 20;
    return { x, y };
  }

  const outbreaksWithCoords = outbreaks.filter(o => o.lat !== undefined && o.lng !== undefined);

  return (
    <svg
      viewBox="0 0 900 460"
      style={{ width: "100%", height: "auto", display: "block" }}
      onMouseLeave={() => onHoverOutbreak(null, null)}
    >
      {/* Ocean background */}
      <rect width="900" height="460" fill="#dce8f8" rx="8" />

      {/* Simplified world land masses (rough rectangles for major continents) */}
      {/* North America */}
      <path d="M 110,60 L 240,55 L 260,80 L 250,160 L 230,200 L 200,210 L 160,200 L 130,180 L 100,130 Z" fill="#c8daf0" stroke="white" strokeWidth="0.5" />
      {/* South America */}
      <path d="M 175,220 L 230,215 L 255,250 L 250,330 L 230,360 L 200,360 L 175,330 L 160,280 Z" fill="#c8daf0" stroke="white" strokeWidth="0.5" />
      {/* Europe */}
      <path d="M 410,50 L 510,45 L 520,80 L 500,110 L 460,115 L 420,100 L 400,80 Z" fill="#c8daf0" stroke="white" strokeWidth="0.5" />
      {/* Africa */}
      <path d="M 430,115 L 510,110 L 530,150 L 530,270 L 500,310 L 465,310 L 430,270 L 415,180 Z" fill="#c8daf0" stroke="white" strokeWidth="0.5" />
      {/* Asia */}
      <path d="M 510,45 L 750,40 L 780,80 L 760,180 L 700,200 L 620,180 L 560,160 L 520,120 L 500,80 Z" fill="#c8daf0" stroke="white" strokeWidth="0.5" />
      {/* Australia */}
      <path d="M 680,260 L 760,255 L 780,290 L 760,330 L 710,335 L 670,310 L 665,280 Z" fill="#c8daf0" stroke="white" strokeWidth="0.5" />

      {/* Equator line */}
      <line x1="20" y1="230" x2="880" y2="230" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeDasharray="4,4" />
      <text x="25" y="225" fontSize="8" fill="rgba(0,0,0,0.3)">Equator</text>

      {/* Outbreak pins */}
      {outbreaksWithCoords.map((outbreak, i) => {
        const { x, y } = latLngToXY(outbreak.lat!, outbreak.lng!);
        const isRecent = (Date.now() - new Date(outbreak.publicationDate).getTime()) < 90 * 86400000;
        const isVaccineRelated = outbreak.diseaseKey !== null;

        return (
          <g
            key={outbreak.id + i}
            transform={`translate(${x}, ${y})`}
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => onHoverOutbreak(outbreak, e.nativeEvent)}
            onMouseLeave={() => onHoverOutbreak(null, null)}
          >
            {isRecent && (
              <circle r="10" fill="rgba(231, 76, 60, 0.2)" />
            )}
            <circle
              r="6"
              fill={isRecent ? "#e74c3c" : isVaccineRelated ? "#e67e22" : "#95a5a6"}
              stroke="white"
              strokeWidth="1.5"
            />
            {isVaccineRelated && (
              <text y="-9" textAnchor="middle" fontSize="8" fill="#e74c3c" fontWeight="700">
                💉
              </text>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(20, 400)">
        <circle cx="8" cy="8" r="6" fill="#e74c3c" stroke="white" strokeWidth="1.5" />
        <text x="18" y="12" fontSize="9" fill="#555">{"Recent (<90 days)"}</text>
        <circle cx="108" cy="8" r="6" fill="#e67e22" stroke="white" strokeWidth="1.5" />
        <text x="118" y="12" fontSize="9" fill="#555">Vaccine-preventable</text>
        <circle cx="230" cy="8" r="6" fill="#95a5a6" stroke="white" strokeWidth="1.5" />
        <text x="240" y="12" fontSize="9" fill="#555">Other outbreak</text>
      </g>
    </svg>
  );
}

// ---------- Outbreak Alert Card ----------
function OutbreakAlertCard({ outbreak }: { outbreak: WHOOutbreakItem }) {
  const isRecent = (Date.now() - new Date(outbreak.publicationDate).getTime()) < 30 * 86400000;
  const vaccineName = outbreak.diseaseKey ? VACCINE_NAMES[outbreak.diseaseKey] : null;

  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)",
      padding: "0.875rem 1rem", display: "flex", gap: "0.75rem", alignItems: "flex-start",
      borderLeft: `3px solid ${isRecent ? "#e74c3c" : "var(--border)"}`,
    }}>
      <div style={{ fontSize: "1.25rem", flexShrink: 0, marginTop: "2px" }}>
        {isRecent ? "🚨" : "⚠️"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.3, marginBottom: "0.25rem" }}>
          {outbreak.title}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            📍 {outbreak.country}
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            · {timeAgo(outbreak.publicationDate)}
          </span>
          {vaccineName && (
            <span className="pill pill-warn" style={{ fontSize: "0.72rem", padding: "1px 6px" }}>
              💉 {vaccineName}
            </span>
          )}
          <a
            href={outbreak.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "0.78rem", color: "var(--primary)", textDecoration: "none", marginLeft: "auto" }}
          >
            WHO Report →
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TRAVEL RISK TAB
// ============================================================
interface TravelTabProps {
  locations: (TravelLocation | null)[];
  locationQueries: string[];
  locationSuggestions: GeoResult[][];
  locationRisks: (LocationRisk | null)[];
  geocodeLoading: boolean[];
  locationLabels: string[];
  locationIcons: string[];
  onQueryChange: (idx: number, query: string) => void;
  onSelectLocation: (idx: number, geo: GeoResult) => void;
  onClearLocation: (idx: number) => void;
}

function TravelTab({
  locations, locationQueries, locationSuggestions, locationRisks, geocodeLoading,
  locationLabels, locationIcons, onQueryChange, onSelectLocation, onClearLocation,
}: TravelTabProps) {
  const hasAnyLocation = locations.some(l => l !== null);

  return (
    <div>
      <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: "1.5rem", maxWidth: "600px" }}>
        Add your home, where family lives, and any travel destinations. We'll check CDC surveillance data and WHO outbreak alerts to compute your real-time exposure risk for each vaccine-preventable disease.
      </p>

      {/* Location inputs */}
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", marginBottom: "2rem" }}>
        {locationLabels.map((label, idx) => (
          <LocationInput
            key={idx}
            label={label}
            icon={locationIcons[idx]}
            query={locationQueries[idx]}
            suggestions={locationSuggestions[idx]}
            selected={locations[idx]}
            loading={geocodeLoading[idx]}
            onChange={(q) => onQueryChange(idx, q)}
            onSelect={(geo) => onSelectLocation(idx, geo)}
            onClear={() => onClearLocation(idx)}
          />
        ))}
      </div>

      {/* Risk Results */}
      {hasAnyLocation ? (
        <RiskResults locationRisks={locationRisks} locations={locations} locationLabels={locationLabels} locationIcons={locationIcons} />
      ) : (
        <div style={{
          textAlign: "center", padding: "3rem", background: "var(--surface)",
          borderRadius: "var(--radius-lg)", border: "1px dashed var(--border)",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺️</div>
          <h3 style={{ fontFamily: "var(--font-serif)", color: "var(--text)", marginBottom: "0.5rem" }}>
            Add your locations to see risk
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto" }}>
            Search for any city, state, or country. We'll check live CDC surveillance and WHO outbreak data to show your personalized exposure risk.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------- Location Input ----------
function LocationInput({ label, icon, query, suggestions, selected, loading, onChange, onSelect, onClear }: {
  label: string; icon: string; query: string; suggestions: GeoResult[];
  selected: TravelLocation | null; loading: boolean;
  onChange: (q: string) => void; onSelect: (g: GeoResult) => void; onClear: () => void;
}) {
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1rem", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.25rem" }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{label}</span>
      </div>
      {selected ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--primary)" }}>
              {selected.displayName.split(",").slice(0, 2).join(",")}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              {selected.country} {selected.isUS ? "🇺🇸" : "🌍"}
            </div>
          </div>
          <button
            onClick={onClear}
            style={{ background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "0.2rem 0.5rem", fontSize: "0.75rem", cursor: "pointer", color: "var(--muted)", flexShrink: 0 }}
          >
            Change
          </button>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={query}
            onChange={e => onChange(e.target.value)}
            placeholder={`Search city, state, country…`}
            style={{
              width: "100%", padding: "0.625rem 0.75rem", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", fontSize: "0.875rem", fontFamily: "var(--font-inter)",
              color: "var(--text)", background: "var(--surface)", boxSizing: "border-box",
              outline: "none",
            }}
          />
          {loading && (
            <div style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", color: "var(--muted)" }}>
              searching…
            </div>
          )}
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
              background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-md)", marginTop: "2px", overflow: "hidden",
            }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(s)}
                  style={{
                    display: "block", width: "100%", textAlign: "left", padding: "0.625rem 0.875rem",
                    background: "none", border: "none", cursor: "pointer", fontSize: "0.825rem",
                    color: "var(--text)", borderBottom: i < suggestions.length - 1 ? "1px solid var(--border)" : "none",
                    lineHeight: 1.3,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <span>{s.displayName.split(",").slice(0, 3).join(",")}</span>
                  <span style={{ color: "var(--muted)", marginLeft: "0.25rem" }}>
                    {s.isUS ? "🇺🇸" : "🌍"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Risk Results ----------
function RiskResults({ locationRisks, locations, locationLabels, locationIcons }: {
  locationRisks: (LocationRisk | null)[];
  locations: (TravelLocation | null)[];
  locationLabels: string[];
  locationIcons: string[];
}) {
  const allVaccineIds = new Set<string>();
  locationRisks.forEach(lr => {
    if (lr) Object.keys(lr.risksByVaccine).forEach(id => allVaccineIds.add(id));
  });

  const vaccineIds = Array.from(allVaccineIds);

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--text)", marginBottom: "1rem" }}>
        Your Exposure Risk by Location
      </h3>

      {/* Summary cards per location */}
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", marginBottom: "2rem" }}>
        {locations.map((loc, idx) => {
          if (!loc || !locationRisks[idx]) return null;
          const risk = locationRisks[idx]!;
          const { label, color } = getRiskLabel(
            Math.max(0, ...Object.values(risk.risksByVaccine).map(r => r.riskScore))
          );
          const activeOutbreaks = Object.values(risk.risksByVaccine).filter(r => r.activeOutbreak);

          return (
            <div key={idx} style={{
              background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
              padding: "1.25rem", borderTop: `4px solid ${color}`,
            }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.25rem" }}>{locationIcons[idx]}</span>
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>
                  {locationLabels[idx]}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                {loc.displayName.split(",").slice(0, 2).join(",")}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 700, fontSize: "1.1rem", color }}>
                  {label}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>overall risk</span>
              </div>
              {activeOutbreaks.length > 0 && (
                <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "var(--radius)", padding: "0.5rem 0.75rem", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "#c0392b", marginBottom: "0.25rem" }}>
                    🚨 {activeOutbreaks.length} active outbreak{activeOutbreaks.length > 1 ? "s" : ""} nearby
                  </div>
                  {activeOutbreaks.slice(0, 2).map((r, i) => (
                    <div key={i} style={{ fontSize: "0.78rem", color: "#666" }}>
                      · {r.outbreakTitle || r.vaccineName}
                    </div>
                  ))}
                </div>
              )}

              {/* Vaccine-specific risk bars */}
              <div style={{ display: "grid", gap: "0.4rem" }}>
                {Object.entries(risk.risksByVaccine)
                  .sort((a, b) => b[1].riskScore - a[1].riskScore)
                  .slice(0, 5)
                  .map(([vaccineId, vRisk]) => (
                    <div key={vaccineId}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "2px" }}>
                        <span style={{ color: "var(--text)", fontWeight: 500 }}>
                          {VACCINE_NAMES[vaccineId]?.split(" ")[0] || vaccineId}
                          {vRisk.activeOutbreak && " 🚨"}
                        </span>
                        <span style={{ color: getRiskLabel(vRisk.riskScore).color, fontWeight: 700 }}>
                          {vRisk.riskScore > 0 ? `${vRisk.riskScore}` : "0"}
                        </span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${vRisk.riskScore}%`,
                            background: getRiskLabel(vRisk.riskScore).color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vaccine recommendation matrix */}
      {vaccineIds.length > 0 && (
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
            <h4 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--text)" }}>
              Vaccine Importance Across Your Locations
            </h4>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "var(--surface)" }}>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "left", color: "var(--muted)", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>
                    Vaccine
                  </th>
                  {locations.map((loc, idx) => loc ? (
                    <th key={idx} style={{ padding: "0.75rem 1rem", textAlign: "center", color: "var(--muted)", fontWeight: 600, borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                      {locationIcons[idx]} {loc.displayName.split(",")[0]}
                    </th>
                  ) : null)}
                  <th style={{ padding: "0.75rem 1rem", textAlign: "center", color: "var(--muted)", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>
                    Overall
                  </th>
                </tr>
              </thead>
              <tbody>
                {vaccineIds.map(vaccineId => {
                  const scores = locationRisks
                    .filter(lr => lr !== null)
                    .map(lr => lr!.risksByVaccine[vaccineId]?.riskScore || 0);
                  const maxScore = Math.max(...scores);
                  const { label: overallLabel, color: overallColor } = getRiskLabel(maxScore);

                  return (
                    <tr key={vaccineId} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "var(--text)" }}>
                        {VACCINE_NAMES[vaccineId] || vaccineId}
                      </td>
                      {locations.map((loc, idx) => {
                        if (!loc || !locationRisks[idx]) return null;
                        const vRisk = locationRisks[idx]!.risksByVaccine[vaccineId];
                        if (!vRisk) return <td key={idx} style={{ padding: "0.75rem 1rem", textAlign: "center", color: "var(--muted)" }}>—</td>;
                        const { label, color } = getRiskLabel(vRisk.riskScore);
                        return (
                          <td key={idx} style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                            <span style={{
                              display: "inline-block", padding: "2px 8px", borderRadius: "999px",
                              fontSize: "0.75rem", fontWeight: 700, color: "white",
                              background: color,
                            }}>
                              {label}{vRisk.activeOutbreak ? " 🚨" : ""}
                            </span>
                          </td>
                        );
                      })}
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                        <span style={{
                          display: "inline-block", padding: "2px 8px", borderRadius: "999px",
                          fontSize: "0.75rem", fontWeight: 700, color: "white",
                          background: overallColor,
                        }}>
                          {overallLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "0.75rem 1.25rem", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)" }}>
              Risk scores combine CDC NNDSS weekly surveillance data and WHO Disease Outbreak News alerts.
              Scores shown are relative to national averages, not absolute disease rates.
              Consult your physician before making vaccination decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}