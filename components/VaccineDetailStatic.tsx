import Link from "next/link";
import type { VaccineData, ScoreResult } from "@/lib/vaccineData";

interface Props {
  vaccine: VaccineData;
  score: ScoreResult;
  relatedVaccines?: VaccineData[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function ScoreBar({
  label,
  value,
  color,
  description,
}: {
  label: string;
  value: number;
  color: string;
  description?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <div>
          <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>
            {label}
          </span>
          {description && (
            <span style={{ color: "#64748b", fontSize: 12, marginLeft: 8 }}>
              {description}
            </span>
          )}
        </div>
        <span
          style={{
            color,
            fontSize: 16,
            fontWeight: 700,
            minWidth: 36,
            textAlign: "right",
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "#1e293b",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: color,
            borderRadius: 4,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "#0d1526",
        border: `1px solid ${accent ?? "#1e293b"}`,
        borderRadius: 12,
        padding: 28,
        marginBottom: 24,
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 20,
          fontWeight: 700,
          color: "#f1f5f9",
          marginBottom: 20,
          paddingBottom: 12,
          borderBottom: `1px solid ${accent ?? "#1e293b"}`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function getRecommendationConfig(rec: ScoreResult["recommendation"]) {
  switch (rec) {
    case "strong":
      return {
        label: "Strong Recommendation",
        color: "#059669",
        bg: "#064e3b",
        border: "#065f46",
        icon: "✓",
      };
    case "moderate":
      return {
        label: "Moderate Recommendation",
        color: "#0891b2",
        bg: "#0c4a6e",
        border: "#075985",
        icon: "↑",
      };
    case "consider":
      return {
        label: "Worth Considering",
        color: "#d97706",
        bg: "#451a03",
        border: "#78350f",
        icon: "~",
      };
    default:
      return {
        label: "Discuss With Provider",
        color: "#dc2626",
        bg: "#450a0a",
        border: "#7f1d1d",
        icon: "?",
      };
  }
}

function NetBenefitRing({ score }: { score: ScoreResult }) {
  const rec = getRecommendationConfig(score.recommendation);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score.netBenefit / 100) * circumference;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg width={140} height={140} viewBox="0 0 140 140">
          <circle
            cx={70}
            cy={70}
            r={54}
            fill="none"
            stroke="#1e293b"
            strokeWidth={12}
          />
          <circle
            cx={70}
            cy={70}
            r={54}
            fill="none"
            stroke={rec.color}
            strokeWidth={12}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{ fontSize: 36, fontWeight: 700, color: rec.color, lineHeight: 1 }}
          >
            {score.netBenefit}
          </span>
          <span style={{ fontSize: 12, color: "#64748b" }}>/ 100</span>
        </div>
      </div>
      <div
        style={{
          background: rec.bg,
          border: `1px solid ${rec.border}`,
          borderRadius: 8,
          padding: "8px 16px",
          color: rec.color,
          fontSize: 13,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        {rec.icon} {rec.label}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function VaccineDetailStatic({ vaccine, score, relatedVaccines }: Props) {
  const rec = getRecommendationConfig(score.recommendation);

  // Sort adverse events by severity
  const sortedAE = [...vaccine.adverseEvents].sort(
    (a, b) =>
      b.severityWeight * (b.probability / 100000) -
      a.severityWeight * (a.probability / 100000)
  );

  // Separate serious from common AEs
  const seriousAE = sortedAE.filter(
    (ae) => ae.type === "serious" || ae.type === "rare-serious"
  );
  const commonAE = sortedAE.filter(
    (ae) => ae.type === "mild" || ae.type === "moderate"
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#060e1e",
        paddingBottom: 80,
      }}
    >
      <style>{`
        .vf-hero-grid { display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: start; }
        .vf-body-grid { display: grid; grid-template-columns: 1fr 340px; gap: 32px; align-items: start; }
        .vf-effectiveness-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
        .vf-disease-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
        .vf-procon-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .vf-related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .vf-schedule-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .vf-stats-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .vf-stat-card { background: #0d1526; border: 1px solid #1e293b; border-radius: 10px; padding: 12px 16px; min-width: 140px; flex: 1 1 140px; }
        .vf-sidebar { position: sticky; top: 80px; }
        .vf-ae-card { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .vf-policy-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        @media (max-width: 900px) {
          .vf-hero-grid { grid-template-columns: 1fr !important; }
          .vf-body-grid { grid-template-columns: 1fr !important; }
          .vf-sidebar { position: static !important; }
        }
        @media (max-width: 768px) {
          .vf-effectiveness-grid { grid-template-columns: 1fr !important; }
          .vf-disease-grid { grid-template-columns: 1fr !important; }
          .vf-procon-grid { grid-template-columns: 1fr !important; }
          .vf-related-grid { grid-template-columns: 1fr !important; }
          .vf-schedule-info-grid { grid-template-columns: 1fr !important; }
          .vf-stats-row { gap: 10px !important; }
          .vf-stat-card { min-width: 120px !important; }
          .vf-ae-card { flex-direction: column !important; align-items: flex-start !important; }
          .vf-policy-row { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
        }
      `}</style>
      {/* ── Hero ── */}
      <div
        style={{
          background: "linear-gradient(180deg, #0a1628 0%, #060e1e 100%)",
          borderBottom: "1px solid #1e293b",
          paddingTop: 48,
          paddingBottom: 48,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            style={{ marginBottom: 24, fontSize: 13, color: "#64748b" }}
          >
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
              Home
            </Link>
            <span style={{ margin: "0 8px" }}>›</span>
            <Link
              href="/vaccines"
              style={{ color: "#64748b", textDecoration: "none" }}
            >
              Vaccines
            </Link>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#94a3b8" }}>{vaccine.name}</span>
          </nav>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 48,
              alignItems: "start",
            }}
          >
            {/* Left: Vaccine info */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: `${vaccine.color}22`,
                    border: `2px solid ${vaccine.color}44`,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    flexShrink: 0,
                  }}
                >
                  {vaccine.icon}
                </div>
                <div>
                  <h1
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 36,
                      fontWeight: 900,
                      color: "#f8fafc",
                      lineHeight: 1.1,
                      margin: 0,
                    }}
                  >
                    {vaccine.name} Vaccine
                  </h1>
                  <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0" }}>
                    {vaccine.diseases.join(" · ")}
                  </p>
                </div>
              </div>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 16,
                  lineHeight: 1.7,
                  maxWidth: 640,
                  marginBottom: 24,
                }}
              >
                {vaccine.disease.description}
              </p>

              {/* Key stats row */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  {
                    label: "Years in Use",
                    value: `${vaccine.yearsInUse}+ yrs`,
                    icon: "📅",
                  },
                  {
                    label: "Doses Administered",
                    value: vaccine.dosesAdministered,
                    icon: "💉",
                  },
                  {
                    label: "Effectiveness",
                    value: `${vaccine.effectiveness.againstSevereDisease}% vs severe disease`,
                    icon: "🛡️",
                  },
                  {
                    label: "Age Window",
                    value: vaccine.ageWindow,
                    icon: "👶",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: "#0d1526",
                      border: "1px solid #1e293b",
                      borderRadius: 10,
                      padding: "12px 16px",
                      minWidth: 160,
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</div>
                    <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600 }}>
                      {stat.value}
                    </div>
                    <div style={{ color: "#475569", fontSize: 12 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Score ring */}
            <div
              style={{
                background: "#0d1526",
                border: "1px solid #1e293b",
                borderRadius: 16,
                padding: 28,
                textAlign: "center",
                minWidth: 220,
              }}
            >
              <p
                style={{
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 16,
                }}
              >
                Overall Benefit Score
              </p>
              <NetBenefitRing score={score} />
              <p
                style={{
                  color: "#475569",
                  fontSize: 11,
                  marginTop: 12,
                  lineHeight: 1.5,
                }}
              >
                Default scenario · 12-month-old · US community (92% vax rate)
              </p>
              <Link
                href="/"
                style={{
                  display: "block",
                  marginTop: 16,
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  color: "#fff",
                  padding: "10px 0",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Score for your child →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body Content ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 24px 0",
        }}
        className="vf-body-grid"
      >
        {/* ── Main column ── */}
        <div>
          {/* Summary / Recommendation */}
          <div
            style={{
              background: rec.bg,
              border: `1px solid ${rec.border}`,
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 20 }}>{rec.icon}</span>
              <span style={{ color: rec.color, fontWeight: 700, fontSize: 16 }}>
                {rec.label}
              </span>
            </div>
            <p style={{ color: "#cbd5e1", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              {score.summary}
            </p>
          </div>

          {/* Evidence Scores */}
          <SectionCard title="📊 Evidence Scores" accent="#1e3a5f">
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
              Scores computed from peer-reviewed data using VaxFact's evidence model.
              Based on default scenario (12-month-old, standard US community).
            </p>
            <ScoreBar
              label="Net Benefit"
              value={score.netBenefit}
              color={rec.color}
              description="Benefit minus risk, weighted by exposure probability"
            />
            <ScoreBar
              label="Exposure Risk"
              value={score.exposureRisk}
              color="#3b82f6"
              description="Likelihood of encountering the disease"
            />
            <ScoreBar
              label="Disease Consequence"
              value={score.diseaseConsequence}
              color="#ef4444"
              description="Severity of outcomes if disease is acquired"
            />
            <ScoreBar
              label="Vaccine Benefit"
              value={score.vaccineBenefit}
              color="#10b981"
              description="Protection provided against disease and death"
            />
            <ScoreBar
              label="Vaccine Harm"
              value={score.vaccineHarm}
              color="#f59e0b"
              description="Risk from the vaccine itself (adverse events)"
            />
            <ScoreBar
              label="Evidence Confidence"
              value={score.evidenceConfidence}
              color="#8b5cf6"
              description="Quality and consensus of the scientific evidence"
            />
          </SectionCard>

          {/* Disease Burden */}
          <SectionCard title="🦠 Disease Burden" accent="#1e293b">
            <p
              style={{
                color: "#94a3b8",
                fontSize: 15,
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              {vaccine.disease.description}
            </p>

            <div className="vf-disease-grid">
              {[
                {
                  label: "Transmission",
                  value: vaccine.disease.transmissionRoute,
                  icon: "🔄",
                },
                {
                  label: "Outbreak Potential",
                  value: vaccine.disease.outbreakPotential,
                  icon: "⚡",
                },
                {
                  label: "Hospitalization Rate",
                  value: `${vaccine.disease.hospitalizationRate}% of infected`,
                  icon: "🏥",
                },
                {
                  label: "Long-term Complications",
                  value: `${vaccine.disease.chronicSequelaeRate}% of infected`,
                  icon: "⏱️",
                },
                {
                  label: "Incidence (unvaccinated)",
                  value: `${vaccine.disease.incidenceUnvaccinated} per 100,000/yr`,
                  icon: "📈",
                },
                {
                  label: "Incidence (vaccinated)",
                  value: `${vaccine.disease.incidenceVaccinated} per 100,000/yr`,
                  icon: "📉",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "#060e1e",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    padding: 14,
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                    {item.value}
                  </div>
                  <div style={{ color: "#475569", fontSize: 12 }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "#060e1e",
                border: "1px solid #1e293b",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div
                style={{
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                }}
              >
                Quality of Life Impact
              </div>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {vaccine.disease.qualityOfLifeImpact}
              </p>
            </div>
          </SectionCard>

          {/* Vaccine Effectiveness */}
          <SectionCard title="🛡️ Vaccine Effectiveness" accent="#1e3a5f">
            <div className="vf-effectiveness-grid">
              {[
                {
                  label: "Against Infection",
                  value: vaccine.effectiveness.againstInfection,
                  icon: "🦠",
                },
                {
                  label: "Against Severe Disease",
                  value: vaccine.effectiveness.againstSevereDisease,
                  icon: "🏥",
                },
                {
                  label: "Against Death",
                  value: vaccine.effectiveness.againstDeath,
                  icon: "💚",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "#060e1e",
                    border: "1px solid #065f46",
                    borderRadius: 10,
                    padding: 16,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      color: "#10b981",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {item.value}%
                  </div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>{item.label}</div>
                </div>
              ))}
            </div>

            {vaccine.effectiveness.waningNotes && (
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                  }}
                >
                  Waning Immunity
                </div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  {vaccine.effectiveness.waningNotes}
                </p>
              </div>
            )}

            {vaccine.effectiveness.breakthroughNotes && (
              <div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                  }}
                >
                  Breakthrough Infections
                </div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  {vaccine.effectiveness.breakthroughNotes}
                </p>
              </div>
            )}
          </SectionCard>

          {/* Adverse Events */}
          <SectionCard title="⚠️ Adverse Events & Side Effects" accent="#2d1b00">
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
              All probabilities are per 100,000 doses administered, sourced from VAERS,
              Vaccine Safety Datalink, and post-licensure surveillance studies.
            </p>

            {commonAE.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3
                  style={{
                    color: "#94a3b8",
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Common Side Effects
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {commonAE.map((ae) => (
                    <div
                      key={ae.name}
                      style={{
                        background: "#060e1e",
                        border: "1px solid #1e293b",
                        borderRadius: 8,
                        padding: "12px 16px",
                        gap: 12,
                      }}
                      className="vf-ae-card"
                    >
                      <div>
                        <div
                          style={{
                            color: "#e2e8f0",
                            fontSize: 14,
                            fontWeight: 500,
                            marginBottom: 2,
                          }}
                        >
                          {ae.name}
                        </div>
                        <div style={{ color: "#475569", fontSize: 12 }}>{ae.notes}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div
                          style={{
                            color: "#f59e0b",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {ae.probability.toLocaleString()} / 100k
                        </div>
                        <div style={{ color: "#475569", fontSize: 11 }}>per dose</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {seriousAE.length > 0 && (
              <div>
                <h3
                  style={{
                    color: "#94a3b8",
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Rare Serious Events
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {seriousAE.map((ae) => (
                    <div
                      key={ae.name}
                      style={{
                        background: "#0a0000",
                        border: "1px solid #7f1d1d",
                        borderRadius: 8,
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: "#fca5a5",
                            fontSize: 14,
                            fontWeight: 500,
                            marginBottom: 2,
                          }}
                        >
                          {ae.name}
                        </div>
                        <div style={{ color: "#6b7280", fontSize: 12 }}>{ae.notes}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div
                          style={{
                            color: "#ef4444",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {ae.probability < 1
                            ? `${ae.probability} / 100k`
                            : `${ae.probability.toLocaleString()} / 100k`}
                        </div>
                        <div style={{ color: "#475569", fontSize: 11 }}>per dose</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          {/* Vaccine Schedule */}
          <SectionCard title="📅 Vaccine Schedule" accent="#1e293b">
            <div className="vf-schedule-info-grid">
              <div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 8,
                  }}
                >
                  Dosing Schedule
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {vaccine.schedule.timing.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: "#94a3b8",
                        fontSize: 14,
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          background: "#1e3a5f",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#3b82f6",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 8,
                  }}
                >
                  Key Info
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>
                    <div style={{ color: "#475569", fontSize: 12 }}>Minimum interval</div>
                    <div style={{ color: "#94a3b8", fontSize: 14 }}>
                      {vaccine.schedule.minimumInterval}
                    </div>
                  </div>
                  {vaccine.schedule.canCombineWith.length > 0 && (
                    <div>
                      <div style={{ color: "#475569", fontSize: 12 }}>Can co-administer with</div>
                      <div style={{ color: "#94a3b8", fontSize: 14 }}>
                        {vaccine.schedule.canCombineWith.join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {vaccine.schedule.catchUpNotes && (
              <div
                style={{
                  background: "#060e1e",
                  border: "1px solid #1e3a5f",
                  borderRadius: 8,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                  }}
                >
                  Catch-Up Notes
                </div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {vaccine.schedule.catchUpNotes}
                </p>
              </div>
            )}
          </SectionCard>

          {/* Pros & Cons */}
          <SectionCard title="⚖️ Benefits vs. Considerations" accent="#1e293b">
            <div className="vf-procon-grid">
              <div>
                <h3
                  style={{
                    color: "#10b981",
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ✓ Benefits
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {vaccine.prosList.map((pro, i) => (
                    <li
                      key={i}
                      style={{
                        color: "#94a3b8",
                        fontSize: 14,
                        lineHeight: 1.6,
                        paddingLeft: 16,
                        borderLeft: "2px solid #065f46",
                      }}
                    >
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3
                  style={{
                    color: "#f59e0b",
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ↕ Considerations
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {vaccine.consList.map((con, i) => (
                    <li
                      key={i}
                      style={{
                        color: "#94a3b8",
                        fontSize: 14,
                        lineHeight: 1.6,
                        paddingLeft: 16,
                        borderLeft: "2px solid #78350f",
                      }}
                    >
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Credible Critiques / What researchers question */}
          {vaccine.credibleCritiques && vaccine.credibleCritiques.length > 0 && (
            <SectionCard title="🔬 What Some Researchers Question" accent="#2d1f3d">
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>
                These are legitimate scientific debates — not fringe claims.
                They represent areas of ongoing research or policy disagreement among credentialed experts.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {vaccine.credibleCritiques.map((critique, i) => (
                  <li
                    key={i}
                    style={{
                      background: "#0d0a1f",
                      border: "1px solid #3b2d5a",
                      borderRadius: 8,
                      padding: "12px 16px",
                      color: "#c4b5fd",
                      fontSize: 14,
                      lineHeight: 1.6,
                      paddingLeft: 16,
                    }}
                  >
                    {critique}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* Uncertainties */}
          {vaccine.uncertainties && vaccine.uncertainties.length > 0 && (
            <SectionCard title="🌫️ Scientific Uncertainties" accent="#1e293b">
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>
                Honest acknowledgment of what we don't yet know with confidence.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {vaccine.uncertainties.map((u, i) => (
                  <li
                    key={i}
                    style={{
                      color: "#94a3b8",
                      fontSize: 14,
                      lineHeight: 1.6,
                      paddingLeft: 16,
                      borderLeft: "2px solid #334155",
                    }}
                  >
                    {u}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* Related Vaccines */}
          {relatedVaccines && relatedVaccines.length > 0 && (
            <SectionCard title="💉 Related Vaccines" accent="#1e293b">
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>
                Vaccines often given together or covering related diseases.
              </p>
              <div className="vf-related-grid">
                {relatedVaccines.map((v) => (
                  <Link
                    key={v.id}
                    href={`/vaccines/${v.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "#060e1e",
                      border: "1px solid #1e293b",
                      borderRadius: 8,
                      padding: "12px 14px",
                      textDecoration: "none",
                      transition: "border-color 0.15s",
                    }}
                    className="related-vaccine-link"
                  >
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `${v.color}22`,
                        border: `2px solid ${v.color}44`,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {v.icon}
                    </span>
                    <div>
                      <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>
                        {v.name}
                      </div>
                      <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>
                        {v.ageWindow}
                      </div>
                    </div>
                    <span style={{ marginLeft: "auto", color: "#3b82f6", fontSize: 13 }}>→</span>
                  </Link>
                ))}
              </div>
            </SectionCard>
          )}

          <style>{`
            .related-vaccine-link:hover {
              border-color: #3b82f6 !important;
            }
          `}</style>

          {/* International Policy Comparison */}
          {vaccine.countryPolicies && vaccine.countryPolicies.length > 0 && (
            <SectionCard title="🌍 International Policy Comparison" accent="#1e293b">
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>
                How different countries approach this vaccine — revealing where global consensus
                is strong vs. where policy diverges.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {vaccine.countryPolicies.map((policy) => (
                  <div
                    key={policy.country}
                    style={{
                      background: "#060e1e",
                      border: "1px solid #1e293b",
                      borderRadius: 8,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                    }}
                  >
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{policy.code}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>
                          {policy.country}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "2px 10px",
                            borderRadius: 20,
                            background: policy.recommended ? "#064e3b" : "#451a03",
                            color: policy.recommended ? "#10b981" : "#f59e0b",
                          }}
                        >
                          {policy.recommended ? "✓ Recommended" : "Varies / Optional"}
                        </span>
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: 13 }}>{policy.schedule}</div>
                      {policy.rationale && (
                        <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>
                          {policy.rationale}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="vf-sidebar">
          {/* Brand names */}
          <div
            style={{
              background: "#0d1526",
              border: "1px solid #1e293b",
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              Brand Names
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {vaccine.brandNames.map((brand) => (
                <span
                  key={brand}
                  style={{
                    background: "#1e293b",
                    color: "#94a3b8",
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* Quick evidence summary */}
          <div
            style={{
              background: "#0d1526",
              border: "1px solid #1e293b",
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 16,
              }}
            >
              Evidence Quality
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#64748b", fontSize: 13 }}>Years of Study</span>
                <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>
                  {vaccine.scores.yearsOfStudy}/100
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#64748b", fontSize: 13 }}>Long-Term Safety</span>
                <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>
                  {vaccine.scores.longTermSafetyEvidence}/100
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#64748b", fontSize: 13 }}>Evidence Confidence</span>
                <span style={{ color: "#8b5cf6", fontSize: 13, fontWeight: 600 }}>
                  {vaccine.scores.evidenceConfidence}/100
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#64748b", fontSize: 13 }}>In use since</span>
                <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>
                  {new Date().getFullYear() - vaccine.yearsInUse}
                </span>
              </div>
            </div>
          </div>

          {/* Sources */}
          {vaccine.sources && vaccine.sources.length > 0 && (
            <div
              style={{
                background: "#0d1526",
                border: "1px solid #1e293b",
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  color: "#94a3b8",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                Key Sources
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {vaccine.sources.slice(0, 5).map((src, i) => (
                  <div
                    key={i}
                    style={{
                      borderLeft: "2px solid #1e3a5f",
                      paddingLeft: 10,
                    }}
                  >
                    <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#3b82f6", textDecoration: "none" }}
                        >
                          {src.title}
                        </a>
                      ) : (
                        src.title
                      )}
                    </div>
                    <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>
                      {src.type.toUpperCase()} · {src.year} · {src.country} ·{" "}
                      <span
                        style={{
                          color:
                            src.confidence === "high"
                              ? "#10b981"
                              : src.confidence === "moderate"
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      >
                        {src.confidence} confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e1b4b, #1e3a5f)",
              border: "1px solid #3730a3",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>🎯</div>
            <h3
              style={{
                color: "#e2e8f0",
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Get your personalized score
            </h3>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
              Adjust for your child's age, daycare, travel plans, and community
              vaccination rate to see a customized risk-benefit analysis.
            </p>
            <Link
              href="/"
              style={{
                display: "block",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "#fff",
                padding: "12px 0",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Open Score Calculator →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}