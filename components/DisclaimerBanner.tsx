"use client";

import { X, AlertTriangle } from "lucide-react";

export default function DisclaimerBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="disclaimer-banner p-4 flex items-start gap-3">
      <AlertTriangle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 text-sm">
        <span className="text-amber-300 font-semibold">Educational Tool Only. </span>
        <span className="text-slate-300">
          VaxFact is a decision-support resource based on publicly available epidemiological data and
          peer-reviewed literature. It is{" "}
          <strong className="text-white">not</strong> individualized medical advice.
          Scores are models, not diagnoses. Always discuss vaccination decisions with your
          child's pediatrician. Evidence is population-level and may not reflect your
          child's specific health context.
        </span>
      </div>
      <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  );
}