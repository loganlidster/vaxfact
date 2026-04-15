"use client";

import { useState, useMemo } from "react";
import { VACCINES, computeScores, DEFAULT_SCENARIO, ScenarioInputs, VaccineData } from "@/lib/vaccineData";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import VaccineGrid from "@/components/VaccineGrid";
import VaccineDetail from "@/components/VaccineDetail";
import ScheduleBuilder from "@/components/ScheduleBuilderNew";
import ScenarioDrawer from "@/components/ScenarioDrawer";
import Footer from "@/components/Footer";
import OutbreakMap from "@/components/OutbreakMap";
import LifeCourseTimeline from "@/components/LifeCourseTimeline";
import DecisionPhilosophy from "@/components/DecisionPhilosophy";

type View = "home" | "detail" | "schedule" | "outbreak" | "timeline";

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [scenario, setScenario] = useState<ScenarioInputs>(DEFAULT_SCENARIO);
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineData | null>(null);
  const [selectedForSchedule, setSelectedForSchedule] = useState<string[]>([]);
  const [showScenarioDrawer, setShowScenarioDrawer] = useState(false);

  const scores = useMemo(() => VACCINES.map(v => computeScores(v, scenario)), [scenario]);

  const handleSelectVaccine = (vaccine: VaccineData) => {
    setSelectedVaccine(vaccine);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setView("home");
    setSelectedVaccine(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSchedule = (id: string) => {
    setSelectedForSchedule(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedVaccineScore = selectedVaccine
    ? scores.find(s => s.vaccineId === selectedVaccine.id)
    : null;

  const scenarioActive =
    scenario.daycare ||
    scenario.travel ||
    scenario.outbreak ||
    scenario.siblings ||
    scenario.immunocompromisedHousehold ||
    scenario.rural ||
    scenario.childAge !== DEFAULT_SCENARIO.childAge ||
    scenario.communityVaxRate !== DEFAULT_SCENARIO.communityVaxRate;

  const handleStartScenario = () => {
    if (window.innerWidth < 900) {
      setShowScenarioDrawer(true);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSampleCard = () => {
    const el = document.getElementById("overview");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navigateTo = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backLabel =
    view === "schedule" ? "Back to vaccines" :
    view === "outbreak" ? "Back to vaccines" :
    view === "timeline" ? "Back to vaccines" :
    "Back to all vaccines";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <Header
        onHomeClick={handleBack}
        showBack={view !== "home"}
        backLabel={backLabel}
        selectedCount={selectedForSchedule.length}
        onScheduleClick={() => navigateTo("schedule")}
        onScenarioClick={() => setShowScenarioDrawer(true)}
        onOutbreakClick={() => navigateTo("outbreak")}
        onTimelineClick={() => navigateTo("timeline")}
        scenarioActive={scenarioActive}
        currentView={view}
      />

      <main style={{ flex: 1 }}>
        {view === "home" && (
          <>
            <HeroSection
              scenario={scenario}
              setScenario={setScenario}
              onStartScenario={handleStartScenario}
              onSampleCard={handleSampleCard}
            />
            <VaccineGrid
              vaccines={VACCINES}
              scores={scores}
              scenario={scenario}
              onSelectVaccine={handleSelectVaccine}
              selectedForSchedule={selectedForSchedule}
              onToggleSchedule={toggleSchedule}
            />
            <DecisionPhilosophy />
          </>
        )}

        {view === "detail" && selectedVaccine && selectedVaccineScore && (
          <VaccineDetail
            vaccine={selectedVaccine}
            score={selectedVaccineScore}
            scenario={scenario}
            onBack={handleBack}
            isSelectedForSchedule={selectedForSchedule.includes(selectedVaccine.id)}
            onToggleSchedule={() => toggleSchedule(selectedVaccine.id)}
          />
        )}

        {view === "schedule" && (
          <ScheduleBuilder
            vaccines={VACCINES}
            selectedIds={selectedForSchedule}
            onToggle={toggleSchedule}
            onBack={handleBack}
          />
        )}

        {view === "outbreak" && (
          <OutbreakMap onBack={handleBack} />
        )}

        {view === "timeline" && (
          <LifeCourseTimeline />
        )}
      </main>

      {view === "home" && <Footer />}

      {showScenarioDrawer && (
        <ScenarioDrawer
          scenario={scenario}
          setScenario={setScenario}
          onClose={() => setShowScenarioDrawer(false)}
        />
      )}
    </div>
  );
}