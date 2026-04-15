import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "What Parents Actually Ask About Vaccines — Honest Answers | VaxFact.net",
  description:
    "Real questions parents ask about vaccine safety, schedules, ingredients, and side effects — answered honestly with evidence. No dismissiveness, no spin.",
  alternates: { canonical: "https://vaxfact.net/articles/what-parents-ask" },
  openGraph: {
    title: "What Parents Actually Ask About Vaccines — VaxFact.net",
    description:
      "Honest, evidence-based answers to the real questions parents have about vaccine safety, ingredients, schedules, and side effects.",
    url: "https://vaxfact.net/articles/what-parents-ask",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Parents Actually Ask About Vaccines — Honest Answers",
  description:
    "Real questions parents ask about vaccine safety, schedules, ingredients, and side effects — answered honestly with evidence.",
  url: "https://vaxfact.net/articles/what-parents-ask",
  datePublished: "2025-01-01",
  dateModified: "2025-01-01",
  publisher: {
    "@type": "Organization",
    name: "VaxFact.net",
    url: "https://vaxfact.net",
  },
  author: {
    "@type": "Organization",
    name: "VaxFact.net Editorial Team",
  },
};

interface Section {
  anchor: string;
  question: string;
  shortAnswer: string;
  body: string[];
  relatedVaccines?: { id: string; name: string }[];
  relatedLinks?: { href: string; label: string }[];
}

const SECTIONS: Section[] = [
  {
    anchor: "too-many-too-soon",
    question: "Are we giving babies too many vaccines too soon?",
    shortAnswer: "No — the schedule is timed to protect babies during their most vulnerable window, not overwhelm them.",
    body: [
      "This is the single most common concern pediatricians hear from new parents, and it deserves a real answer rather than dismissal. The US childhood vaccine schedule currently recommends up to 14 vaccines during the first two years of life, with multiple vaccines often given at the same visit. For a new parent watching their tiny infant receive 3 or 4 injections at the 2-month appointment, the question is completely understandable.",
      "Here's what the evidence shows: A baby's immune system is extraordinarily capable from birth. Infants encounter thousands of new antigens (foreign substances that trigger immune responses) every single day — from the air they breathe, the surfaces they touch, the breast milk or formula they drink, and the microorganisms that colonize their gut. The total number of antigens in the entire childhood vaccine series is a tiny fraction of what the immune system routinely processes.",
      "The timing of vaccines is deliberate and evidence-based. Pertussis (whooping cough) is most deadly in infants under 3 months old — that's why the first DTaP dose is given at 2 months. Hib meningitis strikes most often in babies 6–12 months old. Hepatitis B can be transmitted at birth. Delaying any of these vaccines doesn't make them safer — it creates a period of vulnerability precisely when the risk is highest.",
      "Studies examining children who received vaccines on the recommended schedule versus delayed or alternative schedules have found no benefit to spacing out vaccines. A 2020 study of 326,000+ children published in Academic Pediatrics found no difference in neurodevelopmental outcomes between on-schedule and delayed vaccination. The alternative schedules promoted by some physicians (like the 'Sears schedule') have no evidence base for safety benefit and carry documented risk from the protection gaps they create.",
      "The immune system analogy that resonates with many parents: on the day your 2-month-old receives 4 vaccines, they're also drinking breast milk containing billions of bacteria, touching multiple surfaces, and inhaling air filled with environmental antigens. The vaccines represent a tiny addition to what the immune system is already processing continuously.",
    ],
    relatedVaccines: [
      { id: "dtap", name: "DTaP" },
      { id: "hib", name: "Hib" },
      { id: "hepb", name: "Hepatitis B" },
    ],
    relatedLinks: [{ href: "/faq#vaccine-decision", label: "FAQ: Can babies get too many vaccines at once?" }],
  },
  {
    anchor: "ingredients",
    question: "What's actually in vaccines — should I be worried about the ingredients?",
    shortAnswer: "Vaccines contain small amounts of several types of ingredients, all at doses far below harmful levels.",
    body: [
      "Vaccine ingredient concerns are legitimate and deserve honest engagement rather than 'don't worry about it.' Let's go through the main ingredients parents ask about.",
      "Aluminum salts (adjuvants): Used in many vaccines to boost immune response. The amount per dose is typically 125–625 micrograms. Comparison: A breastfed baby receives about 7,000 micrograms of aluminum from breast milk in the first 6 months. Adults absorb roughly 7–9 milligrams of aluminum from food daily. The aluminum in vaccines is aluminum phosphate or hydroxide — forms that behave pharmacokinetically differently from environmental aluminum exposure, are cleared through urine, and don't accumulate. Large studies including a 2020 analysis of 326,000 Danish children have found no association between vaccine aluminum and neurodevelopmental outcomes.",
      "Formaldehyde: Used during manufacturing to inactivate viruses or bacterial toxins. Residual amounts after purification are typically less than 0.1 mg per dose. Your body naturally contains 1–2 mg of formaldehyde per liter of blood as a metabolic byproduct — meaning a newborn has roughly 50–70 times more formaldehyde circulating in their bloodstream at any given moment than is in any vaccine.",
      "Thimerosal (ethylmercury): Removed from all routine childhood vaccines in 2001 as a precautionary measure. Some multi-dose flu vaccine vials still contain trace amounts as a preservative; thimerosal-free alternatives are widely available. The concern arose from confusion with methylmercury (the toxic bioaccumulative form in fish) — ethylmercury is processed and cleared much more rapidly by the body.",
      "Polysorbate 80, gelatin, yeast proteins: Stabilizers and manufacturing residuals present in tiny amounts. Concerns about these ingredients occasionally circulate online, but there is no credible evidence of harm at vaccine doses.",
      "The key principle is dose-response: virtually any substance is harmful at high enough doses and safe at low enough doses. The relevant question is not 'is this ingredient present' but 'is it present at a dose that causes harm?' For all ingredients in currently approved vaccines, the answer from decades of surveillance data is no.",
    ],
    relatedLinks: [
      { href: "/faq#ingredients", label: "FAQ: Are there ingredients in vaccines I should be concerned about?" },
      { href: "/about#evidence", label: "Our Evidence Standards" },
    ],
  },
  {
    anchor: "natural-immunity",
    question: "Isn't natural immunity better than vaccine immunity?",
    shortAnswer: "Sometimes — but the cost of acquiring natural immunity is getting the disease, which can be severe or fatal.",
    body: [
      "This question reflects genuinely sophisticated immunological thinking, and the honest answer is nuanced. In some cases, natural infection does produce broader or more durable immunity than vaccination — this is a real scientific observation, not misinformation. The question is whether the immunity benefit is worth the cost of getting the disease.",
      "For measles, natural infection produces lifelong immunity and the antibody response involves a broader range of viral epitopes than the MMR vaccine. However, measles in children causes immune amnesia — the virus destroys memory B cells that protect against other infections, leaving children vulnerable to opportunistic diseases for 2–3 years after infection. Natural measles immunity comes at the cost of significant disease risk (1 in 1,000 US children who got measles developed encephalitis; 1–2 in 1,000 died) plus this immune suppression effect that can increase mortality from unrelated infections for years afterward.",
      "For chickenpox (varicella), natural infection also produces longer-lasting immunity than the 2-dose vaccine series. However, it also establishes latent herpes zoster virus in nerve cells that can reactivate as shingles decades later. The varicella vaccine doesn't eliminate this risk entirely, but it reduces the viral load established during initial infection and thus reduces shingles risk.",
      "For COVID-19, multiple studies have found that hybrid immunity (vaccination after natural infection) produces the strongest and most durable immune responses — stronger than either natural infection or vaccination alone. This is consistent evidence that the two types of immunity are not mutually exclusive and can be complementary.",
      "The core framework for evaluating natural vs. vaccine immunity: (1) How severe is the disease in the population you're considering? (2) How durable is natural immunity vs. vaccine immunity for this specific pathogen? (3) What are the downstream consequences of natural infection beyond the acute illness? For most vaccine-preventable diseases, the risk of natural infection — including rare but real serious complications — outweighs the incremental immunity benefit over vaccination.",
    ],
    relatedVaccines: [
      { id: "mmr", name: "MMR" },
      { id: "varicella", name: "Varicella" },
      { id: "covid19", name: "COVID-19" },
    ],
  },
  {
    anchor: "side-effects",
    question: "My baby was really upset after their vaccines — is that normal?",
    shortAnswer: "Yes, and it's actually a sign that the immune system is responding correctly.",
    body: [
      "Fussiness, crying, mild fever, and soreness at the injection site are the most common reactions to vaccines in infants, and they reflect the immune system doing exactly what it's supposed to do. When a vaccine introduces antigens, the immune system mounts an inflammatory response — producing cytokines (signaling proteins) that cause fever and malaise as part of activating the adaptive immune response that will produce lasting protection.",
      "What's typical: Mild fever (usually under 101°F/38.3°C), fussiness or prolonged crying for a few hours, reduced appetite, and soreness/redness at the injection site. These typically resolve within 24–48 hours. Ibuprofen or acetaminophen can be used to manage discomfort (check with your pediatrician for appropriate doses and timing — pre-medicating before vaccination is generally not recommended as it may reduce immune response).",
      "What's less common but still observed: Hypotonic-hyporesponsive episodes (HHE) — where a baby briefly becomes limp, pale, and unresponsive — occur in roughly 57 per 100,000 DTaP doses. These are alarming to witness but are self-resolving with no long-term consequences identified in follow-up studies. Febrile seizures occur in about 6 per 100,000 DTaP doses and are associated with the fever response rather than direct neurological toxicity — they're distressing but generally benign.",
      "When to seek medical attention immediately: High fever over 104°F (40°C), seizure, difficulty breathing, hives or swelling of the face/throat (signs of anaphylaxis), or inconsolable crying lasting more than 3 hours. Anaphylaxis — while very rare at about 1–2 per million doses — is why medical facilities maintain a 15-minute observation period after vaccination and keep epinephrine available.",
      "A note on the temporal fallacy: Because babies receive vaccines on a schedule that overlaps with the age of onset for various developmental conditions and illnesses, it's natural to associate timing with causation. A baby who develops an ear infection two days after vaccination got the ear infection from a pathogen — not the vaccine. Multiple large studies using 'self-controlled case series' designs have specifically addressed this issue, finding no excess risk of serious adverse events in the days following vaccination compared to unexposed periods.",
    ],
    relatedVaccines: [
      { id: "dtap", name: "DTaP" },
      { id: "mmr", name: "MMR" },
      { id: "pcv", name: "PCV (Pneumococcal)" },
    ],
    relatedLinks: [{ href: "/faq#side-effects", label: "FAQ: Most common vaccine side effects" }],
  },
  {
    anchor: "schedule-delay",
    question: "What actually happens if I delay or skip vaccines?",
    shortAnswer: "Your child is unprotected against serious diseases during the gap — sometimes during their highest-risk window.",
    body: [
      "This is a question that deserves a direct, honest answer rather than a lecture. Here's what the evidence shows about specific diseases and what delaying protection means in practice.",
      "Pertussis (whooping cough): The disease is most dangerous — and most often fatal — in infants under 3 months old, before the vaccine series has even begun. That's why the first DTaP dose is given at 2 months. Delaying to 4 or 6 months extends the unprotected window. In a 2013 study of 682 US infants hospitalized for pertussis, 90% were unvaccinated or under-vaccinated. The US currently reports 10,000–50,000 pertussis cases per year.",
      "Hib meningitis: Before the Hib vaccine, Haemophilus influenzae type b was the leading cause of bacterial meningitis in children under 5 in the US — causing approximately 20,000 cases and 1,000 deaths per year. Peak incidence was in children 6–12 months old. Delaying Hib vaccination means being unprotected precisely during this peak risk period.",
      "Measles: Measles circulates globally and can arrive in any community via international travel. Unvaccinated children are susceptible to measles throughout their childhood. The 2019 US measles outbreak — the largest since 1992 with 1,282 cases — was traced primarily to unvaccinated communities in New York and Washington state. Measles is not a mild disease: approximately 30% of cases develop complications including pneumonia, encephalitis, and (rarely) subacute sclerosing panencephalitis, a fatal brain disease that develops years after infection.",
      "The argument for delay (as sometimes made): Some physicians argue that older babies and children have more mature immune systems and may need fewer vaccine doses to achieve protection, or that the risk of some diseases is genuinely low in infancy in low-exposure settings. There is partial truth here — age at vaccination does affect immune response for some vaccines. But the recommended schedule is designed to balance timing of immunity acquisition with timing of peak disease risk. For the most dangerous early-childhood diseases, those risks peak in infancy, making early vaccination essential.",
      "The catch-up schedule: If your child has missed vaccines, there is a well-established catch-up schedule. Most vaccines can be started at any age and completed on a modified timeline. Partial vaccination still provides meaningful protection for completed doses. If you've delayed, discuss catch-up options with your pediatrician — it's never too late to start.",
    ],
    relatedLinks: [
      { href: "/schedule", label: "View the Vaccination Schedule" },
      { href: "/faq#catch-up", label: "FAQ: What to do if my child missed vaccines" },
    ],
  },
  {
    anchor: "do-your-own-research",
    question: "How do I actually 'do my own research' on vaccines?",
    shortAnswer: "Use primary sources, understand study quality, and distinguish between scientific debate and misinformation.",
    body: [
      "'Do your own research' has become a fraught phrase in vaccine discussions — often used to mean 'read things that confirm your doubts.' But legitimate research literacy is a genuine skill that leads most people who apply it carefully to greater confidence in vaccines, not less.",
      "Start with the right questions: Instead of asking 'Is this vaccine dangerous?' (which frames everything toward seeking danger) ask: 'What does the best available evidence say about the risks of this vaccine compared to the risks of the disease?' This is the question that epidemiologists, public health researchers, and pediatricians actually use.",
      "Understand study quality: Not all studies are equal. A single case report of an adverse event after vaccination is not evidence that the vaccine caused it. A small study with no control group is much weaker evidence than a large randomized controlled trial or a Cochrane systematic review. When evaluating claims, ask: How many people were studied? Was there a control group? Has it been replicated? Is it published in a peer-reviewed journal with an impact factor, or on a website with no editorial oversight?",
      "Find primary sources: PubMed (pubmed.ncbi.nlm.nih.gov) provides free access to abstracts of virtually every peer-reviewed study ever published on vaccines. The CDC, WHO, and European Medicines Agency all publish their evidence reviews publicly. The Cochrane Library publishes systematic reviews that synthesize evidence across multiple studies. VaxFact links to primary sources for every vaccine in our database.",
      "Recognize credible critique vs. misinformation: Legitimate scientific debate about vaccines exists and is important — questions about optimal schedules, waning immunity, rare adverse events, and risk stratification are actively researched. What separates credible critique from misinformation: credible critiques are published in peer-reviewed journals, acknowledged by the scientific community as open questions, and argued by researchers with relevant credentials. Claims that vaccines cause autism, that vaccine manufacturers fraudulently hide data across all global health agencies simultaneously, or that vaccines contain microchips are not credible scientific positions.",
      "VaxFact's approach: Every vaccine page includes a 'What Researchers Question' section that documents legitimate scientific debates — not misinformation, but genuine open questions in the literature. We believe that acknowledging what is uncertain strengthens trust, and that parents who understand the difference between scientific uncertainty and manufactured doubt make better decisions.",
    ],
    relatedLinks: [
      { href: "/about#evidence", label: "VaxFact's Evidence Standards" },
      { href: "/about#data-sources", label: "Our Data Sources" },
      { href: "/faq", label: "Full FAQ" },
    ],
  },
];

export default function WhatParentsAskPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main style={{ minHeight: "100vh", background: "#060e1e", paddingBottom: 80 }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(180deg, #0a1628 0%, #060e1e 100%)",
          borderBottom: "1px solid #1e293b",
          paddingTop: 48,
          paddingBottom: 48,
          paddingLeft: 24,
          paddingRight: 24,
        }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748b" }}>
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#94a3b8" }}>Articles</span>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#94a3b8" }}>What Parents Actually Ask</span>
            </nav>
            <div style={{
              display: "inline-block",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 12,
              color: "#34d399",
              marginBottom: 16,
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}>
              📖 EVIDENCE-BASED ARTICLE
            </div>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(26px, 5vw, 44px)",
              fontWeight: 900,
              color: "#f8fafc",
              marginBottom: 20,
              lineHeight: 1.15,
            }}>
              What Parents Actually Ask About Vaccines
            </h1>
            <p style={{
              fontSize: 18,
              color: "#94a3b8",
              lineHeight: 1.75,
              marginBottom: 24,
            }}>
              Honest, evidence-based answers to the real questions parents have — no dismissiveness, no spin.
              We answer what you're actually wondering, with citations.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "#64748b" }}>
              <span>📅 Updated 2025</span>
              <span>⏱ 15 min read</span>
              <span>📚 Sources: CDC, WHO, Cochrane, PubMed</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px" }}>

          {/* Table of contents */}
          <div style={{
            background: "#0d1526",
            border: "1px solid #1e293b",
            borderRadius: 12,
            padding: 24,
            margin: "32px 0",
          }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 12, letterSpacing: "0.05em" }}>
              TABLE OF CONTENTS
            </div>
            {SECTIONS.map((s, i) => (
              <a
                key={s.anchor}
                href={`#${s.anchor}`}
                style={{
                  display: "block",
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontSize: 14,
                  padding: "6px 0",
                  borderBottom: i < SECTIONS.length - 1 ? "1px solid #1e293b" : "none",
                  lineHeight: 1.4,
                }}
              >
                {i + 1}. {s.question}
              </a>
            ))}
          </div>

          {/* Sections */}
          {SECTIONS.map((s) => (
            <article
              key={s.anchor}
              id={s.anchor}
              style={{
                marginBottom: 48,
                scrollMarginTop: 80,
              }}
            >
              <h2 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(20px, 3.5vw, 28px)",
                fontWeight: 800,
                color: "#f1f5f9",
                marginBottom: 16,
                lineHeight: 1.2,
              }}>
                {s.question}
              </h2>

              {/* Short answer callout */}
              <div style={{
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderLeft: "3px solid #10b981",
                borderRadius: "0 8px 8px 0",
                padding: "12px 16px",
                marginBottom: 24,
              }}>
                <span style={{ color: "#34d399", fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>
                  SHORT ANSWER
                </span>
                <p style={{ color: "#a7f3d0", fontSize: 15, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {s.shortAnswer}
                </p>
              </div>

              {/* Body paragraphs */}
              {s.body.map((para, i) => (
                <p
                  key={i}
                  style={{
                    color: "#94a3b8",
                    fontSize: 15,
                    lineHeight: 1.85,
                    marginBottom: 18,
                  }}
                >
                  {para}
                </p>
              ))}

              {/* Related vaccines */}
              {s.relatedVaccines && s.relatedVaccines.length > 0 && (
                <div style={{ marginTop: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 10, letterSpacing: "0.04em" }}>
                    RELATED VACCINE PROFILES
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {s.relatedVaccines.map((vax) => (
                      <Link
                        key={vax.id}
                        href={`/vaccines/${vax.id}`}
                        style={{
                          background: "rgba(99,102,241,0.1)",
                          border: "1px solid rgba(99,102,241,0.25)",
                          color: "#818cf8",
                          borderRadius: 6,
                          padding: "5px 12px",
                          fontSize: 13,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        💉 {vax.name} →
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related links */}
              {s.relatedLinks && s.relatedLinks.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 8, letterSpacing: "0.04em" }}>
                    SEE ALSO
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {s.relatedLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        style={{
                          color: "#3b82f6",
                          fontSize: 13,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        → {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <hr style={{ border: "none", borderTop: "1px solid #1e293b", marginTop: 32 }} />
            </article>
          ))}

          {/* CTA */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 16,
            padding: 32,
            textAlign: "center",
            marginBottom: 40,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💉</div>
            <h3 style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              fontWeight: 700,
              color: "#f1f5f9",
              marginBottom: 12,
            }}>
              See Personalized Benefit-Risk Scores
            </h3>
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              Enter your child's age, daycare status, travel plans, and community vaccination rates
              to see evidence-based benefit-risk scores tailored to your situation.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Score My Vaccines →
            </Link>
          </div>

          {/* Medical disclaimer */}
          <div style={{
            background: "#0a0000",
            border: "1px solid #7f1d1d",
            borderRadius: 10,
            padding: 20,
            marginBottom: 40,
          }}>
            <p style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              <strong>Medical Disclaimer:</strong> This article provides educational information only and does not constitute medical advice.
              Vaccine decisions should be made in consultation with a licensed healthcare provider familiar with your child's individual health history.
              All data sourced from CDC, WHO, Cochrane Reviews, and peer-reviewed literature — see our{" "}
              <Link href="/about#data-sources" style={{ color: "#f87171" }}>data sources</Link>.
            </p>
          </div>

        </div>
      </main>
      <SiteFooter />
    </>
  );
}