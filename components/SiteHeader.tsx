"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const VACCINE_NAV = [
  {
    category: "Routine Vaccines",
    items: [
      { id: "hepb", name: "Hepatitis B" },
      { id: "dtap", name: "DTaP" },
      { id: "hib", name: "Hib" },
      { id: "pcv", name: "PCV (Pneumococcal)" },
      { id: "mmr", name: "MMR" },
      { id: "rotavirus", name: "Rotavirus" },
      { id: "varicella", name: "Varicella (Chickenpox)" },
      { id: "hepa", name: "Hepatitis A" },
      { id: "hpv", name: "HPV" },
      { id: "menacwy", name: "MenACWY (Meningococcal)" },
      { id: "rsv", name: "RSV" },
      { id: "ipv", name: "IPV (Polio)" },
      { id: "zoster", name: "Shingles (Zoster)" },
    ],
  },
  {
    category: "Annual & Shared Decision",
    items: [
      { id: "influenza", name: "Influenza (Flu)" },
      { id: "covid19", name: "COVID-19" },
      { id: "menb", name: "MenB (Meningococcal B)" },
    ],
  },
  {
    category: "Travel Vaccines",
    items: [
      { id: "typhoid", name: "Typhoid" },
      { id: "yellowfever", name: "Yellow Fever" },
      { id: "rabies", name: "Rabies" },
      { id: "dengue", name: "Dengue" },
    ],
  },
];

interface SiteHeaderProps {
  // Optional interactive callbacks for the home page SPA views
  onScheduleClick?: () => void;
  onOutbreakClick?: () => void;
  onTimelineClick?: () => void;
  onScenarioClick?: () => void;
  scenarioActive?: boolean;
  selectedCount?: number;
  currentView?: string;
}

export default function SiteHeader({
  onScheduleClick,
  onOutbreakClick,
  onTimelineClick,
  onScenarioClick,
  scenarioActive,
  selectedCount = 0,
  currentView,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      style={{
        background: "#0f172a",
        borderBottom: "1px solid #1e293b",
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
          gap: 16,
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 21,
            fontWeight: 700,
            color: "#f8fafc",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VaxFact
          </span>
          <span style={{ color: "#334155", fontWeight: 400, fontSize: 15 }}>
            .net
          </span>
        </Link>

        {/* ── Nav ── */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flex: 1,
          }}
        >
          {/* Vaccines Dropdown */}
          <div className="vf-nav-dropdown-wrapper">
            <Link href="/vaccines" className="vf-nav-link">
              Vaccines ▾
            </Link>
            <div className="vf-nav-dropdown">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 24,
                  padding: 28,
                  minWidth: 680,
                }}
              >
                {VACCINE_NAV.map((group) => (
                  <div key={group.category}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#475569",
                        marginBottom: 10,
                        paddingBottom: 6,
                        borderBottom: "1px solid #1e293b",
                      }}
                    >
                      {group.category}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {group.items.map((v) => (
                        <Link
                          key={v.id}
                          href={`/vaccines/${v.id}`}
                          className="vf-dropdown-link"
                        >
                          {v.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  borderTop: "1px solid #1e293b",
                  padding: "12px 28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#475569", fontSize: 13 }}>
                  20 vaccines with full evidence profiles
                </span>
                <Link
                  href="/vaccines"
                  style={{
                    color: "#3b82f6",
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  View all vaccines →
                </Link>
              </div>
            </div>
          </div>

          {/* Schedule — link or button depending on page */}
          {onScheduleClick ? (
            <button
              onClick={onScheduleClick}
              className={`vf-nav-link vf-nav-btn ${currentView === "schedule" ? "vf-nav-active" : ""}`}
            >
              Schedule
            </button>
          ) : (
            <Link
              href="/schedule"
              className={`vf-nav-link ${pathname === "/schedule" ? "vf-nav-active" : ""}`}
            >
              Schedule
            </Link>
          )}

          {/* Timeline */}
          {onTimelineClick ? (
            <button
              onClick={onTimelineClick}
              className={`vf-nav-link vf-nav-btn ${currentView === "timeline" ? "vf-nav-active" : ""}`}
            >
              Timeline
            </button>
          ) : (
            <Link
              href="/timeline"
              className={`vf-nav-link ${pathname === "/timeline" ? "vf-nav-active" : ""}`}
            >
              Timeline
            </Link>
          )}

          {/* Outbreak Map */}
          {onOutbreakClick ? (
            <button
              onClick={onOutbreakClick}
              className={`vf-nav-link vf-nav-btn ${currentView === "outbreak" ? "vf-nav-active" : ""}`}
            >
              Outbreak Map
            </button>
          ) : (
            <Link
              href="/outbreak-map"
              className={`vf-nav-link ${pathname === "/outbreak-map" ? "vf-nav-active" : ""}`}
            >
              Outbreak Map
            </Link>
          )}

          <Link
            href="/faq"
            className={`vf-nav-link ${pathname === "/faq" ? "vf-nav-active" : ""}`}
          >
            FAQ
          </Link>

          <Link
            href="/about"
            className={`vf-nav-link ${pathname === "/about" ? "vf-nav-active" : ""}`}
          >
            About
          </Link>
        </nav>

        {/* ── Right side actions ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Scenario button (home page only) */}
          {onScenarioClick && (
            <button
              onClick={onScenarioClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: scenarioActive ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${scenarioActive ? "#3b82f6" : "#1e293b"}`,
                color: scenarioActive ? "#93c5fd" : "#94a3b8",
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              ⚙ Your Situation
              {scenarioActive && (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#3b82f6",
                    display: "inline-block",
                  }}
                />
              )}
            </button>
          )}

          {/* Selected vaccines badge (home page) */}
          {selectedCount > 0 && (
            <span
              style={{
                background: "#1e3a5f",
                border: "1px solid #1e4a8a",
                color: "#60a5fa",
                fontSize: 12,
                fontWeight: 700,
                padding: "5px 10px",
                borderRadius: 8,
              }}
            >
              {selectedCount} selected
            </span>
          )}

          {/* Score CTA */}
          {!isHome && (
            <Link
              href="/"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Score My Vaccines
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .vf-nav-link {
          color: #64748b;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 7px 11px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
          display: inline-block;
        }
        .vf-nav-link:hover {
          color: #f1f5f9;
          background: rgba(255,255,255,0.05);
        }
        .vf-nav-active {
          color: #93c5fd !important;
          background: rgba(59,130,246,0.1) !important;
        }
        .vf-nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .vf-nav-dropdown-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .vf-nav-dropdown {
          display: none;
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          z-index: 200;
          overflow: hidden;
        }
        .vf-nav-dropdown-wrapper:hover .vf-nav-dropdown,
        .vf-nav-dropdown-wrapper:focus-within .vf-nav-dropdown {
          display: block;
        }
        .vf-dropdown-link {
          display: block;
          color: #64748b;
          text-decoration: none;
          font-size: 13.5px;
          padding: 5px 8px;
          border-radius: 5px;
          transition: all 0.12s;
        }
        .vf-dropdown-link:hover {
          color: #f1f5f9;
          background: rgba(59,130,246,0.1);
        }
      `}</style>
    </header>
  );
}