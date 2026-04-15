"use client";

import { Shield, Calendar, Sliders, ChevronLeft, Map, Clock } from "lucide-react";

interface HeaderProps {
  onHomeClick: () => void;
  showBack: boolean;
  backLabel?: string;
  selectedCount: number;
  onScheduleClick: () => void;
  onScenarioClick: () => void;
  onOutbreakClick: () => void;
  onTimelineClick: () => void;
  scenarioActive: boolean;
  currentView?: string;
}

export default function Header({
  onHomeClick,
  showBack,
  backLabel = "Back to vaccines",
  selectedCount,
  onScheduleClick,
  onScenarioClick,
  onOutbreakClick,
  onTimelineClick,
  scenarioActive,
  currentView,
}: HeaderProps) {
  return (
    <header className="topbar">
      <div className="vf-container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, minHeight: 72 }}>

          {/* Left: Brand or Back */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {showBack ? (
              <button
                onClick={onHomeClick}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--muted)", fontSize: 14, fontWeight: 600,
                  padding: "8px 0", fontFamily: "Inter, sans-serif",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                <ChevronLeft size={18} />
                {backLabel}
              </button>
            ) : (
              <button
                onClick={onHomeClick}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0,
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: "linear-gradient(135deg, var(--primary), #4a78ee)",
                  color: "white", display: "grid", placeItems: "center",
                  boxShadow: "0 8px 20px rgba(35,70,160,.28)",
                  flexShrink: 0,
                }}>
                  <Shield size={18} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.1, color: "var(--text)" }}>
                    VaxFact<span style={{ color: "var(--primary)" }}>.net</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                    Multi-source vaccine evidence explorer
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Right: Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!showBack && (
              <button
                onClick={onScenarioClick}
                className="btn btn-sm btn-secondary"
                style={scenarioActive ? {
                  background: "var(--primary-soft)",
                  borderColor: "#c2d4f7",
                  color: "var(--primary)",
                } : {}}
              >
                <Sliders size={15} />
                <span>Your Situation</span>
                {scenarioActive && (
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "var(--primary)", display: "inline-block", flexShrink: 0,
                  }} />
                )}
              </button>
            )}

            {/* Timeline button */}
            <button
              onClick={onTimelineClick}
              className={`btn btn-sm ${currentView === "timeline" ? "btn-primary" : "btn-secondary"}`}
            >
              <Clock size={15} />
              <span>Timeline</span>
            </button>

            {/* Outbreak Map button — always visible */}
            <button
              onClick={onOutbreakClick}
              className={`btn btn-sm ${currentView === "outbreak" ? "btn-primary" : "btn-secondary"}`}
            >
              <Map size={15} />
              <span style={{ display: "none" }} className="sm-show">Outbreak Map</span>
              <span className="sm-hide">Map</span>
            </button>

            <button
              onClick={onScheduleClick}
              className={`btn btn-sm ${selectedCount > 0 ? "btn-primary" : "btn-secondary"}`}
            >
              <Calendar size={15} />
              <span>Schedule</span>
              {selectedCount > 0 && (
                <span style={{
                  background: "rgba(255,255,255,0.25)", borderRadius: 6,
                  fontSize: 12, fontWeight: 800, padding: "1px 6px", marginLeft: 2,
                }}>
                  {selectedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}