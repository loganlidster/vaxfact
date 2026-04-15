"use client";

import { useState, useMemo } from "react";
import { VaccineData, VACCINES } from "@/lib/vaccineData";
import { ArrowLeft, Printer, CheckCircle, Plus, X, AlertTriangle, Info } from "lucide-react";

interface Props {
  vaccines: VaccineData[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
}

// Age milestones in months for the Gantt X-axis
const AGE_MILESTONES = [
  { label: "Birth", month: 0 },
  { label: "2m", month: 2 },
  { label: "4m", month: 4 },
  { label: "6m", month: 6 },
  { label: "9m", month: 9 },
  { label: "12m", month: 12 },
  { label: "15m", month: 15 },
  { label: "18m", month: 18 },
  { label: "2yr", month: 24 },
  { label: "3yr", month: 36 },
  { label: "4yr", month: 48 },
  { label: "5yr", month: 60 },
  { label: "6yr", month: 72 },
];

const MAX_MONTH = 72;

// Parse timing strings to approximate month ranges
function parseTiming(timing: string[]): { start: number; end: number; label: string }[] {
  const ranges: { start: number; end: number; label: string }[] = [];
  const monthMap: Record<string, number> = {
    "birth": 0, "0": 0,
    "2 months": 2, "2m": 2, "6w": 1.5,
    "4 months": 4, "4m": 4,
    "6 months": 6, "6m": 6,
    "9 months": 9,
    "12 months": 12, "12m": 12,
    "12–15 months": 12, "12-15 months": 12,
    "15 months": 15, "15m": 15,
    "15–18 months": 15, "15-18 months": 15,
    "18 months": 18, "18m": 18,
    "2 years": 24, "2y": 24,
    "3 years": 36,
    "4 years": 48, "4–6 years": 48, "4-6 years": 48,
    "5 years": 60,
    "6 years": 72,
  };

  for (const t of timing) {
    const lower = t.toLowerCase().trim();
    let month = monthMap[lower];
    if (month === undefined) {
      // Try to extract a number
      const m = lower.match(/(\d+)\s*(month|mo|m)/);
      const y = lower.match(/(\d+)\s*(year|yr|y)/);
      if (m) month = parseInt(m[1]);
      else if (y) month = parseInt(y[1]) * 12;
      else if (lower === "birth" || lower.includes("birth")) month = 0;
      else month = 0;
    }
    const windowEnd = Math.min(MAX_MONTH, month + 2);
    ranges.push({ start: month, end: windowEnd, label: t });
  }
  return ranges;
}

const ADMIN_NOTES: Record<string, string[]> = {
  hepb: ["Give within 24h of birth if mother is HBsAg-positive", "Can combine with all other infant vaccines", "Check maternal HBsAg status before birth dose decision"],
  dtap: ["Space 4w between doses 1–3", "6 months between dose 3 and dose 4", "Pre-medicate with acetaminophen only if history of febrile seizure"],
  hib: ["4 brands available — check if combination vaccine covers Hib", "May reduce to 3 doses depending on brand used", "Not needed after age 5 in healthy children"],
  pcv: ["PCV20 now preferred over PCV13 in US", "4w between doses 1–3", "8w before booster dose", "Give at least 8w after any prior PCV"],
  mmr: ["Do NOT give to immunocompromised — specialist review required", "Defer 11 months if received blood products", "MMRV (with varicella) has 2x febrile seizure rate vs. separate shots"],
  rotavirus: ["ORAL vaccine — not injected", "Must start BEFORE 15 weeks of age", "Series must complete before 8 months", "Contraindicated in SCID"],
};

const CONFLICT_RULES: Array<{
  ids: string[];
  message: string;
  severity: "warning" | "info";
}> = [
  {
    ids: ["mmr", "rotavirus"],
    message: "MMR (12+ months) and Rotavirus (must finish by 8 months) are given at different age windows — no scheduling conflict.",
    severity: "info",
  },
  {
    ids: ["dtap", "pcv"],
    message: "DTaP and PCV can be given at the same visit. Fever is more common when given together.",
    severity: "info",
  },
];

export default function ScheduleBuilder({ vaccines, selectedIds, onToggle, onBack }: Props) {
  const [printMode, setPrintMode] = useState(false);
  const selectedVaccines = vaccines.filter((v) => selectedIds.includes(v.id));
  const unselectedVaccines = vaccines.filter((v) => !selectedIds.includes(v.id));

  const conflicts = useMemo(() => {
    return CONFLICT_RULES.filter((rule) =>
      rule.ids.every((id) => selectedIds.includes(id))
    );
  }, [selectedIds]);

  const monthToPercent = (month: number) => (month / MAX_MONTH) * 100;

  // Group doses by visit month
  const visitMap = useMemo(() => {
    const map: Record<number, Array<{ vaccine: VaccineData; doseLabel: string; color: string }>> = {};
    for (const v of selectedVaccines) {
      const parsed = parseTiming(v.schedule.timing);
      parsed.forEach((d, i) => {
        const key = d.start;
        if (!map[key]) map[key] = [];
        map[key].push({ vaccine: v, doseLabel: `${v.name} Dose ${i + 1}`, color: v.color });
      });
    }
    return map;
  }, [selectedVaccines]);

  const visitMonths = Object.keys(visitMap).map(Number).sort((a, b) => a - b);

  if (printMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white text-black p-8 rounded-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vaccine Schedule</h1>
              <p className="text-gray-500 text-sm mt-1">Generated by VaxFact.net · Educational purposes only · Confirm with your pediatrician</p>
            </div>
            <button onClick={() => { setPrintMode(false); window.print(); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Print / Save PDF</button>
          </div>
          <div className="space-y-3">
            {visitMonths.map((month) => (
              <div key={month} className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-2">{month === 0 ? "Birth" : `${month < 12 ? month + " months" : month === 12 ? "12 months (1 year)" : Math.round(month / 12) + " years"}`}</h3>
                <div className="space-y-1">
                  {visitMap[month].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                      <span className="text-gray-700">{item.doseLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6 border-t pt-4">This schedule is for educational reference only and may not reflect the latest CDC/AAP guidance or your child's specific health needs. Always verify timing with your child's healthcare provider.</p>
        </div>
        <button onClick={() => setPrintMode(false)} className="mt-4 text-slate-400 hover:text-white text-sm flex items-center gap-2">
          <ArrowLeft size={14} /> Back to schedule view
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Explorer
          </button>
          <div className="w-px h-5 bg-slate-700" />
          <h2 className="text-white font-bold text-xl">Schedule Builder</h2>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6" }}>
            {selectedVaccines.length} vaccines
          </span>
        </div>
        <button
          onClick={() => setPrintMode(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}
        >
          <Printer size={15} /> Print Schedule
        </button>
      </div>

      {/* Vaccine selector row */}
      <div className="glass-card p-4" style={{ border: "1px solid rgba(30,45,69,0.8)" }}>
        <p className="text-slate-400 text-xs mb-3 font-medium uppercase tracking-wider">Selected for Schedule</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedVaccines.length === 0 && (
            <p className="text-slate-600 text-sm">No vaccines selected. Add from the Vaccine Explorer.</p>
          )}
          {selectedVaccines.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: `${v.color}20`, color: v.color, border: `1px solid ${v.color}40` }}
            >
              <span>{v.icon}</span>
              {v.name}
              <button onClick={() => onToggle(v.id)} className="hover:opacity-70 transition-opacity">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
        {unselectedVaccines.length > 0 && (
          <div>
            <p className="text-slate-600 text-xs mb-2">Add more:</p>
            <div className="flex flex-wrap gap-2">
              {unselectedVaccines.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onToggle(v.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Plus size={11} />
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Conflicts / notes */}
      {conflicts.map((c, i) => (
        <div key={i} className="flex items-start gap-2 p-3 rounded-xl text-sm" style={{ background: c.severity === "warning" ? "rgba(245,158,11,0.08)" : "rgba(59,130,246,0.06)", border: `1px solid ${c.severity === "warning" ? "rgba(245,158,11,0.25)" : "rgba(59,130,246,0.2)"}` }}>
          {c.severity === "warning" ? <AlertTriangle size={15} className="text-amber-400 mt-0.5 flex-shrink-0" /> : <Info size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />}
          <span className={c.severity === "warning" ? "text-amber-300" : "text-blue-300"}>{c.message}</span>
        </div>
      ))}

      {selectedVaccines.length > 0 && (
        <>
          {/* Gantt Chart */}
          <div className="glass-card p-5" style={{ border: "1px solid rgba(30,45,69,0.8)" }}>
            <h3 className="text-white font-semibold mb-4">Gantt Timeline — Birth through Age 6</h3>

            {/* X-axis */}
            <div className="relative mb-2 pl-32">
              <div className="flex justify-between">
                {AGE_MILESTONES.map((m) => (
                  <div key={m.month} className="text-center" style={{ width: `${100 / (AGE_MILESTONES.length - 1)}%`, position: "absolute", left: `${monthToPercent(m.month)}%`, transform: "translateX(-50%)" }}>
                    <div className="text-slate-600 text-xs whitespace-nowrap">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid lines */}
            <div className="relative pl-32 mb-1" style={{ height: 16 }}>
              {AGE_MILESTONES.map((m) => (
                <div key={m.month} className="absolute top-0 bottom-0 w-px" style={{ left: `${monthToPercent(m.month)}%`, background: "rgba(30,45,69,0.6)" }} />
              ))}
            </div>

            {/* Vaccine rows */}
            <div className="space-y-2">
              {selectedVaccines.map((vaccine) => {
                const doseWindows = parseTiming(vaccine.schedule.timing);
                return (
                  <div key={vaccine.id} className="flex items-center gap-0">
                    {/* Label */}
                    <div className="w-32 flex-shrink-0 flex items-center gap-2 pr-3">
                      <div className="w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0" style={{ background: `${vaccine.color}25` }}>
                        {vaccine.icon}
                      </div>
                      <span className="text-xs text-slate-300 font-medium truncate">{vaccine.name}</span>
                    </div>

                    {/* Bar track */}
                    <div className="flex-1 relative h-8" style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                      {/* Grid lines overlay */}
                      {AGE_MILESTONES.map((m) => (
                        <div key={m.month} className="absolute top-0 bottom-0 w-px" style={{ left: `${monthToPercent(m.month)}%`, background: "rgba(30,45,69,0.4)" }} />
                      ))}

                      {/* Dose markers */}
                      {doseWindows.map((d, i) => (
                        <div
                          key={i}
                          className="gantt-bar absolute"
                          title={`Dose ${i + 1}: ${d.label}`}
                          style={{
                            left: `${monthToPercent(d.start)}%`,
                            width: `${monthToPercent(d.end - d.start + 1)}%`,
                            background: `linear-gradient(90deg, ${vaccine.color}dd, ${vaccine.color}88)`,
                            border: `1px solid ${vaccine.color}60`,
                            top: "50%",
                            transform: "translateY(-50%)",
                            minWidth: 28,
                            maxWidth: "12%",
                          }}
                        >
                          <span className="text-white font-bold">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-4 rounded flex items-center justify-center text-white font-bold text-xs" style={{ background: "rgba(100,116,139,0.3)", border: "1px solid rgba(100,116,139,0.3)" }}>1</div>
                Dose number
              </div>
              <span>Bars show recommended administration window · Hover for details</span>
            </div>
          </div>

          {/* Visit summary */}
          <div className="glass-card p-5" style={{ border: "1px solid rgba(30,45,69,0.8)" }}>
            <h3 className="text-white font-semibold mb-4">Visit-by-Visit Summary ({visitMonths.length} visits)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visitMonths.map((month) => {
                const monthLabel = month === 0 ? "Birth"
                  : month < 12 ? `${month} months`
                  : month === 12 ? "12 months (1 year)"
                  : `${Math.round(month / 12)} years (${month}m)`;

                return (
                  <div key={month} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(30,45,69,0.8)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)" }}>
                        {month === 0 ? "🏥" : "💉"}
                      </div>
                      <span className="text-white font-semibold text-sm">{monthLabel}</span>
                    </div>
                    <div className="space-y-1.5">
                      {visitMap[month].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                          <span className="text-slate-300">{item.doseLabel}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-xs text-slate-600">{visitMap[month].length} injection{visitMap[month].length > 1 ? "s" : ""} at this visit</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Administration notes */}
          <div className="glass-card p-5" style={{ border: "1px solid rgba(30,45,69,0.8)" }}>
            <h3 className="text-white font-semibold mb-4">Administration Notes by Vaccine</h3>
            <div className="space-y-4">
              {selectedVaccines.map((v) => {
                const notes = ADMIN_NOTES[v.id] || [];
                return (
                  <div key={v.id} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${v.color}20` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{v.icon}</span>
                      <span className="text-white font-medium text-sm">{v.name}</span>
                      <span className="text-xs text-slate-500">· {v.schedule.doses} doses · {v.ageWindow}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {notes.map((note, i) => (
                        <li key={i} className="text-xs text-slate-400 flex gap-2">
                          <CheckCircle size={12} className="mt-0.5 flex-shrink-0" style={{ color: v.color }} />
                          {note}
                        </li>
                      ))}
                      <li className="text-xs text-slate-400 flex gap-2">
                        <CheckCircle size={12} className="mt-0.5 flex-shrink-0 text-slate-600" />
                        Minimum interval: {v.schedule.minimumInterval}
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer-banner p-4 flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-400">
              <span className="text-amber-300 font-semibold">Schedule Disclaimer: </span>
              This schedule is generated for educational purposes based on typical CDC/ACIP guidance. It is not a substitute for individualized guidance from your child's healthcare provider. Timing may differ based on your child's health history, prematurity, prior doses, or local outbreaks. Always confirm any vaccination schedule with your pediatrician.
            </p>
          </div>
        </>
      )}
    </div>
  );
}