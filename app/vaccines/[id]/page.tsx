import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VACCINES, DEFAULT_SCENARIO, computeScores } from "@/lib/vaccineData";
import VaccineDetailStatic from "@/components/VaccineDetailStatic";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// Generate all 20 static vaccine pages at build time
export async function generateStaticParams() {
  return VACCINES.map((v) => ({ id: v.id }));
}

// Per-vaccine SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vaccine = VACCINES.find((v) => v.id === id);
  if (!vaccine) return { title: "Vaccine Not Found" };

  const title = `${vaccine.name} Vaccine — Benefits, Risks & Side Effects`;
  const description = `Evidence-based analysis of the ${vaccine.name} vaccine. Includes benefit-risk score, disease data, adverse events, credible scientific debates, and international policy comparison. ${vaccine.effectiveness.againstSevereDisease}% effective against severe disease.`;

  return {
    title,
    description,
    keywords: [
      `${vaccine.name} vaccine`,
      `${vaccine.name} side effects`,
      `${vaccine.name} benefits`,
      `${vaccine.name} risks`,
      `is ${vaccine.name} vaccine safe`,
      `${vaccine.name} vaccine effectiveness`,
      ...vaccine.diseases,
    ],
    alternates: { canonical: `https://vaxfact.net/vaccines/${vaccine.id}` },
    openGraph: {
      title,
      description,
      url: `https://vaxfact.net/vaccines/${vaccine.id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function VaccinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vaccine = VACCINES.find((v) => v.id === id);
  if (!vaccine) notFound();

  const score = computeScores(vaccine, DEFAULT_SCENARIO);

  // JSON-LD structured data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `${vaccine.name} Vaccine`,
    "description": vaccine.disease.description,
    "url": `https://vaxfact.net/vaccines/${vaccine.id}`,
    "about": {
      "@type": "Drug",
      "name": vaccine.name,
      "description": vaccine.disease.description,
      "administrationRoute": "Injection",
      "recognizingAuthority": {
        "@type": "Organization",
        "name": "CDC Advisory Committee on Immunization Practices (ACIP)",
      },
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vaxfact.net" },
        { "@type": "ListItem", "position": 2, "name": "Vaccines", "item": "https://vaxfact.net/vaccines" },
        { "@type": "ListItem", "position": 3, "name": vaccine.name, "item": `https://vaxfact.net/vaccines/${vaccine.id}` },
      ],
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `How effective is the ${vaccine.name} vaccine?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The ${vaccine.name} vaccine is ${vaccine.effectiveness.againstSevereDisease}% effective against severe disease, ${vaccine.effectiveness.againstInfection}% effective against infection, and ${vaccine.effectiveness.againstDeath}% effective against death. ${vaccine.effectiveness.waningNotes}`,
          },
        },
        {
          "@type": "Question",
          "name": `What are the side effects of the ${vaccine.name} vaccine?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Common side effects include: ${vaccine.adverseEvents.filter(e => e.type === "mild").map(e => e.name).join(", ")}. Rare serious adverse events: ${vaccine.adverseEvents.filter(e => e.type === "rare-serious").map(e => `${e.name} (${e.probability.toFixed(1)} per 100,000 doses)`).join("; ") || "None documented."}`,
          },
        },
        {
          "@type": "Question",
          "name": `When should the ${vaccine.name} vaccine be given?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The ${vaccine.name} vaccine is given as a ${vaccine.schedule.doses}-dose series. Timing: ${vaccine.schedule.timing.join(", ")}. ${vaccine.schedule.catchUpNotes || ""}`,
          },
        },
        {
          "@type": "Question",
          "name": `What disease does the ${vaccine.name} vaccine prevent?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": vaccine.disease.description,
          },
        },
      ],
    },
  };

  // Related vaccines (same age window or similar disease area)
  const relatedVaccines = VACCINES
    .filter(v => v.id !== vaccine.id)
    .filter(v => {
      const sameAge = v.ageWindow === vaccine.ageWindow;
      const relatedDisease = vaccine.diseases.some(d =>
        v.diseases.some(d2 => d2.toLowerCase().includes(d.toLowerCase().split(" ")[0]))
      );
      return sameAge || relatedDisease;
    })
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <VaccineDetailStatic
          vaccine={vaccine}
          score={score}
          relatedVaccines={relatedVaccines}
        />
      </main>
      <SiteFooter />
    </>
  );
}