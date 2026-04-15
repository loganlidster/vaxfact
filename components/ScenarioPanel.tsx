"use client";

import { ScenarioInputs } from "@/lib/vaccineData";
import { Settings2, Baby, Building2, Plane, AlertCircle, Users, Heart, MapPin, Activity } from "lucide-react";

interface Props {
  scenario: ScenarioInputs;
  setScenario: (s: ScenarioInputs) => void;
}

const Toggle = ({
  label,
  icon,
  value,
  onChange,
  description,
}: {
  label: string;
  icon: React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
  description: string;
}) => (
  <div
    className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
    style={{
      background: value ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${value ? "rgba(59,130,246,0.3)" : "rgba(30,45,69,0.6)"}`,
    }}
    onClick={() => onChange(!value)}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{ background: value ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)" }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-white">{label}</span>
        <div
          className="w-9 h-5 rounded-full flex-shrink-0 relative transition-all duration-200"
          style={{ background: value ? "#3b82f6" : "#1e3a5f" }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
            style={{ left: value ? "18px" : "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
          />
        </div>
      </div>
      <p className="text-slate-500 text-xs mt-0.5 leading-snug">{description}</p>
    </div>
  </div>
);

export default function ScenarioPanel({ scenario, setScenario }: Props) {
  const update = (key: keyof ScenarioInputs, value: ScenarioInputs[keyof ScenarioInputs]) =>
    setScenario({ ...scenario, [key]: value });

  const ageLabel =
    scenario.childAge < 3 ? "Newborn (0-2 mo)"
    : scenario.childAge < 6 ? "Young infant (3-5 mo)"
    : scenario.childAge < 12 ? "Infant (6-11 mo)"
    : scenario.childAge < 24 ? "Toddler (12-23 mo)"
    : scenario.childAge < 48 ? "Toddler (2-3 yr)"
    : scenario.childAge < 72 ? "Preschool (4-5 yr)"
    : "School age (6+ yr)";

  return (
    <div className="glass-card p-5 sticky top-20" style={{ border: "1px solid rgba(30,45,69,0.8)" }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.15)" }}>
          <Settings2 size={16} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-sm">Your Family's Scenario</h2>
          <p className="text-slate-500 text-xs">Scores update live as you adjust</p>
        </div>
      </div>

      {/* Age slider */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Baby size={14} className="text-blue-400" />
            <span className="text-sm font-medium text-white">Child's Age</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
            {ageLabel}
          </span>
        </div>
        <input
          type="range" min={0} max={96} step={1} value={scenario.childAge}
          onChange={(e) => update("childAge", parseInt(e.target.value))}
          className="w-full"
          style={{ background: `linear-gradient(90deg, #3b82f6 ${(scenario.childAge / 96) * 100}%, #1e3a5f ${(scenario.childAge / 96) * 100}%)` }}
        />
        <div className="flex justify-between text-slate-600 text-xs mt-1">
          <span>Birth</span><span>2 yr</span><span>4 yr</span><span>6 yr</span><span>8 yr</span>
        </div>
      </div>

      {/* Community coverage slider */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Activity size={14} className="text-teal-400" />
            <span className="text-sm font-medium text-white">Community Vax Rate</span>
          </div>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: scenario.communityVaxRate >= 90 ? "rgba(34,197,94,0.15)" : scenario.communityVaxRate >= 75 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
              color: scenario.communityVaxRate >= 90 ? "#86efac" : scenario.communityVaxRate >= 75 ? "#fcd34d" : "#fca5a5",
            }}
          >
            {scenario.communityVaxRate}%
          </span>
        </div>
        <input
          type="range" min={30} max={99} step={1} value={scenario.communityVaxRate}
          onChange={(e) => update("communityVaxRate", parseInt(e.target.value))}
          className="w-full"
          style={{ background: `linear-gradient(90deg, #14b8a6 ${((scenario.communityVaxRate - 30) / 69) * 100}%, #1e3a5f ${((scenario.communityVaxRate - 30) / 69) * 100}%)` }}
        />
        <div className="flex justify-between text-slate-600 text-xs mt-1">
          <span>30%</span><span>65%</span><span>99%</span>
        </div>
        <p className="text-slate-500 text-xs mt-1">Lower rates increase exposure risk for everyone</p>
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        <Toggle label="Attends Daycare" icon={<Building2 size={14} className={scenario.daycare ? "text-blue-400" : "text-slate-500"} />} value={scenario.daycare} onChange={(v) => update("daycare", v)} description="Group childcare settings significantly increase exposure to respiratory and enteric pathogens" />
        <Toggle label="International Travel" icon={<Plane size={14} className={scenario.travel ? "text-blue-400" : "text-slate-500"} />} value={scenario.travel} onChange={(v) => update("travel", v)} description="Travel to countries with lower vaccination rates or endemic disease substantially raises risk" />
        <Toggle label="Local Outbreak Nearby" icon={<AlertCircle size={14} className={scenario.outbreak ? "text-blue-400" : "text-slate-500"} />} value={scenario.outbreak} onChange={(v) => update("outbreak", v)} description="Active outbreak in your community dramatically elevates immediate exposure risk" />
        <Toggle label="Older Siblings in School" icon={<Users size={14} className={scenario.siblings ? "text-blue-400" : "text-slate-500"} />} value={scenario.siblings} onChange={(v) => update("siblings", v)} description="School-age siblings are frequent vectors for respiratory pathogens in the household" />
        <Toggle label="Immunocompromised in Home" icon={<Heart size={14} className={scenario.immunocompromisedHousehold ? "text-blue-400" : "text-slate-500"} />} value={scenario.immunocompromisedHousehold} onChange={(v) => update("immunocompromisedHousehold", v)} description="Unvaccinated children can transmit diseases to household members who cannot be vaccinated" />
        <Toggle label="Rural / Low-Density Area" icon={<MapPin size={14} className={scenario.rural ? "text-blue-400" : "text-slate-500"} />} value={scenario.rural} onChange={(v) => update("rural", v)} description="Lower population density reduces (but does not eliminate) exposure risk for airborne diseases" />
      </div>

      {[scenario.daycare, scenario.travel, scenario.outbreak, scenario.siblings, scenario.immunocompromisedHousehold].filter(Boolean).length > 0 && (
        <div className="mt-4 p-3 rounded-xl text-xs text-slate-400" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <span className="text-blue-400 font-semibold">
            {[scenario.daycare, scenario.travel, scenario.outbreak, scenario.siblings, scenario.immunocompromisedHousehold].filter(Boolean).length} risk factor{[scenario.daycare, scenario.travel, scenario.outbreak, scenario.siblings, scenario.immunocompromisedHousehold].filter(Boolean).length > 1 ? "s" : ""} active
          </span>{" "}
          — exposure scores are elevated from baseline.
        </div>
      )}
    </div>
  );
}