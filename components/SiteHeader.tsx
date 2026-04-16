"use client";

import { useState } from "react";
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
      { id: "menacwy", name: "MenACWY" },
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
      { id: "menb", name: "MenB" },
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

const ALL_VACCINES_FLAT = VACCINE_NAV.flatMap((g) => g.items);

interface SiteHeaderProps {
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileVaccinesOpen, setMobileVaccinesOpen] = useState(false);

  const navLinks = [
    {
      label: "Schedule",
      href: "/schedule",
      onClick: onScheduleClick,
      view: "schedule",
    },
    {
      label: "Timeline",
      href: "/timeline",
      onClick: onTimelineClick,
      view: "timeline",
    },
    {
      label: "Outbreak Map",
      href: "/outbreak-map",
      onClick: onOutbreakClick,
      view: "outbreak",
    },
    { label: "Compare", href: "/compare", onClick: undefined, view: undefined },
    { label: "FAQ", href: "/faq", onClick: undefined, view: undefined },
    { label: "About", href: "/about", onClick: undefined, view: undefined },
  ];

  return (
    <>
      <header
        style={{
          background: "rgba(247,248,251,0.95)",
          backdropFilter: "saturate(180%) blur(12px)",
          WebkitBackdropFilter: "saturate(180%) blur(12px)",
          borderBottom: "1px solid var(--line)",
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
            padding: "0 20px",
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
              fontSize: 20,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: 5,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #2346a0, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              VaxFact
            </span>
            <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 14 }}>
              .net
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="vf-desktop-nav">
            {/* Vaccines Dropdown */}
            <div className="vf-nav-dropdown-wrapper">
              <Link href="/vaccines" className="vf-nav-link">
                Vaccines ▾
              </Link>
              {/* Invisible hover bridge: fills gap between link and dropdown */}
              <div className="vf-dropdown-bridge" />
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
                          color: "var(--muted)",
                          marginBottom: 10,
                          paddingBottom: 6,
                          borderBottom: "1px solid var(--line)",
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
                    borderTop: "1px solid var(--line)",
                    padding: "12px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--surface-2)",
                  }}
                >
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>
                    20 vaccines with full evidence profiles
                  </span>
                  <Link
                    href="/vaccines"
                    style={{
                      color: "var(--primary)",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    View all →
                  </Link>
                </div>
              </div>
            </div>

            {/* Other nav links */}
            {navLinks.map((link) =>
              link.onClick ? (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className={`vf-nav-link vf-nav-btn ${currentView === link.view ? "vf-nav-active" : ""}`}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`vf-nav-link ${pathname === link.href ? "vf-nav-active" : ""}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* ── Right side ── */}
          <div
            className="vf-desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
          >
            {onScenarioClick && (
              <button
                onClick={onScenarioClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: scenarioActive
                    ? "var(--primary-soft)"
                    : "var(--surface-2)",
                  border: `1px solid ${scenarioActive ? "var(--primary)" : "var(--line)"}`,
                  color: scenarioActive ? "var(--primary)" : "var(--muted)",
                  padding: "7px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                ⚙ Your Situation
                {scenarioActive && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      display: "inline-block",
                    }}
                  />
                )}
              </button>
            )}

            {selectedCount > 0 && (
              <span
                style={{
                  background: "var(--primary-soft)",
                  border: "1px solid var(--line-strong)",
                  color: "var(--primary)",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "5px 10px",
                  borderRadius: 8,
                }}
              >
                {selectedCount} selected
              </span>
            )}

            {!isHome && (
              <Link
                href="/"
                style={{
                  background: "linear-gradient(135deg, #2346a0, #8b5cf6)",
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

          {/* ── Mobile Hamburger ── */}
          <button
            className="vf-mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "1px solid var(--line)",
              borderRadius: 8,
              color: "var(--muted)",
              padding: "8px 10px",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "block",
                width: 20,
                height: 2,
                background: "var(--muted)",
                borderRadius: 2,
                transition: "all 0.2s",
                transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 20,
                height: 2,
                background: "var(--muted)",
                borderRadius: 2,
                opacity: mobileOpen ? 0 : 1,
                transition: "all 0.2s",
              }}
            />
            <span
              style={{
                display: "block",
                width: 20,
                height: 2,
                background: "var(--muted)",
                borderRadius: 2,
                transition: "all 0.2s",
                transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
              }}
            />
          </button>
        </div>

        {/* ── Mobile Menu Panel ── */}
        {mobileOpen && (
          <div
            style={{
              background: "var(--surface)",
              borderTop: "1px solid var(--line)",
              padding: "16px 20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {/* Vaccines accordion */}
            <button
              onClick={() => setMobileVaccinesOpen(!mobileVaccinesOpen)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "none",
                border: "none",
                color: "var(--text)",
                fontSize: 15,
                fontWeight: 600,
                padding: "12px 0",
                cursor: "pointer",
                fontFamily: "inherit",
                borderBottom: "1px solid var(--line)",
                width: "100%",
              }}
            >
              <span>💉 Vaccines</span>
              <span style={{ color: "var(--muted)", fontSize: 12 }}>
                {mobileVaccinesOpen ? "▲" : "▼"}
              </span>
            </button>

            {mobileVaccinesOpen && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  padding: "8px 0 12px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                {ALL_VACCINES_FLAT.map((v) => (
                  <Link
                    key={v.id}
                    href={`/vaccines/${v.id}`}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      color: "var(--muted)",
                      textDecoration: "none",
                      fontSize: 13,
                      padding: "6px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {v.name}
                  </Link>
                ))}
                <Link
                  href="/vaccines"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontSize: 13,
                    padding: "8px 8px",
                    fontWeight: 600,
                    gridColumn: "span 2",
                  }}
                >
                  View all 20 vaccines →
                </Link>
              </div>
            )}

            {/* Other links */}
            {navLinks.map((link) =>
              link.onClick ? (
                <button
                  key={link.label}
                  onClick={() => {
                    link.onClick?.();
                    setMobileOpen(false);
                  }}
                  style={{
                    display: "block",
                    background: "none",
                    border: "none",
                    color: currentView === link.view ? "var(--primary)" : "var(--muted)",
                    fontSize: 15,
                    fontWeight: 500,
                    padding: "12px 0",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    borderBottom: "1px solid var(--line)",
                    width: "100%",
                  }}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    color: pathname === link.href ? "var(--primary)" : "var(--muted)",
                    textDecoration: "none",
                    fontSize: 15,
                    fontWeight: 500,
                    padding: "12px 0",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Mobile CTAs */}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {onScenarioClick && (
                <button
                  onClick={() => {
                    onScenarioClick();
                    setMobileOpen(false);
                  }}
                  style={{
                    flex: 1,
                    background: scenarioActive ? "var(--primary-soft)" : "var(--surface-2)",
                    border: `1px solid ${scenarioActive ? "var(--primary)" : "var(--line)"}`,
                    color: scenarioActive ? "var(--primary)" : "var(--muted)",
                    padding: "10px 0",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ⚙ Your Situation
                </button>
              )}
              {!isHome && (
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #2346a0, #8b5cf6)",
                    color: "#fff",
                    padding: "10px 0",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  Score My Vaccines
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <style>{`
        /* Desktop nav */
        .vf-desktop-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
        }
        .vf-mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 900px) {
          .vf-desktop-nav {
            display: none !important;
          }
          .vf-mobile-menu-btn {
            display: flex !important;
          }
        }

        /* Nav links */
        .vf-nav-link {
          color: var(--muted);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          padding: 7px 10px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
          display: inline-block;
        }
        .vf-nav-link:hover {
          color: var(--text);
          background: var(--surface-2);
        }
        .vf-nav-active {
          color: var(--primary) !important;
          background: var(--primary-soft) !important;
        }
        .vf-nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        /* Dropdown wrapper */
        .vf-nav-dropdown-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        /* Invisible bridge: covers the 8px gap between nav link and dropdown panel
           so the dropdown stays open as the mouse moves from link → dropdown */
        .vf-dropdown-bridge {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 12px; /* matches top offset of dropdown */
          background: transparent;
          z-index: 199;
        }

        /* Dropdown panel */
        .vf-nav-dropdown {
          display: none;
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(23,32,51,0.12);
          z-index: 200;
          overflow: hidden;
        }

        /* Show dropdown and bridge on hover of wrapper OR dropdown itself */
        .vf-nav-dropdown-wrapper:hover .vf-nav-dropdown,
        .vf-nav-dropdown-wrapper:hover .vf-dropdown-bridge,
        .vf-nav-dropdown:hover,
        .vf-nav-dropdown-wrapper:focus-within .vf-nav-dropdown {
          display: block;
        }

        .vf-dropdown-link {
          display: block;
          color: var(--muted);
          text-decoration: none;
          font-size: 13px;
          padding: 5px 8px;
          border-radius: 5px;
          transition: all 0.12s;
        }
        .vf-dropdown-link:hover {
          color: var(--primary);
          background: var(--primary-soft);
        }
      `}</style>
    </>
  );
}