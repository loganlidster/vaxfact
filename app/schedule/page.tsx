import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { VACCINES } from "@/lib/vaccineData";

export const metadata: Metadata = {
  title: "Vaccine Schedule Builder — Personalized Childhood Immunization Schedule",
  description:
    "Build a personalized vaccine schedule based on your child's age. See which vaccines are due now, coming up, and overdue. Based on the CDC ACIP recommended immunization schedule for 20 vaccines.",
  alternates: { canonical: "https://vaxfact.net/schedule" },
  openGraph: {
    title: "Vaccine Schedule Builder — VaxFact.net",
    description:
      "Personalized childhood vaccine schedule based on CDC recommendations.",
    url: "https://vaxfact.net/schedule",
  },
};

// Age milestones for the schedule (in months)
const AGE_MILESTONES = [
  { label: "Birth", months: 0, sublabel: "Within 24 hours" },
  { label: "2 months", months: 2, sublabel: "" },
  { label: "4 months", months: 4, sublabel: "" },
  { label: "6 months", months: 6, sublabel: "" },
  { label: "9 months", months: 9, sublabel: "Well-child check" },
  { label: "12 months", months: 12, sublabel: "1 year" },
  { label: "15 months", months: 15, sublabel: "" },
  { label: "18 months", months: 18, sublabel: "" },
  { label: "24 months", months: 24, sublabel: "2 years" },
  { label: "3 years", months: 36, sublabel: "" },
  { label: "4–6 years", months: 54, sublabel: "Pre-K booster visit" },
  { label: "11–12 years", months: 132, sublabel: "Preteen visit" },
  { label: "16 years", months: 192, sublabel: "Teen booster visit" },
  { label: "18+ years", months: 216, sublabel: "Adult" },
];

// Which vaccines are due at which milestone (simplified CDC schedule)
const SCHEDULE_MAP: Record<number, { vaccineId: string; note: string; dose?: number }[]> = {
  0: [
    { vaccineId: "hepb", note: "1st dose — birth", dose: 1 },
  ],
  2: [
    { vaccineId: "hepb", note: "2nd dose", dose: 2 },
    { vaccineId: "dtap", note: "1st dose", dose: 1 },
    { vaccineId: "hib", note: "1st dose", dose: 1 },
    { vaccineId: "pcv", note: "1st dose (PCV15 or PCV20)", dose: 1 },
    { vaccineId: "ipv", note: "1st dose", dose: 1 },
    { vaccineId: "rotavirus", note: "1st dose (oral)", dose: 1 },
  ],
  4: [
    { vaccineId: "dtap", note: "2nd dose", dose: 2 },
    { vaccineId: "hib", note: "2nd dose", dose: 2 },
    { vaccineId: "pcv", note: "2nd dose", dose: 2 },
    { vaccineId: "ipv", note: "2nd dose", dose: 2 },
    { vaccineId: "rotavirus", note: "2nd dose (oral)", dose: 2 },
  ],
  6: [
    { vaccineId: "dtap", note: "3rd dose", dose: 3 },
    { vaccineId: "hib", note: "3rd dose (if Hib-OMP, not needed)", dose: 3 },
    { vaccineId: "pcv", note: "3rd dose", dose: 3 },
    { vaccineId: "hepb", note: "3rd dose (if not given at 9m)", dose: 3 },
    { vaccineId: "rotavirus", note: "3rd dose (if RotaTeq)", dose: 3 },
    { vaccineId: "influenza", note: "Annual — 1st dose if never had (+ 2nd dose 4 wks later)", dose: 1 },
    { vaccineId: "covid19", note: "Annual dose recommended", dose: 1 },
  ],
  12: [
    { vaccineId: "hepb", note: "3rd dose (9–18 months)", dose: 3 },
    { vaccineId: "hib", note: "Final dose (12–15 months)", dose: 4 },
    { vaccineId: "pcv", note: "4th dose (12–15 months)", dose: 4 },
    { vaccineId: "mmr", note: "1st dose", dose: 1 },
    { vaccineId: "varicella", note: "1st dose", dose: 1 },
    { vaccineId: "hepa", note: "1st dose (12–23 months)", dose: 1 },
  ],
  18: [
    { vaccineId: "hepa", note: "2nd dose (6–18 months after 1st)", dose: 2 },
    { vaccineId: "dtap", note: "4th dose (15–18 months)", dose: 4 },
  ],
  54: [
    { vaccineId: "dtap", note: "5th dose — pre-K booster", dose: 5 },
    { vaccineId: "mmr", note: "2nd dose", dose: 2 },
    { vaccineId: "varicella", note: "2nd dose", dose: 2 },
    { vaccineId: "ipv", note: "3rd or 4th dose — final", dose: 4 },
  ],
  132: [
    { vaccineId: "dtap", note: "Tdap booster", dose: 6 },
    { vaccineId: "hpv", note: "1st dose (11–12, ideally before 15)", dose: 1 },
    { vaccineId: "menacwy", note: "1st dose (MenACWY)", dose: 1 },
    { vaccineId: "influenza", note: "Annual dose every fall", dose: 1 },
    { vaccineId: "covid19", note: "Annual dose recommended", dose: 1 },
  ],
  192: [
    { vaccineId: "menacwy", note: "Booster dose (16 years)", dose: 2 },
    { vaccineId: "menb", note: "MenB series — shared decision with provider", dose: 1 },
    { vaccineId: "hpv", note: "Complete series if not done", dose: 3 },
    { vaccineId: "influenza", note: "Annual dose every fall", dose: 1 },
  ],
  216: [
    { vaccineId: "influenza", note: "Annual dose for all adults", dose: 1 },
    { vaccineId: "covid19", note: "Annual updated dose recommended", dose: 1 },
    { vaccineId: "hpv", note: "Through age 26 (or shared decision 27–45)", dose: 3 },
    { vaccineId: "zoster", note: "2 doses starting at age 50", dose: 1 },
  ],
};

export default function SchedulePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Vaccine Schedule Builder — VaxFact.net",
    description:
      "Personalized childhood vaccine schedule based on CDC ACIP recommendations.",
    url: "https://vaxfact.net/schedule",
  };

  // Build lookup map for vaccines
  const vaccineMap = Object.fromEntries(VACCINES.map((v) => [v.id, v]));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main style={{ minHeight: "100vh", background: "#060e1e", paddingBottom: 80 }}>
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(180deg, #0a1628 0%, #060e1e 100%)",
            borderBottom: "1px solid #1e293b",
            paddingTop: 48,
            paddingBottom: 48,
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748b" }}>
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#94a3b8" }}>Schedule</span>
            </nav>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 42,
                fontWeight: 900,
                color: "#f8fafc",
                marginBottom: 16,
                lineHeight: 1.1,
              }}
            >
              Vaccine Schedule
            </h1>
            <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 620, lineHeight: 1.7, marginBottom: 24 }}>
              The CDC ACIP recommended immunization schedule — showing which vaccines are
              due at each well-child visit from birth through adulthood. Click any vaccine
              for full evidence details.
            </p>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "Vaccines covered", value: "20", icon: "💉" },
                { label: "Well-child visits", value: "14", icon: "🏥" },
                { label: "Vaccine preventable diseases", value: "25+", icon: "🦠" },
                { label: "Data source", value: "CDC ACIP", icon: "🏛️" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#0d1526",
                    border: "1px solid #1e293b",
                    borderRadius: 10,
                    padding: "12px 18px",
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</div>
                  <div style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 700 }}>
                    {stat.value}
                  </div>
                  <div style={{ color: "#475569", fontSize: 12 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule timeline */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: 15,
                top: 0,
                bottom: 0,
                width: 2,
                background: "linear-gradient(180deg, #3b82f6, #8b5cf6)",
                borderRadius: 2,
              }}
            />

            {AGE_MILESTONES.map((milestone) => {
              const vaccines = SCHEDULE_MAP[milestone.months] ?? [];
              if (vaccines.length === 0) return null;

              return (
                <div
                  key={milestone.months}
                  style={{
                    marginLeft: 44,
                    marginBottom: 36,
                    position: "relative",
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: -37,
                      top: 12,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "#3b82f6",
                      border: "3px solid #060e1e",
                      boxShadow: "0 0 0 2px #3b82f6",
                    }}
                  />

                  {/* Visit header */}
                  <div style={{ marginBottom: 14 }}>
                    <h2
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#f1f5f9",
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {milestone.label}
                    </h2>
                    {milestone.sublabel && (
                      <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>
                        {milestone.sublabel}
                      </div>
                    )}
                    <div
                      style={{
                        display: "inline-block",
                        background: "#1e3a5f",
                        border: "1px solid #1e4a8a",
                        borderRadius: 6,
                        padding: "2px 10px",
                        fontSize: 11,
                        color: "#60a5fa",
                        fontWeight: 600,
                        marginTop: 6,
                      }}
                    >
                      {vaccines.length} vaccine{vaccines.length !== 1 ? "s" : ""} due
                    </div>
                  </div>

                  {/* Vaccines for this visit */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {vaccines.map(({ vaccineId, note, dose }) => {
                      const vaccine = vaccineMap[vaccineId];
                      if (!vaccine) return null;

                      return (
                        <Link
                          key={`${vaccineId}-${note}`}
                          href={`/vaccines/${vaccineId}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            style={{
                              background: "#0d1526",
                              border: "1px solid #1e293b",
                              borderRadius: 10,
                              padding: "12px 14px",
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              transition: "border-color 0.15s, background 0.15s",
                            }}
                            className="schedule-card"
                          >
                            <div
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 10,
                                background: `${vaccine.color}22`,
                                border: `2px solid ${vaccine.color}44`,
                                display: "grid",
                                placeItems: "center",
                                fontSize: 18,
                                flexShrink: 0,
                              }}
                            >
                              {vaccine.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  color: "#e2e8f0",
                                  fontSize: 13,
                                  fontWeight: 700,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {vaccine.name}
                              </div>
                              <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
                                {note}
                              </div>
                            </div>
                            {dose && (
                              <div
                                style={{
                                  background: "#1e293b",
                                  borderRadius: 6,
                                  padding: "2px 8px",
                                  fontSize: 11,
                                  color: "#94a3b8",
                                  fontWeight: 600,
                                  flexShrink: 0,
                                }}
                              >
                                D{dose}
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Catch-up Schedule Section */}
          <div style={{
            marginTop: 48,
            background: "#0d1526",
            border: "1px solid #1e293b",
            borderRadius: 14,
            padding: 28,
          }}>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              fontWeight: 700,
              color: "#f1f5f9",
              marginBottom: 8,
              paddingBottom: 12,
              borderBottom: "1px solid #1e293b",
            }}>
              📋 Catch-Up Schedule Principles
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
              If your child has missed any vaccines, catch-up vaccination is straightforward. The CDC publishes a complete
              catch-up schedule for children 4 months through 18 years. Key principles:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="vf-schedule-grid">
              {[
                {
                  icon: "✅",
                  title: "Start at any age",
                  desc: "Most vaccines can be started at any age — you do not need to restart a series from scratch. Partial series still count.",
                },
                {
                  icon: "⏱",
                  title: "Minimum intervals still apply",
                  desc: "Doses given too close together may not provide full immunity. Your provider will calculate the correct spacing.",
                },
                {
                  icon: "🎯",
                  title: "Prioritize early-risk vaccines",
                  desc: "Pertussis, Hib, and PCV protect infants most during early months. Catch up as quickly as possible for these.",
                },
                {
                  icon: "🔗",
                  title: "Combination vaccines help",
                  desc: "Combination vaccines like Pediarix (HepB+DTaP+IPV) and Pentacel (DTaP+IPV+Hib) can reduce total injections during catch-up.",
                },
              ].map((item) => (
                <div key={item.title} style={{
                  background: "#060e1e",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  padding: 16,
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <a
                href="https://www.cdc.gov/vaccines/schedules/hcp/imz/catchup.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#3b82f6",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                → View full CDC catch-up schedule ↗
              </a>
            </div>
          </div>

          {/* Adult Schedule Section */}
          <div style={{
            marginTop: 28,
            background: "#0d1526",
            border: "1px solid #1e293b",
            borderRadius: 14,
            padding: 28,
          }}>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              fontWeight: 700,
              color: "#f1f5f9",
              marginBottom: 8,
              paddingBottom: 12,
              borderBottom: "1px solid #1e293b",
            }}>
              🧑 Adult Vaccine Schedule
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
              Vaccine protection doesn't stop at childhood. Adults need ongoing boosters and new vaccines as they age.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  vaccine: "Tdap / Td",
                  color: "#f97316",
                  when: "Tdap once (if never received), then Td every 10 years. Tdap each pregnancy (27–36 weeks).",
                  why: "Tetanus immunity wanes; pertussis protection needed to protect newborns.",
                },
                {
                  vaccine: "Influenza",
                  color: "#3b82f6",
                  when: "Every year, ideally September–October before flu season.",
                  why: "Flu strains change annually; prior immunity doesn't fully protect against new strains.",
                },
                {
                  vaccine: "COVID-19",
                  color: "#8b5cf6",
                  when: "Updated booster annually per current CDC guidance.",
                  why: "Protection wanes; updated formulations better match circulating variants.",
                },
                {
                  vaccine: "Shingles (Shingrix)",
                  color: "#ec4899",
                  when: "2 doses at age 50+; 2–6 months apart.",
                  why: "Varicella virus reactivates as shingles in 1/3 of adults. Shingrix is 90%+ effective.",
                },
                {
                  vaccine: "Pneumococcal (PCV20/PPSV23)",
                  color: "#06b6d4",
                  when: "PCV20 once at age 65+ (or earlier for high-risk conditions).",
                  why: "Pneumococcal pneumonia causes ~150,000 hospitalizations/year in US adults.",
                },
                {
                  vaccine: "RSV (Abrysvo/Mresvia)",
                  color: "#10b981",
                  when: "Single dose at age 60+; or during pregnancy (32–36 weeks) to protect newborn.",
                  why: "RSV causes 60,000–160,000 hospitalizations/year in adults 65+.",
                },
                {
                  vaccine: "Hepatitis B",
                  color: "#0ea5e9",
                  when: "3-dose series for all unvaccinated adults; Heplisav-B is a convenient 2-dose adult option.",
                  why: "Many adults were never vaccinated; hepatitis B remains a significant cause of liver cancer.",
                },
              ].map((item) => (
                <div key={item.vaccine} style={{
                  display: "flex",
                  gap: 14,
                  background: "#060e1e",
                  border: "1px solid #1e293b",
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: "0 8px 8px 0",
                  padding: "12px 16px",
                  alignItems: "flex-start",
                }}>
                  <div style={{ minWidth: 120 }}>
                    <span style={{ color: item.color, fontSize: 14, fontWeight: 700 }}>{item.vaccine}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{item.when}</div>
                    <div style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{item.why}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <a
                href="https://www.cdc.gov/vaccines/schedules/hcp/imz/adult.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
              >
                → View full CDC adult immunization schedule ↗
              </a>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                background: "#0d1f0d",
                border: "1px solid #065f46",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <p style={{ color: "#86efac", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                <strong>Source:</strong> This schedule is based on the{" "}
                <a
                  href="https://www.cdc.gov/vaccines/schedules/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#34d399" }}
                >
                  CDC ACIP Recommended Immunization Schedule
                </a>
                . It is simplified for clarity — always consult your healthcare provider for
                your child's specific schedule. Some vaccines may have alternate timing
                or catch-up schedules.
              </p>
            </div>
            <div
              style={{
                background: "#0a0000",
                border: "1px solid #7f1d1d",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <p style={{ color: "#fca5a5", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                <strong>Not medical advice.</strong> VaxFact.net provides educational
                information only. Discuss your child's specific vaccine schedule with
                your pediatrician.
              </p>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .schedule-card:hover {
          border-color: #3b82f6 !important;
          background: #0f1f3d !important;
        }
      `}</style>

      <SiteFooter />
    </>
  );
}