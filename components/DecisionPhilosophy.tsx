"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const PHILOSOPHY_SECTIONS = [
  {
    id: "weighting",
    emoji: "⚖️",
    title: "How evidence is weighted",
    summary: "Not all studies are equal. Here's how VaxFact ranks sources.",
    content: `VaxFact prioritizes evidence in this order: (1) Large randomized controlled trials with long follow-up and independent replication, (2) Population-scale cohort studies using national surveillance data, (3) Cochrane-quality systematic reviews and meta-analyses, (4) Regulatory-grade post-market surveillance (VAERS with rate analysis, EMA/CDC monitoring), (5) Observational studies with adequate controls.

We apply a confidence penalty when only one or two high-quality studies exist. We apply a higher confidence score when multiple independent research groups across different countries have converged on the same finding. We explicitly flag when a finding has been contested, retracted, or is from a single low-powered study.

Evidence confidence directly controls the uncertainty band shown on every score. A 97% confidence score produces a narrow band (±4 points). A 58% score produces a wide band (±16 points). This is intentional — we want you to see when we know something well vs. when we're extrapolating.`,
  },
  {
    id: "tradeoffs",
    emoji: "🔄",
    title: "How tradeoffs are modeled",
    summary: "Every vaccine involves tradeoffs. Here's how VaxFact thinks about them.",
    content: `The net benefit score is not simply "vaccines good/bad." It's a model that asks: for this specific person, in this specific situation, how do the expected benefits compare to the expected risks?

The model computes: (Exposure Risk × Disease Consequence × Vaccine Protection) − Vaccine Harm.

Exposure risk depends on your scenario: whether you're in daycare, traveling internationally, in an active outbreak, in a community with low vaccination rates. Vaccine harm is computed from the actual adverse event probability data — weighted by severity.

Critically, we do not claim this model is perfect. The scoring engine is deterministic and simplified. Real bodies, real immune systems, and real life circumstances are more complex than any model. The score is a structured way to think about tradeoffs — not a prescription.`,
  },
  {
    id: "uncertainty",
    emoji: "🌫️",
    title: "Why we show uncertainty",
    summary: "Certainty in medicine is rarer than it's often presented.",
    content: `Most public health communication presents vaccines as either definitively safe-and-effective or dangerously unproven. The reality is more nuanced — and more interesting.

Every score on VaxFact comes with an uncertainty band. A narrow band means we have strong, replicated evidence. A wide band means the evidence is thinner, more contested, or less applicable to your specific situation.

We show uncertainty because: (1) It's honest — science always has error bars, (2) Wide bands are informative — they tell you this is an area where a conversation with your provider is especially important, (3) False precision erodes trust when reality doesn't match the confident prediction.

The existence of uncertainty does not mean a vaccine is unsafe. Hepatitis B has 44 years of post-licensure data and >1 billion doses — its narrow uncertainty band reflects this. MenB has 10 years of data and a Category B recommendation — its wide band reflects legitimate scientific uncertainty.`,
  },
  {
    id: "critiques",
    emoji: "🔬",
    title: "Why we include credible critiques",
    summary: "Real science has real debates. Suppressing them backfires.",
    content: `Every vaccine in VaxFact has a "What some researchers question" section. This is not a concession to anti-vaccine sentiment. It is the opposite.

When public health institutions present vaccines as beyond criticism, parents — who have inevitably encountered real critiques — feel lied to when they read the actual literature. Trust erodes. Hesitancy increases.

Our position: the best way to support vaccine confidence is to surface real scientific debates openly, explain their current status, and trust parents with the complexity.

The critiques we include meet a threshold: they were published in peer-reviewed literature, raised by credentialed researchers, or represent a formal dissenting view in a regulatory process. We exclude conspiracy theories, retracted papers presented as valid, and claims with no peer-reviewed basis.

We do not take positions on these debates. We surface them so you can bring informed questions to your provider.`,
  },
  {
    id: "notdoctors",
    emoji: "🏥",
    title: "What this tool does and does not do",
    summary: "Understanding the limits is as important as understanding the capabilities.",
    content: `VaxFact does:
• Provide evidence-based benefit-risk modeling for 20 vaccines
• Show how your specific scenario shifts the evidence
• Surface credible scientific debates in accessible language
• Give you a framework for asking better questions at medical appointments
• Show real-time outbreak data so you can see what's circulating

VaxFact does NOT:
• Give you a medical recommendation
• Replace a conversation with your pediatrician, GP, or travel medicine provider
• Account for your child's specific medical history, genetic factors, or immune status
• Tell you whether to vaccinate
• Predict what will happen to your individual child

The score is a model. You are a person. Models and people have a complicated relationship. Use this tool to arrive at your medical appointments better informed — not to make decisions without them.`,
  },
];

export default function DecisionPhilosophy() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleSections = showAll ? PHILOSOPHY_SECTIONS : PHILOSOPHY_SECTIONS.slice(0, 3);

  return (
    <section style={{ background: "var(--surface-2)", borderTop: "1px solid var(--line)", padding: "64px 0" }}>
      <div className="vf-container">
        {/* Header */}
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              color: "var(--primary)", fontFamily: "Inter, sans-serif",
              textTransform: "uppercase",
            }}>
              HOW THIS TOOL THINKS
            </span>
          </div>
          <h2 style={{
            fontSize: 32, fontWeight: 900, color: "var(--text)", marginBottom: 12,
            fontFamily: "'Source Serif 4', serif",
          }}>
            Decision philosophy
          </h2>
          <p style={{
            fontSize: 16, color: "var(--muted)", fontFamily: "Inter, sans-serif",
            lineHeight: 1.7,
          }}>
            VaxFact is built on a specific philosophy about how to present medical evidence to parents. Understanding it helps you use the tool well.
          </p>
        </div>

        {/* Philosophy cards */}
        <div style={{ display: "grid", gap: 12, maxWidth: 800 }}>
          {visibleSections.map(section => {
            const isOpen = openSection === section.id;
            return (
              <div key={section.id} style={{
                border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden",
                background: "var(--surface)",
                transition: "box-shadow 0.15s ease",
                boxShadow: isOpen ? "0 4px 24px rgba(0,0,0,0.06)" : "none",
              }}>
                <button
                  onClick={() => setOpenSection(prev => prev === section.id ? null : section.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 16,
                    padding: "20px 24px", background: "none",
                    border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{section.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", fontFamily: "'Source Serif 4', serif", marginBottom: 3 }}>
                      {section.title}
                    </div>
                    <div style={{ fontSize: 14, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                      {section.summary}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {isOpen
                      ? <ChevronUp size={20} color="var(--muted)" />
                      : <ChevronDown size={20} color="var(--muted)" />}
                  </div>
                </button>

                {isOpen && (
                  <div style={{
                    padding: "0 24px 24px",
                    borderTop: "1px solid var(--line)",
                  }}>
                    <div style={{ paddingTop: 20 }}>
                      {section.content.split('\n\n').map((para, i) => (
                        <p key={i} style={{
                          fontSize: 15, color: "var(--muted)", fontFamily: "Inter, sans-serif",
                          lineHeight: 1.75, marginBottom: 14,
                          whiteSpace: "pre-line",
                        }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show more / less */}
        {!showAll && PHILOSOPHY_SECTIONS.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            style={{
              marginTop: 16, padding: "10px 24px",
              background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12,
              fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif",
              color: "var(--muted)", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              transition: "color 0.15s ease, border-color 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "var(--text)";
              e.currentTarget.style.borderColor = "var(--text)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.borderColor = "var(--line)";
            }}
          >
            <ChevronDown size={16} />
            Show all philosophy sections
          </button>
        )}

        {/* Methodology note */}
        <div style={{
          marginTop: 40, padding: "24px 28px",
          background: "var(--primary-soft)", border: "1px solid #c2d4f7", borderRadius: 18,
          maxWidth: 800,
        }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>📋</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)", fontFamily: "'Source Serif 4', serif", marginBottom: 6 }}>
                Full methodology documentation
              </div>
              <p style={{ fontSize: 14, color: "var(--primary)", opacity: 0.85, fontFamily: "Inter, sans-serif", lineHeight: 1.6, margin: 0 }}>
                The complete technical methodology — including the scoring algorithm, data sources, evidence hierarchy, scenario modifier weights, and uncertainty band calculations — is documented in the VaxFact Technical Manual. Each vaccine entry includes full source citations, evidence quality ratings, and the reasoning behind every score component.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}