// ============================================================
// VaxFact.net — Core Vaccine Data & Evidence Model
// All figures are population-level estimates from peer-reviewed
// literature, CDC surveillance, and WHO epidemiology reports.
// Sources cited inline. This is educational, not medical advice.
// ============================================================

export interface AdverseEvent {
  name: string;
  probability: number;       // per 100,000 doses
  severityWeight: number;    // 0–100 per severity table
  type: "mild" | "moderate" | "serious" | "rare-serious";
  notes: string;
}

export interface StudySource {
  title: string;
  type: "RCT" | "cohort" | "surveillance" | "meta-analysis" | "review";
  year: number;
  country: string;
  sampleSize: string;
  confidence: "high" | "moderate" | "low";
  url?: string;
}

export interface CountryPolicy {
  country: string;
  code: string;
  recommended: boolean;
  schedule: string;
  rationale: string;
}

export interface VaccineData {
  id: string;
  name: string;                     // Vaccine name
  brandNames: string[];
  diseases: string[];               // Diseases prevented
  ageWindow: string;                // Recommended age window
  yearsInUse: number;               // Years licensed
  dosesAdministered: string;        // Lifetime doses globally

  // DISEASE BURDEN (unvaccinated population)
  disease: {
    description: string;
    qualityOfLifeImpact: string;    // Narrative
    transmissionRoute: string;
    incidenceUnvaccinated: number;  // Annual cases per 100,000 unvaccinated
    incidenceVaccinated: number;    // Annual cases per 100,000 vaccinated
    mortalityRate: number;          // Deaths per 100,000 infected (CFR)
    hospitalizationRate: number;    // % of infected requiring hospitalization
    icuRate: number;                // % of infected requiring ICU
    chronicSequelaeRate: number;    // % with long-term complications
    acuteQoLLoss: number;          // 0–100 score
    longTermQoLLoss: number;       // 0–100 score
    outbreakPotential: "low" | "moderate" | "high" | "very-high";
  };

  // VACCINE EFFECTIVENESS
  effectiveness: {
    againstInfection: number;       // % VE against any infection
    againstSevereDisease: number;   // % VE against hospitalization/ICU
    againstDeath: number;           // % VE against mortality
    waningNotes: string;
    breakthroughNotes: string;
  };

  // SCORING DIMENSIONS (0–100)
  scores: {
    yearsOfStudy: number;           // Evidence longevity
    longTermSafetyEvidence: number; // Quality of long-term safety data
    exposureRiskBase: number;       // Base likelihood of encountering disease
    diseaseConsequence: number;     // Severity if you get the disease
    vaccineRisk: number;            // Risk from the vaccine itself
    netBenefit: number;             // Benefit minus risk
    evidenceConfidence: number;     // Quality/consensus of evidence
  };

  // ADVERSE EVENTS
  adverseEvents: AdverseEvent[];

  // SCENARIO MODIFIERS (multipliers on exposure risk)
  scenarioModifiers: {
    daycare: number;
    travel: number;
    outbreak: number;
    siblings: number;
    immunocompromisedHousehold: number;
    ruralVsUrban: number;
  };

  // SCHEDULE
  schedule: {
    doses: number;
    timing: string[];               // Age at each dose
    minimumInterval: string;
    catchUpNotes: string;
    canCombineWith: string[];
    cannotCombineWith: string[];
  };

  // SOURCES
  sources: StudySource[];
  countryPolicies: CountryPolicy[];

  // CONTENT
  prosList: string[];
  consList: string[];
  uncertainties: string[];
  credibleCritiques: string[];

  // VISUAL
  color: string;
  icon: string;
}

// ============================================================
// SEVERITY WEIGHTS (from project brief)
// ============================================================
export const SEVERITY_WEIGHTS = {
  death: 100,
  permanentNeurologicInjury: 70,
  chronicLifelongCondition: 60,
  icuAdmission: 40,
  hospitalization: 20,
  moderateAcuteQoL: 10,
  longTermQoLLoss: 30,
};

// ============================================================
// VACCINE DATASET — V1 (6 vaccines per project brief)
// ============================================================
export const VACCINES: VaccineData[] = [
  // ──────────────────────────────────────────────────────────
  // 1. HEPATITIS B (HepB)
  // ──────────────────────────────────────────────────────────
  {
    id: "hepb",
    name: "Hepatitis B",
    brandNames: ["Engerix-B", "Recombivax HB", "Heplisav-B", "Pediarix (combo)"],
    diseases: ["Hepatitis B", "Liver cirrhosis", "Hepatocellular carcinoma"],
    ageWindow: "Birth – 18 months (3-dose series)",
    yearsInUse: 44,
    dosesAdministered: "Over 1 billion doses worldwide",
    disease: {
      description: "Hepatitis B is a viral liver infection. In infants and young children, 90% of infections become chronic, leading to cirrhosis and liver cancer decades later. Most adults clear the infection but chronic infection causes 780,000 deaths/year globally.",
      qualityOfLifeImpact: "Chronic hepatitis B requires lifelong monitoring and often antiviral medication. Cirrhosis causes fatigue, jaundice, fluid accumulation, and cognitive impairment. Liver cancer has a 5-year survival rate of 15–20%. Patients describe significant anxiety and stigma, with major impacts on employment and relationships.",
      transmissionRoute: "Blood-to-blood contact, sexual transmission, mother-to-child at birth, shared needles. Highly stable on surfaces — survives up to 7 days.",
      incidenceUnvaccinated: 140,    // ~140 per 100k in unvaccinated US infants (perinatal risk)
      incidenceVaccinated: 1.4,      // ~99% reduction
      mortalityRate: 25,             // 25 per 100k infected develop fatal liver disease long-term
      hospitalizationRate: 15,
      icuRate: 3,
      chronicSequelaeRate: 90,       // 90% of infant infections become chronic
      acuteQoLLoss: 40,
      longTermQoLLoss: 65,
      outbreakPotential: "moderate",
    },
    effectiveness: {
      againstInfection: 98,
      againstSevereDisease: 99,
      againstDeath: 99,
      waningNotes: "Immunity appears lifelong for most vaccinated individuals. Booster not currently recommended for immunocompetent adults vaccinated as infants. Memory B-cell response persists even when antibody titers wane.",
      breakthroughNotes: "Breakthrough infections extremely rare (<1%). Mostly occur in immunocompromised individuals or those with vaccine non-response (~5% of population).",
    },
    scores: {
      yearsOfStudy: 95,
      longTermSafetyEvidence: 92,
      exposureRiskBase: 55,
      diseaseConsequence: 88,
      vaccineRisk: 8,
      netBenefit: 94,
      evidenceConfidence: 96,
    },
    adverseEvents: [
      { name: "Injection site soreness", probability: 25000, severityWeight: 2, type: "mild", notes: "Resolves within 48 hours" },
      { name: "Low-grade fever", probability: 15000, severityWeight: 2, type: "mild", notes: "Self-limiting, <24 hours" },
      { name: "Fatigue / headache", probability: 10000, severityWeight: 2, type: "mild", notes: "Common, short-lived" },
      { name: "Anaphylaxis", probability: 1.1, severityWeight: 80, type: "rare-serious", notes: "~1.1 per million doses. Treated immediately with epinephrine. Outcomes excellent with prompt treatment." },
      { name: "Suspected demyelinating events", probability: 0.1, severityWeight: 60, type: "rare-serious", notes: "Postlicensure signal investigated. Multiple large studies (WHO 2012, Cochrane 2017) found no causal link. Under ongoing monitoring." },
    ],
    scenarioModifiers: {
      daycare: 1.3,
      travel: 1.8,
      outbreak: 2.5,
      siblings: 1.2,
      immunocompromisedHousehold: 1.5,
      ruralVsUrban: 0.9,
    },
    schedule: {
      doses: 3,
      timing: ["Birth (within 24h)", "1–2 months", "6–18 months"],
      minimumInterval: "4 weeks between dose 1 and 2; 8 weeks between dose 2 and 3",
      catchUpNotes: "Unvaccinated children and adolescents can receive 3-dose catch-up series at any age. 2-dose adult series (Heplisav-B) available for age 18+.",
      canCombineWith: ["DTaP", "Hib", "PCV", "IPV"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "WHO Position Paper on Hepatitis B vaccines", type: "review", year: 2017, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
      { title: "Mast et al. — Perinatal HBV transmission reduction", type: "cohort", year: 2005, country: "USA", sampleSize: "52,000 infants", confidence: "high" },
      { title: "Cochrane Review: HepB vaccines in healthy individuals", type: "meta-analysis", year: 2019, country: "Multi-country", sampleSize: "98 RCTs", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "Birth, 1–2m, 6–18m", rationale: "Universal infant vaccination since 1991. Eliminated perinatal transmission in vaccinated cohorts." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "8w, 12w, 16w (as Pediarix)", rationale: "Introduced into routine infant schedule in 2017." },
      { country: "Australia", code: "AU", recommended: true, schedule: "Birth, 2m, 4m, 6m", rationale: "Universal since 2000. High coverage Aboriginal communities prioritized." },
      { country: "Germany", code: "DE", recommended: true, schedule: "2m, 3m, 4m, 12m", rationale: "STIKO recommends universal infant vaccination." },
      { country: "Japan", code: "JP", recommended: true, schedule: "2m, 3m, 7–8m", rationale: "Universal since 2016; previously only risk-group vaccination." },
    ],
    prosList: [
      "Prevents 3 serious diseases: hepatitis B infection, liver cirrhosis, and hepatocellular carcinoma",
      "44 years of post-licensure safety data across >1 billion doses",
      "Near-complete (98–99%) protection from a disease that is incurable once chronic",
      "Immunity appears lifelong — only vaccine shown to prevent a human cancer",
      "Critical for infants born to infected mothers where risk of chronic infection is 90%",
      "Eliminates need for anxiety about accidental blood exposures throughout child's life",
    ],
    consList: [
      "3-dose series requires multiple healthcare visits over 18 months",
      "5% of population are natural non-responders (genetic variation in immune response)",
      "Injection site reactions common (25% of doses)",
      "Rare anaphylaxis risk (~1 per million doses) requires 15-minute post-vaccination observation",
      "Long-term antibody levels wane, though memory protection appears retained",
    ],
    uncertainties: [
      "Exact duration of immunity: studies show >30 years of protection but long-term data still accumulating",
      "Whether booster doses are needed for immunocompromised children vaccinated in infancy",
      "Optimal revaccination strategy for the ~5% who don't mount initial antibody response",
    ],
    credibleCritiques: [
      "Some researchers argue newborn vaccination is unnecessary in low-prevalence settings where maternal testing reliably identifies infected mothers (Mitkus et al., 2014 — risk-benefit reanalysis)",
      "The Recombivax HB and Engerix-B formulations contain aluminum adjuvant; critics argue the safety of neonatal aluminum exposure has been insufficiently studied (Tomljenovic & Shaw, 2011 — disputed by subsequent pharmacokinetic modeling)",
      "Policy critics note that in low-risk families, perinatal transmission risk is very low and argue that targeted vaccination of at-risk newborns would reduce doses without significant increase in population disease burden",
    ],
    color: "#0ea5e9",
    icon: "🫀",
  },

  // ──────────────────────────────────────────────────────────
  // 2. DTaP (Diphtheria, Tetanus, Pertussis)
  // ──────────────────────────────────────────────────────────
  {
    id: "dtap",
    name: "DTaP",
    brandNames: ["Infanrix", "Daptacel", "Pediarix (combo)", "Pentacel (combo)"],
    diseases: ["Diphtheria", "Tetanus (Lockjaw)", "Pertussis (Whooping Cough)"],
    ageWindow: "2 months – 6 years (5-dose series)",
    yearsInUse: 30,
    dosesAdministered: "Hundreds of millions of doses annually",
    disease: {
      description: "DTaP prevents three distinct diseases. Diphtheria causes a throat membrane that can suffocate children — case fatality rate 5–10%. Tetanus causes uncontrolled muscle spasms including jaw lock — 10–20% fatal even with ICU care. Pertussis causes prolonged violent coughing fits lasting weeks to months; in infants under 3 months, 1–2% die.",
      qualityOfLifeImpact: "Pertussis in infants causes apnea, cyanosis, and convulsions from hypoxia. Survivors may have neurological injury. Tetanus survivors report years of anxiety and PTSD from the experience. Diphtheria can cause permanent heart and nerve damage. Whooping cough lasts 10 weeks on average — 'the 100-day cough' — severely disrupting family life.",
      transmissionRoute: "Pertussis: highly contagious respiratory droplets (R0 = 12–17, comparable to measles). Diphtheria: respiratory droplets. Tetanus: soil/wound contamination (not person-to-person).",
      incidenceUnvaccinated: 480,    // Pertussis dominates; pre-vaccine era ~150 cases/100k/yr
      incidenceVaccinated: 48,       // VE ~90% against clinical pertussis
      mortalityRate: 150,            // Per 100k infected infants (pertussis CFR infants ~1.5%)
      hospitalizationRate: 35,
      icuRate: 8,
      chronicSequelaeRate: 5,
      acuteQoLLoss: 70,
      longTermQoLLoss: 25,
      outbreakPotential: "very-high",
    },
    effectiveness: {
      againstInfection: 80,
      againstSevereDisease: 95,
      againstDeath: 98,
      waningNotes: "Pertussis immunity wanes more rapidly than diphtheria/tetanus — significant waning by 4–6 years after final dose. This is why Tdap boosters are recommended at age 11 and for every pregnant woman. Waning immunity in adolescents and adults is the primary source of pertussis transmission to vulnerable infants.",
      breakthroughNotes: "Vaccinated children can get pertussis but illness is typically milder and shorter. Approximately 13–25% of pertussis cases occur in fully vaccinated individuals due to waning immunity.",
    },
    scores: {
      yearsOfStudy: 90,
      longTermSafetyEvidence: 88,
      exposureRiskBase: 82,
      diseaseConsequence: 92,
      vaccineRisk: 14,
      netBenefit: 91,
      evidenceConfidence: 90,
    },
    adverseEvents: [
      { name: "Injection site redness/swelling", probability: 40000, severityWeight: 2, type: "mild", notes: "Very common; resolves in 1–3 days" },
      { name: "Fever >38°C", probability: 30000, severityWeight: 3, type: "mild", notes: "More common after 4th/5th dose" },
      { name: "Fussiness/crying", probability: 50000, severityWeight: 1, type: "mild", notes: "Normal immune response" },
      { name: "Febrile seizure", probability: 6, severityWeight: 35, type: "moderate", notes: "~6 per 100,000 doses. Most resolve without treatment. No evidence of long-term neurological harm." },
      { name: "Hypotonic-hyporesponsive episode (HHE)", probability: 57, severityWeight: 40, type: "moderate", notes: "~57 per 100,000. Child becomes limp and unresponsive briefly. Self-resolving. No long-term consequences identified." },
      { name: "Persistent crying >3 hours", probability: 1000, severityWeight: 5, type: "mild", notes: "Associated with acellular formulation; much lower than whole-cell DTP" },
      { name: "Anaphylaxis", probability: 2, severityWeight: 80, type: "rare-serious", notes: "~2 per million doses" },
      { name: "Encephalopathy (acute)", probability: 0.3, severityWeight: 90, type: "rare-serious", notes: "Causal relationship not established. IOM 2012 concluded evidence was inadequate to accept or reject causality." },
    ],
    scenarioModifiers: {
      daycare: 2.1,
      travel: 2.5,
      outbreak: 4.0,
      siblings: 1.8,
      immunocompromisedHousehold: 2.0,
      ruralVsUrban: 0.7,
    },
    schedule: {
      doses: 5,
      timing: ["2 months", "4 months", "6 months", "15–18 months", "4–6 years"],
      minimumInterval: "4 weeks between doses 1–3; 6 months between doses 3 and 4",
      catchUpNotes: "Children 7+ receive Tdap (lower diphtheria dose). Adults need Tdap booster every 10 years. Pregnant women: Tdap at 27–36 weeks each pregnancy.",
      canCombineWith: ["HepB", "Hib", "PCV", "IPV", "Rotavirus"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "Jefferson T et al. — Vaccines for preventing pertussis (Cochrane)", type: "meta-analysis", year: 2012, country: "Multi-country", sampleSize: "137,000+ participants", confidence: "high" },
      { title: "IOM Report: Adverse Effects of Vaccines", type: "review", year: 2012, country: "USA", sampleSize: "Comprehensive literature review", confidence: "high" },
      { title: "CDC MMWR — Pertussis surveillance and trends", type: "surveillance", year: 2023, country: "USA", sampleSize: "National notifiable disease data", confidence: "high" },
      { title: "Tartof et al. — Waning immunity to pertussis", type: "cohort", year: 2013, country: "USA", sampleSize: "469,000 children", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "2m, 4m, 6m, 15–18m, 4–6y", rationale: "Essential given ongoing pertussis circulation. ~15,000–50,000 cases/year despite vaccination." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "8w, 12w, 16w, 3y4m", rationale: "Maternal Tdap program introduced 2012 after infant deaths in pertussis resurgence." },
      { country: "Australia", code: "AU", recommended: true, schedule: "6w, 4m, 6m, 18m, 4y", rationale: "Cocoon strategy plus maternal vaccination. Major outbreak in 2008–2012 drove policy strengthening." },
      { country: "Germany", code: "DE", recommended: true, schedule: "2m, 3m, 4m, 11–14m, 5–6y", rationale: "STIKO recommends plus booster doses through adolescence." },
    ],
    prosList: [
      "Protects against three potentially fatal diseases in a single injection",
      "Pertussis has an R0 of 12–17 — one of the most contagious diseases known; protection is critical in early infancy",
      "Infant pertussis mortality rate is 1–2% in the first 3 months of life — a compelling risk if unvaccinated",
      "Diphtheria is re-emerging in unvaccinated populations (recent outbreaks in Europe)",
      "Tetanus protection is permanent in the environment — essential regardless of community coverage",
      "30 years of safety data on the acellular (aP) formulation; much safer than original whole-cell DTP",
    ],
    consList: [
      "Pertussis immunity wanes — fully vaccinated children and adults can still contract and spread whooping cough",
      "5-dose schedule requires frequent visits in infancy",
      "Local reactions (redness, swelling) common especially after 4th/5th dose",
      "Febrile seizures occur in ~6 per 100,000 doses — distressing to witness, though typically benign",
      "Hypotonic-hyporesponsive episodes: ~57 per 100,000 — dramatic but self-resolving",
    ],
    uncertainties: [
      "Whether acellular pertussis vaccines can be reformulated to achieve longer-lasting immunity (whole-cell DTP had superior durability but more side effects)",
      "The role of vaccinated individuals as silent carriers and transmitters of pertussis",
      "Optimal schedule for maternal Tdap vaccination to maximize passive antibody transfer to newborns",
      "Whether pertussis strain evolution is gradually reducing vaccine effectiveness",
    ],
    credibleCritiques: [
      "Acellular pertussis vaccines, while safer, appear to generate weaker and shorter-lived immunity than whole-cell DTP. Some immunologists argue the switch to acellular formulation contributed to the pertussis resurgence (Warfel et al., 2014 — baboon model; Cherry, 2015).",
      "The IOM 2012 review found the evidence 'inadequate to accept or reject' a causal relationship between DTaP and some neurological outcomes — an honest acknowledgment of genuine uncertainty.",
      "Some critics argue that the pertussis component's waning effectiveness means parents of vaccinated children may have a false sense of security about their infant's protection, particularly before dose 2.",
    ],
    color: "#f97316",
    icon: "🫁",
  },

  // ──────────────────────────────────────────────────────────
  // 3. Hib (Haemophilus influenzae type b)
  // ──────────────────────────────────────────────────────────
  {
    id: "hib",
    name: "Hib",
    brandNames: ["ActHIB", "Hiberix", "PedvaxHIB", "Pentacel (combo)"],
    diseases: ["Hib meningitis", "Hib pneumonia", "Hib epiglottitis", "Hib septicemia"],
    ageWindow: "2 months – 15 months (3–4 dose series)",
    yearsInUse: 35,
    dosesAdministered: "Over 500 million doses globally",
    disease: {
      description: "Before the vaccine, Haemophilus influenzae type b was the leading cause of bacterial meningitis in children under 5 in developed countries. Hib meningitis carries a 3–6% fatality rate and causes permanent neurological damage — hearing loss, intellectual disability, seizure disorders — in 15–30% of survivors.",
      qualityOfLifeImpact: "Hib meningitis survivors who escape death often face lifelong hearing loss (requiring hearing aids or cochlear implants), intellectual disability, epilepsy, or motor impairment. The disease is devastating in its swiftness — children can go from apparent health to coma within hours. Epiglottitis requires emergency intubation and ICU care.",
      transmissionRoute: "Respiratory droplets. Colonizes the nasopharynx asymptomatically in many people; invasive disease occurs unpredictably.",
      incidenceUnvaccinated: 75,     // Pre-vaccine era: ~75 cases/100k children under 5
      incidenceVaccinated: 0.4,      // Post-vaccine: >99% reduction
      mortalityRate: 450,            // ~4.5% CFR (450 per 100k infected)
      hospitalizationRate: 100,      // All invasive Hib requires hospitalization
      icuRate: 40,
      chronicSequelaeRate: 25,       // 15–30% of meningitis survivors
      acuteQoLLoss: 85,
      longTermQoLLoss: 55,
      outbreakPotential: "moderate",
    },
    effectiveness: {
      againstInfection: 95,
      againstSevereDisease: 98,
      againstDeath: 99,
      waningNotes: "Immunity from conjugate vaccine is long-lasting. No booster required after complete infant series for immunocompetent children. Immunological memory well-documented.",
      breakthroughNotes: "Invasive Hib disease in vaccinated children is extremely rare. When it occurs, often in immunocompromised individuals or those who missed doses.",
    },
    scores: {
      yearsOfStudy: 88,
      longTermSafetyEvidence: 90,
      exposureRiskBase: 35,          // Disease has been dramatically reduced by vaccination
      diseaseConsequence: 90,
      vaccineRisk: 5,
      netBenefit: 93,
      evidenceConfidence: 95,
    },
    adverseEvents: [
      { name: "Injection site redness", probability: 25000, severityWeight: 2, type: "mild", notes: "Common; resolves in 2–3 days" },
      { name: "Fever", probability: 10000, severityWeight: 2, type: "mild", notes: "Low-grade; self-limiting" },
      { name: "Irritability", probability: 20000, severityWeight: 1, type: "mild", notes: "Normal post-vaccination response" },
      { name: "Anaphylaxis", probability: 0.5, severityWeight: 80, type: "rare-serious", notes: "Among the lowest anaphylaxis rates of any pediatric vaccine" },
    ],
    scenarioModifiers: {
      daycare: 1.8,
      travel: 1.5,
      outbreak: 3.0,
      siblings: 1.3,
      immunocompromisedHousehold: 2.5,
      ruralVsUrban: 0.8,
    },
    schedule: {
      doses: 4,
      timing: ["2 months", "4 months", "6 months", "12–15 months"],
      minimumInterval: "4 weeks between doses 1–3; 8 weeks between dose 3 and booster",
      catchUpNotes: "Children 15–59 months who never received Hib: 1 dose. Children 5+ generally not needed unless asplenic or immunocompromised.",
      canCombineWith: ["DTaP", "HepB", "PCV", "IPV", "Rotavirus"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "Schuchat et al. — Bacterial meningitis in USA before/after Hib vaccine", type: "surveillance", year: 1997, country: "USA", sampleSize: "National meningitis surveillance", confidence: "high" },
      { title: "Watt et al. — Global burden of Hib disease", type: "cohort", year: 2009, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
      { title: "Heath et al. — Hib vaccine effectiveness", type: "meta-analysis", year: 1998, country: "Multi-country", sampleSize: "14 trials", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "2m, 4m, 6m, 12–15m", rationale: "Introduced 1987–1990. Cases dropped 99%+ in children under 5." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "8w, 12w, 16w, 12m", rationale: "Dramatic decline in meningitis after 1992 introduction." },
      { country: "Australia", code: "AU", recommended: true, schedule: "6w, 4m, 6m, 12m", rationale: "Near-elimination of Hib disease in vaccinated cohorts." },
      { country: "Finland", code: "FI", recommended: true, schedule: "3m, 5m, 12m", rationale: "Finland pioneered Hib conjugate vaccine; near-zero cases since 1993." },
    ],
    prosList: [
      "One of the greatest success stories in vaccine history: >99% reduction in invasive Hib disease",
      "Prevents meningitis that kills or permanently disables 15–30% of children who contract it",
      "Exceptionally clean safety profile — among the lowest adverse event rates of any childhood vaccine",
      "35 years of post-licensure safety data with no serious long-term safety signals identified",
      "Herd immunity effect protects unvaccinated infants before they complete the series",
      "Combination vaccines (Pentacel, Pediarix) mean no extra injection needed",
    ],
    consList: [
      "Disease has been so effectively controlled by vaccination that some parents may underestimate the ongoing need for the vaccine",
      "4-dose series in first 15 months requires multiple visits",
      "If vaccination rates fall, Hib could re-emerge quickly (as seen in Alaska 1996–2008 in undervaccinated communities)",
    ],
    uncertainties: [
      "Duration of immunity in immunocompromised children (e.g., asplenic patients may need boosters)",
      "Whether a 3-dose series is equivalent to 4-dose for all children (some countries use 3-dose with good results)",
    ],
    credibleCritiques: [
      "Some pediatric immunologists argue that a 3-dose schedule (as used in Finland and UK) is adequate, making the US 4-dose schedule conservative (Eskola et al., 1987 — Finnish RCT).",
      "In communities with very low Hib carriage rates due to high vaccine coverage, the incremental benefit of each additional dose may be very small, raising questions about schedule optimization.",
    ],
    color: "#8b5cf6",
    icon: "🧠",
  },

  // ──────────────────────────────────────────────────────────
  // 4. PCV (Pneumococcal Conjugate Vaccine)
  // ──────────────────────────────────────────────────────────
  {
    id: "pcv",
    name: "PCV (Prevnar)",
    brandNames: ["Prevnar 13", "Prevnar 20", "Synflorix"],
    diseases: ["Pneumococcal meningitis", "Pneumococcal pneumonia", "Bacteremia", "Otitis media (ear infections)"],
    ageWindow: "2 months – 15 months (4-dose series)",
    yearsInUse: 24,
    dosesAdministered: "Over 600 million doses globally",
    disease: {
      description: "Streptococcus pneumoniae is a major cause of meningitis, sepsis, and pneumonia in children under 2. Before PCV, pneumococcal meningitis had a 20–30% case fatality rate and caused neurological sequelae in up to 40% of survivors. Pneumococcal disease also causes hundreds of thousands of ear infections per year, a leading cause of pediatric hearing loss.",
      qualityOfLifeImpact: "Pneumococcal meningitis survivors face the same grim sequelae as Hib meningitis: hearing loss, cognitive impairment, epilepsy. Invasive pneumococcal disease in young children requires hospitalization, often ICU. Even non-invasive pneumococcal pneumonia causes significant suffering and, in young children, can rapidly progress to sepsis.",
      transmissionRoute: "Respiratory droplets. Up to 40% of healthy children asymptomatically carry pneumococcus in the nasopharynx.",
      incidenceUnvaccinated: 160,    // ~160 per 100k under-2 for all invasive disease
      incidenceVaccinated: 20,       // ~88% reduction in vaccine-serotype disease
      mortalityRate: 250,            // ~2.5% CFR for invasive pneumococcal disease in children
      hospitalizationRate: 100,
      icuRate: 25,
      chronicSequelaeRate: 30,
      acuteQoLLoss: 80,
      longTermQoLLoss: 45,
      outbreakPotential: "moderate",
    },
    effectiveness: {
      againstInfection: 88,
      againstSevereDisease: 94,
      againstDeath: 97,
      waningNotes: "Long-lasting immunity against vaccine serotypes. PCV13 replaced PCV7 due to serotype replacement — newer formulations (PCV15, PCV20) address emerging serotypes.",
      breakthroughNotes: "Serotype replacement is a real phenomenon — non-vaccine serotypes have partially filled the ecological niche left by vaccine serotypes. This is why newer higher-valency vaccines are periodically introduced.",
    },
    scores: {
      yearsOfStudy: 78,
      longTermSafetyEvidence: 82,
      exposureRiskBase: 72,          // Pneumococcus is ubiquitous
      diseaseConsequence: 88,
      vaccineRisk: 10,
      netBenefit: 88,
      evidenceConfidence: 88,
    },
    adverseEvents: [
      { name: "Injection site reactions", probability: 40000, severityWeight: 2, type: "mild", notes: "Most common AE; resolves in 2–3 days" },
      { name: "Fever", probability: 25000, severityWeight: 3, type: "mild", notes: "Common, particularly with multiple simultaneous vaccines" },
      { name: "Fussiness", probability: 35000, severityWeight: 1, type: "mild", notes: "Normal" },
      { name: "Decreased appetite", probability: 15000, severityWeight: 1, type: "mild", notes: "Transient" },
      { name: "Febrile seizure", probability: 4, severityWeight: 35, type: "moderate", notes: "~4 per 100,000; risk higher when given with flu vaccine simultaneously" },
      { name: "Anaphylaxis", probability: 1.5, severityWeight: 80, type: "rare-serious", notes: "~1.5 per million doses" },
    ],
    scenarioModifiers: {
      daycare: 2.0,
      travel: 1.6,
      outbreak: 2.5,
      siblings: 1.5,
      immunocompromisedHousehold: 3.0,
      ruralVsUrban: 0.9,
    },
    schedule: {
      doses: 4,
      timing: ["2 months", "4 months", "6 months", "12–15 months"],
      minimumInterval: "4 weeks between doses 1–3; 8 weeks between dose 3 and booster",
      catchUpNotes: "Children 14–59 months who missed doses: accelerated schedule available. High-risk children (asplenia, HIV) may need additional doses of PPSV23.",
      canCombineWith: ["DTaP", "Hib", "HepB", "IPV", "Rotavirus"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "Black et al. — Efficacy, safety and immunogenicity of heptavalent PCV (landmark RCT)", type: "RCT", year: 2000, country: "USA", sampleSize: "37,868 children", confidence: "high" },
      { title: "CDC MMWR — Pneumococcal disease surveillance post-PCV13", type: "surveillance", year: 2015, country: "USA", sampleSize: "National surveillance", confidence: "high" },
      { title: "Lucero et al. — PCV for preventing pneumonia in children (Cochrane)", type: "meta-analysis", year: 2009, country: "Multi-country", sampleSize: "Multiple RCTs", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "2m, 4m, 6m, 12–15m (PCV20 now preferred)", rationale: "Invasive pneumococcal disease in children fell 77% after PCV7 introduction in 2000." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "8w, 16w, 12m (PCV13)", rationale: "JCVI recommends; near-elimination of vaccine-serotype disease." },
      { country: "Australia", code: "AU", recommended: true, schedule: "6w, 4m, 6m, 12m", rationale: "Universal since 2005; significant herd immunity benefit documented." },
      { country: "Netherlands", code: "NL", recommended: true, schedule: "3m, 5m, 11m", rationale: "3-dose reduced schedule with documented equivalence." },
    ],
    prosList: [
      "Prevents the leading cause of bacterial meningitis in young children (post-Hib vaccination era)",
      "Dramatically reduces ear infections — a leading cause of antibiotic use and pediatric hearing loss",
      "Herd immunity benefit extends to unvaccinated elderly grandparents who face high pneumococcal mortality",
      "24 years of safety data with no significant long-term safety signals",
      "PCV20 covers additional serotypes including those that emerged via replacement after PCV13",
    ],
    consList: [
      "Serotype replacement: non-vaccine pneumococcal strains have partially compensated for vaccine-type strains",
      "Relatively newer conjugate vaccine (24 years vs. 44 years for HepB) — long-term data still accumulating compared to older vaccines",
      "Local reactions and fever quite common",
      "4-dose series adds to the infant vaccination burden",
    ],
    uncertainties: [
      "Long-term impact of serotype replacement — will continued emergence of non-vaccine serotypes erode population-level benefit over time?",
      "Whether 3-dose schedules (used successfully in some countries) provide equivalent protection to 4-dose US schedule",
      "The duration of immunity and whether adult boosters will eventually be needed for those vaccinated in infancy",
    ],
    credibleCritiques: [
      "Epidemiologists have documented serotype replacement — total pneumococcal disease burden has not fallen as dramatically as vaccine-serotype disease because other serotypes filled the niche (Lipsitch, 1999; Flasche et al., 2011). The net benefit is real but smaller than originally projected.",
      "Some health economists have questioned whether the ear-infection benefit (otitis media) in otherwise healthy children justifies the cost of the vaccine program in high-income settings, though the meningitis/sepsis benefit is unambiguous.",
    ],
    color: "#10b981",
    icon: "🫀",
  },

  // ──────────────────────────────────────────────────────────
  // 5. MMR (Measles, Mumps, Rubella)
  // ──────────────────────────────────────────────────────────
  {
    id: "mmr",
    name: "MMR",
    brandNames: ["M-M-R II", "Priorix", "MMRV (with varicella)"],
    diseases: ["Measles", "Mumps", "Rubella (German measles)", "Congenital Rubella Syndrome"],
    ageWindow: "12–15 months & 4–6 years (2-dose series)",
    yearsInUse: 55,
    dosesAdministered: "Over 500 million doses worldwide",
    disease: {
      description: "Measles has an R0 of 12–18, making it the most contagious vaccine-preventable disease. Pre-vaccine USA: 3–4 million cases and 400–500 deaths annually. Measles causes pneumonia (leading killer), encephalitis (1 in 1,000), and Subacute Sclerosing Panencephalitis (SSPE) — a fatal progressive brain disease occurring years after infection. Rubella during pregnancy causes Congenital Rubella Syndrome — deafness, blindness, heart defects.",
      qualityOfLifeImpact: "Measles causes 'immune amnesia' — destroying immunity memory cells and increasing vulnerability to other infections for 2–3 years post-recovery. Children with measles encephalitis have a 25% mortality rate and 25–30% permanent neurological disability among survivors. SSPE is 100% fatal, typically 7–10 years post-measles. Congenital rubella causes deaf-blindness and intellectual disability.",
      transmissionRoute: "Measles: airborne, extremely contagious — infectious particles remain in the air for 2 hours after an infected person leaves a room. R0 = 12–18. Mumps: respiratory droplets. Rubella: respiratory droplets.",
      incidenceUnvaccinated: 2200,   // ~2,200 per 100k in true unvaccinated population
      incidenceVaccinated: 11,       // 2-dose VE ~99.7%
      mortalityRate: 200,            // ~2 per 1,000 (200 per 100k) in developed countries
      hospitalizationRate: 25,
      icuRate: 5,
      chronicSequelaeRate: 8,        // Including SSPE, encephalitis survivors, CRS
      acuteQoLLoss: 60,
      longTermQoLLoss: 40,
      outbreakPotential: "very-high",
    },
    effectiveness: {
      againstInfection: 97,
      againstSevereDisease: 99,
      againstDeath: 99.5,
      waningNotes: "Two doses provide lifelong immunity for the vast majority. A small percentage (<3%) of vaccinated individuals have primary or secondary vaccine failure. Population immunity >95% required to maintain herd protection against measles.",
      breakthroughNotes: "Measles outbreaks (e.g., Disneyland 2015, NYC 2019) have almost exclusively occurred in unvaccinated communities or communities with vaccination rates <93–95%.",
    },
    scores: {
      yearsOfStudy: 97,
      longTermSafetyEvidence: 95,
      exposureRiskBase: 88,          // Very high in unvaccinated — measles re-emerges rapidly
      diseaseConsequence: 94,
      vaccineRisk: 16,               // Febrile seizure and ITP are real but rare
      netBenefit: 96,
      evidenceConfidence: 97,
    },
    adverseEvents: [
      { name: "Injection site pain", probability: 20000, severityWeight: 2, type: "mild", notes: "Less common than for injectable bacterial vaccines" },
      { name: "Fever 5–12 days post-vaccination", probability: 5000, severityWeight: 3, type: "mild", notes: "Due to attenuated measles replication; peaks day 6–12" },
      { name: "Mild rash (measles-like)", probability: 5000, severityWeight: 2, type: "mild", notes: "Occurs 5–12 days post-dose 1; not contagious" },
      { name: "Febrile seizure", probability: 25, severityWeight: 35, type: "moderate", notes: "~1 per 3,000 doses (dose 1). Timing: days 6–14. No long-term neurological consequences in controlled studies." },
      { name: "Immune Thrombocytopenia (ITP)", probability: 40, severityWeight: 45, type: "moderate", notes: "~1 per 25,000–40,000 doses. Temporary low platelet count causing bruising. Usually self-resolving; ~6% require treatment." },
      { name: "Anaphylaxis", probability: 3.5, severityWeight: 80, type: "rare-serious", notes: "~3.5 per million doses. Typically within 30 minutes." },
      { name: "Encephalitis (acute)", probability: 0.1, severityWeight: 90, type: "rare-serious", notes: "~1 per 1,000,000 doses vs. 1 in 1,000 from wild measles infection — 1,000x safer." },
      { name: "SSPE from vaccine strain", probability: 0.007, severityWeight: 100, type: "rare-serious", notes: "Theoretical; no confirmed cases of SSPE from vaccine strain. Wild measles SSPE risk: ~1 in 10,000 infections." },
    ],
    scenarioModifiers: {
      daycare: 2.5,
      travel: 4.0,
      outbreak: 6.0,
      siblings: 2.0,
      immunocompromisedHousehold: 2.5,
      ruralVsUrban: 0.6,
    },
    schedule: {
      doses: 2,
      timing: ["12–15 months", "4–6 years"],
      minimumInterval: "4 weeks between doses (minimum 28 days)",
      catchUpNotes: "Unvaccinated children and adults: 2 doses 28 days apart. International travel: infants 6–11 months get 1 dose; re-vaccinate at 12–15 months and 4–6 years.",
      canCombineWith: ["Varicella", "DTaP", "HepA", "HepB", "Meningococcal"],
      cannotCombineWith: ["Do not give to immunocompromised individuals without specialist review"],
    },
    sources: [
      { title: "Demicheli et al. — Vaccines for MMR in children (Cochrane)", type: "meta-analysis", year: 2020, country: "Multi-country", sampleSize: "1.2 million children across 138 studies", confidence: "high" },
      { title: "Jain et al. — Autism and MMR in >95,000 children (JAMA Pediatrics)", type: "cohort", year: 2015, country: "USA", sampleSize: "95,727 children", confidence: "high" },
      { title: "Hviid et al. — MMR and autism (Annals of Internal Medicine)", type: "cohort", year: 2019, country: "Denmark", sampleSize: "650,000 children", confidence: "high" },
      { title: "WHO position paper on measles vaccines", type: "review", year: 2017, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
      { title: "Madsen et al. — MMR and autism in 530,000 Danish children (NEJM)", type: "cohort", year: 2002, country: "Denmark", sampleSize: "530,000 children", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "12–15m, 4–6y", rationale: "Universal 2-dose schedule since 1989. Measles eliminated from USA in 2000 (though outbreaks occur in unvaccinated communities)." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "12–13m, 3y4m", rationale: "MMR controversy (Wakefield 1998) caused coverage to fall; subsequent restoration of confidence required sustained public health effort." },
      { country: "Australia", code: "AU", recommended: true, schedule: "12m, 18m", rationale: "No More Measles campaigns; measles endemic transmission eliminated." },
      { country: "Finland", code: "FI", recommended: true, schedule: "14–18m, 6y", rationale: "Finland achieved measles elimination in 1994 — one of the first countries. Zero endemic transmission since." },
      { country: "Japan", code: "JP", recommended: true, schedule: "12–23m, 5–6y", rationale: "Japan eliminated endemic measles in 2015 after strengthening its 2-dose program." },
    ],
    prosList: [
      "55 years of safety data — the longest record of any combination pediatric vaccine",
      "The largest, most rigorous vaccine safety study ever conducted (Hviid 2019: 650,000 children) found no autism signal",
      "Measles immune amnesia means unvaccinated children are vulnerable to many diseases simultaneously post-infection",
      "SSPE is 100% fatal — the vaccine eliminates this risk entirely",
      "Protects pregnant contacts and their unborn children from congenital rubella syndrome",
      "Measles is so contagious (R0=12–18) that even modest drops in coverage cause large outbreaks",
      "Rubella elimination has nearly eradicated congenital rubella in vaccinated populations",
    ],
    consList: [
      "The Wakefield 1998 fraud created lasting vaccine hesitancy that still affects coverage rates globally",
      "Febrile seizures occur in ~1 per 3,000 doses (real, though typically benign)",
      "Cannot be given to immunocompromised children — this is an important clinical caveat",
      "MMR + varicella (MMRV) combination has 2x febrile seizure rate vs. giving vaccines separately",
      "Contains gelatin stabilizer — relevant for families with religious dietary restrictions",
    ],
    uncertainties: [
      "The exact mechanism of measles immune amnesia and its full long-term consequences are still being characterized",
      "Whether primary and secondary vaccine failure rates are sufficient to eventually require a 3rd dose in adult years",
      "Whether the rubella component immunity duration is sufficient for all women of childbearing age vaccinated in childhood",
    ],
    credibleCritiques: [
      "The Wakefield (1998) MMR-autism claim has been thoroughly refuted by 30+ large studies and over 1.2 million children. Wakefield lost his medical license for research fraud. This is a case study in how a retracted paper caused lasting harm — cited here to document the history, not the science.",
      "Some virologists raise questions about whether herd immunity thresholds calculated for measles (>95%) adequately account for waning immunity in previously vaccinated adults, who now represent a growing susceptible subpopulation (Dine et al., 2004).",
      "Critics note that mumps VE has historically been lower (~88%) than measles VE, and college campus outbreaks in vaccinated populations raise questions about mumps component durability (CDC 2019 — Mumps Cases and Outbreaks).",
    ],
    color: "#ef4444",
    icon: "🦠",
  },

  // ──────────────────────────────────────────────────────────
  // 6. ROTAVIRUS
  // ──────────────────────────────────────────────────────────
  {
    id: "rotavirus",
    name: "Rotavirus",
    brandNames: ["RotaTeq (RV5)", "Rotarix (RV1)"],
    diseases: ["Rotavirus gastroenteritis", "Severe dehydration", "Rotavirus-associated encephalopathy"],
    ageWindow: "2 months – 8 months (oral series)",
    yearsInUse: 19,
    dosesAdministered: "Over 300 million doses globally",
    disease: {
      description: "Rotavirus is the leading cause of severe diarrheal disease in infants and young children worldwide. Before vaccination, it caused ~450,000 child deaths annually globally and ~60,000 hospitalizations per year in the US. By age 5, virtually every child worldwide had been infected at least once. The disease progresses rapidly to severe dehydration in infants.",
      qualityOfLifeImpact: "Rotavirus gastroenteritis causes profuse watery diarrhea (up to 20 episodes/day), vomiting, fever, and severe dehydration that can become life-threatening within hours in infants. Hospitalized children require IV fluids. In low-income countries, rotavirus is a leading killer. Even in the US, the disease causes enormous parental anxiety, missed work, and healthcare utilization. Rare neurological complications (encephalopathy, seizures) occur.",
      transmissionRoute: "Fecal-oral route. Highly stable in the environment — survives on surfaces for weeks. Very low infectious dose. Hand-washing provides limited protection (unlike bacterial diarrhea).",
      incidenceUnvaccinated: 8500,   // ~8,500 per 100k children under 5 (essentially universal exposure)
      incidenceVaccinated: 1020,     // ~88% reduction in severe disease
      mortalityRate: 5,              // ~0.005% in USA; much higher in low-income countries
      hospitalizationRate: 2,        // ~2% of infected infants hospitalized in USA
      icuRate: 0.3,
      chronicSequelaeRate: 0.5,
      acuteQoLLoss: 55,
      longTermQoLLoss: 5,
      outbreakPotential: "very-high",
    },
    effectiveness: {
      againstInfection: 74,          // Against any rotavirus gastroenteritis
      againstSevereDisease: 87,      // Against severe/hospitalized disease
      againstDeath: 96,              // In low-income settings where mortality is high
      waningNotes: "Protection highest in first 2 years of life — the highest-risk period. Immunity wanes but natural boosting from exposure may maintain some protection. No booster recommended.",
      breakthroughNotes: "Vaccinated children can still get rotavirus but illness is milder. Significant reduction in hospitalizations and medical visits even when infection occurs.",
    },
    scores: {
      yearsOfStudy: 70,
      longTermSafetyEvidence: 75,
      exposureRiskBase: 95,          // Essentially universal childhood exposure
      diseaseConsequence: 52,        // Serious in developing world; less so in US with good healthcare
      vaccineRisk: 18,               // Intussusception signal is real
      netBenefit: 78,
      evidenceConfidence: 85,
    },
    adverseEvents: [
      { name: "Mild irritability", probability: 15000, severityWeight: 1, type: "mild", notes: "Common; resolves within 24 hours" },
      { name: "Temporary diarrhea/vomiting", probability: 10000, severityWeight: 3, type: "mild", notes: "Mild gastroenteritis-like symptoms; dose 1 most common" },
      { name: "Intussusception", probability: 1.5, severityWeight: 65, type: "rare-serious", notes: "~1.5 per 100,000 doses (RotaTeq); ~5 per 100,000 (Rotarix) in some studies. Intestinal obstruction requiring intervention. Risk highest days 1–7 after dose 1. Note: previous RotaShield vaccine was withdrawn in 1999 due to much higher intussusception rate (~1 in 10,000); current vaccines have substantially lower risk." },
    ],
    scenarioModifiers: {
      daycare: 2.5,
      travel: 2.0,
      outbreak: 3.0,
      siblings: 1.8,
      immunocompromisedHousehold: 1.5,
      ruralVsUrban: 0.8,
    },
    schedule: {
      doses: 3,
      timing: ["2 months", "4 months", "6 months"],
      minimumInterval: "4 weeks between doses",
      catchUpNotes: "First dose must be given before 15 weeks of age. Series must be completed by 8 months. Do not start if child is older than 15 weeks (intussusception risk).",
      canCombineWith: ["DTaP", "Hib", "PCV", "HepB", "IPV"],
      cannotCombineWith: ["Do not give to immunocompromised infants without specialist review", "SCID — contraindicated"],
    },
    sources: [
      { title: "Vesikari et al. — RotaTeq efficacy (NEJM) — REST Trial", type: "RCT", year: 2006, country: "Multi-country", sampleSize: "70,301 infants", confidence: "high" },
      { title: "Ruiz-Palacios et al. — Rotarix efficacy (NEJM)", type: "RCT", year: 2006, country: "Multi-country", sampleSize: "63,225 infants", confidence: "high" },
      { title: "Parashar et al. — Rotavirus vaccine impact (Lancet Infect Dis)", type: "surveillance", year: 2016, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
      { title: "Yih et al. — Intussusception risk post-rotavirus vaccine (NEJM)", type: "cohort", year: 2014, country: "USA", sampleSize: "1.2 million children", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "2m, 4m, 6m (RotaTeq) or 2m, 4m (Rotarix)", rationale: "Hospitalizations for rotavirus fell 86% after routine recommendation in 2006." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "8w, 12w (Rotarix — 2 dose)", rationale: "Introduced 2013. Hospital admissions for rotavirus fell 70%+." },
      { country: "Australia", code: "AU", recommended: true, schedule: "6w, 4m, 6m or 6w, 4m", rationale: "Universal since 2007. Dramatic reduction in gastroenteritis hospitalizations." },
      { country: "Finland", code: "FI", recommended: true, schedule: "2m, 3m, 5m", rationale: "Universal since 2009; near-elimination of severe rotavirus." },
    ],
    prosList: [
      "Essentially universal childhood exposure means this vaccine benefits nearly every child",
      "Dramatic reduction in hospitalizations (86% in USA post-introduction)",
      "Oral administration — no injection required, reducing infant distress",
      "Critical protection during the highest-risk period (0–2 years) when dehydration is most dangerous",
      "Global child mortality benefit is enormous (hundreds of thousands of deaths prevented annually)",
    ],
    consList: [
      "Relatively newer vaccine (19 years) — long-term data still accumulating compared to older vaccines",
      "Real intussusception risk (~1.5–5 per 100,000) — requires parent counseling",
      "VE against any infection (~74%) lower than some other pediatric vaccines",
      "Strict age limits: cannot start series after 15 weeks of age",
      "Some immunocompromised infants cannot receive the live oral vaccine",
    ],
    uncertainties: [
      "The exact magnitude of the intussusception risk varies between studies and settings — not fully resolved",
      "Whether the vaccine's benefit is equivalent in high-income settings with universal access to IV rehydration vs. low-income settings",
      "Long-term impact on natural rotavirus immunity development — whether vaccinated children have different adult immunity patterns",
    ],
    credibleCritiques: [
      "Some pediatric gastroenterologists argue that in high-income countries with good medical infrastructure (where IV rehydration is readily available), the severity of rotavirus in otherwise healthy infants is manageable, and the intussusception risk (though small) deserves more prominent discussion in parent counseling (Yen et al., 2011).",
      "The original RotaShield vaccine was withdrawn in 1999 due to intussusception (~1 per 10,000). Current vaccines have a substantially lower rate, but critics argue that the FDA and CDC should be more transparent with parents about this class effect rather than presenting the current vaccines as though the RotaShield history doesn't exist.",
      "In low-income countries, the VE of rotavirus vaccines has been lower (50–65%) than in high-income countries (85–95%), possibly due to interference from co-administered oral poliovirus vaccine or nutritional status. This raises equity questions about global recommendations (Patel et al., 2012).",
    ],
    color: "#f59e0b",
    icon: "🦠",
  },
// ──────────────────────────────────────────────────────────────────────────
  // 7. VARICELLA (Chickenpox)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "varicella",
    name: "Varicella",
    brandNames: ["Varivax", "ProQuad (MMRV combo)"],
    diseases: ["Chickenpox (Varicella)", "Shingles (Zoster) — reduced lifetime risk"],
    ageWindow: "12–15 months (dose 1); 4–6 years (dose 2)",
    yearsInUse: 30,
    dosesAdministered: "Over 200 million doses in the US since 1995",
    disease: {
      description: "Varicella-zoster virus causes chickenpox — a highly contagious illness with itchy blisters, fever, and malaise. Before vaccination, nearly every American child contracted it. While often mild, severe complications including bacterial superinfection, pneumonia, encephalitis, and death occurred at meaningful rates. The same virus reactivates decades later as shingles.",
      qualityOfLifeImpact: "Chickenpox causes 5–7 days of significant discomfort, school absence, and parental work disruption. Invasive Group A strep superinfection (flesh-eating bacteria entering through scratched lesions) is a rare but life-threatening complication. Neonatal varicella (if mother infected near delivery) carries up to 30% fatality.",
      transmissionRoute: "Airborne and contact — among the most contagious human pathogens (R₀ 10–12). Contagious from 1–2 days before rash until all lesions crust.",
      incidenceUnvaccinated: 9500,
      incidenceVaccinated: 190,
      mortalityRate: 1.4,
      hospitalizationRate: 0.3,
      icuRate: 0.05,
      chronicSequelaeRate: 0.1,
      acuteQoLLoss: 35,
      longTermQoLLoss: 5,
      outbreakPotential: "high",
    },
    effectiveness: {
      againstInfection: 82,
      againstSevereDisease: 98,
      againstDeath: 99,
      waningNotes: "Protection against severe disease is durable. Protection against mild infection wanes somewhat over 10+ years — breakthrough infections occur in ~15–20% of vaccinated individuals but are universally mild (fewer lesions, no fever, faster resolution).",
      breakthroughNotes: "Breakthrough chickenpox is real but mild. Important: vaccinated children who do get breakthrough are less likely to transmit to others.",
    },
    scores: {
      yearsOfStudy: 80,
      longTermSafetyEvidence: 82,
      exposureRiskBase: 60,
      diseaseConsequence: 52,
      vaccineRisk: 10,
      netBenefit: 82,
      evidenceConfidence: 88,
    },
    adverseEvents: [
      { name: "Injection site pain/redness", probability: 30000, severityWeight: 2, type: "mild", notes: "Very common; self-limiting" },
      { name: "Fever", probability: 15000, severityWeight: 2, type: "mild", notes: "Low-grade; resolves in 1–2 days" },
      { name: "Mild varicella-like rash (vaccine strain)", probability: 3800, severityWeight: 3, type: "mild", notes: "~3–5% of recipients; typically <10 lesions; not contagious in most cases" },
      { name: "Febrile seizure", probability: 3, severityWeight: 35, type: "moderate", notes: "~3 per 100,000; self-resolving; no long-term neurological effect" },
      { name: "Herpes zoster (vaccine strain)", probability: 14, severityWeight: 40, type: "rare-serious", notes: "~14 per 100,000 doses in children; substantially milder than wild-type zoster; very rare transmission to contacts" },
      { name: "Anaphylaxis", probability: 2, severityWeight: 80, type: "rare-serious", notes: "~2 per million doses; gelatin allergy is primary risk factor" },
    ],
    scenarioModifiers: {
      daycare: 1.4,
      travel: 1.2,
      outbreak: 2.8,
      siblings: 1.5,
      immunocompromisedHousehold: 1.8,
      ruralVsUrban: 1.0,
    },
    schedule: {
      doses: 2,
      timing: ["12–15 months", "4–6 years"],
      minimumInterval: "3 months between dose 1 and 2 if administered before age 13; 4 weeks if age 13+",
      catchUpNotes: "Two doses recommended for all susceptible children, adolescents, and adults without evidence of immunity. Adults with no prior disease or vaccination should receive 2 doses 4–8 weeks apart.",
      canCombineWith: ["MMR", "DTaP", "IPV", "HepA"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "CDC: Varicella Vaccination — U.S. Epidemiology Since Licensure", type: "surveillance", year: 2021, country: "USA", sampleSize: "National surveillance 1995–2019", confidence: "high" },
      { title: "Marin et al. — 2-dose varicella vaccine effectiveness", type: "cohort", year: 2016, country: "USA", sampleSize: "~2.3 million children", confidence: "high" },
      { title: "WHO Position Paper on Varicella and Herpes Zoster Vaccines", type: "review", year: 2014, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "12–15m, 4–6y", rationale: "Universal 2-dose schedule since 2006. Eliminated most severe cases; hospitalizations fell 94%." },
      { country: "Germany", code: "DE", recommended: true, schedule: "11–14m, 15–23m", rationale: "STIKO recommends 2-dose universal vaccination." },
      { country: "Australia", code: "AU", recommended: true, schedule: "18m (1 dose — MMRV)", rationale: "1-dose national program; 2-dose private option available." },
      { country: "United Kingdom", code: "GB", recommended: false, schedule: "Not on routine schedule", rationale: "JCVI reviewed and declined universal vaccination in 2010 and 2018, citing concern that widespread vaccination may paradoxically increase adult shingles by reducing natural immune boosting from childhood exposure." },
      { country: "Japan", code: "JP", recommended: true, schedule: "12m, 18m", rationale: "Universal 2-dose schedule since 2014." },
    ],
    prosList: [
      "97% reduction in varicella hospitalizations since vaccine introduction in the US",
      "Near elimination of varicella deaths in children",
      "Prevents serious complications: invasive GAS superinfection, pneumonia, encephalitis",
      "Protects immunocompromised household members who cannot receive the vaccine",
      "Reduces lifetime shingles risk (vaccine-strain virus less likely to reactivate than wild-type)",
      "Eliminates socioeconomic burden: school closures, parental work absence, childcare costs",
    ],
    consList: [
      "82% effectiveness against any infection — breakthrough cases occur in ~15–20% of vaccinated individuals",
      "Vaccine-strain rash (uncommon but possible) — looks like mild chickenpox; can rarely transmit to contacts",
      "UK chose not to add to routine schedule — legitimate scientific debate about population-level shingles risk",
      "2-dose schedule requires second visit at 4–6 years",
      "Gelatin allergy contraindicates vaccine",
    ],
    uncertainties: [
      "Whether widespread childhood vaccination has paradoxically increased adult shingles rates by reducing natural immune boosting from exposure to wild-type virus (the 'exogenous boosting' hypothesis — supported by some models, contested by others)",
      "Long-term impact of shifting disease burden from children to adults in partially vaccinated populations",
      "Duration of vaccine-induced protection against shingles in vaccinated cohorts now entering adulthood",
    ],
    credibleCritiques: [
      "The UK JCVI twice declined universal vaccination based on modeling showing that reducing circulation of wild-type virus may reduce the natural immune boosting that prevents shingles in adults — potentially increasing population-level shingles morbidity even as chickenpox declines (Edmunds & Brisson, 2002; Pinot de Moira et al., 2018).",
      "Some health economists argue that the cost-effectiveness calculation depends heavily on whether productivity losses from parental caregiving are included — removing them narrows the benefit substantially in moderate-income countries.",
      "The 2-dose effectiveness is approximately 82% against any infection, meaning vaccinated children still contribute to transmission clusters in partially vaccinated schools — raising the question of whether herd immunity thresholds are achievable with current vaccine platforms.",
    ],
    color: "#8b5cf6",
    icon: "💜",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 8. HEPATITIS A (HepA)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "hepa",
    name: "Hepatitis A",
    brandNames: ["Havrix", "Vaqta", "Twinrix (HepA+HepB combo)"],
    diseases: ["Hepatitis A"],
    ageWindow: "12–23 months (2-dose series); catch-up at any age",
    yearsInUse: 30,
    dosesAdministered: "Over 100 million doses in the US since 1995",
    disease: {
      description: "Hepatitis A virus (HAV) is a self-limiting liver infection. Unlike HepB, it does not cause chronic disease. However, it causes acute liver failure in ~0.5% of cases, with fatality rates rising sharply in adults and those with pre-existing liver disease. Large outbreaks have swept through homeless communities and produce/restaurant supply chains.",
      qualityOfLifeImpact: "Jaundice, profound fatigue, nausea, and abdominal pain lasting 2–6 weeks. Most working-age adults miss 2–4 weeks of work. A prolonged relapsing form affects ~10–15% and extends illness for months. Full hepatic failure requiring transplant occurs rarely but is devastating.",
      transmissionRoute: "Fecal-oral route — contaminated food, water, or close contact. Very stable in environment; resistant to freezing and chlorination at standard levels.",
      incidenceUnvaccinated: 75,
      incidenceVaccinated: 0.4,
      mortalityRate: 2,
      hospitalizationRate: 22,
      icuRate: 2,
      chronicSequelaeRate: 0,
      acuteQoLLoss: 60,
      longTermQoLLoss: 2,
      outbreakPotential: "high",
    },
    effectiveness: {
      againstInfection: 99,
      againstSevereDisease: 99,
      againstDeath: 99,
      waningNotes: "Mathematical models project protection lasting at least 25–40 years based on antibody decay rates. Booster not currently recommended for immunocompetent individuals after primary series. Some immunocompromised patients may need booster.",
      breakthroughNotes: "Breakthrough infections are exceptionally rare — fewer than 1 per 100,000 vaccinated per year in surveillance data.",
    },
    scores: {
      yearsOfStudy: 78,
      longTermSafetyEvidence: 80,
      exposureRiskBase: 35,
      diseaseConsequence: 58,
      vaccineRisk: 5,
      netBenefit: 85,
      evidenceConfidence: 90,
    },
    adverseEvents: [
      { name: "Injection site pain", probability: 50000, severityWeight: 2, type: "mild", notes: "Most common AE; resolves in 1–2 days" },
      { name: "Headache/fatigue", probability: 15000, severityWeight: 2, type: "mild", notes: "Mild, transient" },
      { name: "Fever", probability: 5000, severityWeight: 2, type: "mild", notes: "Low-grade; uncommon" },
      { name: "Anaphylaxis", probability: 1.0, severityWeight: 80, type: "rare-serious", notes: "~1 per million doses; among the lowest anaphylaxis rates of any vaccine" },
    ],
    scenarioModifiers: {
      daycare: 1.5,
      travel: 3.0,
      outbreak: 3.0,
      siblings: 1.3,
      immunocompromisedHousehold: 1.4,
      ruralVsUrban: 1.1,
    },
    schedule: {
      doses: 2,
      timing: ["12–23 months", "6–18 months after dose 1"],
      minimumInterval: "6 months between dose 1 and dose 2",
      catchUpNotes: "Unvaccinated children through age 18 should receive 2-dose catch-up series. Adults traveling to endemic areas should receive dose 1 at least 2 weeks before departure.",
      canCombineWith: ["MMR", "Varicella", "DTaP", "IPV"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "Fiore et al. — Prevention of Hepatitis A Through Active or Passive Immunization (MMWR)", type: "review", year: 2006, country: "USA", sampleSize: "National surveillance", confidence: "high" },
      { title: "WHO Position Paper on Hepatitis A Vaccines", type: "review", year: 2012, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
      { title: "CDC MMWR — Hepatitis A Outbreaks in Homeless Populations", type: "surveillance", year: 2019, country: "USA", sampleSize: "Multi-state outbreak data", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "12–23m, then 6–18m later", rationale: "Universal childhood vaccination since 2006; previously targeted only high-risk groups." },
      { country: "Israel", code: "IL", recommended: true, schedule: "18m, 24m", rationale: "First country to introduce universal HepA vaccination (1999); incidence fell 95%." },
      { country: "United Kingdom", code: "GB", recommended: false, schedule: "Risk groups and travelers only", rationale: "Not on routine schedule; UK strategy relies on targeted vaccination of risk groups." },
      { country: "Germany", code: "DE", recommended: false, schedule: "Travel and risk groups only", rationale: "Low endemic risk in Germany; STIKO recommends for specific risk groups." },
      { country: "Australia", code: "AU", recommended: false, schedule: "Aboriginal children 12–24m; travelers", rationale: "Universal only in Aboriginal and Torres Strait Islander populations due to higher endemic burden." },
    ],
    prosList: [
      "99% effective — among the highest efficacy of any vaccine",
      "30 years of post-licensure safety data with an exceptionally clean adverse event profile",
      "Prevents a miserable weeks-long illness that causes major work/school disruption",
      "Critical protection for international travel to most of the developing world",
      "Eliminates disease in communities once herd immunity is achieved — demonstrated in Israel and US states that introduced universal vaccination",
      "Single dose provides protection within 2 weeks — useful for pre-travel",
    ],
    consList: [
      "HepA rarely causes death in children — benefit is largest in adults and those with liver disease",
      "Requires 2 doses 6 months apart for full protection",
      "Significant injection site pain (~50% of recipients)",
      "Not on routine schedule in many high-income countries with low endemic risk",
    ],
    uncertainties: [
      "Exact duration of immunity — models predict 25–40 years but real-world cohort data beyond 25 years is limited",
      "Whether single-dose schedules provide sufficient community protection (some countries use 1 dose)",
      "Optimal timing in immunocompromised children where antibody responses may be suboptimal",
    ],
    credibleCritiques: [
      "Some health economists and infectious disease physicians argue that universal toddler vaccination is poorly targeted — the disease burden in children is mild, whereas the vaccine's greatest impact is in adults and those with liver disease. Targeted vaccination of high-risk populations may achieve similar public health outcomes at lower cost (Arguedas et al., 2004).",
      "The 2-dose schedule separated by 6 months creates access challenges in mobile or underserved populations — single-dose programs have been evaluated in some countries with acceptable outcomes, but the US continues to recommend the 2-dose series.",
    ],
    color: "#f97316",
    icon: "🟠",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 9. HPV (Human Papillomavirus)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "hpv",
    name: "HPV",
    brandNames: ["Gardasil 9"],
    diseases: ["Cervical cancer", "Oropharyngeal cancer", "Anal cancer", "Penile cancer", "Vulvar/vaginal cancer", "Genital warts"],
    ageWindow: "9–12 years (2-dose series); 15–26 years (3-dose series); up to 45 years (shared decision)",
    yearsInUse: 18,
    dosesAdministered: "Over 135 million doses in the US; 500 million globally",
    disease: {
      description: "Human papillomavirus is the most common sexually transmitted infection — nearly all sexually active adults will be infected at some point. Most infections clear spontaneously, but persistent infection with high-risk strains (16, 18) causes nearly all cervical cancers and a growing proportion of head and neck cancers. Gardasil 9 covers 9 HPV strains responsible for ~90% of cervical cancers and 90% of genital warts.",
      qualityOfLifeImpact: "Cervical cancer treatment involves surgery, radiation, and chemotherapy with significant impacts on fertility, sexual function, and long-term health. Oropharyngeal cancer (HPV-related) has a better prognosis than tobacco-related oral cancers but involves disfiguring surgery and radiation. Genital warts cause significant psychological distress and social stigma.",
      transmissionRoute: "Skin-to-skin sexual contact. Highly prevalent — estimated 14 million new infections per year in the US alone. Condoms reduce but do not eliminate transmission.",
      incidenceUnvaccinated: 1400,
      incidenceVaccinated: 140,
      mortalityRate: 430,
      hospitalizationRate: 8,
      icuRate: 1,
      chronicSequelaeRate: 1.2,
      acuteQoLLoss: 20,
      longTermQoLLoss: 45,
      outbreakPotential: "low",
    },
    effectiveness: {
      againstInfection: 90,
      againstSevereDisease: 97,
      againstDeath: 90,
      waningNotes: "Antibody levels remain elevated for 12+ years of follow-up with no evidence of waning protection. Modeling projects durable protection for at least 20–30 years. No booster currently recommended for immunocompetent individuals.",
      breakthroughNotes: "Vaccine does not protect against strains not covered. Pre-existing infections at vaccination time are not cleared by vaccine. Greatest efficacy when administered before sexual debut.",
    },
    scores: {
      yearsOfStudy: 72,
      longTermSafetyEvidence: 78,
      exposureRiskBase: 50,
      diseaseConsequence: 82,
      vaccineRisk: 12,
      netBenefit: 88,
      evidenceConfidence: 87,
    },
    adverseEvents: [
      { name: "Injection site pain/swelling", probability: 60000, severityWeight: 2, type: "mild", notes: "Most common AE; resolves in 1–2 days" },
      { name: "Syncope (fainting)", probability: 8000, severityWeight: 10, type: "mild", notes: "~1 in 100 doses in adolescents; requires 15-min post-vaccination observation while seated" },
      { name: "Headache/fatigue", probability: 30000, severityWeight: 2, type: "mild", notes: "Common; transient" },
      { name: "Fever", probability: 13000, severityWeight: 2, type: "mild", notes: "Low-grade; resolves quickly" },
      { name: "Anaphylaxis", probability: 1.7, severityWeight: 80, type: "rare-serious", notes: "~1.7 per million doses; similar to other vaccines" },
      { name: "POTS/postural tachycardia (signal)", probability: 0.5, severityWeight: 40, type: "rare-serious", notes: "Postlicensure surveillance signal; causal relationship not established in controlled studies. Ongoing EMA and CDC monitoring. Background rate of POTS in adolescent females is elevated regardless of vaccination." },
    ],
    scenarioModifiers: {
      daycare: 1.0,
      travel: 1.1,
      outbreak: 1.0,
      siblings: 1.0,
      immunocompromisedHousehold: 1.2,
      ruralVsUrban: 1.2,
    },
    schedule: {
      doses: 2,
      timing: ["9–14 years: Dose 1, then 6–12 months later", "15+ years: Dose 1, 2 months, 6 months"],
      minimumInterval: "5 months between dose 1 and 2 for 2-dose schedule; 4 weeks between doses 1–2 and 3 months between doses 2–3 for 3-dose schedule",
      catchUpNotes: "Catch-up vaccination recommended through age 26. Ages 27–45: shared clinical decision-making based on risk. Immunocompromised individuals of any age: 3-dose series.",
      canCombineWith: ["Tdap", "MenACWY", "Influenza"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "FUTURE II Trial — Gardasil efficacy against HPV 16/18", type: "RCT", year: 2007, country: "Multi-country", sampleSize: "12,167 females", confidence: "high" },
      { title: "Falcaro et al. — Impact of HPV vaccination on cervical cancer in Scotland", type: "cohort", year: 2021, country: "Scotland/UK", sampleSize: "National cancer registry", confidence: "high" },
      { title: "WHO Position Paper on HPV Vaccines", type: "review", year: 2022, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
      { title: "CDC ACIP — HPV Vaccination Recommendations Update 2019", type: "review", year: 2019, country: "USA", sampleSize: "National surveillance", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "2 doses at 9–14y; 3 doses 15+", rationale: "Universal recommendation for all genders since 2011 (females) and 2011 (males). HPV-related cancer rates declining significantly in vaccinated cohorts." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "2 doses 12–13y (all genders)", rationale: "Scotland data showed 89% reduction in cervical cancer in vaccinated birth cohorts — among strongest real-world cancer prevention evidence." },
      { country: "Australia", code: "AU", recommended: true, schedule: "2 doses 12–13y", rationale: "First country to achieve near-elimination of HPV 16/18 related cervical dysplasia in vaccinated cohorts." },
      { country: "Germany", code: "DE", recommended: true, schedule: "2 doses 9–14y; 3 doses 15+", rationale: "STIKO recommends universal vaccination for all genders since 2018." },
      { country: "Japan", code: "JP", recommended: true, schedule: "3 doses 9–14y", rationale: "Suspended active recommendation 2013–2021 due to reported adverse events; reinstituted 2021 after safety review." },
    ],
    prosList: [
      "Near-complete prevention of cervical cancer (89% reduction in Scotland birth cohort)",
      "Prevents cancers in males: penile, anal, oropharyngeal",
      "Eliminates genital warts (HPV 6 and 11) in >90% of cases",
      "Greatest efficacy when given before first sexual exposure — ages 9–12 offer highest protection",
      "Australia approaching near-elimination of cervical cancer as a public health problem",
      "18 years of post-licensure safety data across 500+ million doses",
    ],
    consList: [
      "Does not protect against strains not covered (~10% of cervical cancers caused by other HPV strains)",
      "Does not clear existing infections — benefit reduced if given after sexual debut",
      "Syncope risk in adolescents requires 15-minute post-vaccination observation",
      "Japan suspended active recommendation for 8 years due to adverse event concerns — regulatory controversy remains",
      "3-dose schedule required for older adolescents and adults",
    ],
    uncertainties: [
      "POTS/chronic fatigue syndrome signal: Japan, Denmark, and Ireland received many reports; pharmacovigilance studies have not confirmed causation but the signal has not been definitively ruled out in all analyses (Brinth et al., 2015; WHO GACVS 2017)",
      "Long-term duration of protection beyond 15 years — extrapolated from antibody modeling; real-world cancer endpoints require longer follow-up",
      "Whether vaccinating boys provides sufficient herd protection to justify cost vs. vaccinating boys directly (different countries have reached different conclusions)",
    ],
    credibleCritiques: [
      "Japan's Ministry of Health received thousands of reports of 'complex regional pain syndrome,' POTS, and cognitive symptoms following HPV vaccination, prompting suspension of the proactive recommendation from 2013–2021. The WHO's GACVS investigated and concluded the reported rates were not higher than background — but critics argue the investigation was insufficiently independent and the case definitions were inconsistent (Martínez-Lavín et al., 2017).",
      "Nordic surveillance studies (Denmark, Sweden) found elevated rates of POTS and chronic fatigue in HPV-vaccinated females compared with HPV-unvaccinated controls, though these findings have been contested due to confounding (Donegan et al., 2019 vs. Grimaldi-Bensouda et al., 2017).",
      "Health economists have questioned whether vaccinating males against HPV is cost-effective in countries with high female vaccination coverage, where herd protection to males may be sufficient — arguing resources would achieve more health per dollar if redirected (Chesson et al., 2018).",
    ],
    color: "#ec4899",
    icon: "🎀",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 10. MENINGOCOCCAL ACWY (MenACWY)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "menacwy",
    name: "MenACWY",
    brandNames: ["Menactra", "Menveo", "MenQuadfi"],
    diseases: ["Meningococcal disease (serogroups A, C, W, Y)", "Bacterial meningitis", "Meningococcemia"],
    ageWindow: "11–12 years (dose 1); 16 years (booster); infants 2–23 months if high-risk",
    yearsInUse: 20,
    dosesAdministered: "Over 100 million doses in the US",
    disease: {
      description: "Neisseria meningitidis causes two life-threatening presentations: meningitis (infection of the brain's protective membranes) and meningococcemia (blood infection). The disease's hallmark is its terrifying speed — a healthy teenager can be dead within 24 hours of first symptoms. Survivors face limb amputations, deafness, and cognitive impairment at high rates.",
      qualityOfLifeImpact: "~10–15% of patients die despite antibiotics. Of survivors, ~20% suffer permanent sequelae: limb loss from tissue death (purpura fulminans), hearing loss, neurological damage, and skin scarring. The disease's psychological impact on families is severe — onset is so rapid that many never reach hospital in time.",
      transmissionRoute: "Respiratory droplets and close contact — requires prolonged close contact (kissing, shared cups, living in dormitories). Not highly contagious — most contacts of cases do not develop disease.",
      incidenceUnvaccinated: 1.5,
      incidenceVaccinated: 0.15,
      mortalityRate: 1000,
      hospitalizationRate: 95,
      icuRate: 50,
      chronicSequelaeRate: 20,
      acuteQoLLoss: 90,
      longTermQoLLoss: 40,
      outbreakPotential: "moderate",
    },
    effectiveness: {
      againstInfection: 90,
      againstSevereDisease: 85,
      againstDeath: 85,
      waningNotes: "Antibody levels wane within 3–5 years, which is why a booster at age 16 is recommended for adolescents vaccinated at 11–12. Boosters are particularly important before college dormitory settings (peak risk factor).",
      breakthroughNotes: "Does not protect against serogroup B (MenB) — which requires a separate vaccine. Approximately 30–40% of US meningococcal disease in adolescents is now MenB, not covered by MenACWY.",
    },
    scores: {
      yearsOfStudy: 62,
      longTermSafetyEvidence: 72,
      exposureRiskBase: 15,
      diseaseConsequence: 95,
      vaccineRisk: 8,
      netBenefit: 82,
      evidenceConfidence: 82,
    },
    adverseEvents: [
      { name: "Injection site pain/redness", probability: 40000, severityWeight: 2, type: "mild", notes: "Very common; resolves 1–2 days" },
      { name: "Headache", probability: 25000, severityWeight: 2, type: "mild", notes: "Common in adolescents; transient" },
      { name: "Fatigue/malaise", probability: 20000, severityWeight: 2, type: "mild", notes: "1–2 days post-vaccination" },
      { name: "Fever", probability: 5000, severityWeight: 2, type: "mild", notes: "Uncommon; self-limiting" },
      { name: "Syncope (adolescents)", probability: 3000, severityWeight: 10, type: "mild", notes: "Needle anxiety — requires 15-min observation" },
      { name: "Anaphylaxis", probability: 1.5, severityWeight: 80, type: "rare-serious", notes: "~1.5 per million doses" },
    ],
    scenarioModifiers: {
      daycare: 1.0,
      travel: 2.0,
      outbreak: 3.5,
      siblings: 1.2,
      immunocompromisedHousehold: 1.6,
      ruralVsUrban: 0.9,
    },
    schedule: {
      doses: 2,
      timing: ["11–12 years", "16 years (booster)"],
      minimumInterval: "8 weeks if completing series early; standard: 4–5 years between doses",
      catchUpNotes: "For unvaccinated older teens: 1 dose if 13–15 years, then booster at 16–18. College freshmen living in dorms: strongly consider vaccination if not previously vaccinated. Hajj pilgrims: required by Saudi Arabia.",
      canCombineWith: ["HPV", "Tdap", "Influenza", "MenB"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "Cohn et al. — Prevention and Control of Meningococcal Disease (MMWR)", type: "review", year: 2013, country: "USA", sampleSize: "National surveillance", confidence: "high" },
      { title: "WHO Position Paper — Meningococcal Vaccines", type: "review", year: 2011, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
      { title: "Jackson et al. — Menactra efficacy in adolescents (NEJM)", type: "RCT", year: 2005, country: "USA", sampleSize: "2,829 adolescents", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "11–12y, booster at 16y", rationale: "Adolescent peak risk; dormitory living significantly elevates risk." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "14y + university freshmen", rationale: "UK targets university entry (high-risk exposure) and provides MenACWY + MenB for infants." },
      { country: "Saudi Arabia", code: "SA", recommended: true, schedule: "Required for Hajj pilgrims", rationale: "Mass gatherings create unique outbreak risk — mandatory for all Hajj participants." },
      { country: "Australia", code: "AU", recommended: true, schedule: "12m (MenACWY), 12y, university", rationale: "Universal infant + adolescent schedule." },
    ],
    prosList: [
      "Prevents a disease where 10–15% of patients die and 20% suffer permanent disability",
      "Disease moves so fast that vaccination is the only realistic prevention — antibiotics often arrive too late",
      "Critical for college dormitory settings where risk jumps significantly",
      "Well-established safety record over 20 years",
      "Required for Hajj pilgrimage — important for traveling families",
    ],
    consList: [
      "Very rare disease in absolute terms — exposure risk in average community is very low",
      "Does not cover serogroup B (requires separate MenB vaccine)",
      "Immunity wanes — booster required at age 16",
      "Cost-effectiveness is debated given low absolute disease incidence",
    ],
    uncertainties: [
      "Duration of antibody protection and optimal booster interval beyond current recommendations",
      "Whether mass vaccination has shifted serogroup distribution toward MenB (not covered)",
      "Cost-effectiveness compared with school-based outbreak response strategies",
    ],
    credibleCritiques: [
      "Health economists have questioned whether universal adolescent MenACWY vaccination is cost-effective given the low absolute incidence of meningococcal disease in the US (~300 cases/year total). Models suggest cost per quality-adjusted life year (QALY) saved may exceed standard cost-effectiveness thresholds, though the catastrophic nature of the disease complicates standard QALY analysis (Shepard et al., 2005).",
      "The shift in serogroup distribution — with MenB now accounting for 30–40% of adolescent cases not covered by MenACWY — suggests the vaccine program may be changing the epidemiology in ways that reduce its net coverage of the total disease burden over time.",
    ],
    color: "#6366f1",
    icon: "🔵",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 11. MENINGOCOCCAL B (MenB)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "menb",
    name: "MenB",
    brandNames: ["Bexsero", "Trumenba"],
    diseases: ["Meningococcal disease (serogroup B)", "Bacterial meningitis", "Meningococcemia"],
    ageWindow: "16–23 years (preferred); 10–25 years if high-risk; infants if high-risk",
    yearsInUse: 10,
    dosesAdministered: "Over 10 million doses globally",
    disease: {
      description: "Meningococcal serogroup B is now the dominant serogroup causing meningococcal disease in US adolescents and young adults (30–40% of cases). The same devastating clinical picture as other serogroups — rapid-onset bacterial meningitis or meningococcemia, with 10–15% mortality and 20% permanent disability rate.",
      qualityOfLifeImpact: "Identical to meningococcal disease generally — potential for death within 24 hours, limb amputation, deafness, and neurological damage. University campuses have experienced cluster outbreaks requiring emergency vaccination campaigns.",
      transmissionRoute: "Respiratory droplets and close/prolonged contact. College dormitories and parties represent key exposure settings.",
      incidenceUnvaccinated: 0.7,
      incidenceVaccinated: 0.1,
      mortalityRate: 1000,
      hospitalizationRate: 95,
      icuRate: 50,
      chronicSequelaeRate: 20,
      acuteQoLLoss: 90,
      longTermQoLLoss: 40,
      outbreakPotential: "moderate",
    },
    effectiveness: {
      againstInfection: 63,
      againstSevereDisease: 63,
      againstDeath: 70,
      waningNotes: "Effectiveness estimates are 63–73% based on post-licensure real-world studies — lower than many vaccines but meaningful for a disease with no other prevention option. Immunity wanes within 1–2 years; additional doses may be needed for ongoing high-risk exposure.",
      breakthroughNotes: "The polysaccharide structure of MenB makes it harder to generate durable immune responses compared with conjugate vaccines. Vaccine effectiveness varies by study and outbreak setting.",
    },
    scores: {
      yearsOfStudy: 40,
      longTermSafetyEvidence: 55,
      exposureRiskBase: 10,
      diseaseConsequence: 95,
      vaccineRisk: 15,
      netBenefit: 68,
      evidenceConfidence: 62,
    },
    adverseEvents: [
      { name: "Injection site pain (severe)", probability: 70000, severityWeight: 5, type: "mild", notes: "The most reactogenic of the adolescent vaccines — significant arm pain common" },
      { name: "Fever >38°C", probability: 25000, severityWeight: 4, type: "mild", notes: "More common than most vaccines; usually resolves 24–48h" },
      { name: "Headache/fatigue", probability: 40000, severityWeight: 3, type: "mild", notes: "Common; transient" },
      { name: "Myalgia/arthralgia", probability: 30000, severityWeight: 3, type: "mild", notes: "Muscle and joint pain 1–3 days post-vaccination" },
      { name: "Anaphylaxis", probability: 1.5, severityWeight: 80, type: "rare-serious", notes: "~1.5 per million doses" },
    ],
    scenarioModifiers: {
      daycare: 1.0,
      travel: 1.8,
      outbreak: 4.0,
      siblings: 1.2,
      immunocompromisedHousehold: 1.8,
      ruralVsUrban: 0.9,
    },
    schedule: {
      doses: 2,
      timing: ["Dose 1", "Dose 2: 1 month later (Bexsero) or 6 months later (Trumenba)"],
      minimumInterval: "4 weeks (Bexsero); 6 months (Trumenba standard) or 1–6 months accelerated",
      catchUpNotes: "Category B recommendation: shared clinical decision-making for ages 16–23. Strongly recommended during outbreaks and for patients with complement deficiencies, functional asplenia, or eculizumab use.",
      canCombineWith: ["MenACWY", "HPV", "Tdap"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "Patton et al. — Real-world effectiveness of MenB vaccines (Lancet)", type: "cohort", year: 2022, country: "UK/USA", sampleSize: "Multi-country surveillance", confidence: "moderate" },
      { title: "WHO Position Paper — Meningococcal B Vaccines", type: "review", year: 2022, country: "Global", sampleSize: "Global surveillance", confidence: "moderate" },
      { title: "CDC ACIP — MenB Vaccination Recommendations (MMWR)", type: "review", year: 2015, country: "USA", sampleSize: "National disease surveillance", confidence: "moderate" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: false, schedule: "Category B: shared decision 16–23y; Category A for high-risk", rationale: "ACIP gave Category B recommendation — not universally recommended. Providers and patients should decide together." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "Infants: 8w, 16w, 1y", rationale: "UK added MenB to infant schedule in 2015 — first country to do so. Significant reduction in infant meningococcal B disease." },
      { country: "Italy", code: "IT", recommended: true, schedule: "Infants + adolescents", rationale: "Universal infant and catch-up adolescent vaccination program." },
      { country: "Australia", code: "AU", recommended: false, schedule: "State-level variation; some programs offer adolescent vaccination", rationale: "Not yet in national schedule; some states provide." },
    ],
    prosList: [
      "Only vaccine that protects against serogroup B — now the dominant cause of teen/young adult meningococcal disease in the US",
      "UK infant program showed significant reduction in MenB disease",
      "Provides some protection against the most feared adolescent infectious disease",
      "Can be co-administered with MenACWY for complete meningococcal coverage",
    ],
    consList: [
      "Category B (not universally recommended) in the US — only shared decision-making",
      "Lower effectiveness (63%) than most vaccines",
      "Most reactogenic adolescent vaccine — significant pain, fever, and fatigue common",
      "Short duration of immunity — may wane within 1–2 years",
      "Limited long-term safety and effectiveness data (only licensed since 2014–2015)",
    ],
    uncertainties: [
      "Real-world effectiveness estimates range from 50–73% across different studies and outbreak settings — substantial uncertainty",
      "Optimal dose spacing and need for boosters not well-established",
      "Long-term duration of protection — insufficient data beyond 5 years",
      "Cost-effectiveness at population level given low disease incidence and vaccine reactogenicity",
    ],
    credibleCritiques: [
      "The ACIP deliberately chose not to give a Category A (universal) recommendation, instead issuing a Category B recommendation for individual shared decision-making — an unusual move reflecting genuine uncertainty about population-level benefit vs. burden. The decision acknowledged that at current disease rates, mass vaccination would prevent very few cases while exposing millions to a reactogenic vaccine (Mbaeyi et al., 2019).",
      "Post-licensure effectiveness data from real-world outbreaks has been mixed — some college outbreaks occurred in vaccinated individuals, and effectiveness in outbreak settings may differ from the 63% population estimate (Pelton et al., 2021).",
    ],
    color: "#7c3aed",
    icon: "🟣",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 12. RSV VACCINE (Infant/Maternal)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "rsv",
    name: "RSV Protection",
    brandNames: ["Nirsevimab (Beyfortus — monoclonal antibody)", "Abrysvo (maternal vaccine)", "mRESVIA (older adults)"],
    diseases: ["Respiratory Syncytial Virus (RSV)", "RSV bronchiolitis", "RSV pneumonia"],
    ageWindow: "Nirsevimab: all infants <8 months entering RSV season; maternal Abrysvo: 32–36 weeks gestation",
    yearsInUse: 2,
    dosesAdministered: "Nirsevimab: millions of doses since 2023 US approval; Abrysvo: recently approved",
    disease: {
      description: "RSV is the leading cause of infant hospitalization in the US — responsible for 58,000–80,000 hospitalizations and 100–300 infant deaths annually. Nearly all children are infected by age 2. In most, it causes a cold. In the youngest infants, it can progress to severe bronchiolitis requiring oxygen, IV fluids, and ICU care. Former premature infants and those with cardiac or pulmonary conditions are at highest risk.",
      qualityOfLifeImpact: "Severe RSV bronchiolitis is distressing for both infants and parents — infants struggle to breathe and feed, sometimes requiring 5–10 days of hospitalization. Long-term: RSV is associated with increased risk of recurrent wheezing and asthma in childhood, though causation vs. correlation is debated.",
      transmissionRoute: "Respiratory droplets and contact with contaminated surfaces. Highly contagious. RSV season runs October–March in temperate climates.",
      incidenceUnvaccinated: 7800,
      incidenceVaccinated: 1560,
      mortalityRate: 20,
      hospitalizationRate: 0.5,
      icuRate: 0.1,
      chronicSequelaeRate: 0.2,
      acuteQoLLoss: 55,
      longTermQoLLoss: 8,
      outbreakPotential: "high",
    },
    effectiveness: {
      againstInfection: 75,
      againstSevereDisease: 80,
      againstDeath: 80,
      waningNotes: "Nirsevimab (monoclonal antibody) provides protection for the entire RSV season (approximately 5 months). It is not a vaccine — it provides passive immunization. Annual administration at the start of each RSV season may be needed until the child's immune system matures. Maternal Abrysvo vaccine provides protection through maternal antibodies for approximately 3–6 months post-birth.",
      breakthroughNotes: "Protection is not complete — some breakthrough RSV infections occur, but hospitalizations are substantially reduced. First RSV season is highest risk.",
    },
    scores: {
      yearsOfStudy: 20,
      longTermSafetyEvidence: 30,
      exposureRiskBase: 75,
      diseaseConsequence: 62,
      vaccineRisk: 8,
      netBenefit: 75,
      evidenceConfidence: 72,
    },
    adverseEvents: [
      { name: "Injection site reactions (nirsevimab)", probability: 3000, severityWeight: 2, type: "mild", notes: "Low rate; monoclonal antibodies generally well tolerated" },
      { name: "Rash (nirsevimab)", probability: 1000, severityWeight: 2, type: "mild", notes: "Uncommon; transient" },
      { name: "Injection site pain (maternal Abrysvo)", probability: 60000, severityWeight: 2, type: "mild", notes: "Most common AE in pregnant women" },
      { name: "Fatigue/headache (maternal Abrysvo)", probability: 25000, severityWeight: 2, type: "mild", notes: "Common; transient" },
      { name: "Preterm birth signal (Abrysvo)", probability: 0.5, severityWeight: 70, type: "rare-serious", notes: "An imbalance in preterm births was observed in the Abrysvo trial (5.7% vs 4.7% placebo). FDA approved with labeling and a REMS; causal relationship not confirmed. Monitoring ongoing." },
    ],
    scenarioModifiers: {
      daycare: 1.5,
      travel: 1.2,
      outbreak: 2.0,
      siblings: 1.6,
      immunocompromisedHousehold: 1.4,
      ruralVsUrban: 1.3,
    },
    schedule: {
      doses: 1,
      timing: ["Nirsevimab: single dose before or at start of RSV season (October–March)", "Maternal Abrysvo: single dose 32–36 weeks gestation"],
      minimumInterval: "N/A (single dose)",
      catchUpNotes: "Infants born April–September: administer nirsevimab when RSV season begins. Preterm infants in their second RSV season who remain high-risk may receive additional dosing per provider guidance.",
      canCombineWith: ["All routine infant vaccines"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "MELODY Trial — Nirsevimab efficacy (NEJM)", type: "RCT", year: 2022, country: "Multi-country", sampleSize: "1,490 infants", confidence: "high" },
      { title: "MATISSE Trial — Abrysvo maternal vaccination (NEJM)", type: "RCT", year: 2023, country: "Multi-country", sampleSize: "7,392 women", confidence: "high" },
      { title: "CDC MMWR — RSV Surveillance and Nirsevimab Implementation", type: "surveillance", year: 2024, country: "USA", sampleSize: "National surveillance", confidence: "moderate" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "Nirsevimab: all infants <8m entering RSV season; maternal Abrysvo or infant nirsevimab (not both)", rationale: "CDC ACIP added nirsevimab to immunization schedule in 2023. Maternal vaccine alternative." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "Maternal RSV vaccine in pregnancy (from 2024)", rationale: "UK added maternal RSV vaccination program in 2024 — first country to do so at national scale." },
      { country: "European Union", code: "EU", recommended: true, schedule: "Nirsevimab approved; country-specific implementation", rationale: "EMA approved nirsevimab; national programs vary." },
    ],
    prosList: [
      "RSV is the #1 reason infants are hospitalized — this directly addresses a major unmet need",
      "Phase 3 trial showed 80% reduction in RSV hospitalizations",
      "Monoclonal antibody (not a live vaccine) — especially suitable for premature infants and immunocompromised",
      "No 'active' immune response required — works immediately, unlike traditional vaccines",
      "Maternal vaccination option means protection from birth without an infant injection",
    ],
    consList: [
      "Very new product — only 2 years of post-approval safety data",
      "Not a traditional vaccine — requires annual administration as passive immunization",
      "Preterm birth signal from maternal Abrysvo trial — ongoing monitoring and FDA advisory",
      "Supply and cost challenges — new to immunization schedule",
      "75–80% effectiveness means substantial RSV disease still occurs",
    ],
    uncertainties: [
      "The preterm birth imbalance observed in the Abrysvo trial (5.7% vs 4.7% in placebo) requires ongoing monitoring — causal mechanism unclear, but FDA added it to prescribing information",
      "Long-term impact on RSV immunity development in infants who receive passive antibody protection — does it delay but not eliminate susceptibility?",
      "Cost-effectiveness at population scale, particularly for nirsevimab which requires annual administration",
      "Optimal strategy: maternal vaccine vs. infant monoclonal antibody — not yet resolved by evidence",
    ],
    credibleCritiques: [
      "The FDA approved Abrysvo despite a numerical imbalance in preterm births in the trial (5.7% vs 4.7%), and the FDA's Vaccines and Related Biological Products Advisory Committee voted 10–4 that the preterm birth signal did not outweigh benefits. Four dissenting votes from an FDA advisory committee is notable and uncommon — the minority argued that restricting to 32–36 weeks (rather than earlier) was insufficient mitigation (FDA VRBPAC, 2023).",
      "Nirsevimab is a monoclonal antibody, not a traditional vaccine — its annual administration requirement and cost raise sustainability questions for universal programs in lower-income settings or Medicaid-reliant systems where reimbursement pathways are still being established.",
    ],
    color: "#06b6d4",
    icon: "👶",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 13. INFLUENZA (Seasonal Flu)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "influenza",
    name: "Influenza",
    brandNames: ["Fluzone", "Flucelvax", "Flulaval", "FluMist (LAIV, nasal)", "Fluad (adjuvanted, 65+)"],
    diseases: ["Influenza A", "Influenza B", "Secondary bacterial pneumonia", "Influenza encephalitis"],
    ageWindow: "6 months and older annually; 2 doses first year for children under 9",
    yearsInUse: 80,
    dosesAdministered: "175–200 million doses in US annually",
    disease: {
      description: "Seasonal influenza infects 9–45 million Americans annually and kills 12,000–52,000 per year depending on strain severity. Children under 5, adults over 65, pregnant women, and immunocompromised individuals face the highest risk of severe disease. Flu is not 'just a bad cold' — it can cause viral pneumonia, encephalitis, myocarditis, and bacterial superinfection. The 1918 pandemic killed 50–100 million people.",
      qualityOfLifeImpact: "Severe flu causes 3–7 days of high fever, body aches, profound fatigue, and respiratory symptoms. Hospitalization rates rise sharply with age. Long COVID-like post-influenza fatigue syndrome exists but is underrecognized. Flu during pregnancy increases risk of premature birth and maternal mortality.",
      transmissionRoute: "Respiratory droplets and aerosols. Highly contagious. Seasonal — peaks October–March. Antigenic drift requires annual reformulation of the vaccine.",
      incidenceUnvaccinated: 12000,
      incidenceVaccinated: 5000,
      mortalityRate: 15,
      hospitalizationRate: 1.5,
      icuRate: 0.2,
      chronicSequelaeRate: 0.1,
      acuteQoLLoss: 60,
      longTermQoLLoss: 3,
      outbreakPotential: "high",
    },
    effectiveness: {
      againstInfection: 40,
      againstSevereDisease: 65,
      againstDeath: 50,
      waningNotes: "Effectiveness varies year to year based on how well the vaccine matches the circulating strains (range: 10–60%). In well-matched years, 50–65% effective against hospitalization. High-dose and adjuvanted formulations are more effective in adults 65+. Protection wanes over the season — ideal timing is late October.",
      breakthroughNotes: "Breakthrough influenza is common due to antigenic mismatch. Vaccinated individuals who get flu typically have milder illness and lower risk of death and hospitalization.",
    },
    scores: {
      yearsOfStudy: 95,
      longTermSafetyEvidence: 90,
      exposureRiskBase: 70,
      diseaseConsequence: 60,
      vaccineRisk: 5,
      netBenefit: 74,
      evidenceConfidence: 75,
    },
    adverseEvents: [
      { name: "Injection site soreness", probability: 25000, severityWeight: 2, type: "mild", notes: "Most common; resolves in 1–2 days" },
      { name: "Low-grade fever/malaise", probability: 10000, severityWeight: 2, type: "mild", notes: "Immune response; resolves in 24–48h" },
      { name: "Headache", probability: 8000, severityWeight: 2, type: "mild", notes: "Uncommon" },
      { name: "FluMist (LAIV) nasal congestion", probability: 20000, severityWeight: 2, type: "mild", notes: "Expected with live attenuated intranasal vaccine; transient" },
      { name: "Febrile seizure (children)", probability: 4, severityWeight: 35, type: "moderate", notes: "~4 per 100,000 in young children when given simultaneously with PCV; no long-term effects" },
      { name: "Guillain-Barré Syndrome", probability: 1.0, severityWeight: 75, type: "rare-serious", notes: "~1–2 excess cases per million doses above background rate. Background rate of GBS is ~1–2 per 100,000 per year. Wild influenza infection itself causes GBS at a much higher rate." },
      { name: "Anaphylaxis", probability: 1.4, severityWeight: 80, type: "rare-serious", notes: "~1.4 per million doses" },
    ],
    scenarioModifiers: {
      daycare: 1.5,
      travel: 1.3,
      outbreak: 2.5,
      siblings: 1.4,
      immunocompromisedHousehold: 1.6,
      ruralVsUrban: 1.1,
    },
    schedule: {
      doses: 1,
      timing: ["Annually, ideally by end of October"],
      minimumInterval: "4 weeks between 2 doses for children under 9 receiving flu vaccine for the first time",
      catchUpNotes: "Children 6 months to 8 years receiving flu vaccine for the first time need 2 doses 4 weeks apart in the first season. Annual vaccination recommended for everyone 6 months and older.",
      canCombineWith: ["All routine vaccines"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "CDC MMWR — Influenza Vaccination Coverage and Effectiveness", type: "surveillance", year: 2024, country: "USA", sampleSize: "National surveillance", confidence: "high" },
      { title: "Cochrane Review: Vaccines for preventing influenza in healthy adults", type: "meta-analysis", year: 2018, country: "Multi-country", sampleSize: "52 clinical trials", confidence: "high" },
      { title: "DiazGranados et al. — High-Dose vs Standard-Dose Influenza Vaccine (NEJM)", type: "RCT", year: 2014, country: "USA/Canada", sampleSize: "31,989 adults 65+", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "Annual for all ages 6m+", rationale: "Universal annual vaccination since 2010." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "Annual: all children 2–17y, adults 65+, risk groups, pregnant", rationale: "Age-targeted program; LAIV nasal spray preferred for children." },
      { country: "Australia", code: "AU", recommended: true, schedule: "Annual: 6m–5y, 65+, Indigenous, risk groups", rationale: "Universal recommendation expanding; free to targeted groups." },
      { country: "Germany", code: "DE", recommended: false, schedule: "Recommended for 60+, risk groups, pregnant", rationale: "STIKO does not recommend universal child vaccination; targets high-risk." },
    ],
    prosList: [
      "80+ years of post-licensure safety data — one of the most studied vaccines in history",
      "Prevents 12,000–52,000 deaths annually in the US in vaccinated years",
      "Reduces pediatric flu deaths by ~65% in vaccinated children",
      "Protects pregnant women and reduces premature birth risk",
      "Reduces hospitalization and severe disease even in mismatch years",
      "Annual vaccination reinforces surveillance system that monitors for pandemic strains",
    ],
    consList: [
      "Variable effectiveness (10–60%) depending on strain match — can be as low as 10% in poorly matched years",
      "Does not prevent all flu — breakthrough infections are common",
      "Annual administration required — can become a burden",
      "FluMist (nasal) not recommended for immunocompromised or some high-risk groups",
      "GBS risk: ~1 excess case per million doses (though flu itself causes GBS at higher rate)",
    ],
    uncertainties: [
      "Optimal timing within the flu season — too early may result in waning protection before peak season",
      "Whether universal child vaccination reduces mortality in older adults through herd effects (promising data but not conclusive)",
      "Universal vs. targeted vaccination cost-effectiveness in countries with limited healthcare budgets",
      "Long-term impact of annual vaccination on immune imprinting (early childhood exposures may shape lifetime flu immunity in ways that are still being studied)",
    ],
    credibleCritiques: [
      "The Cochrane Collaboration's systematic review of influenza vaccine efficacy in healthy adults (Jefferson et al., 2018, 52 trials) found that while NNT (number needed to vaccinate to prevent one flu case) ranged from 40–71 depending on year, the absolute reduction in hospitalization and death was modest in healthy adults — leading some health economists to question whether universal rather than targeted vaccination is the optimal strategy.",
      "Immune imprinting research (the 'original antigenic sin' hypothesis, updated as 'original antigenic sin' in modern immunology) suggests that early childhood flu vaccinations may shape the immune system's response to novel strains for life — raising questions about whether annual vaccination in very young children affects their long-term influenza immunity architecture (Gostic et al., 2019; PNAS).",
    ],
    color: "#0891b2",
    icon: "🌊",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 14. COVID-19
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "covid19",
    name: "COVID-19",
    brandNames: ["Moderna mRNA-1273", "Pfizer-BioNTech BNT162b2 (Comirnaty)", "Novavax NVX-CoV2373 (protein subunit)"],
    diseases: ["COVID-19", "Long COVID", "MIS-C (Multisystem Inflammatory Syndrome in Children)", "Post-COVID cardiac complications"],
    ageWindow: "6 months and older; updated annually for ongoing protection",
    yearsInUse: 4,
    dosesAdministered: "Over 680 million doses in the US; 13+ billion doses globally",
    disease: {
      description: "SARS-CoV-2 caused a global pandemic responsible for 7+ million confirmed deaths (likely 20+ million excess deaths). In children, COVID-19 is generally mild but can cause MIS-C (a rare but serious inflammatory syndrome), hospitalization in very young infants and those with comorbidities, and long COVID symptoms. The virus continues to circulate with ongoing antigenic evolution requiring updated vaccine formulations.",
      qualityOfLifeImpact: "Acute COVID-19 in children: typically mild respiratory illness. Risk groups: infants <1 year, obese children, those with immunocompromising conditions, diabetes, or complex chronic conditions. Long COVID in children: fatigue, cognitive symptoms, and exercise intolerance reported in 2–10% (estimates vary widely). MIS-C: serious cardiac inflammation occurring 2–6 weeks post-infection in ~1 per 3,000 infections.",
      transmissionRoute: "Airborne — aerosols remain suspended for hours in poorly ventilated spaces. Highly transmissible. Multiple variants have emerged with varying transmissibility and immune escape characteristics.",
      incidenceUnvaccinated: 8000,
      incidenceVaccinated: 2400,
      mortalityRate: 8,
      hospitalizationRate: 0.6,
      icuRate: 0.08,
      chronicSequelaeRate: 3.0,
      acuteQoLLoss: 45,
      longTermQoLLoss: 15,
      outbreakPotential: "high",
    },
    effectiveness: {
      againstInfection: 50,
      againstSevereDisease: 73,
      againstDeath: 80,
      waningNotes: "Protection against infection wanes significantly within 3–6 months (20–30% by 6 months). Protection against hospitalization and death remains more durable (50–70% at 6 months). Updated formulations targeting current variants are recommended annually. Hybrid immunity (vaccination + prior infection) provides stronger and more durable protection.",
      breakthroughNotes: "Breakthrough infections are common and expected. Vaccinated individuals who contract COVID-19 have substantially lower rates of hospitalization, ICU admission, and death.",
    },
    scores: {
      yearsOfStudy: 30,
      longTermSafetyEvidence: 45,
      exposureRiskBase: 65,
      diseaseConsequence: 50,
      vaccineRisk: 18,
      netBenefit: 65,
      evidenceConfidence: 65,
    },
    adverseEvents: [
      { name: "Injection site pain/swelling", probability: 70000, severityWeight: 3, type: "mild", notes: "Very common; resolves 1–2 days" },
      { name: "Fatigue/fever/chills", probability: 50000, severityWeight: 4, type: "mild", notes: "Common systemic reaction, especially after dose 2; resolves 1–3 days" },
      { name: "Headache/myalgia", probability: 45000, severityWeight: 3, type: "mild", notes: "Common; transient" },
      { name: "Myocarditis/pericarditis", probability: 4.2, severityWeight: 70, type: "rare-serious", notes: "~4–11 per 100,000 in males 12–29 after mRNA dose 2. Most cases are mild and resolve. Rare severe cases. Risk highest in young males after mRNA dose 2. Risk from COVID-19 infection itself is substantially higher." },
      { name: "Anaphylaxis", probability: 4.7, severityWeight: 80, type: "rare-serious", notes: "~4.7 per million doses for mRNA vaccines — higher than some vaccines; 30-min observation recommended" },
    ],
    scenarioModifiers: {
      daycare: 1.4,
      travel: 1.3,
      outbreak: 2.0,
      siblings: 1.3,
      immunocompromisedHousehold: 1.8,
      ruralVsUrban: 1.1,
    },
    schedule: {
      doses: 1,
      timing: ["Initial series (2–3 doses depending on product)", "Annual updated booster recommended"],
      minimumInterval: "8 weeks between primary doses for mRNA vaccines in most individuals; varies by product",
      catchUpNotes: "ACIP recommends updated annual COVID-19 vaccine for all persons 6 months and older. For immunocompromised individuals: additional doses may be recommended. Novavax protein subunit vaccine available for those preferring non-mRNA option.",
      canCombineWith: ["Influenza", "RSV"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "Polack et al. — Safety and Efficacy of BNT162b2 mRNA Vaccine (NEJM)", type: "RCT", year: 2020, country: "Multi-country", sampleSize: "43,548 participants", confidence: "high" },
      { title: "Baden et al. — Efficacy and Safety of mRNA-1273 SARS-CoV-2 Vaccine (NEJM)", type: "RCT", year: 2021, country: "USA", sampleSize: "30,420 participants", confidence: "high" },
      { title: "Mevorach et al. — Myocarditis after BNT162b2 Vaccination in Israel (NEJM)", type: "cohort", year: 2021, country: "Israel", sampleSize: "2.5 million vaccinees", confidence: "high" },
      { title: "CDC MMWR — COVID-19 VE against Hospitalization in Children", type: "surveillance", year: 2023, country: "USA", sampleSize: "VISION Network surveillance", confidence: "moderate" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "Annual updated vaccine 6m+", rationale: "ACIP recommends annual updated COVID-19 vaccine for all ages. Shared clinical decision-making for low-risk individuals." },
      { country: "United Kingdom", code: "GB", recommended: false, schedule: "65+, risk groups, healthcare workers; annual", rationale: "JCVI moved to targeted strategy in 2023 — healthy children and most adults under 65 not offered routine vaccination." },
      { country: "Australia", code: "AU", recommended: false, schedule: "65+, Aboriginal, immunocompromised; annual", rationale: "Australia moved to targeted vaccination for those most at risk from severe disease." },
      { country: "Germany", code: "DE", recommended: false, schedule: "60+, risk groups", rationale: "STIKO recommends only for high-risk groups following primary immunization." },
    ],
    prosList: [
      "73% reduction in COVID-19 hospitalization in vaccinated vs. unvaccinated children during high-circulation periods",
      "Prevents MIS-C — a rare but serious inflammatory complication",
      "Critical for immunocompromised children and those with comorbidities where COVID can be severe",
      "mRNA platform allows rapid updating to match new variants",
      "Global evidence base: 13 billion doses with well-characterized safety profile",
    ],
    consList: [
      "Waning protection against infection within 3–6 months requires annual updates",
      "Myocarditis risk in adolescent males (4–11 per 100,000) — mild in most cases but requiring discussion",
      "Effectiveness varies significantly by variant and time since vaccination",
      "US continues recommending for all children; UK, Australia, Germany have shifted to targeted approach",
      "Policy divergence between countries reflects genuine uncertainty about optimal strategy for low-risk children",
    ],
    uncertainties: [
      "Long COVID rates in children: estimates range from 2–25% depending on case definition and study methodology — significant uncertainty",
      "Optimal dosing schedule for updated annual vaccines given rapid antigenic evolution",
      "Long-term cardiac outcomes following vaccine-associated myocarditis — most resolve but monitoring continues",
      "Whether annual COVID-19 vaccination of healthy low-risk children is cost-effective compared with vaccination of high-risk individuals only",
    ],
    credibleCritiques: [
      "Cochrane's review of COVID-19 vaccine studies highlighted methodological issues in some trials; more broadly, the rapid vaccine development and authorization process — while justified by pandemic urgency — meant that some long-term safety endpoints (>2 years) were not evaluated prior to authorization. Critics argue this should be acknowledged more explicitly in public communications (Jefferson et al., 2023).",
      "The myocarditis signal in adolescent males following mRNA dose 2 is documented and real. While most cases are mild and self-resolving, some pediatric cardiologists have raised concerns about using the most reactogenic dosing schedule (dose 2 rather than extended-interval or half-dose approaches) in the lowest-risk age group. Some countries adopted extended intervals specifically to reduce this risk (Canadian National Advisory Committee on Immunization, 2021).",
      "Major Western health agencies (UK, Australia, Germany) declined to recommend universal COVID-19 vaccination for healthy children — a divergence from the US ACIP position that reflects genuine policy disagreement about the risk-benefit balance in low-risk pediatric populations, not anti-vaccine sentiment.",
    ],
    color: "#3b82f6",
    icon: "🦠",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 15. ZOSTER (Shingles — Shingrix)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "zoster",
    name: "Zoster (Shingrix)",
    brandNames: ["Shingrix (RZV — recombinant zoster vaccine)"],
    diseases: ["Herpes Zoster (Shingles)", "Postherpetic Neuralgia (PHN)", "Zoster ophthalmicus", "Zoster-related stroke"],
    ageWindow: "50 years and older (2 doses); immunocompromised adults 19+",
    yearsInUse: 7,
    dosesAdministered: "Over 40 million doses in the US since 2017",
    disease: {
      description: "The same varicella-zoster virus (VZV) that causes childhood chickenpox lies dormant in nerve ganglia for life. As cellular immunity declines with age, the virus reactivates as shingles — a painful, blistering rash along a nerve dermatome. 1 in 3 Americans will develop shingles in their lifetime. Postherpetic neuralgia (PHN), a burning neuropathic pain lasting months to years, is the most feared complication.",
      qualityOfLifeImpact: "Shingles rash causes severe burning and stabbing pain. PHN affects 10–15% of patients over 60 and can be completely debilitating — constant, severe neuropathic pain that interferes with sleep, concentration, and daily function for months or years. Older patients describe PHN as among the most severe chronic pain experiences. Zoster ophthalmicus can cause vision loss.",
      transmissionRoute: "Not transmitted person-to-person as shingles. Virus can be transmitted from active shingles lesions to unvaccinated chickenpox-naive individuals (who then get chickenpox, not shingles).",
      incidenceUnvaccinated: 1000,
      incidenceVaccinated: 80,
      mortalityRate: 3,
      hospitalizationRate: 2,
      icuRate: 0.2,
      chronicSequelaeRate: 15,
      acuteQoLLoss: 70,
      longTermQoLLoss: 35,
      outbreakPotential: "low",
    },
    effectiveness: {
      againstInfection: 91,
      againstSevereDisease: 89,
      againstDeath: 85,
      waningNotes: "Shingrix maintains >85% effectiveness through 7 years of follow-up — substantially more durable than the older Zostavax vaccine (which waned to <40% after 5–6 years). Protection expected to last at least 10 years based on current data. Immune response declines more slowly because Shingrix uses an AS01B adjuvant that generates strong CD4+ T-cell responses.",
      breakthroughNotes: "Breakthrough shingles after Shingrix is uncommon and typically milder. PHN risk is substantially reduced even in breakthrough cases.",
    },
    scores: {
      yearsOfStudy: 50,
      longTermSafetyEvidence: 68,
      exposureRiskBase: 45,
      diseaseConsequence: 75,
      vaccineRisk: 15,
      netBenefit: 88,
      evidenceConfidence: 88,
    },
    adverseEvents: [
      { name: "Injection site pain (severe)", probability: 78000, severityWeight: 5, type: "mild", notes: "Most common AE; 78% of recipients report moderate to strong pain" },
      { name: "Fatigue/myalgia", probability: 57000, severityWeight: 5, type: "mild", notes: "Strong systemic reactions common; some describe feeling unwell for 1–3 days" },
      { name: "Headache", probability: 38000, severityWeight: 3, type: "mild", notes: "Common; resolves 1–3 days" },
      { name: "Fever/chills", probability: 21000, severityWeight: 4, type: "mild", notes: "Less common; resolves quickly" },
      { name: "Grade 3 (severe) systemic reactions", probability: 17000, severityWeight: 20, type: "moderate", notes: "~17% report grade 3 systemic reactions preventing normal daily activity; highest rate of any approved vaccine; providers counsel patients extensively about this" },
      { name: "Anaphylaxis", probability: 1.4, severityWeight: 80, type: "rare-serious", notes: "~1.4 per million doses" },
    ],
    scenarioModifiers: {
      daycare: 1.0,
      travel: 1.1,
      outbreak: 1.2,
      siblings: 1.0,
      immunocompromisedHousehold: 1.2,
      ruralVsUrban: 1.0,
    },
    schedule: {
      doses: 2,
      timing: ["Dose 1 at 50+", "Dose 2: 2–6 months after dose 1"],
      minimumInterval: "Minimum 4 weeks if 2–6 month schedule needs to be compressed",
      catchUpNotes: "Previously vaccinated with Zostavax: give Shingrix at least 2 months after. Immunocompromised individuals 19+: may receive Shingrix. Non-live vaccine — can be given to immunocompromised patients (unlike older Zostavax live vaccine).",
      canCombineWith: ["Influenza", "COVID-19", "Tdap", "PCV15/20"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "Lal et al. — Efficacy of an Adjuvanted Herpes Zoster Subunit Vaccine (NEJM)", type: "RCT", year: 2015, country: "Multi-country", sampleSize: "15,411 adults 50+", confidence: "high" },
      { title: "Cunningham et al. — Efficacy of the Herpes Zoster Subunit Vaccine in Adults 70 Years and Older (NEJM)", type: "RCT", year: 2016, country: "Multi-country", sampleSize: "13,900 adults 70+", confidence: "high" },
      { title: "Izurieta et al. — Comparative effectiveness of Shingrix in older adults (JAMA Intern Med)", type: "cohort", year: 2021, country: "USA", sampleSize: "4 million Medicare beneficiaries", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "2 doses 50+; preferred over Zostavax", rationale: "ACIP strongly recommends Shingrix; replaced Zostavax recommendation in 2017." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "2 doses 70–79y; immunocompromised 50+", rationale: "NHS Shingles vaccination programme offers Shingrix to 70–79 year olds." },
      { country: "Australia", code: "AU", recommended: true, schedule: "2 doses 70y (free); 50–69 available at cost", rationale: "Free Shingrix for 70-year-olds from 2023 NIP; recommended for immunocompromised 18+." },
      { country: "Germany", code: "DE", recommended: true, schedule: "2 doses 60+; immunocompromised 50+", rationale: "STIKO strongly recommends Shingrix for adults 60+ and immunocompromised 50+." },
    ],
    prosList: [
      "91% effective against shingles — among the highest VE of any adult vaccine",
      "Prevents postherpetic neuralgia — one of the most debilitating chronic pain conditions",
      "Durable protection: >85% efficacy through 7 years, expected to last 10+ years",
      "Non-live vaccine: can be used in immunocompromised patients (unlike old Zostavax)",
      "Prevents vision-threatening zoster ophthalmicus",
      "Medicare covers both doses for adults 50+",
    ],
    consList: [
      "Most reactogenic approved vaccine: 78% arm pain, 57% fatigue/myalgia, 17% grade 3 reactions",
      "Many patients take the day after dose 2 off work due to symptoms",
      "Requires 2 doses 2–6 months apart",
      "Limited post-licensure data beyond 7 years",
    ],
    uncertainties: [
      "Long-term duration of protection beyond 10 years — modeling suggests ongoing protection but real-world data limited",
      "Whether vaccination is cost-effective in adults under 60 — not currently recommended for this age group",
      "Optimal timing for immunocompromised patients — immune response may be blunted, optimal strategy not fully established",
    ],
    credibleCritiques: [
      "Shingrix has the highest rate of grade 3 (severe, activity-limiting) systemic reactions of any approved vaccine — approximately 17% of recipients. While these reactions are transient (1–3 days), some researchers and geriatric medicine specialists have raised concerns about this reactogenicity profile in frail older adults who may be particularly distressed by a day or two of significant illness (Harbecke et al., 2017).",
      "The economic case for vaccinating all adults from age 50 vs. age 60 or 65 is not fully settled — modeling studies differ on when the cost per QALY saved crosses standard thresholds, and some health economists argue resources are better used targeting the 70+ group where PHN risk is highest (Szabo et al., 2019).",
    ],
    color: "#f59e0b",
    icon: "⚡",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TRAVEL VACCINES
  // ──────────────────────────────────────────────────────────────────────────

  // ──────────────────────────────────────────────────────────────────────────
  // 16. TYPHOID
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "typhoid",
    name: "Typhoid",
    brandNames: ["Typhim Vi (injectable)", "Vivotif (oral, live attenuated)"],
    diseases: ["Typhoid fever (Salmonella Typhi)", "Paratyphoid fever"],
    ageWindow: "Injectable: 2 years+; Oral: 6 years+; travelers to endemic areas",
    yearsInUse: 35,
    dosesAdministered: "Tens of millions of doses globally",
    disease: {
      description: "Typhoid fever is a systemic bacterial illness caused by Salmonella Typhi, endemic in South Asia, Southeast Asia, sub-Saharan Africa, and parts of Latin America. Without treatment, case fatality can reach 10–20%. Untreated, typhoid causes sustained high fever, abdominal pain, rose spots, and potentially fatal intestinal perforation or hemorrhage. Drug-resistant typhoid (XDR typhoid) is an emerging global concern.",
      qualityOfLifeImpact: "Typhoid causes 2–4 weeks of debilitating high fever and gastrointestinal illness. Complications include intestinal perforation (requiring emergency surgery), encephalopathy, and internal bleeding. XDR typhoid from Pakistan is resistant to nearly all oral antibiotics — increasing severity of untreated disease.",
      transmissionRoute: "Fecal-oral — contaminated food and water. Risk especially high in areas with poor sanitation: South Asia, Southeast Asia, sub-Saharan Africa. Travel to rural areas with limited potable water.",
      incidenceUnvaccinated: 350,
      incidenceVaccinated: 88,
      mortalityRate: 150,
      hospitalizationRate: 25,
      icuRate: 3,
      chronicSequelaeRate: 1,
      acuteQoLLoss: 65,
      longTermQoLLoss: 5,
      outbreakPotential: "moderate",
    },
    effectiveness: {
      againstInfection: 75,
      againstSevereDisease: 80,
      againstDeath: 80,
      waningNotes: "Injectable Typhim Vi: ~75% effective for 2–3 years; revaccinate every 2 years for ongoing travel. Oral Vivotif: similar efficacy; 4-dose oral series, boosts every 5 years. New Vi-TT conjugate vaccine (Typbar-TCV, approved by WHO) is more immunogenic with longer protection — not yet widely available in the US.",
      breakthroughNotes: "Breakthrough typhoid possible — continued food/water hygiene essential alongside vaccination.",
    },
    scores: {
      yearsOfStudy: 65,
      longTermSafetyEvidence: 72,
      exposureRiskBase: 20,
      diseaseConsequence: 72,
      vaccineRisk: 5,
      netBenefit: 78,
      evidenceConfidence: 78,
    },
    adverseEvents: [
      { name: "Injection site pain (injectable)", probability: 35000, severityWeight: 2, type: "mild", notes: "Resolves in 1–2 days" },
      { name: "Fever/headache (injectable)", probability: 8000, severityWeight: 2, type: "mild", notes: "Uncommon; transient" },
      { name: "GI symptoms (oral Vivotif)", probability: 5000, severityWeight: 3, type: "mild", notes: "Mild; from live attenuated oral vaccine" },
      { name: "Anaphylaxis", probability: 0.5, severityWeight: 80, type: "rare-serious", notes: "Rare" },
    ],
    scenarioModifiers: {
      daycare: 1.0,
      travel: 8.0,
      outbreak: 4.0,
      siblings: 1.0,
      immunocompromisedHousehold: 1.3,
      ruralVsUrban: 1.2,
    },
    schedule: {
      doses: 1,
      timing: ["Injectable: single dose at least 2 weeks before travel", "Oral: 4 capsules on alternate days (days 1, 3, 5, 7)"],
      minimumInterval: "Complete oral series at least 1 week before travel",
      catchUpNotes: "Revaccinate with injectable every 2 years if travel continues. Oral vaccine booster every 5 years. Children 2–5 years: injectable form; oral only for age 6+.",
      canCombineWith: ["HepA", "Rabies", "Yellow Fever", "Japanese Encephalitis"],
      cannotCombineWith: ["Proguanil (antimalarial may reduce oral vaccine efficacy)"],
    },
    sources: [
      { title: "WHO Position Paper on Typhoid Vaccines", type: "review", year: 2018, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
      { title: "Milligan et al. — Typhoid vaccines: Systematic review and meta-analysis (Lancet)", type: "meta-analysis", year: 2015, country: "Multi-country", sampleSize: "11 trials", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: false, schedule: "Recommended for travel to endemic areas", rationale: "Travel vaccine; not on routine schedule." },
      { country: "India", code: "IN", recommended: true, schedule: "Universal childhood immunization in some states", rationale: "High endemic burden; expanding Vi-TT conjugate programs." },
      { country: "Pakistan", code: "PK", recommended: true, schedule: "Typhoid conjugate vaccine campaign in endemic cities", rationale: "Response to XDR typhoid outbreak." },
    ],
    prosList: [
      "Prevents a disease that can be fatal and is becoming drug-resistant",
      "Essential for travel to South Asia, Southeast Asia, sub-Saharan Africa",
      "Two administration options: injectable and oral (flexibility for different patient preferences)",
      "Clean safety profile — among the best-tolerated travel vaccines",
      "Single injectable dose 2 weeks before travel — easy to fit into travel preparation",
    ],
    consList: [
      "Does not protect against paratyphoid fever (different strains)",
      "75–80% effectiveness — food and water hygiene still essential",
      "Injectable requires revaccination every 2 years for ongoing travel",
      "Oral vaccine requires 4 doses on alternating days and refrigeration",
      "XDR typhoid (nearly untreatable) — vaccine is even more important but effectiveness against emerging resistance strains not yet fully established",
    ],
    uncertainties: [
      "Effectiveness against XDR (extensively drug-resistant) typhoid strains now circulating in Pakistan — most studies predate XDR emergence",
      "When the new Vi-TT conjugate vaccine (Typbar-TCV) will achieve broad US availability and CDC recommendation",
    ],
    credibleCritiques: [
      "The injectable Vi polysaccharide vaccine provides only T-cell-independent immunity and does not generate immunological memory — meaning it requires revaccination every 2 years and has poor immunogenicity in children under 2, who bear much of the global typhoid burden. The newer conjugate vaccine (Vi-TT) solves these limitations but is not yet widely available in the US.",
    ],
    color: "#a16207",
    icon: "🟤",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 17. YELLOW FEVER
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "yellowfever",
    name: "Yellow Fever",
    brandNames: ["YF-Vax", "Stamaril"],
    diseases: ["Yellow fever"],
    ageWindow: "9 months and older; required for travel to endemic countries; only at certified travel clinics",
    yearsInUse: 85,
    dosesAdministered: "Over 500 million doses globally",
    disease: {
      description: "Yellow fever is a hemorrhagic viral illness transmitted by Aedes mosquitoes in sub-Saharan Africa and tropical South America. Approximately 15% of patients who develop severe yellow fever will die. The disease can cause jaundice (hence 'yellow' fever), kidney failure, internal bleeding, and multi-organ failure. Vaccination is required for entry to many endemic countries.",
      qualityOfLifeImpact: "Mild cases: fever, headache, muscle pain — resolves in 3–4 days. Severe cases (15% of initial cases progress): toxic phase with jaundice, hemorrhage, and multi-organ failure. Case fatality in toxic phase: 30–60%.",
      transmissionRoute: "Mosquito-borne (Aedes aegypti primarily). Not transmitted person-to-person. Risk highest in forested areas and rural settings in endemic regions.",
      incidenceUnvaccinated: 50,
      incidenceVaccinated: 1,
      mortalityRate: 5000,
      hospitalizationRate: 15,
      icuRate: 5,
      chronicSequelaeRate: 0.5,
      acuteQoLLoss: 70,
      longTermQoLLoss: 5,
      outbreakPotential: "moderate",
    },
    effectiveness: {
      againstInfection: 99,
      againstSevereDisease: 99,
      againstDeath: 99,
      waningNotes: "Single dose provides lifelong immunity for the vast majority of recipients. WHO revised its position in 2013 — a single dose is now considered sufficient for life; boosters are no longer required. International Certificate of Vaccination (required for some country entry) is now valid for life.",
      breakthroughNotes: "Vaccine failures are extremely rare. The live attenuated 17D strain generates robust, lifelong neutralizing antibodies in >99% of recipients.",
    },
    scores: {
      yearsOfStudy: 88,
      longTermSafetyEvidence: 80,
      exposureRiskBase: 8,
      diseaseConsequence: 90,
      vaccineRisk: 22,
      netBenefit: 82,
      evidenceConfidence: 82,
    },
    adverseEvents: [
      { name: "Injection site pain/headache", probability: 25000, severityWeight: 2, type: "mild", notes: "Common; resolves in 1–2 days" },
      { name: "Mild fever/malaise (days 5–10)", probability: 10000, severityWeight: 3, type: "mild", notes: "Due to attenuated viral replication; self-limiting" },
      { name: "Yellow Fever Vaccine-Associated Neurotropic Disease (YEL-AND)", probability: 0.8, severityWeight: 85, type: "rare-serious", notes: "~0.8 per 100,000 doses. Encephalitis from vaccine strain. Risk higher in infants <9 months (contraindicated) and adults 60+. Fatal in rare cases." },
      { name: "Yellow Fever Vaccine-Associated Viscerotropic Disease (YEL-AVD)", probability: 0.4, severityWeight: 95, type: "rare-serious", notes: "~0.4 per 100,000 doses. Vaccine virus replicates like wild-type — multi-organ failure. Risk increases significantly with age 60+ (up to 1.0–1.8 per 100,000). Case fatality: 50–60%." },
      { name: "Anaphylaxis (egg allergy)", probability: 10, severityWeight: 80, type: "rare-serious", notes: "Vaccine produced in eggs — contraindicated in severe egg allergy" },
    ],
    scenarioModifiers: {
      daycare: 1.0,
      travel: 15.0,
      outbreak: 5.0,
      siblings: 1.0,
      immunocompromisedHousehold: 1.2,
      ruralVsUrban: 1.3,
    },
    schedule: {
      doses: 1,
      timing: ["Single dose at least 10 days before travel to endemic area"],
      minimumInterval: "N/A (single dose for life)",
      catchUpNotes: "Only administer at CDC-designated yellow fever vaccination centers. Contraindicated: age <9 months, severe egg allergy, immunocompromised, thymus disorders. Adults 60+: carefully weigh risk vs. benefit given higher YEL-AVD risk.",
      canCombineWith: ["Typhoid", "HepA", "Rabies"],
      cannotCombineWith: ["Do not give with MMR simultaneously if possible — give 4 weeks apart"],
    },
    sources: [
      { title: "WHO Position Paper on Yellow Fever Vaccines", type: "review", year: 2013, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
      { title: "Lindsey et al. — Adverse Event Reports for Yellow Fever Vaccination (Vaccine)", type: "surveillance", year: 2016, country: "USA", sampleSize: "VAERS analysis", confidence: "moderate" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: false, schedule: "Required for travel to endemic areas; restricted to authorized centers", rationale: "Travel requirement only; not a routine immunization." },
      { country: "Brazil", code: "BR", recommended: true, schedule: "Universal childhood vaccination in endemic regions", rationale: "Major 2016–2018 outbreak prompted expanded vaccination campaigns." },
      { country: "endemic African nations", code: "CM", recommended: true, schedule: "Routine infant vaccination in endemic countries", rationale: "WHO recommends routine vaccination in all countries with endemic risk." },
    ],
    prosList: [
      "Single dose — lifelong protection against a hemorrhagic fever with 30–60% case fatality",
      "85 years of use with well-characterized safety profile",
      "Required for entry to many endemic countries — mandatory for travelers",
      "99% effectiveness against a disease with limited treatment options",
      "Eliminates risk of importing disease to non-endemic countries",
    ],
    consList: [
      "YEL-AVD (viscerotropic disease) can be fatal — risk increases dramatically with age 60+",
      "Contraindicated in infants under 9 months, immunocompromised individuals, severe egg allergy",
      "Only administered at authorized travel medicine centers — access limitation",
      "Produced in eggs — concerns for egg-allergic individuals",
    ],
    uncertainties: [
      "Exact mechanism and predictors of YEL-AVD — why some individuals develop this catastrophic reaction is not fully understood; thymus history and genetic factors suspected",
      "Risk-benefit balance for adults over 60 in non-endemic travel settings — where disease risk is low but adverse event risk is elevated",
    ],
    credibleCritiques: [
      "The risk of YEL-AVD (yellow fever vaccine-associated viscerotropic disease) increases with age — reaching approximately 1–1.8 per 100,000 doses in adults over 60, compared with 0.4 per 100,000 in younger adults. With case fatality of 50–60%, this represents a meaningful risk for older travelers to low-risk destinations. Some travel medicine specialists advocate for careful individual risk assessment for older travelers rather than uniform recommendation (Thomas et al., 2011).",
    ],
    color: "#eab308",
    icon: "🟡",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 18. RABIES
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "rabies",
    name: "Rabies",
    brandNames: ["Imovax (HDCV)", "RabAvert (PCEC)"],
    diseases: ["Rabies"],
    ageWindow: "Pre-exposure: travelers to endemic areas, veterinarians, animal handlers; Post-exposure: any age, immediately",
    yearsInUse: 45,
    dosesAdministered: "15+ million post-exposure series annually worldwide",
    disease: {
      description: "Rabies is caused by lyssavirus transmitted through the bite of an infected animal. Once clinical symptoms appear, rabies is virtually 100% fatal. It is one of the deadliest diseases known to medicine — only a handful of documented survivors of clinical rabies exist in medical literature. 59,000 people die of rabies annually, primarily in Asia and Africa, mostly from dog bites.",
      qualityOfLifeImpact: "Clinical rabies causes encephalitis progressing to paralysis, hydrophobia (fear of water due to painful throat spasms), delirium, coma, and death within 2–10 days of symptom onset. It is considered one of the most terrifying deaths in medicine. Once started, there is essentially no treatment.",
      transmissionRoute: "Bite, scratch, or mucous membrane contact from infected animal (dog, bat, fox, raccoon, skunk). Bats are the primary source of US human rabies deaths — contact may be imperceptible during sleep.",
      incidenceUnvaccinated: 0.01,
      incidenceVaccinated: 0.0,
      mortalityRate: 99000,
      hospitalizationRate: 100,
      icuRate: 80,
      chronicSequelaeRate: 0,
      acuteQoLLoss: 100,
      longTermQoLLoss: 0,
      outbreakPotential: "low",
    },
    effectiveness: {
      againstInfection: 100,
      againstSevereDisease: 100,
      againstDeath: 100,
      waningNotes: "Pre-exposure prophylaxis (PrEP): 3-dose series. Provides memory immunity allowing simplified post-exposure management. Titers should be checked every 2 years for high-risk individuals. Post-exposure: 100% effective if initiated before symptom onset. No known treatment failures with appropriately administered post-exposure prophylaxis.",
      breakthroughNotes: "No post-exposure prophylaxis failures have been documented in properly vaccinated and treated patients. Failures occur only when treatment is delayed or rabies immune globulin (RIG) is omitted.",
    },
    scores: {
      yearsOfStudy: 70,
      longTermSafetyEvidence: 75,
      exposureRiskBase: 5,
      diseaseConsequence: 100,
      vaccineRisk: 8,
      netBenefit: 72,
      evidenceConfidence: 85,
    },
    adverseEvents: [
      { name: "Injection site pain/redness", probability: 35000, severityWeight: 2, type: "mild", notes: "Common; resolves 1–2 days" },
      { name: "Headache/nausea/dizziness", probability: 20000, severityWeight: 3, type: "mild", notes: "Mild systemic effects; transient" },
      { name: "Immune complex-like reaction (HDCV, dose 2+)", probability: 600, severityWeight: 20, type: "moderate", notes: "Occurs with HDCV booster doses — urticaria, angioedema, arthralgias in ~6% of boosters. Self-limiting." },
      { name: "Anaphylaxis", probability: 1.1, severityWeight: 80, type: "rare-serious", notes: "~1 per 100,000 doses" },
    ],
    scenarioModifiers: {
      daycare: 1.0,
      travel: 5.0,
      outbreak: 2.0,
      siblings: 1.0,
      immunocompromisedHousehold: 1.2,
      ruralVsUrban: 1.5,
    },
    schedule: {
      doses: 3,
      timing: ["Pre-exposure: Day 0, Day 7, Day 21 or 28", "Post-exposure (unvaccinated): Day 0 (+ RIG), Day 3, 7, 14", "Post-exposure (pre-vaccinated): Day 0 and 3 only — no RIG needed"],
      minimumInterval: "Pre-exposure: minimum 7 days between doses",
      catchUpNotes: "Pre-exposure vaccination is recommended for: travelers to countries where dog rabies is endemic (South/Southeast Asia, Central America, Africa), veterinarians and animal handlers, wildlife workers, spelunkers (bat exposure), laboratory workers with live virus. Titer testing every 2 years for ongoing risk.",
      canCombineWith: ["All travel vaccines"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "WHO Expert Consultation on Rabies — Technical Report Series", type: "review", year: 2018, country: "Global", sampleSize: "Global surveillance", confidence: "high" },
      { title: "CDC — Rabies Pre-Exposure Prophylaxis Guidelines", type: "review", year: 2022, country: "USA", sampleSize: "National surveillance", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: false, schedule: "Pre-exposure for high-risk travelers and occupations; post-exposure universally recommended", rationale: "Routine vaccination only for specific occupational/travel risk groups; post-exposure is absolute treatment." },
      { country: "India", code: "IN", recommended: true, schedule: "Post-exposure universal; pre-exposure programs expanding", rationale: "India has highest rabies burden globally; major government PEP programs." },
    ],
    prosList: [
      "100% fatal disease — vaccination is the only prevention",
      "Pre-exposure vaccination eliminates the need for hard-to-obtain rabies immune globulin (RIG) in resource-limited settings after exposure",
      "Post-exposure prophylaxis is 100% effective if started before symptoms",
      "Simplifies post-exposure regimen for vaccinated individuals (2 doses vs 4 + RIG)",
      "Clean safety profile with 45 years of use",
    ],
    consList: [
      "3-dose pre-exposure series is burdensome and expensive (~$500–1000 out of pocket in US)",
      "Requires periodic titer checks if ongoing high-risk exposure",
      "Immune complex reaction with HDCV boosters (~6%)",
      "Not warranted for most domestic US travelers — primarily for travel to Asia, Africa",
    ],
    uncertainties: [
      "Optimal timing and frequency of booster doses for high-risk individuals (titer-based vs. time-based)",
      "Whether 2-dose pre-exposure schedules are equivalent to 3-dose — some countries are evaluating this",
    ],
    credibleCritiques: [
      "The 3-dose pre-exposure series costs $500–1,500 out of pocket in many US travel medicine clinics, making pre-exposure prophylaxis inaccessible to lower-income travelers who may be visiting higher-risk rural settings — creating a health equity problem where those at highest risk of serious animal bites (visiting family in rural South Asia) are least able to afford pre-exposure vaccination.",
    ],
    color: "#6b7280",
    icon: "🐺",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 19. DENGUE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "dengue",
    name: "Dengue",
    brandNames: ["Dengvaxia (CYD-TDV)", "Qdenga (TAK-003, newer)"],
    diseases: ["Dengue fever", "Dengue hemorrhagic fever", "Dengue shock syndrome"],
    ageWindow: "Dengvaxia: 9–16 years in endemic areas AND seropositive only; Qdenga: 4–60 years in endemic areas",
    yearsInUse: 8,
    dosesAdministered: "Dengvaxia: millions in Philippines and Latin America; Qdenga: growing use",
    disease: {
      description: "Dengue is the most rapidly spreading mosquito-borne viral disease globally — infecting 390 million people annually with 100 million symptomatic cases. Four serotypes exist (DENV 1–4). Secondary infection with a different serotype dramatically increases risk of severe dengue hemorrhagic fever through antibody-dependent enhancement (ADE). The dengue vaccine controversy — specifically the Dengvaxia disaster in the Philippines — is one of the most significant vaccine safety events of recent decades.",
      qualityOfLifeImpact: "Mild dengue: severe flu-like illness with intense joint pain ('breakbone fever') for 5–7 days. Severe dengue: plasma leakage, hemorrhage, organ impairment. Case fatality of severe dengue: 1–5% without treatment. 20,000+ dengue deaths annually.",
      transmissionRoute: "Aedes aegypti mosquito bite. No person-to-person transmission. Peak risk in tropical/subtropical regions, monsoon season. Risk during day (Aedes is a daytime biter).",
      incidenceUnvaccinated: 3500,
      incidenceVaccinated: 1750,
      mortalityRate: 500,
      hospitalizationRate: 5,
      icuRate: 0.5,
      chronicSequelaeRate: 0.2,
      acuteQoLLoss: 70,
      longTermQoLLoss: 5,
      outbreakPotential: "high",
    },
    effectiveness: {
      againstInfection: 50,
      againstSevereDisease: 62,
      againstDeath: 65,
      waningNotes: "Dengvaxia: 60% effective overall in seropositive individuals; acts as a 'prime' for seronegative individuals — increasing severe dengue risk on subsequent infection due to ADE mechanism. Qdenga (TAK-003) does not have this seronegative concern and shows ~80% efficacy against DENV 2, lower against DENV 1/3/4.",
      breakthroughNotes: "Dengvaxia is contraindicated in seronegative individuals — this is the fundamental lesson from the Philippines disaster (see credible critiques).",
    },
    scores: {
      yearsOfStudy: 30,
      longTermSafetyEvidence: 40,
      exposureRiskBase: 15,
      diseaseConsequence: 72,
      vaccineRisk: 25,
      netBenefit: 55,
      evidenceConfidence: 58,
    },
    adverseEvents: [
      { name: "Injection site reactions", probability: 40000, severityWeight: 3, type: "mild", notes: "Common; resolves quickly" },
      { name: "Headache/malaise", probability: 30000, severityWeight: 3, type: "mild", notes: "Common; transient" },
      { name: "Severe dengue in seronegative vaccinees (Dengvaxia)", probability: 500, severityWeight: 85, type: "rare-serious", notes: "In seronegative individuals, Dengvaxia acts as a sensitizing 'first infection' — subsequent natural dengue infection triggers ADE (antibody-dependent enhancement), dramatically increasing risk of severe dengue hemorrhagic fever. This led to deaths in Philippine children." },
    ],
    scenarioModifiers: {
      daycare: 1.0,
      travel: 6.0,
      outbreak: 3.0,
      siblings: 1.0,
      immunocompromisedHousehold: 1.2,
      ruralVsUrban: 1.2,
    },
    schedule: {
      doses: 3,
      timing: ["Month 0", "Month 6", "Month 12"],
      minimumInterval: "6 months between doses",
      catchUpNotes: "Dengvaxia: ONLY administer to confirmed seropositive individuals (prior dengue infection confirmed by serology). Qdenga: no seropositivity requirement — preferred option where available. For travelers: currently limited recommendations; Qdenga being evaluated for traveler use.",
      canCombineWith: ["Yellow Fever (separate injection sites)", "Typhoid"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "Sridhar et al. — Effect of Dengue Serostatus on Dengvaxia Efficacy (NEJM)", type: "cohort", year: 2018, country: "Multi-country", sampleSize: "35,000 children (reanalysis)", confidence: "high" },
      { title: "WHO SAGE — Updated Dengvaxia Recommendations", type: "review", year: 2018, country: "Global", sampleSize: "Global surveillance and trials", confidence: "high" },
      { title: "Biswal et al. — Efficacy of TAK-003 Dengue Vaccine (NEJM)", type: "RCT", year: 2020, country: "Multi-country", sampleSize: "20,071 children", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: false, schedule: "Dengvaxia approved for seropositive 9–16y in endemic US territories (PR, US VI, Pacific Islands)", rationale: "Restricted to confirmed seropositive children in endemic US territories only." },
      { country: "Philippines", code: "PH", recommended: false, schedule: "Suspended (Dengvaxia school program terminated 2018)", rationale: "800,000 children vaccinated; program suspended after Sanofi revealed seronegative risk. Criminal investigation of health officials followed." },
      { country: "Brazil", code: "BR", recommended: true, schedule: "Dengvaxia (seropositive 10–65y in high-burden regions) + Qdenga (expanding)", rationale: "Brazil and several Latin American countries use dengue vaccines with seropositivity testing." },
    ],
    prosList: [
      "Qdenga (newer vaccine) does not have the seronegative safety concern",
      "Provides meaningful protection against the leading mosquito-borne viral disease globally",
      "Prevents severe dengue hemorrhagic fever in seropositive individuals",
      "Important tool in endemic regions where repeat infections are common",
    ],
    consList: [
      "Dengvaxia caused deaths in Philippine children — one of the most significant vaccine disasters in recent history",
      "Dengvaxia contraindicated in seronegative individuals — fundamental limitation requiring serology testing",
      "Moderate effectiveness (50–62%) even in seropositive individuals",
      "Not recommended for most US travelers to endemic areas (limited access, serostatus unknown)",
      "Complex 3-dose schedule over 12 months",
    ],
    uncertainties: [
      "Long-term effectiveness of Qdenga beyond 4.5 years of follow-up",
      "Effectiveness of Qdenga against all four dengue serotypes — particularly DENV 3 and 4",
      "Whether Qdenga will receive recommendations for international travelers — currently not standardly recommended for travel",
    ],
    credibleCritiques: [
      "The Dengvaxia Philippines disaster is one of the most important vaccine safety events of the 21st century and must be understood by anyone discussing dengue vaccination. The Philippine DOH launched a school-based mass vaccination program (800,000 children) in 2016 without mandatory pre-screening for dengue serostatus. When Sanofi disclosed that seronegative vaccinees faced increased risk of severe dengue, the program was suspended. Hospitalizations and deaths followed. The event severely damaged vaccine confidence in the Philippines and across Southeast Asia, and resulted in criminal charges against health officials. It is a documented case where a vaccine caused net harm to a specific population (seronegative children) due to inadequate pre-vaccination screening (Aguiar et al., 2019).",
    ],
    color: "#ef4444",
    icon: "🦟",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 20. IPV (Inactivated Poliovirus Vaccine)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "ipv",
    name: "IPV (Polio)",
    brandNames: ["IPOL", "Pediarix (combo)", "Pentacel (combo)", "Vaxelis (combo)"],
    diseases: ["Poliomyelitis", "Post-polio syndrome"],
    ageWindow: "2 months – 6 years (4-dose series); booster for adult travelers to endemic areas",
    yearsInUse: 70,
    dosesAdministered: "Over 2 billion doses of polio vaccine globally (combined OPV/IPV)",
    disease: {
      description: "Poliovirus causes irreversible paralysis by destroying motor neurons in the spinal cord. Before vaccination, polio paralyzed 13,000–20,000 Americans annually. The global eradication campaign has reduced polio to near-zero: wild poliovirus now endemic only in Pakistan and Afghanistan. However, vaccine-derived poliovirus (VDPV) circulates in under-vaccinated communities, including a 2022 New York outbreak that paralyzed an unvaccinated young adult.",
      qualityOfLifeImpact: "Paralytic polio: irreversible flaccid paralysis of one or more limbs. Bulbar polio: paralysis of breathing muscles requiring iron lung or ventilator. Post-polio syndrome: 25–40% of survivors develop new weakness, fatigue, and pain 15–40 years after initial illness. No treatment for acute paralytic polio — only supportive care.",
      transmissionRoute: "Fecal-oral (primary) and oral-oral. Poliovirus spreads easily in communities with poor sanitation. IPV-vaccinated individuals can still carry poliovirus in the gut — OPV provides superior mucosal immunity for transmission blocking.",
      incidenceUnvaccinated: 800,
      incidenceVaccinated: 0.2,
      mortalityRate: 50,
      hospitalizationRate: 12,
      icuRate: 3,
      chronicSequelaeRate: 35,
      acuteQoLLoss: 80,
      longTermQoLLoss: 55,
      outbreakPotential: "high",
    },
    effectiveness: {
      againstInfection: 99,
      againstSevereDisease: 99,
      againstDeath: 99,
      waningNotes: "Four doses of IPV provide lifelong immunity against paralytic poliomyelitis. Serum antibody titers remain protective for decades. Adults who completed a childhood series have durable protection. Additional doses are recommended for adults traveling to polio-endemic countries or during outbreak response.",
      breakthroughNotes: "Paralytic polio has not occurred in a fully vaccinated US individual from wild poliovirus. The 2022 New York case occurred in an unvaccinated adult.",
    },
    scores: {
      yearsOfStudy: 98,
      longTermSafetyEvidence: 95,
      exposureRiskBase: 20,
      diseaseConsequence: 85,
      vaccineRisk: 3,
      netBenefit: 94,
      evidenceConfidence: 97,
    },
    adverseEvents: [
      { name: "Injection site redness/pain", probability: 15000, severityWeight: 2, type: "mild", notes: "Mild; resolves in 1–2 days" },
      { name: "Fever", probability: 5000, severityWeight: 2, type: "mild", notes: "Uncommon; self-limiting" },
      { name: "Anaphylaxis", probability: 0.3, severityWeight: 80, type: "rare-serious", notes: "Extremely rare — one of the lowest anaphylaxis rates of any vaccine; streptomycin/neomycin allergy is risk factor" },
    ],
    scenarioModifiers: {
      daycare: 1.2,
      travel: 3.0,
      outbreak: 5.0,
      siblings: 1.1,
      immunocompromisedHousehold: 1.4,
      ruralVsUrban: 1.0,
    },
    schedule: {
      doses: 4,
      timing: ["2 months", "4 months", "6–18 months", "4–6 years"],
      minimumInterval: "4 weeks between doses 1–2 and 2–3; at least 6 months between doses 3 and 4",
      catchUpNotes: "Unvaccinated children/adults: 3-dose catch-up series. Travel to endemic areas (Pakistan, Afghanistan): booster dose recommended for adults who completed childhood series >10 years ago.",
      canCombineWith: ["DTaP", "HepB", "Hib", "PCV", "Rotavirus"],
      cannotCombineWith: [],
    },
    sources: [
      { title: "Plotkin SA — Inactivated Polio Vaccine Review (Pediatric Infectious Disease Journal)", type: "review", year: 2014, country: "USA", sampleSize: "Global trials review", confidence: "high" },
      { title: "WHO Position Paper on Polio Vaccines", type: "review", year: 2022, country: "Global", sampleSize: "Global eradication surveillance", confidence: "high" },
      { title: "CDC — Polio Surveillance Update (2022 New York outbreak)", type: "surveillance", year: 2022, country: "USA", sampleSize: "National surveillance", confidence: "high" },
    ],
    countryPolicies: [
      { country: "United States", code: "US", recommended: true, schedule: "2m, 4m, 6–18m, 4–6y", rationale: "Universal 4-dose IPV schedule. US switched from OPV to IPV in 2000 to eliminate vaccine-associated paralytic polio risk." },
      { country: "United Kingdom", code: "GB", recommended: true, schedule: "8w, 12w, 16w, 3.5y (as combo vaccines)", rationale: "IPV included in combination vaccines (6-in-1 Infanrix hexa); universal schedule." },
      { country: "Australia", code: "AU", recommended: true, schedule: "2m, 4m, 6m, 4y", rationale: "Universal IPV in combination vaccines." },
      { country: "Germany", code: "DE", recommended: true, schedule: "2m, 3m, 4m, 12m", rationale: "Universal IPV schedule per STIKO recommendations." },
      { country: "Pakistan/Afghanistan", code: "PK", recommended: true, schedule: "Birth + OPV campaigns + IPV", rationale: "Only countries with wild poliovirus transmission remaining. Intensive oral and inactivated vaccine campaigns ongoing." },
    ],
    prosList: [
      "Near-miraculous success: eliminated paralytic polio from the US — from 20,000 cases/year to near zero",
      "Among the safest vaccines ever developed — adverse event profile essentially limited to mild injection site reactions",
      "70 years of post-licensure data across billions of doses",
      "Lifelong protection from 4 doses",
      "Prevents irreversible paralysis — no treatment exists once paralysis occurs",
      "IPV (unlike OPV) cannot cause vaccine-associated paralytic polio",
    ],
    consList: [
      "IPV provides weaker intestinal (mucosal) immunity than OPV — vaccinated individuals can still carry poliovirus and potentially spread it in under-vaccinated communities",
      "Requires injection (vs. oral drops for OPV used globally)",
      "4-dose schedule requires multiple healthcare visits",
      "Global eradication relies on OPV campaigns, not just IPV — a complex dual-vaccine world",
    ],
    uncertainties: [
      "How long the US can maintain polio-free status given vaccine-derived poliovirus (VDPV) circulation in under-vaccinated communities globally and domestically",
      "Whether the 2022 New York VDPV case represents an isolated event or a harbinger of sustained community spread in under-vaccinated areas",
      "Long-term strategy as global eradication approaches — when to transition away from any polio vaccination",
    ],
    credibleCritiques: [
      "The switch from OPV to IPV in high-income countries has created a two-tier global polio vaccination system: high-income countries use IPV (safer, no VDPV risk) while low-income countries continue to rely on OPV (which can generate circulating vaccine-derived poliovirus in under-vaccinated communities). Some researchers argue the persistence of VDPV outbreaks — now more common than wild polio — is partly a consequence of incomplete global IPV transition funding (Bandyopadhyay et al., 2015).",
      "The 2022 New York VDPV case that paralyzed an unvaccinated young adult revealed that the sewage surveillance system had detected poliovirus in wastewater for months before the case — raising questions about the adequacy of surveillance and outbreak response in communities with declining vaccination rates in the US.",
    ],
    color: "#10b981",
    icon: "💉",
  },
];

// ============================================================
// SCORING ENGINE
// ============================================================

export interface ScenarioInputs {
  childAge: number;           // months
  daycare: boolean;
  travel: boolean;
  outbreak: boolean;
  siblings: boolean;
  immunocompromisedHousehold: boolean;
  rural: boolean;
  communityVaxRate: number;   // 0–100%
}

export interface ScoreResult {
  vaccineId: string;
  exposureRisk: number;           // 0–100
  diseaseConsequence: number;     // 0–100
  vaccineHarm: number;            // 0–100
  vaccineBenefit: number;         // 0–100
  evidenceConfidence: number;     // 0–100
  netBenefit: number;             // 0–100
  recommendation: "strong" | "moderate" | "consider" | "discuss";
  summary: string;
}

export function computeScores(vaccine: VaccineData, scenario: ScenarioInputs): ScoreResult {
  // ── 1. EXPOSURE RISK SCORE ──────────────────────────────
  // P_exposure = base × age_factor × scenario_multipliers × community_factor
  const base = vaccine.scores.exposureRiskBase / 100;

  // Age factor: younger infants are more vulnerable for most diseases
  const ageFactor = scenario.childAge < 6 ? 1.4
    : scenario.childAge < 12 ? 1.2
    : scenario.childAge < 24 ? 1.0
    : scenario.childAge < 60 ? 0.85
    : 0.7;

  // Community coverage factor: lower coverage = higher risk
  const communityFactor = 1 + (1 - scenario.communityVaxRate / 100) * 1.5;

  // Scenario multipliers
  let scenarioMult = 1.0;
  if (scenario.daycare) scenarioMult *= vaccine.scenarioModifiers.daycare;
  if (scenario.travel) scenarioMult *= vaccine.scenarioModifiers.travel;
  if (scenario.outbreak) scenarioMult *= vaccine.scenarioModifiers.outbreak;
  if (scenario.siblings) scenarioMult *= vaccine.scenarioModifiers.siblings;
  if (scenario.immunocompromisedHousehold) scenarioMult *= vaccine.scenarioModifiers.immunocompromisedHousehold;
  if (scenario.rural) scenarioMult *= vaccine.scenarioModifiers.ruralVsUrban;

  const rawExposure = base * ageFactor * communityFactor * scenarioMult;
  const exposureRisk = Math.min(100, Math.round(rawExposure * 100));

  // ── 2. DISEASE CONSEQUENCE SCORE ────────────────────────
  // DiseaseHarm = severity-weighted sum of outcome probabilities
  const d = vaccine.disease;
  const diseaseHarm =
    SEVERITY_WEIGHTS.death * (d.mortalityRate / 100000) +
    SEVERITY_WEIGHTS.icuAdmission * (d.icuRate / 100) +
    SEVERITY_WEIGHTS.hospitalization * (d.hospitalizationRate / 100) +
    SEVERITY_WEIGHTS.chronicLifelongCondition * (d.chronicSequelaeRate / 100) +
    SEVERITY_WEIGHTS.moderateAcuteQoL * (d.acuteQoLLoss / 100) +
    SEVERITY_WEIGHTS.longTermQoLLoss * (d.longTermQoLLoss / 100);

  const diseaseConsequence = Math.min(100, Math.round(diseaseHarm * 10));

  // ── 3. VACCINE BENEFIT SCORE ────────────────────────────
  // Benefit = reduction in expected disease harm from vaccination
  const effectivenessWeighted = (
    vaccine.effectiveness.againstSevereDisease * 0.5 +
    vaccine.effectiveness.againstDeath * 0.3 +
    vaccine.effectiveness.againstInfection * 0.2
  ) / 100;

  const vaccineBenefit = Math.min(100, Math.round(effectivenessWeighted * diseaseConsequence));

  // ── 4. VACCINE HARM SCORE ───────────────────────────────
  // VaccineHarm = sum(probability × severity) + uncertainty penalty
  const adverseHarm = vaccine.adverseEvents.reduce((sum, ae) => {
    const probNormalized = ae.probability / 100000; // convert per-100k to probability
    return sum + (probNormalized * ae.severityWeight);
  }, 0);

  const uncertaintyPenalty = (100 - vaccine.scores.evidenceConfidence) * 0.1;
  const vaccineHarm = Math.min(100, Math.round((adverseHarm * 500 + uncertaintyPenalty)));

  // ── 5. EVIDENCE CONFIDENCE ─────────────────────────────
  const evidenceConfidence = vaccine.scores.evidenceConfidence;

  // ── 6. NET BENEFIT ──────────────────────────────────────
  // NetBenefit = (ExposureRisk × DiseaseConsequence × VaccineBenefit) - VaccineHarm
  // Normalized to 0–100
  const rawNetBenefit = (exposureRisk * diseaseConsequence * vaccineBenefit) / 10000 - vaccineHarm;
  const netBenefit = Math.min(100, Math.max(0, Math.round(rawNetBenefit + 50)));

  // ── 7. RECOMMENDATION ──────────────────────────────────
  const recommendation: ScoreResult["recommendation"] =
    netBenefit >= 75 ? "strong"
    : netBenefit >= 55 ? "moderate"
    : netBenefit >= 35 ? "consider"
    : "discuss";

  const summary =
    recommendation === "strong"
      ? `For your child's situation, the evidence strongly supports this vaccine. The disease risk is significant and the vaccine provides substantial protection with a well-established safety record.`
      : recommendation === "moderate"
      ? `The evidence moderately supports this vaccine for your child's situation. Benefits outweigh risks but some factors in your scenario lower the urgency.`
      : recommendation === "consider"
      ? `Worth careful consideration. Disease risk in your scenario is lower than average, or the vaccine risk/uncertainty is somewhat higher. Discuss timing and priorities with your provider.`
      : `The risk-benefit balance in your specific scenario suggests a detailed conversation with your child's provider before deciding.`;

  return {
    vaccineId: vaccine.id,
    exposureRisk,
    diseaseConsequence,
    vaccineHarm,
    vaccineBenefit,
    evidenceConfidence,
    netBenefit,
    recommendation,
    summary,
  };
}

export const DEFAULT_SCENARIO: ScenarioInputs = {
  childAge: 12,
  daycare: false,
  travel: false,
  outbreak: false,
  siblings: false,
  immunocompromisedHousehold: false,
  rural: false,
  communityVaxRate: 92,
};