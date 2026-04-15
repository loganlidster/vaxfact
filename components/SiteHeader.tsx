import Link from "next/link";

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

export default function SiteHeader() {
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
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 22,
            fontWeight: 700,
            color: "#f8fafc",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: 8,
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
          <span style={{ color: "#64748b", fontWeight: 400, fontSize: 16 }}>
            .net
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Vaccines Dropdown */}
          <div className="nav-dropdown-wrapper">
            <Link href="/vaccines" className="nav-link nav-link-vaccines">
              Vaccines ▾
            </Link>
            <div className="nav-dropdown">
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
                        color: "#64748b",
                        marginBottom: 10,
                        paddingBottom: 6,
                        borderBottom: "1px solid #1e293b",
                      }}
                    >
                      {group.category}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {group.items.map((v) => (
                        <Link
                          key={v.id}
                          href={`/vaccines/${v.id}`}
                          style={{
                            color: "#cbd5e1",
                            textDecoration: "none",
                            fontSize: 14,
                            padding: "4px 8px",
                            borderRadius: 4,
                            transition: "all 0.15s",
                          }}
                          className="dropdown-vaccine-link"
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
                <span style={{ color: "#64748b", fontSize: 13 }}>
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

          <Link href="/schedule" className="nav-link">
            Schedule
          </Link>
          <Link href="/timeline" className="nav-link">
            Timeline
          </Link>
          <Link href="/outbreak-map" className="nav-link">
            Outbreak Map
          </Link>
          <Link href="/faq" className="nav-link">
            FAQ
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>

          <Link
            href="/"
            style={{
              marginLeft: 8,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Score My Vaccines
          </Link>
        </nav>
      </div>

      {/* CSS for dropdown behavior */}
      <style>{`
        .nav-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: #f1f5f9;
          background: rgba(255,255,255,0.05);
        }
        .nav-link-vaccines {
          cursor: pointer;
        }
        .nav-dropdown-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .nav-dropdown {
          display: none;
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          z-index: 200;
          overflow: hidden;
        }
        .nav-dropdown-wrapper:hover .nav-dropdown,
        .nav-dropdown-wrapper:focus-within .nav-dropdown {
          display: block;
        }
        .dropdown-vaccine-link:hover {
          color: #f1f5f9 !important;
          background: rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </header>
  );
}