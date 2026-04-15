"use client";

import { ScenarioInputs, DEFAULT_SCENARIO } from "@/lib/vaccineData";
import { AlertTriangle } from "lucide-react";

interface HeroSectionProps {
  scenario: ScenarioInputs;
  setScenario: (s: ScenarioInputs) => void;
  onStartScenario: () => void;
  onSampleCard: () => void;
}

const AGE_LABELS = ["Birth–6m", "6–12m", "12–23m", "2–4 yrs", "4–6 yrs", "6–9 yrs", "9–12 yrs"];

const TOGGLES: { key: keyof ScenarioInputs; label: string; riskNote: string }[] = [
  { key: "daycare", label: "Attends daycare", riskNote: "Exposure risk increased due to daycare" },
  { key: "travel", label: "International travel", riskNote: "Exposure risk increased for travel-endemic diseases" },
  { key: "outbreak", label: "Outbreak nearby", riskNote: "Exposure risk significantly elevated — active outbreak" },
  { key: "siblings", label: "Older siblings in school", riskNote: "Household exposure increased via school contacts" },
  { key: "immunocompromisedHousehold", label: "Immunocompromised household", riskNote: "Herd protection urgency increased" },
  { key: "rural", label: "Rural / lower access", riskNote: "Healthcare access factor applied" },
];

function getOverallRiskLabel(scenario: ScenarioInputs): { label: string; color: string; detail: string } {
  let riskScore = 0;
  if (scenario.daycare) riskScore += 25;
  if (scenario.travel) riskScore += 20;
  if (scenario.outbreak) riskScore += 35;
  if (scenario.siblings) riskScore += 15;
  if (scenario.immunocompromisedHousehold) riskScore += 10;
  if (scenario.rural) riskScore += 5;
  if (scenario.communityVaxRate < 80) riskScore += 20;
  else if (scenario.communityVaxRate < 90) riskScore += 10;
  if (scenario.childAge <= 12) riskScore += 15;
  else if (scenario.childAge <= 24) riskScore += 8;

  if (riskScore >= 60) return { label: "HIGH", color: "#c0392b", detail: "Multiple elevated risk factors active" };
  if (riskScore >= 35) return { label: "MODERATE", color: "#b26a00", detail: "Some risk factors present" };
  if (riskScore >= 15) return { label: "LOW-MODERATE", color: "#5a9a3f", detail: "Baseline risk with minor factors" };
  return { label: "LOW", color: "#1f7a4d", detail: "Baseline population risk" };
}

export default function HeroSection({ scenario, setScenario, onStartScenario, onSampleCard }: HeroSectionProps) {
  const ageLabel =
    scenario.childAge === 0 ? "Birth–6m"
    : scenario.childAge <= 6 ? "Birth–6m"
    : scenario.childAge <= 12 ? "6–12m"
    : scenario.childAge <= 23 ? "12–23m"
    : scenario.childAge <= 48 ? "2–4 yrs"
    : scenario.childAge <= 72 ? "4–6 yrs"
    : scenario.childAge <= 108 ? "6–9 yrs"
    : "9–12 yrs";

  const toggleBool = (key: keyof ScenarioInputs) => {
    setScenario({ ...scenario, [key]: !scenario[key] });
  };

  const risk = getOverallRiskLabel(scenario);
  const activeToggles = TOGGLES.filter(t => Boolean(scenario[t.key]));

  return (
    <section style={{ padding: "56px 0 32px" }}>
      <div className="vf-container">
        <div
          style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 24, alignItems: "stretch" }}
          className="hero-grid-responsive"
        >
          {/* LEFT: Copy */}
          <div className="vf-card" style={{ padding: "36px 40px" }}>
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 14px", borderRadius: 999,
              background: "var(--primary-soft)", color: "var(--primary)",
              fontSize: 13, fontWeight: 700, marginBottom: 20,
              fontFamily: "Inter, sans-serif",
            }}>
              Evidence Navigator · Designed for thoughtful parents
            </div>

            <h1 style={{
              fontSize: "clamp(28px, 4.5vw, 52px)",
              lineHeight: 1.08,
              maxWidth: "18ch",
              marginBottom: 18,
              color: "var(--text)",
            }}>
              If your child skips this vaccine… what actually happens?
            </h1>

            <p style={{
              fontSize: 18, color: "var(--muted)", maxWidth: "52ch",
              marginBottom: 28, fontFamily: "Inter, sans-serif",
              lineHeight: 1.6,
            }}>
              Adjust your situation. See the real tradeoffs — disease risk, vaccine benefit,
              known side effects, and honest uncertainty — side by side.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
              <button className="btn btn-primary" onClick={onStartScenario}>
                Start with your family scenario
              </button>
              <button className="btn btn-secondary" onClick={onSampleCard}>
                See a sample vaccine card
              </button>
            </div>

            {/* Trust Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { num: "6", label: "Vaccine cards in V1" },
                { num: "4+", label: "Independent evidence sources" },
                { num: "100%", label: "Score formulas visible" },
              ].map((chip) => (
                <div key={chip.num} style={{
                  padding: 14, border: "1px solid var(--line)", borderRadius: 16,
                  background: "var(--surface-2)",
                }}>
                  <strong style={{ display: "block", fontSize: 22, fontFamily: "Inter, sans-serif", fontWeight: 800 }}>
                    {chip.num}
                  </strong>
                  <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                    {chip.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "12px 16px", background: "#fffbeb",
              border: "1px solid #fde68a", borderRadius: 12, marginTop: 20,
            }}>
              <AlertTriangle size={16} style={{ color: "#d97706", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: "#92400e", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
                <strong>Educational tool only.</strong> Not medical advice. Always discuss vaccination decisions
                with your child's pediatrician.
              </p>
            </div>
          </div>

          {/* RIGHT: Scenario Control Center */}
          <div className="vf-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 22, marginBottom: 4 }}>Your Family's Scenario</h2>
            <p style={{ color: "var(--muted)", marginBottom: 16, fontSize: 14, fontFamily: "Inter, sans-serif" }}>
              Adjust these once — all vaccine cards update instantly.
            </p>

            {/* Live Risk Display */}
            <div style={{
              padding: "14px 16px",
              background: "var(--surface-2)",
              border: `1px solid ${risk.color}33`,
              borderLeft: `3px solid ${risk.color}`,
              borderRadius: 14,
              marginBottom: 16,
            }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                Your child's estimated exposure risk
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: risk.color, fontFamily: "Inter, sans-serif" }}>
                  {risk.label}
                </span>
                <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif", textAlign: "right", maxWidth: "120px" }}>
                  {risk.detail}
                </span>
              </div>
              {/* Micro-feedback: show what last changed */}
              {activeToggles.length > 0 && (
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                  {activeToggles.slice(0, 2).map(t => (
                    <div key={String(t.key)} style={{
                      fontSize: 11, color: "#92400e", fontFamily: "Inter, sans-serif",
                      background: "#fffbeb", borderRadius: 6, padding: "3px 8px",
                    }}>
                      ↑ {t.riskNote}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {/* Child Age */}
              <div style={{ padding: 14, background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontWeight: 700, fontSize: 14, fontFamily: "Inter, sans-serif" }}>
                    Child's age
                  </label>
                  <strong style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "var(--primary)" }}>
                    {ageLabel}
                  </strong>
                </div>
                <input
                  type="range" min={0} max={144} step={1}
                  value={scenario.childAge}
                  onChange={e => setScenario({ ...scenario, childAge: parseInt(e.target.value) })}
                  style={{ width: "100%", accentColor: "var(--primary)" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 4, fontFamily: "Inter, sans-serif" }}>
                  <span>Birth</span><span>1 yr</span><span>3 yr</span><span>6 yr</span><span>9 yr</span><span>12 yr</span>
                </div>
              </div>

              {/* Community Vax Rate */}
              <div style={{ padding: 14, background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontWeight: 700, fontSize: 14, fontFamily: "Inter, sans-serif" }}>
                    Community vaccination rate
                  </label>
                  <strong style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: scenario.communityVaxRate < 80 ? "#c0392b" : scenario.communityVaxRate < 90 ? "#b26a00" : "var(--primary)" }}>
                    {scenario.communityVaxRate}%
                  </strong>
                </div>
                <input
                  type="range" min={30} max={99} step={1}
                  value={scenario.communityVaxRate}
                  onChange={e => setScenario({ ...scenario, communityVaxRate: parseInt(e.target.value) })}
                  style={{ width: "100%", accentColor: "var(--primary)" }}
                />
                <div style={{ fontSize: 12, color: scenario.communityVaxRate < 85 ? "#c0392b" : "var(--muted)", marginTop: 4, fontFamily: "Inter, sans-serif", fontWeight: scenario.communityVaxRate < 85 ? 600 : 400 }}>
                  {scenario.communityVaxRate < 80
                    ? "↑ Outbreak risk elevated — herd immunity threshold not met"
                    : scenario.communityVaxRate < 90
                    ? "Approaching outbreak threshold — community protection reduced"
                    : "Community protection intact"}
                </div>
              </div>

              {/* Boolean Toggles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {TOGGLES.map(({ key, label }) => {
                  const isActive = Boolean(scenario[key]);
                  return (
                    <button
                      key={String(key)}
                      onClick={() => toggleBool(key)}
                      className={`scenario-toggle${isActive ? " active" : ""}`}
                    >
                      <div className="t-title">{label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}