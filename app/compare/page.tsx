import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { VACCINES } from "@/lib/vaccineData";

export const metadata: Metadata = {
  title: "Compare Vaccines — Side-by-Side Risk & Benefit Analysis | VaxFact.net",
  description:
    "Compare vaccines side by side: effectiveness, adverse event rates, disease severity scores, and evidence quality. Make informed decisions with transparent data.",
  alternates: { canonical: "https://vaxfact.net/compare" },
  openGraph: {
    title: "Compare Vaccines — VaxFact.net",
    description:
      "Side-by-side vaccine comparison: effectiveness, adverse events, disease risk, and evidence quality for all 24 vaccines.",
    url: "https://vaxfact.net/compare",
  },
};

const COMPARE_VACCINES = VACCINES.map((v) => ({
  id: v.id,
  name: v.name,
  color: v.color,
  icon: v.icon,
  yearsInUse: v.yearsInUse,
  dosesAdministered: v.dosesAdministered,
  effectiveness: v.effectiveness,
  scores: v.scores,
  adverseEvents: v.adverseEvents,
  disease: {
    mortalityRate: v.disease.mortalityRate,
    hospitalizationRate: v.disease.hospitalizationRate,
    outbreakPotential: v.disease.outbreakPotential,
    chronicSequelaeRate: v.disease.chronicSequelaeRate,
  },
  diseases: v.diseases,
  ageWindow: v.ageWindow,
}));

type SortKey = "netBenefit" | "effectivenessInfection" | "evidenceConfidence" | "yearsInUse" | "vaccineRisk";

function getRatingColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 65) return "#84cc16";
  if (score >= 50) return "#f59e0b";
  if (score >= 35) return "#f97316";
  return "#ef4444";
}

function getRatingLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Good";
  if (score >= 50) return "Moderate";
  if (score >= 35) return "Fair";
  return "Low";
}

function OutbreakBadge({ potential }: { potential: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    "low": { bg: "#064e3b", text: "#34d399" },
    "moderate": { bg: "#1c1917", text: "#f59e0b" },
    "high": { bg: "#450a0a", text: "#f87171" },
    "very-high": { bg: "#3b0764", text: "#c084fc" },
  };
  const c = colors[potential] ?? colors["moderate"];
  return (
    <span style={{
      background: c.bg,
      color: c.text,
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 600,
      textTransform: "capitalize",
    }}>
      {potential}
    </span>
  );
}

export default function ComparePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Compare Vaccines — VaxFact.net",
    description:
      "Side-by-side comparison of vaccine effectiveness, safety, disease severity, and evidence quality for 24 recommended vaccines.",
    url: "https://vaxfact.net/compare",
  };

  // Sort by net benefit descending by default
  const sorted = [...COMPARE_VACCINES].sort(
    (a, b) => b.scores.netBenefit - a.scores.netBenefit
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main style={{ minHeight: "100vh", background: "#060e1e", paddingBottom: 80 }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(180deg, #0a1628 0%, #060e1e 100%)",
          borderBottom: "1px solid #1e293b",
          paddingTop: 48,
          paddingBottom: 48,
          paddingLeft: 24,
          paddingRight: 24,
          textAlign: "center",
        }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 20,
              padding: "4px 16px",
              fontSize: 13,
              color: "#818cf8",
              marginBottom: 16,
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}>
              ⚖️ SIDE-BY-SIDE ANALYSIS
            </div>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              color: "#f1f5f9",
              margin: "0 0 16px 0",
              lineHeight: 1.15,
            }}>
              Compare All Vaccines
            </h1>
            <p style={{
              fontSize: 18,
              color: "#94a3b8",
              lineHeight: 1.7,
              margin: "0 0 8px 0",
              maxWidth: 580,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              Transparent, evidence-based scores for all 24 vaccines — sorted by net benefit.
              Click any vaccine for its full evidence profile.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 16px 0" }}>

          {/* Legend */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
            padding: 20,
            background: "#0d1526",
            border: "1px solid #1e293b",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, width: "100%", marginBottom: 4 }}>
              SCORE LEGEND (0–100)
            </div>
            {[
              { label: "Strong (80–100)", color: "#22c55e" },
              { label: "Good (65–79)", color: "#84cc16" },
              { label: "Moderate (50–64)", color: "#f59e0b" },
              { label: "Fair (35–49)", color: "#f97316" },
              { label: "Low (0–34)", color: "#ef4444" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #1e293b" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#0a1628", borderBottom: "2px solid #1e293b" }}>
                  <th style={{ padding: "14px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>VACCINE</th>
                  <th style={{ padding: "14px 12px", textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>NET BENEFIT</th>
                  <th style={{ padding: "14px 12px", textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>VS INFECTION</th>
                  <th style={{ padding: "14px 12px", textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>VS SEVERE</th>
                  <th style={{ padding: "14px 12px", textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>VACCINE RISK</th>
                  <th style={{ padding: "14px 12px", textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>EVIDENCE</th>
                  <th style={{ padding: "14px 12px", textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>OUTBREAK RISK</th>
                  <th style={{ padding: "14px 12px", textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>YEARS STUDIED</th>
                  <th style={{ padding: "14px 12px", textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: 12 }}></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((v, idx) => {
                  const netColor = getRatingColor(v.scores.netBenefit);
                  const veColor = getRatingColor(v.effectiveness.againstInfection);
                  const severeColor = getRatingColor(v.effectiveness.againstSevereDisease);
                  // Vaccine risk is inverse — lower is better (safer)
                  const riskColor = getRatingColor(100 - v.scores.vaccineRisk);
                  const evidenceColor = getRatingColor(v.scores.evidenceConfidence);
                  return (
                    <tr
                      key={v.id}
                      style={{
                        borderBottom: "1px solid #1e293b",
                        background: idx % 2 === 0 ? "#060e1e" : "#080f1c",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Vaccine Name */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{
                            fontSize: 22,
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: `${v.color}22`,
                            border: `1px solid ${v.color}44`,
                            borderRadius: 8,
                          }}>{v.icon}</span>
                          <div>
                            <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>{v.name}</div>
                            <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>
                              {v.diseases.slice(0, 2).join(" · ")}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Net Benefit */}
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <div style={{
                          display: "inline-flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}>
                          <span style={{ color: netColor, fontWeight: 800, fontSize: 20 }}>
                            {v.scores.netBenefit}
                          </span>
                          <span style={{ color: netColor, fontSize: 10, fontWeight: 600 }}>
                            {getRatingLabel(v.scores.netBenefit)}
                          </span>
                        </div>
                      </td>

                      {/* Effectiveness vs Infection */}
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <span style={{ color: veColor, fontWeight: 700, fontSize: 15 }}>
                          {v.effectiveness.againstInfection}%
                        </span>
                      </td>

                      {/* vs Severe Disease */}
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <span style={{ color: severeColor, fontWeight: 700, fontSize: 15 }}>
                          {v.effectiveness.againstSevereDisease}%
                        </span>
                      </td>

                      {/* Vaccine Risk Score */}
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                          <span style={{ color: riskColor, fontWeight: 700, fontSize: 15 }}>
                            {v.scores.vaccineRisk}/100
                          </span>
                          <span style={{ fontSize: 10, color: "#475569" }}>
                            {v.scores.vaccineRisk <= 10 ? "Very Low" : v.scores.vaccineRisk <= 20 ? "Low" : v.scores.vaccineRisk <= 35 ? "Moderate" : "Higher"}
                          </span>
                        </div>
                      </td>

                      {/* Evidence Confidence */}
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                          <span style={{ color: evidenceColor, fontWeight: 700, fontSize: 15 }}>
                            {v.scores.evidenceConfidence}
                          </span>
                          <div style={{
                            height: 4,
                            width: 48,
                            background: "#1e293b",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}>
                            <div style={{
                              height: "100%",
                              width: `${v.scores.evidenceConfidence}%`,
                              background: evidenceColor,
                              borderRadius: 2,
                            }} />
                          </div>
                        </div>
                      </td>

                      {/* Outbreak Potential */}
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <OutbreakBadge potential={v.disease.outbreakPotential} />
                      </td>

                      {/* Years Studied */}
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <span style={{ color: "#94a3b8", fontWeight: 600 }}>
                          {v.yearsInUse}y
                        </span>
                      </td>

                      {/* Link */}
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <Link
                          href={`/vaccines/${v.id}`}
                          style={{
                            background: "rgba(99,102,241,0.12)",
                            border: "1px solid rgba(99,102,241,0.3)",
                            color: "#818cf8",
                            borderRadius: 6,
                            padding: "5px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Key Insights */}
          <div style={{ marginTop: 48 }}>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: 24,
              fontWeight: 700,
              color: "#f1f5f9",
              marginBottom: 24,
            }}>
              📊 Key Insights from the Data
            </h2>
            <div className="vf-about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                {
                  title: "Highest Net Benefit Vaccines",
                  icon: "🏆",
                  content: "Polio (IPV), Hepatitis B, MMR, and Hib vaccines consistently score highest for net benefit. These vaccines target severe diseases with high transmissibility, have decades of safety data, and provide near-complete protection. Their disease-free status in vaccinated communities is the strongest argument for their benefit.",
                },
                {
                  title: "Vaccines with Context-Dependent Value",
                  icon: "🌍",
                  content: "Cholera, Japanese Encephalitis, and Typhoid vaccines have strong disease profiles and excellent safety, but their benefit score depends heavily on travel exposure. For most US residents, these are low priority — for travelers or aid workers in endemic regions, they become critical.",
                },
                {
                  title: "Vaccines with Waning Immunity",
                  icon: "⏳",
                  content: "Pertussis (DTaP/Tdap) and Influenza have notable waning immunity — vaccinated individuals can still contract and transmit these diseases. Despite this, both vaccines significantly reduce severe disease and death, and continued use is strongly supported by evidence.",
                },
                {
                  title: "Understanding Vaccine Risk Scores",
                  icon: "⚠️",
                  content: "The vaccine risk score reflects the weighted sum of adverse event probabilities and severities per 100,000 doses. A score of 5–15 (the range for most vaccines) means the expected harm per 100,000 doses is very low. Even a score of 20–30 typically reflects common mild reactions rather than serious events.",
                },
              ].map((item) => (
                <div key={item.title} style={{
                  background: "#0d1526",
                  border: "1px solid #1e293b",
                  borderRadius: 12,
                  padding: 24,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                  <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 10, margin: "0 0 10px 0" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology note */}
          <div style={{
            marginTop: 40,
            padding: 24,
            background: "#0a1628",
            border: "1px solid #1e293b",
            borderRadius: 12,
          }}>
            <h3 style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 8, margin: "0 0 8px 0" }}>
              📋 METHODOLOGY NOTE
            </h3>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              Scores on this page are derived from peer-reviewed literature, CDC surveillance data, WHO position papers, and Cochrane systematic reviews.
              Net Benefit scores integrate disease burden, vaccine effectiveness, adverse event profiles, and evidence quality using VaxFact's transparent scoring algorithm.
              These scores represent population-level estimates — your individual risk depends on your health status, location, travel plans, and community vaccination rates.
              Use VaxFact's <Link href="/" style={{ color: "#818cf8" }}>personalized calculator</Link> to see scores tailored to your specific scenario.
              All methodology is documented on the <Link href="/about" style={{ color: "#818cf8" }}>About page</Link>.
            </p>
          </div>

        </div>
      </main>
      <SiteFooter />
    </>
  );
}