"use client";

import { Shield, ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "var(--surface)",
      borderTop: "1px solid var(--line)",
      marginTop: "auto",
    }} className="no-print">
      <div className="vf-container" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 40,
        }} className="footer-grid-responsive">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: "linear-gradient(135deg, var(--primary), #4a78ee)",
                display: "grid", placeItems: "center",
                boxShadow: "0 8px 20px rgba(35,70,160,.22)",
              }}>
                <Shield size={18} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: "var(--text)" }}>
                  VaxFact<span style={{ color: "var(--primary)" }}>.net</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                  Multi-source vaccine evidence explorer
                </div>
              </div>
            </div>
            <p style={{
              fontSize: 14, color: "var(--muted)", fontFamily: "Inter, sans-serif",
              lineHeight: 1.7, maxWidth: 380,
            }}>
              An educational tool to help parents make informed vaccination decisions based on
              peer-reviewed evidence from multiple independent sources. Not a substitute for
              professional medical advice.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 style={{
              fontSize: 14, fontWeight: 700, fontFamily: "Inter, sans-serif",
              color: "var(--text)", marginBottom: 14, textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>
              Resources
            </h3>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { label: "CDC Vaccines", url: "https://www.cdc.gov/vaccines/" },
                { label: "WHO Immunization", url: "https://www.who.int/teams/immunization-vaccines-and-biologicals" },
                { label: "CHOP Vaccine Center", url: "https://www.chop.edu/centers-programs/vaccine-education-center" },
                { label: "IAC — Immunization Action Coalition", url: "https://www.immunize.org" },
                { label: "Cochrane Vaccine Reviews", url: "https://www.cochrane.org/search/site/vaccine" },
              ].map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 14, color: "var(--muted)", fontFamily: "Inter, sans-serif",
                    textDecoration: "none", transition: "color 0.15s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                >
                  {link.label}
                  <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h3 style={{
              fontSize: 14, fontWeight: 700, fontFamily: "Inter, sans-serif",
              color: "var(--text)", marginBottom: 14, textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>
              About
            </h3>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                "Educational use only",
                "Not medical advice",
                "Multi-source evidence model",
                "Score methodology visible",
                `© ${year} VaxFact.net`,
              ].map(item => (
                <div key={item} style={{ fontSize: 14, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: 36, paddingTop: 24,
          borderTop: "1px solid var(--line)",
        }}>
          <p style={{
            fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif",
            lineHeight: 1.7, textAlign: "center", maxWidth: 760, margin: "0 auto",
          }}>
            This website provides general information for educational purposes only. The content is not intended
            to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of
            your physician or other qualified health provider with any questions you may have regarding a medical
            condition or vaccination schedule. Never disregard professional medical advice or delay seeking it
            because of something you have read on this website.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid-responsive { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </footer>
  );
}