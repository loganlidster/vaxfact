import type { Metadata } from "next";
import Link from "next/link";
import { VACCINES } from "@/lib/vaccineData";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Vaccine Database — All 20 Vaccines with Evidence Scores",
  description:
    "Browse evidence-based profiles for 20 vaccines: MMR, DTaP, HPV, COVID-19, Influenza, and more. Each profile includes benefit-risk scores, side effects, credible scientific debates, and international policy comparisons.",
  alternates: { canonical: "https://vaxfact.net/vaccines" },
  openGraph: {
    title: "Vaccine Database — VaxFact.net",
    description:
      "Evidence-based profiles for 20 vaccines with transparent benefit-risk scoring.",
    url: "https://vaxfact.net/vaccines",
  },
};

const CATEGORY_MAP: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  routine: {
    label: "Routine",
    color: "#059669",
    bg: "#022c22",
    border: "#065f46",
  },
  annual: {
    label: "Annual",
    color: "#0891b2",
    bg: "#042f4b",
    border: "#075985",
  },
  discuss: {
    label: "Shared Decision",
    color: "#d97706",
    bg: "#2d1800",
    border: "#78350f",
  },
  travel: {
    label: "Travel",
    color: "#7c3aed",
    bg: "#1e0a3c",
    border: "#4c1d95",
  },
};

const VACCINE_CATEGORIES: Record<string, string> = {
  hepb: "routine",
  dtap: "routine",
  hib: "routine",
  pcv: "routine",
  mmr: "routine",
  rotavirus: "routine",
  varicella: "routine",
  hepa: "routine",
  hpv: "routine",
  menacwy: "routine",
  menb: "discuss",
  rsv: "routine",
  influenza: "annual",
  covid19: "annual",
  zoster: "routine",
  typhoid: "travel",
  yellowfever: "travel",
  rabies: "travel",
  dengue: "travel",
  ipv: "routine",
};

const GROUPS = [
  { key: "routine", label: "Routine Childhood & Adult Vaccines", icon: "🏥" },
  { key: "annual", label: "Annual Vaccines", icon: "📅" },
  { key: "discuss", label: "Shared Decision Vaccines", icon: "💬" },
  { key: "travel", label: "Travel Vaccines", icon: "✈️" },
];

export default function VaccinesIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Vaccine Database — VaxFact.net",
    description:
      "Evidence-based profiles for 20 vaccines with transparent benefit-risk scoring.",
    url: "https://vaxfact.net/vaccines",
    hasPart: VACCINES.map((v) => ({
      "@type": "MedicalWebPage",
      name: v.name,
      url: `https://vaxfact.net/vaccines/${v.id}`,
      description: v.disease.description.slice(0, 160),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <style>{`
        .vaccine-card {
          background: #0d1526;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 20px 22px;
          transition: box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          text-decoration: none;
        }
        .vaccine-card:hover {
          box-shadow: 0 8px 32px rgba(59,130,246,0.15);
          transform: translateY(-2px);
          border-color: #3b82f6;
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background: "#060e1e",
          paddingBottom: 80,
        }}
      >
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(180deg, #0a1628 0%, #060e1e 100%)",
            borderBottom: "1px solid #1e293b",
            paddingTop: 48,
            paddingBottom: 48,
          }}
        >
          <div
            style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}
          >
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              style={{ marginBottom: 20, fontSize: 13, color: "#64748b" }}
            >
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
                Home
              </Link>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#94a3b8" }}>Vaccines</span>
            </nav>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 42,
                fontWeight: 900,
                color: "#f8fafc",
                marginBottom: 16,
                lineHeight: 1.1,
              }}
            >
              Vaccine Database
            </h1>
            <p
              style={{
                fontSize: 18,
                color: "#94a3b8",
                maxWidth: 640,
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              Evidence-based profiles for{" "}
              <strong style={{ color: "#f1f5f9" }}>20 vaccines</strong>. Each
              page includes benefit-risk scoring, disease data, adverse events,
              credible scientific debates, and international policy comparisons.
            </p>

            {/* Category legend */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {Object.entries(CATEGORY_MAP).map(([key, val]) => (
                <span
                  key={key}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
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
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: val.color,
                      display: "inline-block",
                    }}
                  />
                  {val.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Vaccine groups */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "48px 24px 0",
          }}
        >
          {GROUPS.map((group) => {
            const groupVaccines = VACCINES.filter(
              (v) => VACCINE_CATEGORIES[v.id] === group.key
            );
            if (groupVaccines.length === 0) return null;
            const cat = CATEGORY_MAP[group.key];

            return (
              <section key={group.key} style={{ marginBottom: 56 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                    paddingBottom: 16,
                    borderBottom: `1px solid ${cat.border}`,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{group.icon}</span>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#f1f5f9",
                      margin: 0,
                    }}
                  >
                    {group.label}
                  </h2>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: cat.bg,
                      color: cat.color,
                      border: `1px solid ${cat.border}`,
                    }}
                  >
                    {groupVaccines.length} vaccines
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 16,
                  }}
                >
                  {groupVaccines.map((vaccine) => (
                    <Link
                      key={vaccine.id}
                      href={`/vaccines/${vaccine.id}`}
                      className="vaccine-card"
                    >
                      {/* Card header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: `${vaccine.color}22`,
                            border: `2px solid ${vaccine.color}44`,
                            display: "grid",
                            placeItems: "center",
                            fontSize: 20,
                            flexShrink: 0,
                          }}
                        >
                          {vaccine.icon}
                        </div>
                        <div>
                          <h3
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: 16,
                              fontWeight: 700,
                              color: "#f1f5f9",
                              margin: 0,
                              lineHeight: 1.2,
                            }}
                          >
                            {vaccine.name}
                          </h3>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginTop: 2,
                            }}
                          >
                            {vaccine.ageWindow}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          fontSize: 13,
                          color: "#64748b",
                          lineHeight: 1.6,
                          flex: 1,
                          margin: "0 0 14px",
                        }}
                      >
                        {vaccine.disease.description.slice(0, 110)}…
                      </p>

                      {/* Footer badges */}
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#059669",
                            background: "#022c22",
                            border: "1px solid #065f46",
                            padding: "3px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {vaccine.effectiveness.againstSevereDisease}% vs
                          severe disease
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          {vaccine.yearsInUse}y in use
                        </span>
                        <span
                          style={{
                            marginLeft: "auto",
                            color: "#3b82f6",
                            fontSize: 13,
                          }}
                        >
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}