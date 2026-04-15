import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Vaccine FAQ — Common Questions About Vaccine Safety & Schedules",
  description:
    "Answers to the most common vaccine questions: Are vaccines safe? What are the real side effects? What does the schedule mean? How do I read benefit-risk scores? Evidence-based answers.",
  alternates: { canonical: "https://vaxfact.net/faq" },
  openGraph: {
    title: "Vaccine FAQ — VaxFact.net",
    description:
      "Evidence-based answers to the most common questions about vaccine safety, schedules, and benefit-risk tradeoffs.",
    url: "https://vaxfact.net/faq",
  },
};

const FAQS = [
  {
    category: "Understanding Vaccine Safety",
    questions: [
      {
        q: "Are vaccines safe?",
        a: "The short answer is: yes, for the vast majority of people, recommended vaccines are safe. All vaccines go through rigorous clinical trials before approval and are monitored continuously after release via systems like VAERS and the Vaccine Safety Datalink. Serious adverse events occur but are rare — often less than 1 per million doses. The more complete answer is that 'safe' is relative: vaccines carry small risks, but these must be compared to the risks of the diseases they prevent, which are typically far larger.",
      },
      {
        q: "Do vaccines cause autism?",
        a: "No. This has been one of the most thoroughly investigated questions in vaccine science. Multiple large studies involving millions of children — including a 2019 Danish cohort study of 650,000 children and multiple Cochrane systematic reviews — have found no link between the MMR vaccine (or any vaccine) and autism. The original 1998 study claiming a link was retracted due to fraud and data manipulation. Major health agencies worldwide agree: vaccines do not cause autism.",
      },
      {
        q: "What are the most common vaccine side effects?",
        a: "Most vaccine side effects are mild and temporary: soreness or redness at the injection site, low-grade fever, and fatigue. These are signs the immune system is responding and typically resolve within 1–3 days. Serious adverse events — such as allergic reactions (anaphylaxis) — are rare, occurring in roughly 1–2 per million doses. Medical facilities that administer vaccines are equipped to handle immediate reactions, which is why a brief observation period is recommended after vaccination.",
      },
      {
        q: "How long have vaccines been studied?",
        a: "It depends on the vaccine. Older vaccines like the smallpox vaccine have over 200 years of use. Routine childhood vaccines like DTaP, MMR, and Hepatitis B have 30–55 years of post-licensure surveillance data covering hundreds of millions to billions of doses. Newer vaccines like COVID-19 mRNA vaccines have shorter post-market history (since 2020) but were built on mRNA technology studied for over 30 years. Each vaccine's evidence longevity is reflected in VaxFact's 'Years of Study' score.",
      },
      {
        q: "Are there ingredients in vaccines I should be concerned about?",
        a: "Vaccines contain small amounts of various ingredients — adjuvants (to boost immune response), preservatives, stabilizers, and residual manufacturing materials. The amounts of any potentially concerning substance (like aluminum salts or formaldehyde) are far below levels considered harmful. For example, babies naturally produce more formaldehyde in their metabolism than is contained in any vaccine. Parents with specific ingredient concerns should review the package insert for each vaccine and discuss with their pediatrician.",
      },
    ],
  },
  {
    category: "Understanding VaxFact Scores",
    questions: [
      {
        q: "What does the 'Net Benefit' score mean?",
        a: "The Net Benefit score (0–100) combines five factors: how likely your child is to be exposed to the disease (Exposure Risk), how severe the disease is (Disease Consequence), how much the vaccine prevents harm (Vaccine Benefit), the risk from the vaccine itself (Vaccine Harm), and the quality of the evidence (Evidence Confidence). A score of 75+ indicates strong evidence that benefits substantially outweigh risks. 55–74 is moderate support. 35–54 suggests weighing carefully. Below 35 suggests a detailed conversation with your provider.",
      },
      {
        q: "Why do scores change when I change my scenario?",
        a: "Because the benefit-risk calculation depends on your specific situation. A child in daycare has higher exposure risk for respiratory diseases than a home-based child. A family traveling internationally has different disease risks than one staying local. A child in a community with low vaccination rates faces higher disease exposure than one in a highly vaccinated community. These real-world factors change the math — and VaxFact's scenario inputs let you see how.",
      },
      {
        q: "Why does VaxFact show 'credible critiques' of some vaccines?",
        a: "Because honest science includes honest disagreement. For some vaccines, there are legitimate published debates among credentialed researchers — about optimal timing, population-specific risk-benefit ratios, or long-term immunity questions. We include these not to cast doubt, but because informed consent requires knowing what's debated. We carefully distinguish between credible scientific critique (backed by peer-reviewed research) and unfounded misinformation (which we do not platform).",
      },
      {
        q: "How does the tool handle uncertainty?",
        a: "Evidence Confidence is a standalone score dimension. Vaccines with shorter post-market history, fewer large RCTs, or active scientific debate receive lower confidence scores, which feed into a higher 'uncertainty penalty' in the Vaccine Harm calculation. This means newer or less-studied vaccines naturally score more cautiously — which reflects the honest state of the evidence.",
      },
    ],
  },
  {
    category: "Vaccine Schedule Questions",
    questions: [
      {
        q: "Why do babies get so many vaccines so early?",
        a: "The early childhood vaccine schedule is designed to protect babies when they are most vulnerable — before their immune systems have matured and before they've had the chance to be exposed to dangerous pathogens. The timing of each vaccine is specifically chosen based on the age at which the risk of disease is highest and the age at which the immune response to the vaccine is most effective. Multiple vaccines can be given simultaneously because the immune system can easily handle the antigen load.",
      },
      {
        q: "Can I delay or spread out the vaccine schedule?",
        a: "Some parents consider alternative schedules. The medical consensus from the CDC, AAP, and WHO is that the standard schedule is optimized for maximum protection when children are most vulnerable. Delaying vaccines leaves children unprotected during high-risk periods. That said, catch-up schedules exist for children who start vaccines later, and your pediatrician can work with you on timing questions. VaxFact's 'Age' input lets you see how exposure risk changes at different ages.",
      },
      {
        q: "What if my child missed some vaccines?",
        a: "Catch-up vaccination is available for all routine childhood vaccines. The CDC publishes a catch-up schedule for children who are behind. Most vaccines can be started or completed at any age with appropriate intervals between doses. Visit your pediatrician or local health department to assess which vaccines your child needs.",
      },
      {
        q: "Do vaccines protect other people, not just the person vaccinated?",
        a: "Yes — this is called herd immunity or community immunity. When a high proportion of a community is immune (through vaccination or prior infection), pathogens have fewer hosts to infect, slowing or stopping transmission. This protects people who can't be vaccinated — newborns, immunocompromised patients, people with certain allergies. VaxFact's 'Community Vaccination Rate' input shows how your community's vaccination coverage affects your child's individual exposure risk.",
      },
    ],
  },
  {
    category: "Specific Vaccine Questions",
    questions: [
      {
        q: "Is the COVID-19 vaccine safe for children?",
        a: "Major health agencies worldwide (CDC, WHO, EMA, Health Canada) have authorized COVID-19 vaccines for children and found the benefit-risk balance to be favorable. The primary serious adverse event studied in young males was myocarditis — inflammation of the heart muscle — which was rare (estimated 1–10 per 100,000 doses in adolescent males), typically mild, and usually resolved on its own. This is actively monitored and discussed in VaxFact's COVID-19 profile under 'What Researchers Question.'",
      },
      {
        q: "Why is the flu shot only about 40–60% effective?",
        a: "Influenza viruses mutate rapidly, and flu vaccines are reformulated each year based on WHO surveillance of which strains are likely to circulate. When the vaccine's strains closely match circulating strains, effectiveness is higher (50–70%). When there's a mismatch, effectiveness drops. Despite imperfect effectiveness, the flu vaccine significantly reduces hospitalizations, especially in high-risk groups (elderly, infants, immunocompromised). Even a partially effective vaccine provides meaningful protection against severe disease.",
      },
      {
        q: "Is the HPV vaccine only for girls?",
        a: "No. The HPV vaccine is recommended for all adolescents regardless of sex. HPV causes cervical cancer in women but also causes oropharyngeal (throat), anal, and penile cancers in men. Boys benefit both from direct protection and from interrupting transmission. The vaccine is most effective when given before sexual activity begins — ideally at age 11–12, but it can be given up to age 45 with decreasing benefit as prior exposure increases.",
      },
      {
        q: "Do I need the shingles vaccine if I've had chickenpox?",
        a: "Yes — this is actually who needs it most. If you've had chickenpox (varicella), the virus remains dormant in your nerve cells and can reactivate as shingles (herpes zoster) decades later. Risk increases significantly with age and immune suppression. Shingrix (recombinant zoster vaccine) is recommended for adults 50+ regardless of chickenpox history, with 90%+ effectiveness against shingles and 89% effectiveness against postherpetic neuralgia (chronic nerve pain), one of the most debilitating complications.",
      },
    ],
  },
  {
    category: "Vaccine Ingredients & Manufacturing",
    questions: [
      {
        q: "What is an adjuvant and why is it in vaccines?",
        a: "An adjuvant is an ingredient added to some vaccines to boost the immune response, allowing the vaccine to work with a smaller amount of antigen (the disease component). The most common adjuvants are aluminum salts (aluminum hydroxide or aluminum phosphate), which have been used safely in vaccines since the 1930s. The amount of aluminum in vaccines is tiny — typically 125–625 micrograms per dose — far below the amounts humans safely encounter daily from food, water, and air. A breastfed infant ingests more aluminum from breast milk in a month than from their entire vaccine series.",
      },
      {
        q: "Why do some vaccines contain formaldehyde?",
        a: "Formaldehyde is used during vaccine manufacturing to inactivate (kill) viruses or detoxify toxins, ensuring the vaccine cannot cause disease. The vast majority is removed during purification — residual amounts are typically less than 0.1 mg per dose. To put this in perspective: your body naturally produces and circulates approximately 1.5 mg of formaldehyde per liter of blood as a normal byproduct of metabolism. A newborn has roughly 50–70 times more formaldehyde in their bloodstream at any moment than is contained in any vaccine.",
      },
      {
        q: "What is thimerosal and which vaccines still contain it?",
        a: "Thimerosal is a mercury-based preservative used to prevent contamination in multi-dose vaccine vials. It contains ethylmercury, which is metabolized and cleared from the body quickly — very different from methylmercury (the environmental toxin in fish) which accumulates. Despite this distinction, thimerosal was removed from all routine childhood vaccines in the US by 2001 as a precautionary measure. Today, only some multi-dose flu vaccines contain thimerosal; thimerosal-free single-dose flu vaccine options are widely available. Dozens of studies have found no association between thimerosal exposure and any neurodevelopmental outcome.",
      },
      {
        q: "Are vaccines tested on animals before human trials?",
        a: "Yes. Vaccine development follows a rigorous multi-stage process: (1) Exploratory/preclinical stage — lab research and animal testing to identify potential candidates and assess basic safety and immunogenicity; (2) Phase I human trials — small studies (20–80 people) focused on safety and dosing; (3) Phase II trials — hundreds of participants to study immune response, safety, and schedule; (4) Phase III trials — thousands to tens of thousands of participants in randomized controlled trials to evaluate efficacy and detect less common adverse events; (5) Post-market surveillance — ongoing monitoring via systems like VAERS, the Vaccine Safety Datalink, and the Clinical Immunization Safety Assessment network.",
      },
      {
        q: "What does 'mRNA vaccine' mean — does it change my DNA?",
        a: "No. mRNA (messenger RNA) vaccines like the Pfizer-BioNTech and Moderna COVID-19 vaccines deliver temporary genetic instructions telling your cells how to make a protein from the target pathogen (like the coronavirus spike protein). Your immune system then recognizes this protein as foreign and builds a response. The mRNA never enters the cell nucleus where DNA is stored — it cannot be incorporated into your DNA. mRNA is also extremely fragile and is broken down by your cells within days. This technology, while used clinically for the first time in COVID-19 vaccines, was developed and studied for over 30 years in cancer research and other applications.",
      },
    ],
  },
  {
    category: "Vaccine Decision-Making for Parents",
    questions: [
      {
        q: "What should I do if my child missed vaccines on the schedule?",
        a: "Don't panic — catch-up vaccination is straightforward and effective. The CDC publishes a catch-up schedule that accounts for delayed starts or missed doses. Most vaccines can be given at any age, and spacing rules still apply (minimum intervals between doses). Your child's pediatrician or a public health clinic can assess which vaccines are needed and create a catch-up plan. The key principle is that some protection is always better than none — partial vaccine series still provide meaningful immunity for the doses received, and completing the series restores full protection.",
      },
      {
        q: "My child has allergies — are any vaccines unsafe for them?",
        a: "Most children with allergies can safely receive all recommended vaccines. The key considerations are: (1) Egg allergy — the flu shot contains trace egg proteins, but current guidance from ACIP is that even children with severe egg allergy can receive the flu vaccine in a standard medical setting without special precautions. (2) Gelatin allergy — some vaccines contain gelatin as a stabilizer; children with confirmed gelatin allergy need a risk-benefit discussion. (3) Latex allergy — some vial stoppers contain latex; latex-free alternatives are available. (4) Any prior anaphylaxis to a vaccine or vaccine ingredient — warrants specialist consultation. A general 'allergy' is not a reason to avoid vaccines; discuss your specific allergy with your provider.",
      },
      {
        q: "Can my baby get too many vaccines at once?",
        a: "No — the evidence strongly indicates that receiving multiple vaccines at the same visit does not overwhelm or overload a baby's immune system. Infants encounter thousands of antigens (foreign substances) every day through normal exposure to the environment, food, and microorganisms. The total antigens in all vaccines given at a 2-month visit are fewer than the antigens in a single bacterium. Combining vaccines at one visit reduces the number of clinic visits, ensures timely protection during the most vulnerable window, and does not diminish immune response to any individual vaccine.",
      },
      {
        q: "Should I spread out my child's vaccines instead of following the schedule?",
        a: "Major medical organizations including the American Academy of Pediatrics and the CDC advise against alternative spacing schedules. The recommended schedule is designed to provide protection as early as possible — during the window when infants are most vulnerable to certain diseases (like pertussis, which is most deadly in infants under 3 months). Spreading out vaccines leaves children unprotected against serious diseases for longer periods. There is no evidence that alternative spacing improves outcomes or reduces risks. Each component of the schedule has been carefully timed based on immunological data on when protection is most needed and when the immune system responds best.",
      },
      {
        q: "What is 'informed refusal' and do I have the right to decline vaccines?",
        a: "In the United States, parents have the legal right to decline vaccines for their children in most states, with the process varying by state law. 'Informed refusal' means declining after fully understanding the benefits, risks, and alternatives — including the risks of the diseases being prevented. Most states allow medical exemptions (for genuine contraindications); many allow religious exemptions; some allow philosophical exemptions. However, exemptions carry real consequences: unvaccinated children face higher personal disease risk, and communities with high exemption rates have experienced outbreaks of measles, pertussis, and other preventable diseases. VaxFact's goal is to support truly informed decisions — including honest information about the risks of vaccine-preventable diseases.",
      },
    ],
  },
  {
    category: "Community Immunity & Public Health",
    questions: [
      {
        q: "What is herd immunity and why does it matter for my family?",
        a: "Herd immunity (or community immunity) occurs when enough people in a population are immune to a disease — through vaccination or prior infection — that transmission chains break down, protecting even those who cannot be vaccinated. The threshold varies by disease: measles requires ~95% immunity; polio requires ~80–85%; flu requires a lower threshold. Herd immunity protects newborns too young to be vaccinated, immunocompromised individuals whose vaccines don't work as well, and the rare individual with a genuine medical contraindication. When community vaccination rates fall below thresholds, previously eliminated diseases can resurge, as seen in US measles outbreaks in 2019 (1,282 cases — the highest since 1992).",
      },
      {
        q: "If vaccines work, why do vaccinated people need to worry about unvaccinated people?",
        a: "This is a legitimate and important question. Vaccines are highly effective but not perfect — most provide 85–99% protection, meaning a small percentage of vaccinated people remain susceptible. In a community with 95% vaccination, the few vaccinated-but-susceptible individuals are surrounded by immune neighbors, and transmission chains rarely reach them. When vaccination rates drop, susceptible pockets grow and outbreaks can ignite. The 2014–2015 Disneyland measles outbreak illustrated this: it started in a community with high vaccination rates, but a cluster of unvaccinated individuals created a transmission chain that spread to vaccinated people who were in the susceptible minority.",
      },
      {
        q: "Do vaccines cause outbreaks?",
        a: "No. Vaccines prevent outbreaks — they don't cause them. All outbreaks of vaccine-preventable diseases are driven by clusters of unvaccinated (or incompletely vaccinated) individuals. There is one partial exception worth understanding: the oral polio vaccine (OPV), a live attenuated vaccine used globally for eradication campaigns, can in very rare cases mutate in under-vaccinated communities to produce 'vaccine-derived poliovirus' (VDPV) that can cause paralysis. This is a known trade-off of OPV use. The injectable polio vaccine (IPV) used in the US cannot cause this. VDPV is effectively eliminated by achieving high vaccination coverage.",
      },
      {
        q: "Are some vaccines more important for community protection than others?",
        a: "Yes. Vaccines against highly contagious airborne diseases — particularly measles (R0 = 12–18) and pertussis (R0 = 12–17) — are most critical for community protection because their high transmissibility means even small gaps in coverage can spark outbreaks. Diseases like tetanus (not person-to-person) and rabies (limited human-to-human transmission) are primarily about individual protection. Travel vaccines like cholera or Japanese Encephalitis are important for individuals going to endemic areas but don't affect domestic community immunity. The MMR and DTaP vaccines carry the highest public health priority from a community immunity standpoint.",
      },
    ],
  },
  {
    category: "Monitoring Vaccine Safety",
    questions: [
      {
        q: "What is VAERS and how should I interpret it?",
        a: "VAERS (Vaccine Adverse Event Reporting System) is a US passive surveillance system co-managed by the CDC and FDA that collects reports of health events occurring after vaccination. Anyone can submit a report — healthcare providers, vaccine manufacturers, or the general public — without requiring proof of causation. This makes VAERS excellent for detecting potential safety signals early, but VAERS data cannot be used to determine whether a vaccine caused a specific adverse event. Reports in VAERS are frequently misinterpreted as 'proof' that vaccines caused reported events — they are not. A report in VAERS means someone experienced a health event after vaccination, not because of vaccination. The CDC and FDA investigate unusual patterns in VAERS data and conduct follow-up studies when signals emerge.",
      },
      {
        q: "How are rare vaccine side effects detected if clinical trials don't catch them?",
        a: "Clinical trials, while large, are typically powered to detect adverse events occurring in more than 1 in 10,000 individuals. Rarer events are detected through post-market surveillance systems: (1) VAERS — passive voluntary reporting; (2) Vaccine Safety Datalink (VSD) — active surveillance linking vaccination records with medical records for ~12 million people; (3) Clinical Immunization Safety Assessment (CISA) — detailed clinical investigation of complex cases; (4) Biologics Effectiveness and Safety (BEST) System — large-scale data from health claims and EHRs; (5) Global monitoring by WHO, EMA, and national health authorities. Real-world examples of post-market signal detection: the intussusception signal that led to withdrawal of the first rotavirus vaccine (RotaShield) in 1999, and the myocarditis signal following mRNA COVID vaccines in 2021.",
      },
      {
        q: "Why does the Vaccine Injury Compensation Program (VICP) exist if vaccines are safe?",
        a: "The National Childhood Vaccine Injury Act of 1986 established the VICP as a no-fault compensation system for individuals who experience rare but genuine vaccine injuries. Its existence does not mean vaccines are unsafe — it reflects that no medical intervention is 100% risk-free and that society has a responsibility to support the rare individuals who experience genuine adverse events. The VICP also incentivized vaccine manufacturers to continue producing vaccines by shielding them from excessive litigation, which helps maintain the stable supply of life-saving vaccines. Since 1988, VICP has compensated approximately 10,000 claims and paid out $5.6 billion — while billions of vaccine doses have been administered safely during that period.",
      },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.flatMap((cat) =>
      cat.questions.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      }))
    ),
  };

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
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
            <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748b" }}>
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#94a3b8" }}>FAQ</span>
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
              Frequently Asked Questions
            </h1>
            <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 600, lineHeight: 1.7 }}>
              Evidence-based answers to the most common vaccine questions — from safety
              to schedules to how our scoring model works.
            </p>
          </div>
        </div>

        {/* FAQ content */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 0" }}>
          {FAQS.map((cat) => (
            <div key={cat.category} style={{ marginBottom: 48 }}>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  marginBottom: 20,
                  paddingBottom: 12,
                  borderBottom: "1px solid #1e293b",
                }}
              >
                {cat.category}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {cat.questions.map((faq) => (
                  <details
                    key={faq.q}
                    style={{
                      background: "#0d1526",
                      border: "1px solid #1e293b",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <summary
                      style={{
                        padding: "16px 20px",
                        cursor: "pointer",
                        color: "#e2e8f0",
                        fontSize: 15,
                        fontWeight: 600,
                        lineHeight: 1.5,
                        listStyle: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <span>{faq.q}</span>
                      <span
                        style={{
                          color: "#3b82f6",
                          fontSize: 20,
                          flexShrink: 0,
                          fontWeight: 300,
                        }}
                      >
                        +
                      </span>
                    </summary>
                    <div
                      style={{
                        padding: "0 20px 20px",
                        borderTop: "1px solid #1e293b",
                      }}
                    >
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: 15,
                          lineHeight: 1.8,
                          margin: "16px 0 0",
                        }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Didn't find answer CTA */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e1b4b, #1e3a5f)",
              border: "1px solid #3730a3",
              borderRadius: 12,
              padding: 28,
              textAlign: "center",
              marginTop: 16,
            }}
          >
            <h3
              style={{
                color: "#e2e8f0",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Didn't find your answer?
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Explore individual vaccine profiles for detailed disease data, adverse
              events, and international policy comparisons. Or use the score calculator
              to see personalized benefit-risk analysis.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/vaccines"
                style={{
                  background: "#1e293b",
                  color: "#e2e8f0",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid #334155",
                }}
              >
                Browse Vaccine Database →
              </Link>
              <Link
                href="/"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Open Score Calculator →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}