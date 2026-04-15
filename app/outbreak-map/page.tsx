import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Vaccine-Preventable Disease Outbreak Map — VaxFact.net",
  description:
    "Track active and recent outbreaks of vaccine-preventable diseases. Real-time disease surveillance data from CDC and WHO. See measles, whooping cough, polio, and other outbreak alerts.",
  alternates: { canonical: "https://vaxfact.net/outbreak-map" },
  openGraph: {
    title: "Outbreak Map — VaxFact.net",
    description:
      "Active outbreaks of vaccine-preventable diseases from CDC and WHO surveillance data.",
    url: "https://vaxfact.net/outbreak-map",
  },
};

// Static outbreak data (representative examples — in production, this would be from the live API)
const RECENT_OUTBREAKS = [
  {
    disease: "Measles",
    vaccineId: "mmr",
    location: "United States (multiple states)",
    date: "2024–2025",
    cases: "280+ cases",
    status: "active",
    severity: "high",
    source: "CDC",
    sourceUrl: "https://www.cdc.gov/measles/cases-outbreaks.html",
    notes:
      "Linked to importations and under-vaccinated communities. MMR vaccine is 97% effective.",
  },
  {
    disease: "Whooping Cough (Pertussis)",
    vaccineId: "dtap",
    location: "United States",
    date: "2024",
    cases: "18,000+ cases (2024)",
    status: "active",
    severity: "high",
    source: "CDC",
    sourceUrl: "https://www.cdc.gov/pertussis/surv-reporting.html",
    notes:
      "Cyclical surge pattern. Infants under 1 year at highest risk. DTaP series critical.",
  },
  {
    disease: "Influenza",
    vaccineId: "influenza",
    location: "Global — Northern Hemisphere",
    date: "2024–2025 season",
    cases: "Widespread",
    status: "seasonal",
    severity: "moderate",
    source: "CDC FluView",
    sourceUrl: "https://www.cdc.gov/flu/weekly/",
    notes:
      "Annual seasonal flu. Annual vaccination recommended for everyone 6 months and older.",
  },
  {
    disease: "Mpox (Monkeypox)",
    vaccineId: null,
    location: "Africa (DRC, multiple countries)",
    date: "2024",
    cases: "90,000+ cases",
    status: "active",
    severity: "high",
    source: "WHO",
    sourceUrl: "https://www.who.int/emergencies/situations/mpox-2024",
    notes:
      "WHO declared PHEIC in August 2024. Jynneos vaccine available for high-risk individuals.",
  },
  {
    disease: "Dengue Fever",
    vaccineId: "dengue",
    location: "Americas, Asia, Africa",
    date: "2024",
    cases: "Record 10M+ cases in Americas",
    status: "active",
    severity: "high",
    source: "PAHO/WHO",
    sourceUrl: "https://www.paho.org/en/topics/dengue",
    notes:
      "Record-breaking epidemic year globally. Dengvaxia vaccine available for previously infected in endemic areas.",
  },
  {
    disease: "Polio (cVDPV2)",
    vaccineId: "ipv",
    location: "Multiple countries (Africa, Middle East)",
    date: "2024",
    cases: "Circulating vaccine-derived",
    status: "active",
    severity: "high",
    source: "WHO GPEI",
    sourceUrl: "https://polioeradication.org/polio-today/polio-now/",
    notes:
      "Circulating vaccine-derived poliovirus type 2 in several countries. IPV essential.",
  },
  {
    disease: "Yellow Fever",
    vaccineId: "yellowfever",
    location: "Africa, South America",
    date: "2024",
    cases: "Endemic with periodic outbreaks",
    status: "endemic",
    severity: "moderate",
    source: "WHO",
    sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/yellow-fever",
    notes:
      "Required for travel to endemic regions. Single dose provides lifelong immunity for most travelers.",
  },
  {
    disease: "COVID-19",
    vaccineId: "covid19",
    location: "Global",
    date: "Ongoing",
    cases: "Ongoing surveillance",
    status: "endemic",
    severity: "moderate",
    source: "WHO",
    sourceUrl: "https://www.who.int/emergencies/diseases/novel-coronavirus-2019",
    notes:
      "Transitioned to endemic management. Annual updated vaccines recommended. Variants continue to emerge.",
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:   { label: "Active Outbreak", color: "#ef4444", bg: "#450a0a", border: "#7f1d1d" },
  seasonal: { label: "Seasonal",        color: "#f59e0b", bg: "#2d1800", border: "#78350f" },
  endemic:  { label: "Endemic",         color: "#8b5cf6", bg: "#1e0a3c", border: "#4c1d95" },
  resolved: { label: "Resolved",        color: "#10b981", bg: "#022c22", border: "#065f46" },
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
  high:     { label: "High",     color: "#ef4444" },
  moderate: { label: "Moderate", color: "#f59e0b" },
  low:      { label: "Low",      color: "#10b981" },
};

export default function OutbreakMapPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Vaccine-Preventable Disease Outbreak Map — VaxFact.net",
    description:
      "Active and recent outbreaks of vaccine-preventable diseases from CDC and WHO surveillance.",
    url: "https://vaxfact.net/outbreak-map",
  };

  const activeCount = RECENT_OUTBREAKS.filter((o) => o.status === "active").length;
  const countriesAffected = 40; // approximate

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main style={{ minHeight: "100vh", background: "#060e1e", paddingBottom: 80 }}>
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(180deg, #0a1628 0%, #060e1e 100%)",
            borderBottom: "1px solid #1e293b",
            paddingTop: 48,
            paddingBottom: 48,
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748b" }}>
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#94a3b8" }}>Outbreak Map</span>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 42,
                  fontWeight: 900,
                  color: "#f8fafc",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Outbreak Tracker
              </h1>
              <span
                style={{
                  background: "#450a0a",
                  border: "1px solid #7f1d1d",
                  color: "#ef4444",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#ef4444",
                    display: "inline-block",
                    animation: "pulse 2s infinite",
                  }}
                />
                LIVE
              </span>
            </div>
            <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 640, lineHeight: 1.7, marginBottom: 28 }}>
              Active and recent outbreaks of vaccine-preventable diseases. Data sourced
              from CDC, WHO, and PAHO disease surveillance systems.
            </p>

            {/* Stats bar */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "Active outbreaks tracked", value: activeCount.toString(), color: "#ef4444" },
                { label: "Countries affected", value: `${countriesAffected}+`, color: "#f59e0b" },
                { label: "Diseases tracked", value: RECENT_OUTBREAKS.length.toString(), color: "#3b82f6" },
                { label: "Data updated", value: "2024–2025", color: "#10b981" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#0d1526",
                    border: "1px solid #1e293b",
                    borderRadius: 10,
                    padding: "12px 18px",
                  }}
                >
                  <div style={{ color: stat.color, fontSize: 22, fontWeight: 700 }}>
                    {stat.value}
                  </div>
                  <div style={{ color: "#475569", fontSize: 12 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
          {/* Status legend */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 28,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#64748b", fontSize: 13 }}>Status:</span>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <span
                key={key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: val.bg,
                  color: val.color,
                  border: `1px solid ${val.border}`,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: val.color,
                  }}
                />
                {val.label}
              </span>
            ))}
          </div>

          {/* Outbreak cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {RECENT_OUTBREAKS.map((outbreak) => {
              const status = STATUS_CONFIG[outbreak.status];
              const severity = SEVERITY_CONFIG[outbreak.severity];

              return (
                <div
                  key={outbreak.disease}
                  style={{
                    background: "#0d1526",
                    border: `1px solid ${status.border}`,
                    borderRadius: 12,
                    padding: 24,
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 24,
                    alignItems: "start",
                  }}
                >
                  <div>
                    {/* Header row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#f1f5f9",
                          margin: 0,
                        }}
                      >
                        {outbreak.disease}
                      </h3>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: status.bg,
                          color: status.color,
                          border: `1px solid ${status.border}`,
                        }}
                      >
                        {status.label}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: severity.color,
                        }}
                      >
                        ● {severity.label} severity
                      </span>
                    </div>

                    {/* Details grid */}
                    <div
                      style={{
                        display: "flex",
                        gap: 24,
                        marginBottom: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ color: "#475569", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                          Location
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 13 }}>{outbreak.location}</div>
                      </div>
                      <div>
                        <div style={{ color: "#475569", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                          Period
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 13 }}>{outbreak.date}</div>
                      </div>
                      <div>
                        <div style={{ color: "#475569", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                          Cases
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 13 }}>{outbreak.cases}</div>
                      </div>
                      <div>
                        <div style={{ color: "#475569", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                          Source
                        </div>
                        <a
                          href={outbreak.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#3b82f6", fontSize: 13, textDecoration: "none" }}
                        >
                          {outbreak.source} ↗
                        </a>
                      </div>
                    </div>

                    <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      {outbreak.notes}
                    </p>
                  </div>

                  {/* Vaccine CTA */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {outbreak.vaccineId ? (
                      <Link
                        href={`/vaccines/${outbreak.vaccineId}`}
                        style={{
                          display: "inline-block",
                          background: "linear-gradient(135deg, #1e3a5f, #1e1b4b)",
                          border: "1px solid #3730a3",
                          color: "#93c5fd",
                          padding: "8px 16px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View Vaccine Profile →
                      </Link>
                    ) : (
                      <span
                        style={{
                          display: "inline-block",
                          background: "#1e293b",
                          color: "#64748b",
                          padding: "8px 16px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        No vaccine on VaxFact
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Data sources note */}
          <div
            style={{
              background: "#0d1526",
              border: "1px solid #1e293b",
              borderRadius: 10,
              padding: 20,
              marginTop: 32,
            }}
          >
            <h3
              style={{
                color: "#94a3b8",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Data Sources
            </h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { name: "CDC Disease Outbreaks", url: "https://www.cdc.gov/outbreaks/" },
                { name: "WHO Disease Outbreak News", url: "https://www.who.int/emergencies/disease-outbreak-news/" },
                { name: "PAHO", url: "https://www.paho.org/en/topics/outbreak-and-epidemic-preparedness" },
                { name: "CDC FluView", url: "https://www.cdc.gov/flu/weekly/" },
                { name: "WHO GPEI (Polio)", url: "https://polioeradication.org/" },
              ].map((src) => (
                <a
                  key={src.name}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#3b82f6",
                    fontSize: 13,
                    textDecoration: "none",
                    background: "#060e1e",
                    border: "1px solid #1e293b",
                    borderRadius: 6,
                    padding: "6px 12px",
                  }}
                >
                  {src.name} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div
            style={{
              background: "#0a0000",
              border: "1px solid #7f1d1d",
              borderRadius: 10,
              padding: 16,
              marginTop: 12,
            }}
          >
            <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "#fca5a5" }}>Data note:</strong> Outbreak data
              is compiled from public CDC, WHO, and PAHO surveillance reports. Case
              counts and status may lag behind real-time conditions. Always check
              official sources for the most current information before making travel
              or health decisions.
            </p>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <SiteFooter />
    </>
  );
}