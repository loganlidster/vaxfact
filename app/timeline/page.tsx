import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { VACCINES } from "@/lib/vaccineData";

export const metadata: Metadata = {
  title: "Vaccine Timeline — Life-Course Immunization Schedule",
  description:
    "See which vaccines are recommended at every stage of life — from birth to age 65+. Interactive life-course vaccine timeline with age windows, dose counts, and disease prevention for all 20 vaccines.",
  alternates: { canonical: "https://vaxfact.net/timeline" },
  openGraph: {
    title: "Vaccine Timeline — VaxFact.net",
    description:
      "Life-course immunization timeline showing recommended vaccines from birth through adulthood.",
    url: "https://vaxfact.net/timeline",
  },
};

// Life stages with age ranges
const LIFE_STAGES = [
  { key: "birth", label: "Birth", sublabel: "0–1 month", color: "#8b5cf6" },
  { key: "infant", label: "Infant", sublabel: "2–6 months", color: "#3b82f6" },
  { key: "toddler", label: "Toddler", sublabel: "7–23 months", color: "#06b6d4" },
  { key: "preschool", label: "Preschool", sublabel: "2–4 years", color: "#10b981" },
  { key: "school", label: "School Age", sublabel: "5–11 years", color: "#84cc16" },
  { key: "preteen", label: "Preteen", sublabel: "11–12 years", color: "#eab308" },
  { key: "teen", label: "Teen", sublabel: "13–18 years", color: "#f97316" },
  { key: "adult", label: "Adult", sublabel: "19–49 years", color: "#ef4444" },
  { key: "older", label: "Older Adult", sublabel: "50–64 years", color: "#ec4899" },
  { key: "senior", label: "Senior", sublabel: "65+ years", color: "#a855f7" },
];

// Map each vaccine to which life stages it belongs
const VACCINE_STAGE_MAP: Record<string, string[]> = {
  hepb:       ["birth", "infant", "toddler"],
  dtap:       ["infant", "toddler", "preschool", "preteen"],
  hib:        ["infant", "toddler"],
  pcv:        ["infant", "toddler", "preschool", "senior"],
  mmr:        ["toddler", "preschool"],
  rotavirus:  ["infant", "toddler"],
  varicella:  ["toddler", "preschool"],
  hepa:       ["toddler", "preschool"],
  hpv:        ["preteen", "teen", "adult"],
  menacwy:    ["preteen", "teen", "adult"],
  menb:       ["teen", "adult"],
  rsv:        ["birth", "older", "senior"],
  influenza:  ["infant", "toddler", "preschool", "school", "preteen", "teen", "adult", "older", "senior"],
  covid19:    ["toddler", "preschool", "school", "preteen", "teen", "adult", "older", "senior"],
  zoster:     ["older", "senior"],
  ipv:        ["infant", "toddler", "preschool"],
  typhoid:    ["school", "preteen", "teen", "adult", "older"],
  yellowfever:["adult", "older"],
  rabies:     ["adult", "older"],
  dengue:     ["school", "preteen", "teen", "adult"],
};

const CATEGORY_COLORS: Record<string, string> = {
  hepb: "#f59e0b", dtap: "#ef4444", hib: "#3b82f6", pcv: "#8b5cf6",
  mmr: "#10b981", rotavirus: "#06b6d4", varicella: "#ec4899", hepa: "#f97316",
  hpv: "#84cc16", menacwy: "#0891b2", menb: "#a855f7", rsv: "#64748b",
  influenza: "#3b82f6", covid19: "#ef4444", zoster: "#d97706",
  ipv: "#14b8a6", typhoid: "#8b5cf6", yellowfever: "#eab308",
  rabies: "#f97316", dengue: "#dc2626",
};

export default function TimelinePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Vaccine Timeline — Life-Course Immunization Schedule",
    description:
      "Life-course immunization timeline showing recommended vaccines from birth through adulthood.",
    url: "https://vaxfact.net/timeline",
  };

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
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748b" }}>
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#94a3b8" }}>Timeline</span>
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
              Life-Course Vaccine Timeline
            </h1>
            <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 640, lineHeight: 1.7 }}>
              See which vaccines are recommended at every life stage — from birth through
              senior years. Based on the CDC ACIP recommended immunization schedule.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 0" }}>

          {/* Life stage grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
              marginBottom: 56,
            }}
          >
            {LIFE_STAGES.map((stage) => {
              const stageVaccines = VACCINES.filter((v) =>
                VACCINE_STAGE_MAP[v.id]?.includes(stage.key)
              );

              return (
                <div
                  key={stage.key}
                  style={{
                    background: "#0d1526",
                    border: `1px solid ${stage.color}33`,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  {/* Stage header */}
                  <div
                    style={{
                      background: `${stage.color}18`,
                      borderBottom: `1px solid ${stage.color}33`,
                      padding: "14px 18px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: stage.color,
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        {stage.label}
                      </div>
                      <div style={{ color: "#64748b", fontSize: 12 }}>
                        {stage.sublabel}
                      </div>
                    </div>
                    <span
                      style={{
                        background: `${stage.color}22`,
                        border: `1px solid ${stage.color}44`,
                        color: stage.color,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 12,
                      }}
                    >
                      {stageVaccines.length} vaccines
                    </span>
                  </div>

                  {/* Vaccine list */}
                  <div style={{ padding: "12px 18px 16px" }}>
                    {stageVaccines.length === 0 ? (
                      <p style={{ color: "#374151", fontSize: 13, margin: 0, fontStyle: "italic" }}>
                        No new vaccines at this stage
                      </p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {stageVaccines.map((v) => (
                          <Link
                            key={v.id}
                            href={`/vaccines/${v.id}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "6px 8px",
                              borderRadius: 6,
                              textDecoration: "none",
                              background: "transparent",
                              transition: "background 0.15s",
                            }}
                            className="timeline-vaccine-link"
                          >
                            <span style={{ fontSize: 16, flexShrink: 0 }}>
                              {v.icon}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  color: "#e2e8f0",
                                  fontSize: 13,
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {v.name}
                              </div>
                              <div style={{ color: "#475569", fontSize: 11 }}>
                                {v.schedule.doses} dose{v.schedule.doses > 1 ? "s" : ""}
                              </div>
                            </div>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: CATEGORY_COLORS[v.id] ?? "#64748b",
                                flexShrink: 0,
                              }}
                            />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full table view */}
          <div
            style={{
              background: "#0d1526",
              border: "1px solid #1e293b",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #1e293b",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  margin: 0,
                }}
              >
                Complete Schedule at a Glance
              </h2>
              <span style={{ color: "#64748b", fontSize: 13 }}>
                20 vaccines × {LIFE_STAGES.length} life stages
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                  minWidth: 900,
                }}
              >
                <thead>
                  <tr style={{ background: "#060e1e" }}>
                    <th
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        color: "#64748b",
                        fontWeight: 600,
                        borderBottom: "1px solid #1e293b",
                        position: "sticky",
                        left: 0,
                        background: "#060e1e",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Vaccine
                    </th>
                    {LIFE_STAGES.map((stage) => (
                      <th
                        key={stage.key}
                        style={{
                          padding: "10px 8px",
                          textAlign: "center",
                          color: stage.color,
                          fontWeight: 600,
                          borderBottom: "1px solid #1e293b",
                          whiteSpace: "nowrap",
                          minWidth: 72,
                        }}
                      >
                        <div>{stage.label}</div>
                        <div style={{ color: "#475569", fontSize: 10, fontWeight: 400 }}>
                          {stage.sublabel}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VACCINES.map((v, i) => (
                    <tr
                      key={v.id}
                      style={{
                        background: i % 2 === 0 ? "#0d1526" : "#060e1e",
                        borderBottom: "1px solid #0f172a",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 16px",
                          position: "sticky",
                          left: 0,
                          background: i % 2 === 0 ? "#0d1526" : "#060e1e",
                          zIndex: 1,
                          borderRight: "1px solid #1e293b",
                        }}
                      >
                        <Link
                          href={`/vaccines/${v.id}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ fontSize: 14 }}>{v.icon}</span>
                          <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                            {v.name}
                          </span>
                        </Link>
                      </td>
                      {LIFE_STAGES.map((stage) => {
                        const recommended = VACCINE_STAGE_MAP[v.id]?.includes(stage.key);
                        return (
                          <td
                            key={stage.key}
                            style={{
                              padding: "10px 8px",
                              textAlign: "center",
                            }}
                          >
                            {recommended ? (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  background: CATEGORY_COLORS[v.id] ?? "#10b981",
                                }}
                                title={`${v.name} recommended at ${stage.label}`}
                              />
                            ) : (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  background: "#1e293b",
                                }}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Note */}
          <div
            style={{
              background: "#0d1f0d",
              border: "1px solid #065f46",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <p style={{ color: "#86efac", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              <strong>Note:</strong> This timeline reflects the CDC ACIP recommended
              immunization schedule for the US. International schedules may differ.
              Talk to your healthcare provider about the right timing for your specific
              situation. Use the{" "}
              <Link href="/" style={{ color: "#34d399", textDecoration: "underline" }}>
                Score Calculator
              </Link>{" "}
              to see personalized benefit-risk analysis for any vaccine.
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .timeline-vaccine-link:hover {
          background: rgba(59,130,246,0.08) !important;
        }
      `}</style>

      <SiteFooter />
    </>
  );
}