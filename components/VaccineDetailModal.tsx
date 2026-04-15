"use client";

import { useState } from "react";
import { VaccineData, ScoreResult, ScenarioInputs } from "@/lib/vaccineData";
import {
  X, CheckCircle, AlertTriangle, HelpCircle, MessageSquare,
  BookOpen, Globe, Calendar, ChevronDown, ChevronUp, Plus, Minus
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from "recharts";

interface Props {
  vaccine: VaccineData;
  score: ScoreResult;
  scenario: ScenarioInputs;
  onClose: () => void;
  isSelectedForSchedule: boolean;
  onToggleSchedule: () => void;
}

type Section = "overview" | "safety" | "evidence" | "schedule" | "policy";

const TabBtn = ({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all`}
    style={active ? { background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" } : { color: "#94a3b8", border: "1px solid transparent" }}
  >
    {icon}{label}
  </button>
);

const ScorePill = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex flex-col items-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
    <div className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</div>
    <div className="text-slate-500 text-xs text-center leading-tight">{label}</div>
  </div>
);

const ExpandableSection = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(30,45,69,0.8)" }}>
      <button className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors" onClick={() => setOpen(!open)}>
        <span className="text-white font-medium text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

export default function VaccineDetailModal({ vaccine, score, onClose, isSelectedForSchedule, onToggleSchedule }: Props) {
  const [section, setSection] = useState<Section>("overview");

  const radarData = [
    { subject: "Years Studied", value: vaccine.scores.yearsOfStudy },
    { subject: "Safety Evidence", value: vaccine.scores.longTermSafetyEvidence },
    { subject: "Net Benefit", value: score.netBenefit },
    { subject: "Effectiveness", value: vaccine.effectiveness.againstSevereDisease },
    { subject: "Evidence Conf.", value: score.evidenceConfidence },
  ];

  const comparisonData = [
    { name: "Without Vaccine", infection: vaccine.disease.incidenceUnvaccinated, color: "#ef4444" },
    { name: "With Vaccine", infection: vaccine.disease.incidenceVaccinated, color: "#22c55e" },
  ];

  const aeData = vaccine.adverseEvents.map((ae) => ({
    name: ae.name.length > 20 ? ae.name.slice(0, 20) + "…" : ae.name,
    fullName: ae.name,
    rate: ae.probability > 1000 ? ae.probability / 1000 : ae.probability,
    unit: ae.probability > 1000 ? "per 1,000" : "per 100k",
    type: ae.type,
    severity: ae.severityWeight,
    notes: ae.notes,
  }));

  const AE_TYPE_COLOR: Record<string, string> = {
    mild: "#22c55e",
    moderate: "#f59e0b",
    serious: "#ef4444",
    "rare-serious": "#dc2626",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div
        className="w-full max-w-4xl max-h-[92vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "#0d1526", border: "1px solid rgba(30,45,69,0.9)", boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 40px ${vaccine.color}15` }}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-5" style={{ borderBottom: "1px solid rgba(30,45,69,0.8)", background: `linear-gradient(135deg, rgba(13,21,38,0.95), ${vaccine.color}08)` }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `${vaccine.color}20`, border: `1px solid ${vaccine.color}40` }}>
                {vaccine.icon}
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">{vaccine.name}</h2>
                <p className="text-slate-400 text-sm">{vaccine.diseases.join(" · ")}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
                    {vaccine.ageWindow}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }}>
                    {vaccine.yearsInUse} years in use
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>
                    {vaccine.dosesAdministered}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onToggleSchedule}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                style={isSelectedForSchedule
                  ? { background: `${vaccine.color}25`, color: vaccine.color, border: `1px solid ${vaccine.color}50` }
                  : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {isSelectedForSchedule ? <><CheckCircle size={13} /> In Schedule</> : <><Plus size={13} /> Add to Schedule</>}
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Score summary row */}
        <div className="flex-shrink-0 px-5 py-3 grid grid-cols-5 gap-3" style={{ borderBottom: "1px solid rgba(30,45,69,0.8)", background: "rgba(0,0,0,0.2)" }}>
          <ScorePill label="Exposure Risk" value={score.exposureRisk} color="#ef4444" />
          <ScorePill label="Disease Harm" value={score.diseaseConsequence} color="#f97316" />
          <ScorePill label="Vaccine Benefit" value={score.vaccineBenefit} color="#22c55e" />
          <ScorePill label="Vaccine Risk" value={score.vaccineHarm} color="#f59e0b" />
          <ScorePill label="Net Benefit" value={score.netBenefit} color={vaccine.color} />
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex gap-1 px-5 py-3 overflow-x-auto" style={{ borderBottom: "1px solid rgba(30,45,69,0.8)" }}>
          <TabBtn label="Overview" active={section === "overview"} onClick={() => setSection("overview")} icon={<BookOpen size={12} />} />
          <TabBtn label="Safety & AEs" active={section === "safety"} onClick={() => setSection("safety")} icon={<AlertTriangle size={12} />} />
          <TabBtn label="Evidence" active={section === "evidence"} onClick={() => setSection("evidence")} icon={<HelpCircle size={12} />} />
          <TabBtn label="Schedule" active={section === "schedule"} onClick={() => setSection("schedule")} icon={<Calendar size={12} />} />
          <TabBtn label="Global Policy" active={section === "policy"} onClick={() => setSection("policy")} icon={<Globe size={12} />} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ── OVERVIEW ── */}
          {section === "overview" && (
            <div className="space-y-5">
              {/* Two-column comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <h4 className="text-red-400 font-semibold text-sm flex items-center gap-1.5">
                    <Minus size={14} /> Without Vaccine
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Annual incidence</span><span className="text-red-300 font-bold">{vaccine.disease.incidenceUnvaccinated.toLocaleString()} / 100k</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Mortality rate</span><span className="text-red-300 font-bold">{vaccine.disease.mortalityRate} / 100k infected</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Hospitalization</span><span className="text-red-300 font-bold">{vaccine.disease.hospitalizationRate}%</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">ICU rate</span><span className="text-red-300 font-bold">{vaccine.disease.icuRate}%</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Chronic sequelae</span><span className="text-red-300 font-bold">{vaccine.disease.chronicSequelaeRate}%</span></div>
                  </div>
                </div>
                <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <h4 className="text-green-400 font-semibold text-sm flex items-center gap-1.5">
                    <Plus size={14} /> With Vaccine
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Annual incidence</span><span className="text-green-300 font-bold">{vaccine.disease.incidenceVaccinated.toLocaleString()} / 100k</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">VE vs. infection</span><span className="text-green-300 font-bold">{vaccine.effectiveness.againstInfection}%</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">VE vs. severe disease</span><span className="text-green-300 font-bold">{vaccine.effectiveness.againstSevereDisease}%</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">VE vs. death</span><span className="text-green-300 font-bold">{vaccine.effectiveness.againstDeath}%</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Score recommendation</span>
                      <span className="font-bold capitalize" style={{ color: score.recommendation === "strong" ? "#22c55e" : score.recommendation === "moderate" ? "#3b82f6" : "#f59e0b" }}>
                        {score.recommendation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Incidence bar chart */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-3">Annual Incidence: With vs Without Vaccine (per 100,000)</h4>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={comparisonData} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={110} />
                    <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="infection" radius={[0, 6, 6, 0]}>
                      {comparisonData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Disease description */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-2">About the Disease</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{vaccine.disease.description}</p>
              </div>

              {/* QoL */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-2">Quality of Life Impact</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{vaccine.disease.qualityOfLifeImpact}</p>
              </div>

              {/* Pros/Cons/Uncertainties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)" }}>
                  <h4 className="text-green-400 font-semibold text-sm mb-3 flex items-center gap-1.5"><CheckCircle size={13} /> Arguments For</h4>
                  <ul className="space-y-2">
                    {vaccine.prosList.map((p, i) => (
                      <li key={i} className="text-slate-300 text-xs leading-relaxed flex gap-2">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)" }}>
                  <h4 className="text-amber-400 font-semibold text-sm mb-3 flex items-center gap-1.5"><AlertTriangle size={13} /> Considerations / Cons</h4>
                  <ul className="space-y-2">
                    {vaccine.consList.map((c, i) => (
                      <li key={i} className="text-slate-300 text-xs leading-relaxed flex gap-2">
                        <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Uncertainties */}
              <ExpandableSection title={`🔍 Genuine Uncertainties (${vaccine.uncertainties.length})`}>
                <ul className="space-y-2 mt-2">
                  {vaccine.uncertainties.map((u, i) => (
                    <li key={i} className="text-slate-400 text-xs leading-relaxed flex gap-2">
                      <span className="text-blue-400 mt-0.5 flex-shrink-0">?</span>{u}
                    </li>
                  ))}
                </ul>
              </ExpandableSection>

              {/* Credible critiques */}
              <ExpandableSection title={`💬 Credible Critiques & Dissent (${vaccine.credibleCritiques.length})`}>
                <div className="mt-2 p-3 rounded-lg text-xs text-slate-500 mb-3" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}>
                  These represent legitimate methodological critiques from peer-reviewed literature. Inclusion does not imply endorsement or equivalence with the primary evidence base.
                </div>
                <ul className="space-y-3">
                  {vaccine.credibleCritiques.map((c, i) => (
                    <li key={i} className="text-slate-400 text-xs leading-relaxed flex gap-2 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <MessageSquare size={12} className="text-slate-600 mt-0.5 flex-shrink-0" />{c}
                    </li>
                  ))}
                </ul>
              </ExpandableSection>

              {/* Scenario summary */}
              <div className="p-4 rounded-xl" style={{ background: `${vaccine.color}08`, border: `1px solid ${vaccine.color}25` }}>
                <h4 className="text-white font-medium text-sm mb-2">Score Interpretation for Your Scenario</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{score.summary}</p>
              </div>
            </div>
          )}

          {/* ── SAFETY ── */}
          {section === "safety" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl text-sm text-slate-400 leading-relaxed" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
                Adverse event rates are population-level estimates from post-licensure surveillance and clinical trials. Individual risk varies. "Per 100,000 doses" means out of 100,000 children vaccinated, this many would be expected to experience this event.
              </div>

              <div className="space-y-3">
                {vaccine.adverseEvents.map((ae, i) => (
                  <div key={i} className="p-4 rounded-xl transition-all" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${AE_TYPE_COLOR[ae.type]}25` }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-white font-medium text-sm">{ae.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ background: `${AE_TYPE_COLOR[ae.type]}20`, color: AE_TYPE_COLOR[ae.type] }}>
                            {ae.type}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">{ae.notes}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-white font-bold text-lg">{ae.probability >= 1000 ? (ae.probability / 1000).toFixed(0) + "k" : ae.probability >= 1 ? ae.probability.toFixed(ae.probability < 10 ? 1 : 0) : ae.probability.toFixed(3)}</div>
                        <div className="text-slate-500 text-xs">per 100,000 doses</div>
                        <div className="text-xs mt-1" style={{ color: "#64748b" }}>Severity: {ae.severityWeight}/100</div>
                      </div>
                    </div>
                    <div className="mt-2 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-1 rounded-full" style={{ width: `${Math.min(100, ae.severityWeight)}%`, background: AE_TYPE_COLOR[ae.type] }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-3">Waning Immunity Notes</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{vaccine.effectiveness.waningNotes}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-3">Breakthrough Infection Notes</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{vaccine.effectiveness.breakthroughNotes}</p>
              </div>
            </div>
          )}

          {/* ── EVIDENCE ── */}
          {section === "evidence" && (
            <div className="space-y-5">
              {/* Radar chart */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-2">Evidence & Benefit Profile</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(30,45,69,0.8)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Radar name="Score" dataKey="value" stroke={vaccine.color} fill={vaccine.color} fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Evidence confidence breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                  <div className="text-slate-400 text-xs mb-1">Years of Evidence</div>
                  <div className="text-2xl font-bold text-white">{vaccine.scores.yearsOfStudy}<span className="text-slate-500 text-sm">/100</span></div>
                  <div className="mt-2 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${vaccine.scores.yearsOfStudy}%`, background: "#3b82f6" }} />
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                  <div className="text-slate-400 text-xs mb-1">Long-Term Safety Evidence</div>
                  <div className="text-2xl font-bold text-white">{vaccine.scores.longTermSafetyEvidence}<span className="text-slate-500 text-sm">/100</span></div>
                  <div className="mt-2 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${vaccine.scores.longTermSafetyEvidence}%`, background: "#14b8a6" }} />
                  </div>
                </div>
              </div>

              {/* Studies */}
              <div>
                <h4 className="text-white font-medium text-sm mb-3">Key Studies & Sources ({vaccine.sources.length})</h4>
                <div className="space-y-2">
                  {vaccine.sources.map((s, i) => (
                    <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white text-xs font-medium leading-snug">{s.title}</p>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className="text-xs text-slate-500">{s.year} · {s.country}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa" }}>{s.type}</span>
                            <span className="text-xs text-slate-500">n={s.sampleSize}</span>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${s.confidence === "high" ? "bg-green-900/30 text-green-400" : s.confidence === "moderate" ? "bg-amber-900/30 text-amber-400" : "bg-red-900/30 text-red-400"}`}>
                          {s.confidence}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-2">Disease Transmission</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{vaccine.disease.transmissionRoute}</p>
              </div>
            </div>
          )}

          {/* ── SCHEDULE ── */}
          {section === "schedule" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Doses", value: vaccine.schedule.doses },
                  { label: "Brand Names", value: vaccine.brandNames.length },
                  { label: "Can Combine With", value: vaccine.schedule.canCombineWith.length },
                  { label: "Min. Interval", value: "See below" },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                    <div className="text-white font-bold text-xl">{item.value}</div>
                    <div className="text-slate-500 text-xs mt-1">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Dose timeline */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-4">Dose Timeline</h4>
                <div className="relative">
                  <div className="absolute top-3.5 left-4 right-4 h-0.5" style={{ background: "rgba(30,45,69,0.8)" }} />
                  <div className="relative flex justify-between">
                    {vaccine.schedule.timing.map((t, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 z-10">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white z-10" style={{ background: vaccine.color }}>
                          {i + 1}
                        </div>
                        <div className="text-xs text-center text-slate-400" style={{ maxWidth: 70 }}>{t}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-2">Minimum Intervals</h4>
                <p className="text-slate-400 text-sm">{vaccine.schedule.minimumInterval}</p>
              </div>

              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-2">Catch-Up Guidance</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{vaccine.schedule.catchUpNotes}</p>
              </div>

              {vaccine.schedule.canCombineWith.length > 0 && (
                <div className="p-4 rounded-xl" style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)" }}>
                  <h4 className="text-green-400 font-medium text-sm mb-3">Can Be Given Same Day As</h4>
                  <div className="flex flex-wrap gap-2">
                    {vaccine.schedule.canCombineWith.map((v) => (
                      <span key={v} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.1)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }}>{v}</span>
                    ))}
                  </div>
                </div>
              )}

              {vaccine.schedule.cannotCombineWith.length > 0 && (
                <div className="p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <h4 className="text-red-400 font-medium text-sm mb-3">Special Precautions</h4>
                  <ul className="space-y-1">
                    {vaccine.schedule.cannotCombineWith.map((v) => (
                      <li key={v} className="text-xs text-slate-400">{v}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ── POLICY ── */}
          {section === "policy" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl text-xs text-slate-400" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
                Policy differences between countries reflect variations in disease prevalence, health system priorities, and schedule philosophy — not necessarily different assessments of safety.
              </div>
              <div className="space-y-3">
                {vaccine.countryPolicies.map((p) => (
                  <div key={p.code} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">{p.country}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.recommended ? "bg-green-900/30 text-green-400" : "bg-slate-800 text-slate-400"}`}>
                            {p.recommended ? "✓ Recommended" : "Not Routine"}
                          </span>
                        </div>
                        <p className="text-blue-400 text-xs mb-1">{p.schedule}</p>
                        <p className="text-slate-500 text-xs leading-relaxed">{p.rationale}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Brand names */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                <h4 className="text-white font-medium text-sm mb-3">Available Formulations</h4>
                <div className="flex flex-wrap gap-2">
                  {vaccine.brandNames.map((b) => (
                    <span key={b} className="text-xs px-2.5 py-1 rounded-full text-slate-400" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}