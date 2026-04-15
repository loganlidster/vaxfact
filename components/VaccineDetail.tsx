"use client";

import { useState } from "react";
import { VaccineData, ScoreResult, ScenarioInputs } from "@/lib/vaccineData";
import {
  ArrowLeft, Calendar, Check, Plus, BookOpen, Globe, Info,
  TrendingUp, AlertTriangle, ChevronDown, ChevronUp, Shield,
  HelpCircle, FlaskConical, Microscope,
} from "lucide-react";

interface VaccineDetailProps {
  vaccine: VaccineData;
  score: ScoreResult;
  scenario: ScenarioInputs;
  onBack: () => void;
  isSelectedForSchedule: boolean;
  onToggleSchedule: () => void;
}

// ─── Uncertainty band helper (mirrors VaccineGrid) ───────────────────────────
function getUncertaintyBand(value: number, confidence: number): { low: number; high: number; label: string } {
  const spread = confidence >= 85 ? 4 : confidence >= 65 ? 9 : 16;
  return {
    low: Math.max(0, value - spread),
    high: Math.min(100, value + spread),
    label: confidence >= 85 ? "High confidence" : confidence >= 65 ? "Moderate confidence" : "Low confidence — wider range",
  };
}

// ─── Plain-language impact explanation ───────────────────────────────────────
function getImpactExplanation(netBenefit: number, exposureRisk: number, vaccineRisk: number): string {
  if (netBenefit >= 75) {
    if (exposureRisk >= 60) return "Your scenario shows elevated exposure risk. For your situation, this vaccine's protection outweighs its risks by a wide margin.";
    return "Strong evidence of benefit across most scenarios. The disease consequences outweigh vaccine risks significantly.";
  }
  if (netBenefit >= 55) {
    if (exposureRisk < 30) return "Your current exposure risk is relatively low, which narrows the margin of benefit. Still positive overall.";
    return "A meaningful benefit, with some caveats. The balance depends on how often this disease circulates in your area.";
  }
  if (netBenefit >= 40) {
    if (vaccineRisk > 30) return "The vaccine carries some modeled risk, and your exposure risk is moderate. This is a close call that warrants a discussion with your provider.";
    return "The benefit is present but modest for your scenario. Community transmission levels matter a great deal here.";
  }
  return "For your specific scenario, the modeled benefit is narrow. This does not mean the vaccine is unsafe — it means your individual risk profile is worth discussing with a provider.";
}

// ─── Score change explanation (matches VaccineGrid logic) ─────────────────────
function getScoreChangeReasons(score: ScoreResult, scenario: ScenarioInputs, vaccineName: string): string[] {
  const reasons: string[] = [];
  const isDefault =
    !scenario.daycare && !scenario.immunocompromisedHousehold && !scenario.travel &&
    !scenario.outbreak && !scenario.siblings && !scenario.rural &&
    scenario.communityVaxRate === 85;
  if (isDefault) return [];

  if (scenario.daycare) reasons.push(`Daycare setting raises group exposure risk for ${vaccineName}.`);
  if (scenario.immunocompromisedHousehold) reasons.push("Immunocompromised household member increases disease consequence score — protecting them through vaccination matters more.");
  if (scenario.travel) reasons.push("International travel expands pathogen exposure window — especially relevant for travel vaccines.");
  if (scenario.outbreak) reasons.push("Active outbreak flag significantly raises exposure risk component.");
  if (scenario.siblings) reasons.push("Siblings in the home increase in-household transmission risk for many respiratory and enteric diseases.");
  if (scenario.communityVaxRate < 80) reasons.push(`Community vaccination rate of ${scenario.communityVaxRate}% is below herd immunity threshold, increasing outbreak probability.`);
  if (scenario.communityVaxRate > 92) reasons.push(`High community vaccination rate (${scenario.communityVaxRate}%) lowers your personal exposure risk through herd protection.`);
  if (scenario.rural) reasons.push("Rural setting notes potential delay in emergency care if complications arise — slightly shifts risk-benefit calculation.");
  return reasons;
}

function TooltipIcon({ tip }: { tip: string }) {
  return (
    <span className="tooltip-wrap" style={{ marginLeft: 4 }}>
      <span className="tooltip-icon">i</span>
      <span className="tooltip-body">{tip}</span>
    </span>
  );
}

// ─── Enhanced ScoreRow with uncertainty band ─────────────────────────────────
function ScoreRow({
  label, value, confidence, tooltip, invert,
}: {
  label: string; value: number; confidence?: number; tooltip?: string; invert?: boolean;
}) {
  const displayValue = invert ? Math.max(0, 100 - value) : value;
  const color = displayValue >= 70 ? "var(--good)" : displayValue >= 50 ? "var(--warn)" : "#b91c1c";
  const band = confidence !== undefined ? getUncertaintyBand(displayValue, confidence) : null;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", color: "var(--muted)" }}>
          {label}
          {tooltip && <TooltipIcon tip={tooltip} />}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {band && (
            <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
              {band.low}–{band.high}
            </span>
          )}
          <strong style={{ fontSize: 16, fontFamily: "Inter, sans-serif", color }}>{displayValue}</strong>
        </div>
      </div>

      {/* Bar with uncertainty overlay */}
      <div className="bar-track" style={{ position: "relative" }}>
        {band && (
          <div style={{
            position: "absolute",
            left: `${band.low}%`,
            width: `${band.high - band.low}%`,
            height: "100%",
            background: `${color}22`,
            borderRadius: 8,
            zIndex: 0,
          }} />
        )}
        <div className="bar-fill" style={{
          width: `${displayValue}%`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          position: "relative", zIndex: 1,
        }} />
      </div>

      {band && (
        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginTop: 3, opacity: 0.7 }}>
          {band.label}
        </div>
      )}
    </div>
  );
}

function Section({
  title, id, isOpen, onToggle, children, icon,
}: {
  title: string; id: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode; icon?: React.ReactNode;
}) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden", marginBottom: 12 }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px", background: isOpen ? "var(--surface)" : "var(--surface-2)",
          border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif",
          fontWeight: 700, fontSize: 16, color: "var(--text)",
          transition: "background 0.15s ease",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon}
          {title}
        </span>
        {isOpen ? <ChevronUp size={20} color="var(--muted)" /> : <ChevronDown size={20} color="var(--muted)" />}
      </button>
      {isOpen && (
        <div style={{ padding: "20px 22px 24px", background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function VaccineDetail({
  vaccine,
  score,
  scenario,
  onBack,
  isSelectedForSchedule,
  onToggleSchedule,
}: VaccineDetailProps) {
  const [openSection, setOpenSection] = useState<string>("comparison");

  const toggle = (id: string) => setOpenSection(prev => prev === id ? "" : id);

  const vaccineRiskLabel = vaccine.scores.vaccineRisk <= 10
    ? "Serious adverse events: very low probability"
    : vaccine.scores.vaccineRisk <= 25
    ? "Modeled vaccine harm: low"
    : "Modeled vaccine harm: moderate — discuss with provider";

  const band = getUncertaintyBand(score.netBenefit, score.evidenceConfidence);
  const impactExplanation = getImpactExplanation(score.netBenefit, score.exposureRisk, vaccine.scores.vaccineRisk);
  const scoreChangeReasons = getScoreChangeReasons(score, scenario, vaccine.name);

  const hasNonDefaultScenario = scoreChangeReasons.length > 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Page header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div className="vf-container" style={{ paddingTop: 24, paddingBottom: 28 }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "none", cursor: "pointer",
              color: "var(--muted)", fontSize: 14, fontWeight: 600,
              fontFamily: "Inter, sans-serif", marginBottom: 20, padding: 0,
              transition: "color 0.15s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
          >
            <ArrowLeft size={16} />
            Back to all vaccines
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: vaccine.color, display: "grid", placeItems: "center",
                boxShadow: `0 8px 20px ${vaccine.color}44`,
              }}>
                <Shield size={26} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: 32, color: "var(--text)", marginBottom: 4 }}>{vaccine.name}</h1>
                <p style={{ color: "var(--muted)", fontSize: 14, fontFamily: "Inter, sans-serif" }}>{vaccine.ageWindow}</p>
              </div>
            </div>
            <button
              onClick={onToggleSchedule}
              className="btn"
              style={{
                background: isSelectedForSchedule ? "var(--primary)" : "var(--surface-2)",
                color: isSelectedForSchedule ? "white" : "var(--text)",
                border: isSelectedForSchedule ? "none" : "1px solid var(--line)",
              }}
            >
              {isSelectedForSchedule ? <Check size={18} /> : <Plus size={18} />}
              {isSelectedForSchedule ? "Added to schedule" : "Add to schedule plan"}
            </button>
          </div>

          {/* Quick stats */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 28,
            marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)",
          }}>
            {[
              { val: vaccine.yearsInUse, label: "Years in use" },
              { val: `${vaccine.effectiveness.againstSevereDisease}%`, label: "Effective vs severe disease" },
              { val: vaccine.schedule.doses, label: "Doses required" },
              { val: `${band.low}–${band.high}`, label: "Overall impact range" },
              { val: `${score.evidenceConfidence}%`, label: "Evidence confidence" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "Inter, sans-serif", color: "var(--text)" }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="vf-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}
          className="detail-grid-responsive"
        >
          {/* Main column */}
          <div>
            {/* Without vs With Vaccine */}
            <Section title="Without vaccine vs. With vaccine" id="comparison" isOpen={openSection === "comparison"} onToggle={() => toggle("comparison")} icon={<TrendingUp size={18} color="var(--primary)" />}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="compare-cols-responsive">
                {/* Without vaccine */}
                <div style={{
                  padding: 20, background: "#fff8f6",
                  border: "1px solid #fad5cb", borderRadius: 16,
                }}>
                  <h4 style={{ fontSize: 17, color: "#7b1d1d", marginBottom: 14, fontFamily: "'Source Serif 4', serif" }}>
                    Without vaccine
                  </h4>
                  <div style={{ fontSize: 14, fontFamily: "Inter, sans-serif", color: "var(--muted)", lineHeight: 1.7 }}>
                    <div style={{ paddingBottom: 10, borderBottom: "1px solid #fad5cb", marginBottom: 10 }}>
                      <strong style={{ color: "var(--text)" }}>Exposure risk</strong>
                      <p>~{vaccine.disease.incidenceUnvaccinated} cases per 100,000/yr in unvaccinated population.
                        Your scenario puts you at {score.exposureRisk}/100 exposure risk.</p>
                    </div>
                    <div style={{ paddingBottom: 10, borderBottom: "1px solid #fad5cb", marginBottom: 10 }}>
                      <strong style={{ color: "var(--text)" }}>Disease burden</strong>
                      <p>Hospitalization: {vaccine.disease.hospitalizationRate}% · ICU: {vaccine.disease.icuRate}% ·
                        Mortality: {vaccine.disease.mortalityRate} per 100k infected ·
                        Chronic complications: {vaccine.disease.chronicSequelaeRate}%</p>
                    </div>
                    <div style={{ paddingBottom: 10, borderBottom: "1px solid #fad5cb", marginBottom: 10 }}>
                      <strong style={{ color: "var(--text)" }}>Life with this disease</strong>
                      <p>{vaccine.disease.qualityOfLifeImpact}</p>
                    </div>
                    <div>
                      <strong style={{ color: "var(--text)" }}>Transmission</strong>
                      <p>{vaccine.disease.transmissionRoute}</p>
                    </div>
                  </div>
                </div>

                {/* With vaccine */}
                <div style={{
                  padding: 20, background: "#f0fdf4",
                  border: "1px solid #bbf7d0", borderRadius: 16,
                }}>
                  <h4 style={{ fontSize: 17, color: "#14532d", marginBottom: 14, fontFamily: "'Source Serif 4', serif" }}>
                    With vaccine
                  </h4>
                  <div style={{ fontSize: 14, fontFamily: "Inter, sans-serif", color: "var(--muted)", lineHeight: 1.7 }}>
                    <div style={{ paddingBottom: 10, borderBottom: "1px solid #bbf7d0", marginBottom: 10 }}>
                      <strong style={{ color: "var(--text)" }}>Residual risk after vaccination</strong>
                      <p>~{vaccine.disease.incidenceVaccinated} cases per 100,000/yr in vaccinated population.
                        Effectiveness against severe disease: {vaccine.effectiveness.againstSevereDisease}%.</p>
                    </div>
                    <div style={{ paddingBottom: 10, borderBottom: "1px solid #bbf7d0", marginBottom: 10 }}>
                      <strong style={{ color: "var(--text)" }}>Common side effects</strong>
                      <p>{vaccine.adverseEvents
                        .filter(e => e.type === "mild" || e.type === "moderate")
                        .map(e => e.name).join(", ")}. These are expected, temporary, and self-limiting.</p>
                    </div>
                    <div style={{ paddingBottom: 10, borderBottom: "1px solid #bbf7d0", marginBottom: 10 }}>
                      <strong style={{ color: "var(--text)" }}>Rare serious adverse events</strong>
                      <p>{vaccine.adverseEvents
                        .filter(e => e.type === "rare-serious" || e.type === "serious")
                        .map(e => `${e.name} (${e.probability < 10 ? e.probability.toFixed(1) : e.probability.toFixed(0)} per 100k doses)`)
                        .join("; ") || "None documented at this time."}</p>
                    </div>
                    <div>
                      <strong style={{ color: "var(--text)" }}>Waning and breakthrough</strong>
                      <p>{vaccine.effectiveness.waningNotes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Disease Info */}
            <Section title="Disease information" id="disease" isOpen={openSection === "disease"} onToggle={() => toggle("disease")} icon={<Info size={18} color="var(--muted)" />}>
              <p style={{ fontSize: 15, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 16, lineHeight: 1.7 }}>
                {vaccine.disease.description}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {[
                  { label: "Incidence (unvax)", val: `${vaccine.disease.incidenceUnvaccinated}/100k` },
                  { label: "Hospitalization", val: `${vaccine.disease.hospitalizationRate}%` },
                  { label: "ICU rate", val: `${vaccine.disease.icuRate}%` },
                  { label: "Outbreak potential", val: vaccine.disease.outbreakPotential },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: 12, background: "var(--surface-2)",
                    border: "1px solid var(--line)", borderRadius: 12,
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "Inter, sans-serif", color: "var(--text)" }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Analysis: Pros / Cons / Uncertainties */}
            <Section title="Analysis: pros, cons, and uncertainties" id="analysis" isOpen={openSection === "analysis"} onToggle={() => toggle("analysis")} icon={<FlaskConical size={18} color="var(--muted)" />}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }} className="analysis-cols-responsive">
                <div style={{ padding: 16, background: "var(--good-soft)", border: "1px solid var(--good-line)", borderRadius: 14 }}>
                  <h4 style={{ fontSize: 15, color: "var(--good)", marginBottom: 10, fontFamily: "'Source Serif 4', serif" }}>
                    Pros
                  </h4>
                  <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}>
                    {vaccine.prosList.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div style={{ padding: 16, background: "var(--warn-soft)", border: "1px solid var(--warn-line)", borderRadius: 14 }}>
                  <h4 style={{ fontSize: 15, color: "var(--warn)", marginBottom: 10, fontFamily: "'Source Serif 4', serif" }}>
                    Cons
                  </h4>
                  <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}>
                    {vaccine.consList.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div style={{ padding: 16, background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 14 }}>
                  <h4 style={{ fontSize: 15, color: "var(--muted)", marginBottom: 10, fontFamily: "'Source Serif 4', serif" }}>
                    Uncertainties
                  </h4>
                  <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}>
                    {vaccine.uncertainties.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </Section>

            {/* ── NEW: What some researchers question ── */}
            {vaccine.credibleCritiques && vaccine.credibleCritiques.length > 0 && (
              <Section
                title="What some researchers question"
                id="critiques"
                isOpen={openSection === "critiques"}
                onToggle={() => toggle("critiques")}
                icon={<Microscope size={18} color="#d97706" />}
              >
                <div style={{
                  padding: "12px 16px", marginBottom: 16,
                  background: "#fffbf0", border: "1px solid #fde68a", borderRadius: 12,
                  fontSize: 13, color: "#92400e", fontFamily: "Inter, sans-serif", lineHeight: 1.6,
                }}>
                  <strong>Not fringe. Not conspiracy.</strong> These are legitimate scientific critiques raised
                  in peer-reviewed literature, regulatory filings, or by credentialed researchers. They represent
                  real uncertainty in the evidence — not reasons to dismiss the vaccine outright.
                </div>
                <ul style={{ paddingLeft: 20, margin: 0, display: "grid", gap: 12 }}>
                  {vaccine.credibleCritiques.map((critique, i) => (
                    <li key={i} style={{
                      fontSize: 14, color: "var(--muted)", fontFamily: "Inter, sans-serif",
                      lineHeight: 1.7, paddingBottom: 12,
                      borderBottom: i < vaccine.credibleCritiques.length - 1 ? "1px solid var(--line)" : "none",
                    }}>
                      {critique}
                    </li>
                  ))}
                </ul>
                <div style={{
                  marginTop: 14, padding: "10px 14px",
                  background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 10,
                  fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif",
                }}>
                  VaxFact does not take a position on these debates. We surface them so you can bring informed
                  questions to your provider.
                </div>
              </Section>
            )}

            {/* Schedule */}
            <Section title="Vaccination schedule" id="schedule" isOpen={openSection === "schedule"} onToggle={() => toggle("schedule")} icon={<Calendar size={18} color="var(--primary)" />}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                {vaccine.schedule.timing.map((time, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", background: "var(--surface-2)",
                    border: "1px solid var(--line)", borderRadius: 12,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: vaccine.color, display: "grid", placeItems: "center",
                      color: "white", fontSize: 13, fontWeight: 800, flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{time}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 10 }}>
                <strong>Minimum interval:</strong> {vaccine.schedule.minimumInterval}
              </p>
              {vaccine.schedule.catchUpNotes && (
                <p style={{ fontSize: 14, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                  <strong>Catch-up schedule:</strong> {vaccine.schedule.catchUpNotes}
                </p>
              )}
            </Section>

            {/* Sources */}
            <Section title="Sources and methodology" id="sources" isOpen={openSection === "sources"} onToggle={() => toggle("sources")} icon={<BookOpen size={18} color="var(--muted)" />}>
              <div style={{ display: "grid", gap: 10 }}>
                {vaccine.sources.map((source, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, padding: 14,
                    background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12,
                  }}>
                    <BookOpen size={16} color="var(--muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
                        {source.title}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 6 }}>
                        {source.type} · {source.year} · {source.country} · {source.sampleSize}
                      </div>
                      <span className={`pill ${source.confidence === "high" ? "pill-good" : source.confidence === "moderate" ? "pill-warn" : ""}`}
                        style={{ fontSize: 11 }}>
                        {source.confidence} confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* International Policies */}
            <Section title="International policy comparison" id="policies" isOpen={openSection === "policies"} onToggle={() => toggle("policies")} icon={<Globe size={18} color="var(--muted)" />}>
              <div style={{ display: "grid", gap: 10 }}>
                {vaccine.countryPolicies.map((policy, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, padding: 14,
                    background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12,
                  }}>
                    <Globe size={16} color="var(--muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "Inter, sans-serif" }}>{policy.country}</span>
                        {policy.recommended && (
                          <span className="pill pill-good" style={{ fontSize: 11 }}>Recommended</span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>{policy.schedule}</div>
                      <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>{policy.rationale}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* ─── Sidebar: Score breakdown ─────────────────────────────────── */}
          <div style={{ position: "sticky", top: 90 }}>
            <div className="vf-card" style={{ padding: 22 }}>

              {/* Overall Impact header */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 16, margin: 0, color: "var(--muted)", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                    Overall Impact for Your Scenario
                  </h3>
                  <TooltipIcon tip="Score reflects how your specific scenario inputs shift the benefit-risk balance. Not a universal recommendation." />
                </div>

                {/* Big score + band */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
                  <span style={{
                    fontSize: 48, fontWeight: 900, fontFamily: "Inter, sans-serif",
                    color: score.netBenefit >= 70 ? "var(--good)" : score.netBenefit >= 50 ? "var(--warn)" : "#b91c1c",
                    lineHeight: 1,
                  }}>
                    {score.netBenefit}
                  </span>
                  <span style={{ fontSize: 15, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>/ 100</span>
                  <span style={{
                    fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif",
                    background: "var(--surface-2)", border: "1px solid var(--line)",
                    borderRadius: 8, padding: "2px 8px", marginLeft: 4,
                  }}>
                    range {band.low}–{band.high}
                  </span>
                </div>

                {/* Confidence pill */}
                <div style={{ marginTop: 6 }}>
                  <span className={`pill ${score.evidenceConfidence >= 85 ? "pill-good" : score.evidenceConfidence >= 65 ? "pill-warn" : ""}`}
                    style={{ fontSize: 11 }}>
                    {band.label}
                  </span>
                </div>

                {/* Plain-language explanation */}
                <p style={{
                  marginTop: 12, fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif",
                  lineHeight: 1.6, padding: "10px 12px",
                  background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 10,
                }}>
                  {impactExplanation}
                </p>
              </div>

              {/* Score breakdown rows */}
              <ScoreRow
                label="Exposure risk"
                value={score.exposureRisk}
                confidence={score.evidenceConfidence}
                tooltip="Probability of encountering this disease given your scenario"
              />
              <ScoreRow
                label="Disease consequence"
                value={score.diseaseConsequence}
                confidence={score.evidenceConfidence}
                tooltip="Severity if contracted — hospitalization, ICU, long-term outcomes"
              />
              <ScoreRow
                label="Vaccine protection"
                value={score.vaccineHarm != null ? 100 - score.vaccineHarm : vaccine.scores.netBenefit}
                confidence={score.evidenceConfidence}
                tooltip="How effectively the vaccine reduces disease risk and severity"
              />
              <ScoreRow
                label="Evidence confidence"
                value={score.evidenceConfidence}
                tooltip="Quality and consensus across available research"
              />

              {/* Vaccine adverse event profile */}
              <div style={{
                marginTop: 4, padding: "10px 14px",
                background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12,
              }}>
                <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
                  Adverse event profile
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "Inter, sans-serif", color: vaccine.scores.vaccineRisk <= 10 ? "var(--good)" : "var(--warn)" }}>
                  {vaccineRiskLabel}
                </div>
              </div>

              {/* Why this score changed — only when non-default scenario */}
              {hasNonDefaultScenario && (
                <div style={{
                  marginTop: 14, padding: "12px 14px",
                  background: "#fffbf0", border: "1px solid #fde68a", borderRadius: 12,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", fontFamily: "Inter, sans-serif", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertTriangle size={13} color="#d97706" />
                    Why this score changed
                  </div>
                  <ul style={{ paddingLeft: 16, margin: 0, display: "grid", gap: 4 }}>
                    {scoreChangeReasons.map((r, i) => (
                      <li key={i} style={{ fontSize: 12, color: "#92400e", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <button
                  onClick={onToggleSchedule}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {isSelectedForSchedule ? <Check size={16} /> : <Plus size={16} />}
                  {isSelectedForSchedule ? "Added to schedule" : "Add to schedule plan"}
                </button>
              </div>
            </div>

            {/* Use with pediatrician */}
            <div style={{
              marginTop: 16, padding: 18,
              background: "var(--primary-soft)", border: "1px solid #c2d4f7", borderRadius: 16,
            }}>
              <h4 style={{ fontSize: 16, color: "var(--primary)", marginBottom: 8 }}>Using this with your provider</h4>
              <p style={{ fontSize: 13, color: "var(--primary)", opacity: 0.85, fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
                This tool is designed to help you form good questions, not replace medical consultation. Bring the score
                breakdown and your scenario settings to your next visit to have a more informed conversation.
              </p>
            </div>

            {/* What this tool does NOT do */}
            <div style={{
              marginTop: 12, padding: 16,
              background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 8 }}>
                What this tool does NOT do
              </div>
              {[
                "Give you a medical recommendation",
                "Account for your full clinical history",
                "Replace a conversation with your provider",
                "Predict individual outcomes",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ color: "#b91c1c", fontSize: 13, lineHeight: 1.4, flexShrink: 0 }}>✕</span>
                  <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .detail-grid-responsive { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .compare-cols-responsive { grid-template-columns: 1fr !important; }
          .analysis-cols-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}