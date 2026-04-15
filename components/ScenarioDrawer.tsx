"use client";

import { useState, useEffect } from "react";
import { ScenarioInputs, DEFAULT_SCENARIO } from "@/lib/vaccineData";
import { X, RotateCcw, Info } from "lucide-react";

interface ScenarioDrawerProps {
  scenario: ScenarioInputs;
  setScenario: (scenario: ScenarioInputs) => void;
  onClose: () => void;
}

const TOGGLES = [
  { key: "daycare" as keyof ScenarioInputs, label: "Attends daycare", text: "Raises exposure to respiratory and enteric disease." },
  { key: "travel" as keyof ScenarioInputs, label: "International travel", text: "Applies higher weight for imported disease risk." },
  { key: "outbreak" as keyof ScenarioInputs, label: "Outbreak nearby", text: "Adds a strong temporary exposure multiplier." },
  { key: "siblings" as keyof ScenarioInputs, label: "Older siblings in school", text: "School-age children increase household exposure." },
  { key: "immunocompromisedHousehold" as keyof ScenarioInputs, label: "Immunocompromised household", text: "Higher urgency for herd protection." },
  { key: "rural" as keyof ScenarioInputs, label: "Rural location", text: "May affect disease exposure and healthcare access." },
];

export default function ScenarioDrawer({ scenario, setScenario, onClose }: ScenarioDrawerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const toggle = (key: keyof ScenarioInputs) => {
    setScenario({ ...scenario, [key]: !scenario[key] });
  };

  const activeCount = TOGGLES.filter(t => Boolean(scenario[t.key])).length;

  const ageLabel = scenario.childAge === 0 ? "Birth"
    : scenario.childAge < 12 ? `${scenario.childAge}m`
    : `${Math.floor(scenario.childAge / 12)}y ${scenario.childAge % 12 > 0 ? `${scenario.childAge % 12}m` : ""}`.trim();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(23,32,51,0.5)",
          zIndex: 40, transition: "opacity 0.2s ease",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0,
        width: "100%", maxWidth: 420,
        background: "var(--surface)",
        boxShadow: "-4px 0 40px rgba(23,32,51,0.15)",
        zIndex: 50, display: "flex", flexDirection: "column",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.2s ease",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid var(--line)",
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 2 }}>Your Family's Scenario</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
              Personalize risk estimates for your child
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "var(--surface-2)", border: "1px solid var(--line)",
              borderRadius: 10, padding: 8, cursor: "pointer",
              display: "flex", alignItems: "center",
              transition: "background 0.15s ease",
            }}
          >
            <X size={18} color="var(--muted)" />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {/* Info */}
          <div style={{
            display: "flex", gap: 10, padding: "12px 14px",
            background: "var(--primary-soft)", border: "1px solid #c2d4f7",
            borderRadius: 12, marginBottom: 20,
          }}>
            <Info size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 13, color: "var(--primary)", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
              These factors modify disease exposure risk in the vaccine cards. All cards update instantly.
            </p>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {/* Child Age */}
            <div style={{
              padding: 14, background: "var(--surface-2)",
              border: "1px solid var(--line)", borderRadius: 14,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontWeight: 700, fontSize: 14, fontFamily: "Inter, sans-serif" }}>
                  Child's age
                </label>
                <strong style={{ fontSize: 14, fontFamily: "Inter, sans-serif", color: "var(--primary)" }}>
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
                <span>Birth</span><span>3yr</span><span>6yr</span><span>9yr</span><span>12yr</span>
              </div>
            </div>

            {/* Community vax rate */}
            <div style={{
              padding: 14, background: "var(--surface-2)",
              border: "1px solid var(--line)", borderRadius: 14,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontWeight: 700, fontSize: 14, fontFamily: "Inter, sans-serif" }}>
                  Community vaccination rate
                </label>
                <strong style={{ fontSize: 14, fontFamily: "Inter, sans-serif", color: "var(--primary)" }}>
                  {scenario.communityVaxRate}%
                </strong>
              </div>
              <input
                type="range" min={30} max={99} step={1}
                value={scenario.communityVaxRate}
                onChange={e => setScenario({ ...scenario, communityVaxRate: parseInt(e.target.value) })}
                style={{ width: "100%", accentColor: "var(--primary)" }}
              />
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, fontFamily: "Inter, sans-serif" }}>
                Lower coverage increases outbreak risk for unvaccinated children.
              </p>
            </div>

            {/* Boolean toggles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {TOGGLES.map(({ key, label, text }) => {
                const active = Boolean(scenario[key]);
                return (
                  <button
                    key={key}
                    onClick={() => toggle(key)}
                    className={`scenario-toggle${active ? " active" : ""}`}
                  >
                    <div className="t-title">{label}</div>
                    <div className="t-text">{text}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid var(--line)", padding: "16px 24px",
          background: "var(--surface-2)", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
            {activeCount} situational factor{activeCount !== 1 ? "s" : ""} active
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setScenario(DEFAULT_SCENARIO)}
              className="btn btn-ghost btn-sm"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={handleClose} className="btn btn-primary btn-sm">
              Apply & close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}