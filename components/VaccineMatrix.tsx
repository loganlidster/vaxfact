"use client";

import { useState } from "react";
import { VaccineData, ScoreResult } from "@/lib/vaccineData";
import { Info, CheckCircle, Plus, ChevronRight } from "lucide-react";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ZAxis, Cell,
} from "recharts";

interface Props {
  vaccines: VaccineData[];
  scores: ScoreResult[];
  onSelectVaccine: (id: string) => void;
  selectedForSchedule: string[];
  onToggleSchedule: (id: string) => void;
}

const RECOMMENDATION_CONFIG = {
  strong: { label: "Strong Support", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  moderate: { label: "Moderate Support", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  consider: { label: "Consider", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  discuss: { label: "Discuss w/ Provider", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-slate-400 text-xs">{label}</span>
      <span className="text-white text-xs font-bold">{value}</span>
    </div>
    <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div
        className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  </div>
);

// Custom tooltip for scatter chart
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; x: number; y: number; z: number; color: string } }> }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="tooltip-content">
        <p className="font-bold text-white">{d.name}</p>
        <p className="text-slate-400">Disease Consequence: <span className="text-white">{d.y}</span></p>
        <p className="text-slate-400">Exposure Risk: <span className="text-white">{d.x}</span></p>
        <p className="text-slate-400">Net Benefit: <span className="text-white">{d.z}</span></p>
      </div>
    );
  }
  return null;
};

export default function VaccineMatrix({ vaccines, scores, onSelectVaccine, selectedForSchedule, onToggleSchedule }: Props) {
  const [view, setView] = useState<"cards" | "matrix">("cards");

  const matrixData = vaccines.map((v, i) => ({
    name: v.name,
    id: v.id,
    x: scores[i].exposureRisk,
    y: scores[i].diseaseConsequence,
    z: scores[i].netBenefit,
    color: v.color,
  }));

  return (
    <div>
      {/* View toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg">
          Vaccine Overview
          <span className="ml-2 text-slate-500 text-sm font-normal">({vaccines.length} vaccines)</span>
        </h2>
        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(30,45,69,0.8)" }}>
          {(["cards", "matrix"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-1.5 text-xs font-medium capitalize transition-all"
              style={{
                background: view === v ? "rgba(59,130,246,0.2)" : "transparent",
                color: view === v ? "#60a5fa" : "#64748b",
              }}
            >
              {v === "cards" ? "📋 Cards" : "📊 Matrix"}
            </button>
          ))}
        </div>
      </div>

      {view === "matrix" && (
        <div className="glass-card p-5 mb-6" style={{ border: "1px solid rgba(30,45,69,0.8)" }}>
          <p className="text-slate-400 text-xs mb-1">
            <span className="text-white font-medium">Risk-Consequence Matrix</span> — X = exposure risk, Y = disease severity, bubble size = net benefit score. Click a bubble to explore.
          </p>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis
                  type="number" dataKey="x" name="Exposure Risk" domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 11 }} label={{ value: "Exposure Risk →", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 11 }}
                />
                <YAxis
                  type="number" dataKey="y" name="Disease Consequence" domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 11 }} label={{ value: "Disease Severity →", angle: -90, position: "insideLeft", offset: 15, fill: "#64748b", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[400, 1200]} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter
                  data={matrixData}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={(d: any) => d && d.id && onSelectVaccine(d.id)}
                  style={{ cursor: "pointer" }}
                >
                  {matrixData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {vaccines.map((v) => (
              <div key={v.id} className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer hover:text-white" onClick={() => onSelectVaccine(v.id)}>
                <div className="w-3 h-3 rounded-full" style={{ background: v.color }} />
                {v.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vaccines.map((vaccine, i) => {
          const score = scores[i];
          const rec = RECOMMENDATION_CONFIG[score.recommendation];
          const inSchedule = selectedForSchedule.includes(vaccine.id);

          return (
            <div
              key={vaccine.id}
              className="glass-card glass-card-hover p-5 transition-all duration-200 cursor-pointer"
              style={{
                border: inSchedule ? `1px solid ${vaccine.color}55` : "1px solid rgba(30,45,69,0.8)",
                boxShadow: inSchedule ? `0 0 20px ${vaccine.color}20` : "none",
              }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${vaccine.color}20`, border: `1px solid ${vaccine.color}30` }}
                  >
                    {vaccine.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{vaccine.name}</h3>
                    <p className="text-slate-500 text-xs">{vaccine.yearsInUse} yrs in use · {vaccine.schedule.doses} doses</p>
                  </div>
                </div>
                <div
                  className="text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap"
                  style={{ background: rec.bg, color: rec.color }}
                >
                  {rec.label}
                </div>
              </div>

              {/* Diseases */}
              <div className="flex flex-wrap gap-1 mb-3">
                {vaccine.diseases.slice(0, 2).map((d) => (
                  <span key={d} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {d}
                  </span>
                ))}
                {vaccine.diseases.length > 2 && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", color: "#64748b" }}>
                    +{vaccine.diseases.length - 2} more
                  </span>
                )}
              </div>

              {/* Net benefit big number */}
              <div className="flex items-center gap-4 mb-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: vaccine.color }}>{score.netBenefit}</div>
                  <div className="text-slate-500 text-xs">Net Benefit</div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <ScoreBar label="Exposure Risk" value={score.exposureRisk} color="#ef4444" />
                  <ScoreBar label="Disease Harm" value={score.diseaseConsequence} color="#f97316" />
                  <ScoreBar label="Vaccine Safety" value={100 - score.vaccineHarm} color="#22c55e" />
                  <ScoreBar label="Evidence" value={score.evidenceConfidence} color="#3b82f6" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectVaccine(vaccine.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <Info size={13} />
                  Full Analysis
                  <ChevronRight size={12} />
                </button>
                <button
                  onClick={() => onToggleSchedule(vaccine.id)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  style={
                    inSchedule
                      ? { background: `${vaccine.color}25`, color: vaccine.color, border: `1px solid ${vaccine.color}50` }
                      : { background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }
                  }
                >
                  {inSchedule ? <CheckCircle size={13} /> : <Plus size={13} />}
                  {inSchedule ? "Added" : "Schedule"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}