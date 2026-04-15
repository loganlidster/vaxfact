"use client";

import { useState, useMemo } from "react";
import { VaccineData, ScoreResult, ScenarioInputs, DEFAULT_SCENARIO } from "@/lib/vaccineData";
import { Calendar, ChevronDown, ChevronUp, Info } from "lucide-react";

interface VaccineGridProps {
  vaccines: VaccineData[];
  scores: ScoreResult[];
  scenario: ScenarioInputs;
  onSelectVaccine: (vaccine: VaccineData) => void;
  selectedForSchedule: string[];
  onToggleSchedule: (id: string) => void;
}

// ── Decision label (neutral language) ──────────────────────────────────────
function getDecisionLabel(netBenefit: number, exposureRisk: number): { label: string; className: string } {
  if (netBenefit >= 85) return { label: "Strongly favored", className: "pill pill-good" };
  if (netBenefit >= 70) return { label: "Favored", className: "pill pill-good" };
  if (netBenefit >= 55) return { label: "Exposure-dependent", className: "pill pill-warn" };
  if (exposureRisk < 30) return { label: "Lower urgency", className: "pill" };
  return { label: "Timing-sensitive", className: "pill pill-warn" };
}

// ── Evidence quality label ─────────────────────────────────────────────────
function getEvidenceLabel(evidenceConfidence: number): { label: string; className: string } {
  if (evidenceConfidence >= 85) return { label: "High evidence confidence", className: "pill pill-good" };
  if (evidenceConfidence >= 65) return { label: "Moderate evidence", className: "pill pill-warn" };
  return { label: "Emerging evidence", className: "pill" };
}

// ── Uncertainty band for a score ───────────────────────────────────────────
function getUncertaintyBand(value: number, confidence: number): { low: number; high: number; label: string } {
  // Wider band when confidence is lower
  const spread = confidence >= 85 ? 4 : confidence >= 65 ? 9 : 16;
  return {
    low: Math.max(0, value - spread),
    high: Math.min(100, value + spread),
    label: confidence >= 85 ? "HIGH" : confidence >= 65 ? "MODERATE" : "LOW",
  };
}

// ── Plain-language impact explanation ─────────────────────────────────────
function getImpactExplanation(netBenefit: number, exposureRisk: number, vaccineRisk: number): string {
  if (netBenefit >= 85) {
    return `In your situation, this vaccine likely prevents a high-risk disease with very low known vaccine risk.`;
  }
  if (netBenefit >= 70) {
    return `In your situation, the disease risk clearly outweighs the vaccine's known side effect profile.`;
  }
  if (netBenefit >= 55) {
    if (exposureRisk < 35) return `Your exposure risk is currently lower — this vaccine's value depends heavily on your situation.`;
    return `The evidence favors vaccination, though your specific scenario has meaningful effect on the math.`;
  }
  if (exposureRisk < 30) {
    return `Your current situation shows low exposure risk. Impact depends strongly on scenario factors.`;
  }
  return `Timing and situation are important here — review your scenario inputs carefully.`;
}

// ── "Why this score changed" explanation ──────────────────────────────────
function getScoreChangeExplanation(
  score: ScoreResult,
  scenario: ScenarioInputs,
  vaccineName: string
): string[] {
  const reasons: string[] = [];
  if (scenario.daycare) reasons.push(`Daycare raises exposure risk for ${vaccineName}`);
  if (scenario.outbreak) reasons.push(`Active outbreak nearby significantly elevates exposure`);
  if (scenario.travel) reasons.push(`International travel applies higher travel-endemic disease weight`);
  if (scenario.siblings) reasons.push(`Older siblings in school increase household transmission risk`);
  if (scenario.immunocompromisedHousehold) reasons.push(`Immunocompromised household raises herd protection urgency`);
  if (scenario.communityVaxRate < 85) reasons.push(`Community vaccination rate below 85% — reduced herd immunity`);
  if (scenario.childAge <= 12) reasons.push(`Infants under 12 months are in highest-risk age window`);
  return reasons;
}

// ── Vaccine risk label (human-readable) ───────────────────────────────────
function getVaccineRiskLabel(vaccineRisk: number): { label: string; pillClass: string } {
  if (vaccineRisk <= 10) return { label: "Serious adverse events: very low probability", pillClass: "pill pill-good" };
  if (vaccineRisk <= 25) return { label: "Adverse event profile: low", pillClass: "pill pill-warn" };
  return { label: "Adverse event profile: moderate — review details", pillClass: "pill" };
}

// ── Tooltip ───────────────────────────────────────────────────────────────
function TooltipIcon({ tip }: { tip: string }) {
  return (
    <span className="tooltip-wrap" style={{ marginLeft: 4 }}>
      <span className="tooltip-icon">i</span>
      <span className="tooltip-body">{tip}</span>
    </span>
  );
}

// ── Metric bar with uncertainty band ─────────────────────────────────────
function MetricBar({
  label, value, tooltip, confidence, showBand,
}: {
  label: string; value: number; tooltip?: string; confidence?: number; showBand?: boolean;
}) {
  const band = confidence !== undefined ? getUncertaintyBand(value, confidence) : null;
  return (
    <div className="metric-bar">
      <div className="metric-bar-row">
        <span style={{ display: "flex", alignItems: "center" }}>
          {label}
          {tooltip && <TooltipIcon tip={tooltip} />}
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          {showBand && band ? (
            <>
              <strong style={{ fontSize: "0.85rem" }}>{band.low}–{band.high}</strong>
              <span style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                Confidence: {band.label}
              </span>
            </>
          ) : (
            <strong>{value}</strong>
          )}
        </div>
      </div>
      <div className="bar-track" style={{ position: "relative" }}>
        <div className="bar-fill" style={{ width: `${value}%` }} />
        {showBand && band && (
          <div style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${band.low}%`, width: `${band.high - band.low}%`,
            background: "rgba(35,70,160,0.12)",
            borderLeft: "1px dashed rgba(35,70,160,0.4)",
            borderRight: "1px dashed rgba(35,70,160,0.4)",
          }} />
        )}
      </div>
    </div>
  );
}

// ── Main VaccineCard ──────────────────────────────────────────────────────
function VaccineCard({
  vaccine, score, scenario, isSelected, onSelect, onToggleSchedule, defaultOpen,
}: {
  vaccine: VaccineData;
  score: ScoreResult;
  scenario: ScenarioInputs;
  isSelected: boolean;
  onSelect: () => void;
  onToggleSchedule: () => void;
  defaultOpen?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultOpen || false);
  const [showScoreDetail, setShowScoreDetail] = useState(false);

  const decisionLabel = getDecisionLabel(score.netBenefit, score.exposureRisk);
  const evidenceLabel = getEvidenceLabel(score.evidenceConfidence);
  const vaccineRisk = getVaccineRiskLabel(vaccine.scores.vaccineRisk);
  const impactExplanation = getImpactExplanation(score.netBenefit, score.exposureRisk, vaccine.scores.vaccineRisk);
  const scoreChanges = useMemo(() => getScoreChangeExplanation(score, scenario, vaccine.name), [score, scenario, vaccine.name]);

  const impactColor =
    score.netBenefit >= 70 ? "var(--primary)" :
    score.netBenefit >= 50 ? "var(--warn)" : "#b91c1c";

  return (
    <article className="vf-card" style={{ display: "flex", flexDirection: "column" }}>
      {/* Color bar on top */}
      <div style={{ height: 4, background: vaccine.color, flexShrink: 0 }} />

      {/* Card Head */}
      <div style={{ padding: "20px 22px 16px", flex: 1 }}>
        {/* Status pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          <span className={decisionLabel.className}>{decisionLabel.label}</span>
          <span className={evidenceLabel.className}>{evidenceLabel.label}</span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 26, marginBottom: 4, color: "var(--text)" }}>{vaccine.name}</h3>
        <p style={{ color: "var(--muted)", fontSize: 13, fontFamily: "Inter, sans-serif", marginBottom: 16, lineHeight: 1.4 }}>
          {vaccine.yearsInUse} years in use · {vaccine.schedule.doses} doses · {vaccine.diseases.slice(0, 2).join(", ")}
        </p>

        {/* Overall Impact Score — neutral label */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto",
          alignItems: "flex-end", marginBottom: 12,
          padding: "14px 0", borderTop: "1px solid var(--line)",
        }}>
          <div>
            <div style={{
              fontSize: 11, color: "var(--muted)", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.05em",
              fontFamily: "Inter, sans-serif",
            }}>
              Overall Impact for Your Scenario
              <TooltipIcon tip="Combines disease risk, vaccine effectiveness, and vaccine side effect profile — adjusted for your specific situation. Not a universal recommendation. Higher = vaccine impact is more significant given your context." />
            </div>
            {/* Plain-language explanation */}
            <p style={{ color: "var(--muted)", fontSize: 12, fontFamily: "Inter, sans-serif", marginTop: 4, lineHeight: 1.4, maxWidth: "22ch" }}>
              {impactExplanation}
            </p>
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, color: impactColor, fontFamily: "Inter, sans-serif" }}>
            {score.netBenefit}
          </div>
        </div>

        {/* "Why this score changed" — only shown if scenario active */}
        {scoreChanges.length > 0 && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowScoreDetail(!showScoreDetail)}
            onKeyDown={e => e.key === "Enter" && setShowScoreDetail(!showScoreDetail)}
            style={{
              background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10,
              padding: "8px 12px", marginBottom: 12, cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#92400e", fontFamily: "Inter, sans-serif" }}>
                Why this score changed ↓
              </span>
              {showScoreDetail ? <ChevronUp size={13} color="#92400e" /> : <ChevronDown size={13} color="#92400e" />}
            </div>
            {showScoreDetail && (
              <ul style={{ margin: "8px 0 0", paddingLeft: 16, fontSize: 12, color: "#78350f", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
                {scoreChanges.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            )}
          </div>
        )}

        {/* 4 Metric Bars with uncertainty bands */}
        <div style={{ marginBottom: 4 }}>
          <MetricBar
            label="Exposure risk"
            value={score.exposureRisk}
            tooltip="Probability of encountering this disease given your scenario. Adjusted by your situation inputs."
            confidence={score.evidenceConfidence}
            showBand={true}
          />
          <MetricBar
            label="Disease harm"
            value={score.diseaseConsequence}
            tooltip="Severity if contracted: hospitalization rate, mortality, chronic complications, quality of life impact."
            confidence={score.evidenceConfidence}
            showBand={true}
          />
          <MetricBar
            label="Vaccine risk"
            value={vaccine.scores.vaccineRisk}
            tooltip="Adverse event profile — probability × severity for each known event. Low score = strong safety record. Not zero, but very small relative to disease risk."
            confidence={score.evidenceConfidence}
            showBand={true}
          />
          <MetricBar
            label="Evidence confidence"
            value={score.evidenceConfidence}
            tooltip="Quality of the research: study types, sample sizes, years of post-licensure data, reproducibility. Uncertainty bands on other scores widen when this is lower."
          />
        </div>

        {/* Vaccine risk plain-language label */}
        <div style={{ marginTop: 6 }}>
          <span className={vaccineRisk.pillClass} style={{ fontSize: 11 }}>{vaccineRisk.label}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, padding: "0 22px 18px", flexShrink: 0 }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ flex: 1 }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          {expanded ? "Collapse" : "See both sides"}
        </button>
        <button
          className="btn btn-sm"
          style={{
            flex: 1,
            background: isSelected ? "var(--primary)" : "var(--surface-2)",
            color: isSelected ? "white" : "var(--text)",
            border: isSelected ? "none" : "1px solid var(--line)",
          }}
          onClick={(e) => { e.stopPropagation(); onToggleSchedule(); }}
        >
          <Calendar size={15} />
          {isSelected ? "In schedule" : "Add to schedule"}
        </button>
      </div>

      {/* Expand Panel: Without vs With Vaccine */}
      <div className={`expand-panel${expanded ? " open" : ""}`} style={{ maxHeight: expanded ? 600 : 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Without vaccine */}
          <div style={{ padding: 16, background: "#fff8f6", border: "1px solid #fad5cb", borderRadius: 14 }}>
            <h4 style={{ fontSize: 14, marginBottom: 12, color: "#7b1d1d", fontFamily: "'Source Serif 4', serif" }}>
              Without vaccine
            </h4>
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
              <li style={{ marginBottom: 6 }}>
                Exposure: ~<strong style={{ color: "var(--text)" }}>{vaccine.disease.incidenceUnvaccinated}</strong> cases per 100k/yr
              </li>
              <li style={{ marginBottom: 6 }}>
                Hospitalization: <strong style={{ color: "var(--text)" }}>{vaccine.disease.hospitalizationRate}%</strong> of infections
              </li>
              <li style={{ marginBottom: 6 }}>
                Mortality: <strong style={{ color: "var(--text)" }}>{vaccine.disease.mortalityRate}</strong> per 100k infected
              </li>
              <li style={{ marginBottom: 6 }}>
                Chronic sequelae: <strong style={{ color: "var(--text)" }}>{vaccine.disease.chronicSequelaeRate}%</strong>
              </li>
              <li style={{ color: "#7b1d1d", fontStyle: "italic" }}>{vaccine.disease.qualityOfLifeImpact.slice(0, 120)}…</li>
            </ul>
          </div>

          {/* With vaccine */}
          <div style={{ padding: 16, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14 }}>
            <h4 style={{ fontSize: 14, marginBottom: 12, color: "#14532d", fontFamily: "'Source Serif 4', serif" }}>
              With vaccine
            </h4>
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
              <li style={{ marginBottom: 6 }}>
                Effectiveness: <strong style={{ color: "var(--text)" }}>{vaccine.effectiveness.againstSevereDisease}%</strong> against severe disease
              </li>
              <li style={{ marginBottom: 6 }}>
                Residual exposure: ~<strong style={{ color: "var(--text)" }}>{vaccine.disease.incidenceVaccinated}</strong> per 100k/yr
              </li>
              <li style={{ marginBottom: 6 }}>
                Common side effects: local soreness, low-grade fever (self-limiting, 1–3 days)
              </li>
              <li style={{ marginBottom: 6 }}>
                Rare serious events: {vaccine.adverseEvents.filter(e => e.type === "rare-serious").length} documented
                (see full analysis for incidence)
              </li>
              <li style={{ color: "#14532d", fontStyle: "italic" }}>{vaccine.effectiveness.waningNotes.slice(0, 100)}…</li>
            </ul>
          </div>
        </div>

        {/* Dissent teaser */}
        <div style={{
          marginTop: 14, padding: "12px 14px",
          background: "#f8f9fa", border: "1px solid var(--line)",
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
            What some researchers question
          </div>
          <p style={{ fontSize: 13, color: "var(--text)", fontFamily: "Inter, sans-serif", lineHeight: 1.5, margin: 0 }}>
            {vaccine.credibleCritiques?.[0]
              ? (vaccine.credibleCritiques[0] as string).slice(0, 160) + "…"
              : `There are legitimate scientific debates about optimal timing, real-world effectiveness in specific populations, and long-term immune response duration. See the full analysis for details.`}
          </p>
        </div>

        <button
          onClick={onSelect}
          style={{
            marginTop: 14, width: "100%",
            background: "var(--primary-soft)", border: "1px solid #c2d4f7",
            borderRadius: 12, padding: "10px 14px",
            color: "var(--primary)", fontWeight: 700, fontSize: 14,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
            transition: "background 0.15s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#dce8ff")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--primary-soft)")}
        >
          <Info size={15} />
          Full analysis — sources, schedule, dissenting views
        </button>
      </div>
    </article>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────
export default function VaccineGrid({
  vaccines, scores, scenario, onSelectVaccine, selectedForSchedule, onToggleSchedule,
}: VaccineGridProps) {
  return (
    <section style={{ padding: "12px 0 48px" }} id="overview">
      <div className="vf-container">
        {/* Section Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 20, gap: 20, flexWrap: "wrap",
        }}>
          <div>
            <h2 style={{ fontSize: 32, color: "var(--text)", marginBottom: 8 }}>
              Vaccine overview cards
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 15, fontFamily: "Inter, sans-serif", maxWidth: "60ch" }}>
              Each card answers one question fast: what happens if I give this vaccine, and what happens if I skip it?
              Scores update live as you change your scenario. Uncertainty bands show the confidence range — wider band means more uncertainty.
            </p>
          </div>
          {selectedForSchedule.length > 0 && (
            <div className="pill pill-primary" style={{ fontSize: 14, padding: "8px 14px" }}>
              {selectedForSchedule.length} vaccine{selectedForSchedule.length !== 1 ? "s" : ""} in your schedule plan
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}
          className="cards-grid-responsive"
        >
          {vaccines.map((vaccine, idx) => {
            const score = scores.find(s => s.vaccineId === vaccine.id);
            if (!score) return null;
            return (
              <VaccineCard
                key={vaccine.id}
                vaccine={vaccine}
                score={score}
                scenario={scenario}
                isSelected={selectedForSchedule.includes(vaccine.id)}
                onSelect={() => onSelectVaccine(vaccine)}
                onToggleSchedule={() => onToggleSchedule(vaccine.id)}
                defaultOpen={idx === 0}
              />
            );
          })}
        </div>

        {/* How Scoring Works */}
        <div style={{
          marginTop: 32, padding: "28px 32px",
          background: "linear-gradient(180deg, #ffffff 0%, #f8faff 100%)",
          border: "1px solid var(--line)", borderRadius: 22,
          boxShadow: "var(--shadow)",
        }} id="how-it-works">
          <h2 style={{ fontSize: 26, marginBottom: 4 }}>How this tool thinks</h2>
          <p style={{ color: "var(--muted)", marginBottom: 20, fontFamily: "Inter, sans-serif", fontSize: 15, maxWidth: "60ch" }}>
            We use a transparent, multi-source weighting model. No single agency's recommendation drives the output.
            The goal is <strong>visible reasoning</strong>, not a predetermined answer.
          </p>

          {/* Decision Philosophy */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24,
          }}>
            {[
              { icon: "⚖️", title: "Not pro or anti", body: "This tool has no predetermined conclusion. It computes from data and shows you the math." },
              { icon: "🔍", title: "Risk vs consequence", body: "Every score weighs both sides: what the disease does, and what the vaccine does." },
              { icon: "🌐", title: "Transparency over authority", body: "CDC is one input. WHO is one input. Studies are one input. No single source dominates." },
              { icon: "❓", title: "Uncertainty is visible", body: "Every score has a confidence range. Lower confidence = wider band. We show what we don't know." },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{
                padding: "14px 16px", background: "var(--surface-2)",
                border: "1px solid var(--line)", borderRadius: 14,
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, fontFamily: "Inter, sans-serif" }}>{title}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>{body}</div>
              </div>
            ))}
          </div>

          {/* What this tool does NOT do */}
          <div style={{
            padding: "14px 16px", background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: 12, marginBottom: 20,
          }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 6, fontFamily: "Inter, sans-serif" }}>
              What this tool does NOT do
            </div>
            <div style={{ fontSize: 13, color: "#78350f", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
              Does not replace medical advice from your pediatrician. Does not guarantee outcomes for any individual child.
              Does not use a single authority — CDC, WHO, and peer-reviewed studies are all weighted inputs, not final answers.
              Does not present certainty where uncertainty exists.
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {[
              {
                q: "What goes into 'Overall Impact for Your Scenario'?",
                a: "It is computed from four dimensions: Exposure Risk (how likely your child encounters the disease), Disease Consequence (how severe the disease is), Vaccine Benefit (how much the vaccine reduces that risk), and Vaccine Harm (adverse event probability × severity weight). The formula is fully transparent and visible in our methodology.",
              },
              {
                q: "Why does the score change when I adjust my scenario?",
                a: "Scenario modifiers — daycare, travel, local outbreaks, older siblings, immunocompromised household — are multipliers on the Exposure Risk dimension. When your exposure context changes, the effective risk changes, which shifts the Overall Impact score. This is the core design: the tradeoffs depend on your situation, not a population average.",
              },
              {
                q: "What do the uncertainty bands mean?",
                a: "Every score has a range (e.g., 'Exposure Risk: 42–58') reflecting the confidence in the underlying data. Wider band = more uncertainty in the evidence base. The 'Evidence Confidence' bar controls band width: low confidence produces wide bands. This is intentional — we show what we don't know.",
              },
              {
                q: "How is 'Vaccine Risk' measured?",
                a: "Each known adverse event is weighted by its probability (per 100,000 doses) and severity (mild, moderate, serious, rare-serious). A score of 6 means the modeled harm from the vaccine is extremely low — not zero, but very small relative to the 0–100 scale. We use post-licensure surveillance data from VAERS, VAX-view, and peer-reviewed safety studies.",
              },
              {
                q: "Where does the 'What some researchers question' section come from?",
                a: "These are documented concerns from peer-reviewed literature, independent researchers, or credentialed practitioners — not fringe or conspiracy content. They are given equal visual weight to the consensus position because intellectual honesty requires showing the full picture.",
              },
            ].map((item, i) => (
              <details key={i}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .cards-grid-responsive { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 640px) {
          .cards-grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}