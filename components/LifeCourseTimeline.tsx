"use client";

import { useState } from "react";
import { VACCINES } from "@/lib/vaccineData";
import {
  Baby, GraduationCap, Users, Heart, Shield,
  ChevronDown, ChevronUp, Info, Clock,
} from "lucide-react";

// ─── Life stage definitions ────────────────────────────────────────────────
const LIFE_STAGES = [
  {
    id: "newborn",
    label: "Newborn",
    sublabel: "Birth – 2 months",
    ageMonths: [0, 2],
    icon: "👶",
    color: "#f0abfc",
    bg: "#fdf4ff",
    border: "#e879f9",
    description: "Critical window: maternal antibodies waning, highest vulnerability to Hep B and RSV.",
  },
  {
    id: "infant",
    label: "Infant",
    sublabel: "2 – 12 months",
    ageMonths: [2, 12],
    icon: "🍼",
    color: "#93c5fd",
    bg: "#eff6ff",
    border: "#60a5fa",
    description: "Core vaccine series: DTaP, Hib, PCV, IPV, HepB, Rotavirus. Most intensive vaccination period.",
  },
  {
    id: "toddler",
    label: "Toddler",
    sublabel: "12 – 36 months",
    ageMonths: [12, 36],
    icon: "🧸",
    color: "#6ee7b7",
    bg: "#f0fdf4",
    border: "#34d399",
    description: "MMR, Varicella, HepA, and booster doses. Daycare increases disease exposure significantly.",
  },
  {
    id: "child",
    label: "Child",
    sublabel: "4 – 11 years",
    ageMonths: [48, 132],
    icon: "🎒",
    color: "#fcd34d",
    bg: "#fffbeb",
    border: "#f59e0b",
    description: "Pre-school boosters (DTaP, IPV, MMR, Varicella). Annual flu. School entry requirements.",
  },
  {
    id: "preteen",
    label: "Preteen",
    sublabel: "11 – 12 years",
    ageMonths: [132, 144],
    icon: "📚",
    color: "#fb923c",
    bg: "#fff7ed",
    border: "#f97316",
    description: "Critical: Tdap booster, HPV series (best before sexual debut), MenACWY. Key catch-up window.",
  },
  {
    id: "teen",
    label: "Teen",
    sublabel: "13 – 18 years",
    ageMonths: [156, 216],
    icon: "🎓",
    color: "#f87171",
    bg: "#fff1f2",
    border: "#ef4444",
    description: "MenACWY booster at 16, HPV catch-up, MenB (shared decision), annual flu. Pre-college prep.",
  },
  {
    id: "adult",
    label: "Young Adult",
    sublabel: "19 – 49 years",
    ageMonths: [228, 588],
    icon: "🏃",
    color: "#818cf8",
    bg: "#eef2ff",
    border: "#6366f1",
    description: "Tdap/Td every 10y, annual flu, COVID updates. Travel vaccines as needed. Pregnancy: flu + Tdap + RSV.",
  },
  {
    id: "older",
    label: "Older Adult",
    sublabel: "50+ years",
    ageMonths: [600, 1200],
    icon: "🌿",
    color: "#34d399",
    bg: "#f0fdf4",
    border: "#10b981",
    description: "Shingrix, PCV (pneumococcal), RSV vaccine, annual flu, COVID updates. Highest disease risk from many vaccine-preventable illnesses.",
  },
];

// ─── Map each vaccine to life stages where it's relevant ──────────────────
const VACCINE_STAGE_MAP: Record<string, string[]> = {
  hepb:       ["newborn", "infant"],
  dtap:       ["infant", "toddler", "child"],
  hib:        ["infant", "toddler"],
  pcv:        ["infant", "toddler"],
  mmr:        ["toddler", "child"],
  rotavirus:  ["infant"],
  varicella:  ["toddler", "child"],
  hepa:       ["toddler", "child"],
  hpv:        ["preteen", "teen", "adult"],
  menacwy:    ["preteen", "teen", "adult"],
  menb:       ["teen", "adult"],
  rsv:        ["newborn", "infant", "older"],
  influenza:  ["newborn", "infant", "toddler", "child", "preteen", "teen", "adult", "older"],
  covid19:    ["infant", "toddler", "child", "preteen", "teen", "adult", "older"],
  zoster:     ["older"],
  typhoid:    ["child", "teen", "adult", "older"],
  yellowfever: ["child", "teen", "adult"],
  rabies:     ["child", "teen", "adult"],
  dengue:     ["child", "teen", "adult"],
  ipv:        ["infant", "toddler", "child"],
};

// ─── Category tags for each vaccine ────────────────────────────────────────
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

const CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  routine: { label: "Routine", color: "#059669", bg: "#d1fae5" },
  annual:  { label: "Annual", color: "#0891b2", bg: "#cffafe" },
  discuss: { label: "Shared decision", color: "#d97706", bg: "#fef3c7" },
  travel:  { label: "Travel", color: "#7c3aed", bg: "#ede9fe" },
};

// ─── Timing label for each vaccine in a specific stage ─────────────────────
const VACCINE_STAGE_TIMING: Record<string, Record<string, string>> = {
  hepb:        { newborn: "Birth + 1–2m + 6m", infant: "6–18m (dose 3)" },
  dtap:        { infant: "2m, 4m, 6m", toddler: "15–18m booster", child: "4–6y booster" },
  hib:         { infant: "2m, 4m, 6m", toddler: "12–15m booster" },
  pcv:         { infant: "2m, 4m, 6m", toddler: "12–15m booster" },
  mmr:         { toddler: "12–15m (dose 1)", child: "4–6y (dose 2)" },
  rotavirus:   { infant: "2m, 4m (±6m)" },
  varicella:   { toddler: "12–15m (dose 1)", child: "4–6y (dose 2)" },
  hepa:        { toddler: "12–23m (dose 1)", child: "6–18m after dose 1" },
  hpv:         { preteen: "2 doses (9–14y optimal)", teen: "Catch-up or dose 2", adult: "Catch-up through 26; discuss 27–45" },
  menacwy:     { preteen: "11–12y (dose 1)", teen: "16y booster; college prep", adult: "If unvaccinated or at risk" },
  menb:        { teen: "16–23y (shared decision)", adult: "High-risk only" },
  rsv:         { newborn: "Nirsevimab before RSV season", infant: "Annual at RSV season start", older: "Abrysvo or Mresvia (60+)" },
  influenza:   { newborn: "6m+ annually", infant: "Annually (2 doses yr 1)", toddler: "Annually", child: "Annually", preteen: "Annually", teen: "Annually", adult: "Annually", older: "High-dose/adjuvanted recommended" },
  covid19:     { infant: "6m+ primary series", toddler: "Annual updates", child: "Annual updates", preteen: "Annual", teen: "Annual", adult: "Annual", older: "Annual — high priority" },
  zoster:      { older: "2 doses starting at 50+" },
  typhoid:     { child: "Travel to endemic areas", teen: "Travel", adult: "Travel + every 2y", older: "Travel" },
  yellowfever: { child: "Travel (9m+)", teen: "Travel", adult: "Travel (once, lifelong)" },
  rabies:      { child: "Pre-exposure: high-risk travel", teen: "Pre-exposure: travel/occupation", adult: "Pre-exposure: travel/occupation/wildlife" },
  dengue:      { child: "Endemic areas, seropositive 9+", teen: "Endemic/travel", adult: "Endemic only" },
  ipv:         { infant: "2m, 4m, 6–18m", toddler: "Part of series", child: "4–6y (final dose)" },
};

type ViewMode = "timeline" | "grid";

export default function LifeCourseTimeline() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [showTravel, setShowTravel] = useState(false);
  const [expandedVaccine, setExpandedVaccine] = useState<string | null>(null);

  const vaccineMap = new Map(VACCINES.map(v => [v.id, v]));

  // Get vaccines for a given stage
  const getVaccinesForStage = (stageId: string) =>
    VACCINES.filter(v => (VACCINE_STAGE_MAP[v.id] || []).includes(stageId))
      .filter(v => showTravel || VACCINE_CATEGORIES[v.id] !== "travel");

  const activeStage = selectedStage
    ? LIFE_STAGES.find(s => s.id === selectedStage)
    : null;

  const activeVaccines = selectedStage ? getVaccinesForStage(selectedStage) : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div className="vf-container" style={{ paddingTop: 32, paddingBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 900, color: "var(--text)", marginBottom: 8, fontFamily: "'Source Serif 4', serif" }}>
                Vaccine Timeline
              </h1>
              <p style={{ fontSize: 16, color: "var(--muted)", fontFamily: "Inter, sans-serif", maxWidth: 560 }}>
                From birth through older adulthood — when each vaccine is recommended, why timing matters, and how protection builds over a lifetime.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {/* Travel toggle */}
              <button
                onClick={() => setShowTravel(t => !t)}
                style={{
                  padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                  fontFamily: "Inter, sans-serif", cursor: "pointer", border: "1px solid var(--line)",
                  background: showTravel ? "#ede9fe" : "var(--surface-2)",
                  color: showTravel ? "#7c3aed" : "var(--muted)",
                  transition: "all 0.15s ease",
                }}
              >
                ✈️ {showTravel ? "Hiding" : "Show"} travel vaccines
              </button>
            </div>
          </div>

          {/* Category legend */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
              <span key={key} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                background: val.bg, color: val.color,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: val.color, display: "inline-block" }} />
                {val.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="vf-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Life stage selector — horizontal swim lanes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10, marginBottom: 32 }}
          className="timeline-stages-responsive">
          {LIFE_STAGES.map(stage => {
            const stageVaccines = getVaccinesForStage(stage.id);
            const isActive = selectedStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(prev => prev === stage.id ? null : stage.id)}
                style={{
                  padding: "16px 10px",
                  background: isActive ? stage.bg : "var(--surface)",
                  border: `2px solid ${isActive ? stage.border : "var(--line)"}`,
                  borderRadius: 16,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{stage.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "Inter, sans-serif", color: "var(--text)", marginBottom: 2 }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 8 }}>
                  {stage.sublabel}
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 24, height: 24, borderRadius: "50%",
                  background: isActive ? stage.border : "var(--surface-2)",
                  color: isActive ? "white" : "var(--muted)",
                  fontSize: 12, fontWeight: 800, fontFamily: "Inter, sans-serif",
                }}>
                  {stageVaccines.length}
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual timeline bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            height: 8, borderRadius: 99,
            background: "linear-gradient(to right, #f0abfc, #93c5fd, #6ee7b7, #fcd34d, #fb923c, #f87171, #818cf8, #34d399)",
            position: "relative", overflow: "visible",
          }}>
            {LIFE_STAGES.map((stage, i) => (
              <div
                key={stage.id}
                onClick={() => setSelectedStage(prev => prev === stage.id ? null : stage.id)}
                style={{
                  position: "absolute",
                  left: `${(i / LIFE_STAGES.length) * 100}%`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20, height: 20,
                  borderRadius: "50%",
                  background: selectedStage === stage.id ? stage.border : "var(--surface)",
                  border: `3px solid ${stage.border}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  zIndex: 1,
                }}
                title={stage.label}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
            <span>Birth</span>
            <span>2m</span>
            <span>12m</span>
            <span>4y</span>
            <span>11y</span>
            <span>13y</span>
            <span>19y</span>
            <span>50y+</span>
          </div>
        </div>

        {/* Selected stage detail panel */}
        {activeStage && (
          <div style={{
            border: `2px solid ${activeStage.border}`,
            borderRadius: 20, overflow: "hidden", marginBottom: 32,
            animation: "fadeIn 0.2s ease",
          }}>
            {/* Stage header */}
            <div style={{
              padding: "20px 24px",
              background: activeStage.bg,
              borderBottom: `1px solid ${activeStage.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 36 }}>{activeStage.icon}</span>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", marginBottom: 2, fontFamily: "'Source Serif 4', serif" }}>
                    {activeStage.label}
                    <span style={{ fontSize: 15, fontWeight: 400, color: "var(--muted)", marginLeft: 10, fontFamily: "Inter, sans-serif" }}>
                      {activeStage.sublabel}
                    </span>
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--muted)", fontFamily: "Inter, sans-serif", margin: 0 }}>
                    {activeStage.description}
                  </p>
                </div>
              </div>
              <div style={{
                padding: "8px 16px", borderRadius: 20,
                background: "white", border: `1px solid ${activeStage.border}`,
                fontSize: 14, fontWeight: 700, fontFamily: "Inter, sans-serif",
                color: "var(--text)",
              }}>
                {activeVaccines.length} vaccine{activeVaccines.length !== 1 ? "s" : ""} relevant
              </div>
            </div>

            {/* Vaccine list for this stage */}
            <div style={{ background: "var(--surface)", padding: "20px 24px" }}>
              {activeVaccines.length === 0 ? (
                <p style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", fontSize: 14 }}>
                  No vaccines shown for this stage with current filters.
                </p>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {activeVaccines.map(vaccine => {
                    const cat = VACCINE_CATEGORIES[vaccine.id];
                    const catLabel = CATEGORY_LABELS[cat];
                    const timing = VACCINE_STAGE_TIMING[vaccine.id]?.[activeStage.id] || "See schedule";
                    const isExpanded = expandedVaccine === vaccine.id;

                    return (
                      <div key={vaccine.id} style={{
                        border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
                      }}>
                        <button
                          onClick={() => setExpandedVaccine(prev => prev === vaccine.id ? null : vaccine.id)}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 14,
                            padding: "14px 18px", background: "var(--surface-2)",
                            border: "none", cursor: "pointer", textAlign: "left",
                          }}
                        >
                          {/* Color dot */}
                          <div style={{
                            width: 12, height: 12, borderRadius: "50%",
                            background: vaccine.color, flexShrink: 0,
                          }} />

                          {/* Name + category */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "Inter, sans-serif", color: "var(--text)" }}>
                                {vaccine.name}
                              </span>
                              <span style={{
                                fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif",
                                padding: "2px 8px", borderRadius: 10,
                                background: catLabel.bg, color: catLabel.color,
                              }}>
                                {catLabel.label}
                              </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                              <Clock size={12} color="var(--muted)" />
                              <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                                {timing}
                              </span>
                            </div>
                          </div>

                          {/* Effectiveness badge */}
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 18, fontWeight: 900, fontFamily: "Inter, sans-serif", color: "var(--good)" }}>
                              {vaccine.effectiveness.againstSevereDisease}%
                            </div>
                            <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                              vs severe disease
                            </div>
                          </div>

                          {isExpanded
                            ? <ChevronUp size={18} color="var(--muted)" style={{ flexShrink: 0 }} />
                            : <ChevronDown size={18} color="var(--muted)" style={{ flexShrink: 0 }} />}
                        </button>

                        {isExpanded && (
                          <div style={{ padding: "16px 18px 20px", background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}
                              className="timeline-expand-responsive">
                              <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--line)" }}>
                                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>Disease prevented</div>
                                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                                  {vaccine.diseases.slice(0, 2).join(", ")}
                                </div>
                              </div>
                              <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--line)" }}>
                                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>Why this timing</div>
                                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                                  {timing}
                                </div>
                              </div>
                              <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--line)" }}>
                                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>Years in use</div>
                                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                                  {vaccine.yearsInUse} years · {vaccine.dosesAdministered}
                                </div>
                              </div>
                            </div>

                            <p style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.7, margin: 0 }}>
                              {vaccine.disease.description.slice(0, 200)}…
                            </p>

                            {vaccine.credibleCritiques && vaccine.credibleCritiques.length > 0 && (
                              <div style={{
                                marginTop: 12, padding: "10px 14px",
                                background: "#fffbf0", border: "1px solid #fde68a", borderRadius: 10,
                                fontSize: 12, color: "#92400e", fontFamily: "Inter, sans-serif", lineHeight: 1.5,
                              }}>
                                <strong>Researchers debate:</strong> {(vaccine.credibleCritiques[0] as string).slice(0, 150)}…
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full matrix view — all vaccines × all stages */}
        <div style={{ border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", background: "var(--surface-2)", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Source Serif 4', serif" }}>
              Complete Vaccine × Age Matrix
            </h3>
            <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
              Click a life stage above for details
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
              <thead>
                <tr style={{ background: "var(--surface-2)" }}>
                  <th style={{
                    padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 700,
                    color: "var(--muted)", borderBottom: "1px solid var(--line)",
                    position: "sticky", left: 0, background: "var(--surface-2)", minWidth: 140,
                  }}>
                    Vaccine
                  </th>
                  {LIFE_STAGES.map(stage => (
                    <th key={stage.id} style={{
                      padding: "8px 10px", textAlign: "center", fontSize: 11, fontWeight: 700,
                      color: "var(--muted)", borderBottom: "1px solid var(--line)", minWidth: 80,
                    }}>
                      <div style={{ fontSize: 16, marginBottom: 2 }}>{stage.icon}</div>
                      <div>{stage.label}</div>
                      <div style={{ fontWeight: 400, fontSize: 10 }}>{stage.sublabel}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VACCINES
                  .filter(v => showTravel || VACCINE_CATEGORIES[v.id] !== "travel")
                  .map((vaccine, i) => {
                    const cat = VACCINE_CATEGORIES[vaccine.id];
                    const catLabel = CATEGORY_LABELS[cat];
                    return (
                      <tr key={vaccine.id} style={{
                        background: i % 2 === 0 ? "var(--surface)" : "var(--surface-2)",
                      }}>
                        <td style={{
                          padding: "10px 16px",
                          borderBottom: "1px solid var(--line)",
                          position: "sticky", left: 0,
                          background: i % 2 === 0 ? "var(--surface)" : "var(--surface-2)",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: vaccine.color, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{vaccine.name}</div>
                              <span style={{
                                fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 6,
                                background: catLabel.bg, color: catLabel.color,
                              }}>
                                {catLabel.label}
                              </span>
                            </div>
                          </div>
                        </td>
                        {LIFE_STAGES.map(stage => {
                          const applies = (VACCINE_STAGE_MAP[vaccine.id] || []).includes(stage.id);
                          const timing = VACCINE_STAGE_TIMING[vaccine.id]?.[stage.id];
                          return (
                            <td key={stage.id} style={{
                              padding: "8px 10px", textAlign: "center",
                              borderBottom: "1px solid var(--line)",
                            }}>
                              {applies ? (
                                <div
                                  title={timing || ""}
                                  style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    width: 28, height: 28, borderRadius: "50%",
                                    background: stage.bg, border: `2px solid ${stage.border}`,
                                  }}>
                                  <div style={{
                                    width: 10, height: 10, borderRadius: "50%",
                                    background: stage.border,
                                  }} />
                                </div>
                              ) : (
                                <div style={{
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  width: 28, height: 28, borderRadius: "50%",
                                  opacity: 0.15,
                                }}>
                                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--muted)" }} />
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Decision philosophy note */}
        <div style={{
          marginTop: 24, padding: "20px 24px",
          background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18,
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20,
        }} className="timeline-philosophy-responsive">
          {[
            { icon: "⏰", title: "Why timing matters", body: "Many vaccines work best when given at specific ages — either because disease risk peaks early, because maternal antibodies interfere if given too soon, or because the immune system responds differently at different developmental stages." },
            { icon: "🔗", title: "Building on each dose", body: "Most vaccine series require multiple doses to build full protection. The schedule is designed so each dose builds on the last — the gap between doses isn't arbitrary, it's immunologically optimized." },
            { icon: "🌍", title: "Schedules differ globally", body: "Different countries start the same vaccines at different ages based on local disease epidemiology, healthcare infrastructure, and cost-benefit modeling. There is no single universally correct schedule." },
          ].map(item => (
            <div key={item.title}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Source Serif 4', serif", marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 1100px) {
          .timeline-stages-responsive { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .timeline-stages-responsive { grid-template-columns: repeat(2, 1fr) !important; }
          .timeline-expand-responsive { grid-template-columns: 1fr !important; }
          .timeline-philosophy-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}