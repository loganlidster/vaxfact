import Link from "next/link";

const FOOTER_VACCINES = [
  { id: "hepb", name: "Hepatitis B" },
  { id: "dtap", name: "DTaP" },
  { id: "mmr", name: "MMR" },
  { id: "varicella", name: "Varicella" },
  { id: "hpv", name: "HPV" },
  { id: "influenza", name: "Influenza" },
  { id: "covid19", name: "COVID-19" },
  { id: "pcv", name: "Pneumococcal (PCV)" },
  { id: "menacwy", name: "MenACWY" },
  { id: "menb", name: "MenB" },
  { id: "hepa", name: "Hepatitis A" },
  { id: "rsv", name: "RSV" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#0a0f1e",
        borderTop: "1px solid #1e293b",
        marginTop: 80,
        paddingTop: 60,
        paddingBottom: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand column */}
          <div className="vf-footer-brand">
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 24,
                fontWeight: 700,
                color: "#f8fafc",
                textDecoration: "none",
                display: "block",
                marginBottom: 12,
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
                VaxFact.net
              </span>
            </Link>
            <p
              style={{
                color: "#64748b",
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 20,
                maxWidth: 320,
              }}
            >
              Evidence-based vaccine information for parents, patients, and providers.
              Transparent benefit-risk scoring for 20 vaccines, grounded in peer-reviewed science.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  background: "#0d1526",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                🔬 20 Vaccines
              </div>
              <div
                style={{
                  background: "#0d1526",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                📊 Evidence Scoring
              </div>
              <div
                style={{
                  background: "#0d1526",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                🏥 CDC/WHO Data
              </div>
            </div>
          </div>

          {/* Tools column */}
          <div>
            <h4
              style={{
                color: "#e2e8f0",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 16,
              }}
            >
              Tools
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { href: "/", label: "Score My Vaccines" },
                { href: "/schedule", label: "Schedule Builder" },
                { href: "/timeline", label: "Life-Course Timeline" },
                { href: "/outbreak-map", label: "Outbreak Map" },
                { href: "/vaccines", label: "Vaccine Database" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    color: "#64748b",
                    textDecoration: "none",
                    fontSize: 14,
                    transition: "color 0.15s",
                  }}
                  className="footer-link"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Information column */}
          <div>
            <h4
              style={{
                color: "#e2e8f0",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 16,
              }}
            >
              Information
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { href: "/faq", label: "FAQ" },
                { href: "/about", label: "About & Methodology" },
                { href: "/about#evidence", label: "Evidence Standards" },
                { href: "/about#scoring", label: "Scoring Model" },
                { href: "/about#disclaimer", label: "Medical Disclaimer" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    color: "#64748b",
                    textDecoration: "none",
                    fontSize: 14,
                    transition: "color 0.15s",
                  }}
                  className="footer-link"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Top Vaccines column */}
          <div>
            <h4
              style={{
                color: "#e2e8f0",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 16,
              }}
            >
              Top Vaccines
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FOOTER_VACCINES.map(({ id, name }) => (
                <Link
                  key={id}
                  href={`/vaccines/${id}`}
                  style={{
                    color: "#64748b",
                    textDecoration: "none",
                    fontSize: 14,
                    transition: "color 0.15s",
                  }}
                  className="footer-link"
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Disclaimer bar */}
        <div
          style={{
            background: "#0d1526",
            border: "1px solid #1e293b",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 32,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚕️</span>
          <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: "#64748b" }}>Medical Disclaimer:</strong> VaxFact.net provides educational
            information only. This is not medical advice. All vaccine decisions should be made in consultation
            with a licensed healthcare provider who knows your individual health history. Data sourced from
            CDC, WHO, and peer-reviewed literature — updated periodically.
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #1e293b",
            paddingTop: 24,
          }}
        >
          <p style={{ color: "#374151", fontSize: 13, margin: 0 }}>
            © {year} VaxFact.net — For educational purposes only.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { href: "/about", label: "About" },
              { href: "/faq", label: "FAQ" },
              { href: "/vaccines", label: "All Vaccines" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  color: "#374151",
                  textDecoration: "none",
                  fontSize: 13,
                  transition: "color 0.15s",
                }}
                className="footer-link"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: #94a3b8 !important;
        }
        @media (max-width: 768px) {
          .vf-footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          .vf-footer-brand {
            grid-column: span 2;
          }
        }
        @media (max-width: 480px) {
          .vf-footer-grid {
            grid-template-columns: 1fr !important;
          }
          .vf-footer-brand {
            grid-column: span 1;
          }
        }
      `}</style>
    </footer>
  );
}