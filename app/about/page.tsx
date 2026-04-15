import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About & Methodology — How VaxFact.net Scores Vaccines",
  description:
    "Learn how VaxFact.net calculates evidence-based vaccine benefit-risk scores. Our transparent methodology uses peer-reviewed data, CDC/WHO surveillance, and a multi-factor scoring model.",
  alternates: { canonical: "https://vaxfact.net/about" },
  openGraph: {
    title: "About & Methodology — VaxFact.net",
    description:
      "Transparent evidence scoring methodology for vaccine benefit-risk analysis.",
    url: "https://vaxfact.net/about",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About & Methodology — VaxFact.net",
  description:
    "How VaxFact.net calculates evidence-based vaccine benefit-risk scores using peer-reviewed data.",
  url: "https://vaxfact.net/about",
  publisher: {
    "@type": "Organization",
    name: "VaxFact.net",
    url: "https://vaxfact.net",
  },
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        background: "#0d1526",
        border: "1px solid #1e293b",
        borderRadius: 12,
        padding: 32,
        marginBottom: 24,
        scrollMarginTop: 80,
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          fontWeight: 700,
          color: "#f1f5f9",
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "1px solid #1e293b",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
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
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
            <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748b" }}>
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#94a3b8" }}>About</span>
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
              About & Methodology
            </h1>
            <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 620, lineHeight: 1.7 }}>
              VaxFact.net uses a transparent, evidence-based scoring model to help parents and
              patients understand vaccine benefit-risk tradeoffs. Here's exactly how it works.
            </p>
          </div>
        </div>

        {/* Quick nav */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 0" }}>
          <div
            style={{
              background: "#0d1526",
              border: "1px solid #1e293b",
              borderRadius: 10,
              padding: "16px 20px",
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            {[
              { href: "#mission", label: "Mission" },
              { href: "#scoring", label: "Scoring Model" },
              { href: "#evidence", label: "Evidence Standards" },
              { href: "#data-sources", label: "Data Sources" },
              { href: "#limitations", label: "Limitations" },
              { href: "#disclaimer", label: "Medical Disclaimer" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                style={{ color: "#3b82f6", fontSize: 14, textDecoration: "none" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <Section id="mission" title="🎯 Our Mission">
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
              VaxFact.net was built on a simple premise: vaccine decisions deserve the same
              rigorous, transparent analysis that financial or medical professionals apply to
              other important choices. Parents shouldn't have to choose between uncritical
              acceptance and unfounded fear.
            </p>
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
              We present population-level evidence — the same data that public health agencies,
              pediatricians, and researchers use — organized in a way that helps individuals
              understand both the benefits and the real (if often tiny) risks of each vaccine.
            </p>
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.8 }}>
              We are <strong style={{ color: "#f1f5f9" }}>pro-science and pro-transparency</strong>.
              That means acknowledging genuine scientific uncertainties and credible debates,
              not hiding them. True informed consent requires honest information.
            </p>
          </Section>

          <Section id="scoring" title="📊 The Scoring Model">
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
              Each vaccine receives six computed scores on a 0–100 scale. The final
              &ldquo;Net Benefit&rdquo; score is a function of all six dimensions, weighted
              by your personalized scenario inputs.
            </p>

            {[
              {
                name: "Exposure Risk",
                color: "#3b82f6",
                formula: "Base rate × Age factor × Scenario multipliers × Community coverage factor",
                desc: "How likely is it that your child will encounter the pathogen? This accounts for daycare, travel, outbreak status, community vaccination rates, and age-specific vulnerability.",
              },
              {
                name: "Disease Consequence",
                color: "#ef4444",
                formula: "Σ(outcome probability × severity weight)",
                desc: "How severe is the disease if acquired? We weight mortality, ICU admission, hospitalization, chronic sequelae, and quality-of-life loss using validated severity weights from the project's evidence model.",
              },
              {
                name: "Vaccine Benefit",
                color: "#10b981",
                formula: "Weighted VE × Disease Consequence",
                desc: "How much does the vaccine reduce disease harm? Combines effectiveness against severe disease (50% weight), death (30%), and infection (20%).",
              },
              {
                name: "Vaccine Harm",
                color: "#f59e0b",
                formula: "Σ(AE probability × severity weight) + Uncertainty penalty",
                desc: "The risk from the vaccine itself. Sums all adverse events weighted by severity and probability, plus a penalty for evidence uncertainty.",
              },
              {
                name: "Evidence Confidence",
                color: "#8b5cf6",
                formula: "Composite of study quality, sample size, replication, and consensus",
                desc: "How certain is the evidence? Reflects years of study, trial quality, sample sizes, independent replication, and expert consensus.",
              },
              {
                name: "Net Benefit",
                color: "#e2e8f0",
                formula: "(Exposure Risk × Disease Consequence × Vaccine Benefit) / 10,000 − Vaccine Harm + 50",
                desc: "The final score. Combines all dimensions into a single 0–100 number. Scores 75+ = strong recommendation; 55–74 = moderate; 35–54 = consider; <35 = discuss with provider.",
              },
            ].map((item) => (
              <div
                key={item.name}
                style={{
                  background: "#060e1e",
                  border: "1px solid #1e293b",
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                  <h3 style={{ color: item.color, fontSize: 15, fontWeight: 700, margin: 0 }}>
                    {item.name}
                  </h3>
                  <code
                    style={{
                      background: "#0d1526",
                      border: "1px solid #1e293b",
                      borderRadius: 6,
                      padding: "3px 8px",
                      fontSize: 11,
                      color: "#64748b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.formula}
                  </code>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </Section>

          <Section id="evidence" title="🔬 Evidence Standards">
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
              We use a hierarchical evidence model. Studies are categorized by type and
              weighted by confidence level:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { type: "RCTs / Meta-analyses", confidence: "High", color: "#10b981", desc: "Randomized controlled trials and systematic reviews of multiple RCTs receive the highest confidence weight." },
                { type: "Cohort Studies", confidence: "Moderate–High", color: "#3b82f6", desc: "Large prospective cohort studies from CDC, WHO, and Vaccine Safety Datalink are used extensively." },
                { type: "Surveillance Data", confidence: "Moderate", color: "#f59e0b", desc: "VAERS and passive surveillance data are used for adverse event rates but are adjusted for underreporting bias." },
                { type: "Reviews / Expert Panels", confidence: "Moderate", color: "#8b5cf6", desc: "ACIP, WHO SAGE, and GACVS advisory panel decisions are incorporated as consensus evidence." },
              ].map((item) => (
                <div
                  key={item.type}
                  style={{
                    background: "#060e1e",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <div style={{ color: item.color, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                    {item.type}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: `${item.color}22`,
                      color: item.color,
                      display: "inline-block",
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    {item.confidence} Confidence
                  </div>
                  <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "#0d1f0d",
                border: "1px solid #065f46",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <p style={{ color: "#86efac", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                <strong>Credible Critiques vs. Misinformation:</strong> We distinguish between
                legitimate scientific debates (published in peer-reviewed journals, debated by
                credentialed researchers) and misinformation (unsupported by credible evidence).
                Only the former appears in our &ldquo;What Researchers Question&rdquo; sections.
              </p>
            </div>
          </Section>

          <Section id="data-sources" title="📂 Data Sources">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "CDC ACIP Recommendations", url: "https://www.cdc.gov/vaccines/acip/", desc: "Primary source for US vaccination schedule and recommendations" },
                { name: "WHO Immunization Data", url: "https://www.who.int/immunization/", desc: "Global vaccination coverage, disease burden, and policy data" },
                { name: "Vaccine Safety Datalink (VSD)", url: "https://www.cdc.gov/vaccinesafety/ensuringsafety/monitoring/vsd/", desc: "Large-scale US safety surveillance database" },
                { name: "VAERS (Vaccine Adverse Event Reporting System)", url: "https://vaers.hhs.gov/", desc: "Passive US adverse event surveillance (adjusted for underreporting)" },
                { name: "Cochrane Reviews", url: "https://www.cochranelibrary.com/", desc: "Independent systematic reviews of vaccine evidence" },
                { name: "PubMed / MEDLINE", url: "https://pubmed.ncbi.nlm.nih.gov/", desc: "Peer-reviewed journal citations for individual vaccine data" },
                { name: "Brighton Collaboration", url: "https://brightoncollaboration.us/", desc: "Standardized adverse event definitions used in our severity scoring" },
              ].map((src) => (
                <div
                  key={src.name}
                  style={{
                    background: "#060e1e",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3b82f6", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
                    >
                      {src.name} ↗
                    </a>
                    <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>{src.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="limitations" title="⚠️ Limitations">
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
              VaxFact.net is an educational tool with important limitations you should understand:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Scores are based on population-level data and may not reflect your child's individual health conditions.",
                "Disease incidence figures represent US averages and may differ significantly in other countries or regions with active outbreaks.",
                "Adverse event probabilities are estimates from surveillance systems that have known underreporting and attribution challenges.",
                "Evidence changes over time — we update data periodically but cannot guarantee real-time accuracy.",
                "The scoring model involves judgment calls in weighting different health outcomes. Reasonable experts may weigh them differently.",
                "We do not account for all possible contraindications, drug interactions, or special medical circumstances.",
              ].map((limitation, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    background: "#060e1e",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    padding: "12px 16px",
                  }}
                >
                  <span style={{ color: "#f59e0b", fontSize: 16, flexShrink: 0 }}>⚠</span>
                  <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                    {limitation}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="disclaimer" title="⚕️ Medical Disclaimer">
            <div
              style={{
                background: "#0a0000",
                border: "1px solid #7f1d1d",
                borderRadius: 10,
                padding: 24,
              }}
            >
              <p style={{ color: "#fca5a5", fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                <strong>VaxFact.net provides educational information only. This is NOT
                medical advice.</strong> All vaccine decisions should be made in consultation
                with a licensed healthcare provider who is familiar with your individual
                health history, your child's specific medical conditions, and current
                local epidemiology. Never delay or forgo vaccination based solely on
                information from this website. The content on VaxFact.net is for
                informational purposes and does not replace a physician-patient relationship.
              </p>
            </div>
          </Section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}