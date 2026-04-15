"use client";

import { useMemo } from "react";
import { VaccineData } from "@/lib/vaccineData";
import { ArrowLeft, Calendar, X, AlertTriangle, Printer, ChevronRight, Clock } from "lucide-react";

interface ScheduleBuilderNewProps {
  vaccines: VaccineData[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
}

interface ScheduleEntry {
  vaccine: VaccineData;
  dose: number;
  timing: string;
  ageMonths: number;
}

function parseAgeToMonths(timing: string): number {
  const lower = timing.toLowerCase();
  if (lower.includes("birth")) return 0;
  const numbers = timing.match(/\d+/g);
  if (numbers) return parseInt(numbers[0]);
  return 0;
}

const AGE_GROUPS = [
  { label: "At Birth", min: 0, max: 0 },
  { label: "1–2 Months", min: 1, max: 2 },
  { label: "2–4 Months", min: 2, max: 4 },
  { label: "4–6 Months", min: 4, max: 6 },
  { label: "6–9 Months", min: 6, max: 9 },
  { label: "9–12 Months", min: 9, max: 12 },
  { label: "12–15 Months", min: 12, max: 15 },
  { label: "15–18 Months", min: 15, max: 18 },
  { label: "18–24 Months", min: 18, max: 24 },
  { label: "2+ Years", min: 24, max: 999 },
];

function GanttChart({ entries, vaccines }: { entries: ScheduleEntry[]; vaccines: VaccineData[] }) {
  const maxMonths = 24;
  const milestones = [0, 1, 2, 4, 6, 9, 12, 15, 18, 24];

  // Group entries by vaccine
  const byVaccine = vaccines.filter(v =>
    entries.some(e => e.vaccine.id === v.id)
  );

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: 18, padding: 24, overflowX: "auto",
    }}>
      <h3 style={{ fontSize: 18, marginBottom: 20 }}>Timeline (first 24 months)</h3>
      <div style={{ minWidth: 560 }}>
        {/* Month axis */}
        <div style={{ display: "flex", paddingLeft: 130, marginBottom: 10 }}>
          {milestones.map((m, i) => (
            <div key={m} style={{
              flex: 1, fontSize: 11, color: "var(--muted)",
              fontFamily: "Inter, sans-serif", fontWeight: 600,
            }}>
              {m === 0 ? "Birth" : `${m}m`}
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div style={{ position: "relative" }}>
          {byVaccine.map(vaccine => {
            const vEntries = entries.filter(e => e.vaccine.id === vaccine.id);
            return (
              <div key={vaccine.id} style={{
                display: "flex", alignItems: "center",
                marginBottom: 10, height: 36,
              }}>
                {/* Label */}
                <div style={{
                  width: 130, flexShrink: 0, paddingRight: 12,
                  fontSize: 13, fontWeight: 600, fontFamily: "Inter, sans-serif",
                  color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {vaccine.name}
                </div>

                {/* Track */}
                <div style={{
                  flex: 1, height: 36, position: "relative",
                  background: "var(--surface-2)", borderRadius: 8,
                  border: "1px solid var(--line)",
                }}>
                  {/* Milestone grid lines */}
                  {milestones.slice(1).map(m => (
                    <div key={m} style={{
                      position: "absolute",
                      left: `${(m / maxMonths) * 100}%`,
                      top: 0, bottom: 0, width: 1,
                      background: "var(--line)", opacity: 0.5,
                    }} />
                  ))}

                  {/* Dose markers */}
                  {vEntries.map(entry => {
                    const pct = Math.min((entry.ageMonths / maxMonths) * 100, 96);
                    return (
                      <div key={`${entry.vaccine.id}-d${entry.dose}`}
                        style={{
                          position: "absolute",
                          left: `${pct}%`,
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 28, height: 28,
                          borderRadius: "50%",
                          background: vaccine.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: 11, fontWeight: 800,
                          fontFamily: "Inter, sans-serif",
                          boxShadow: `0 2px 8px ${vaccine.color}66`,
                          zIndex: 2,
                          cursor: "default",
                        }}
                        title={`Dose ${entry.dose}: ${entry.timing}`}
                      >
                        {entry.dose}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--line)",
          display: "flex", flexWrap: "wrap", gap: 14,
        }}>
          {byVaccine.map(v => (
            <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: v.color }} />
              <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif", color: "var(--muted)" }}>{v.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ScheduleBuilderNew({
  vaccines,
  selectedIds,
  onToggle,
  onBack,
}: ScheduleBuilderNewProps) {
  const selectedVaccines = vaccines.filter(v => selectedIds.includes(v.id));

  const scheduleEntries = useMemo<ScheduleEntry[]>(() => {
    const entries: ScheduleEntry[] = [];
    selectedVaccines.forEach(vaccine => {
      vaccine.schedule.timing.forEach((timing, i) => {
        entries.push({
          vaccine,
          dose: i + 1,
          timing,
          ageMonths: parseAgeToMonths(timing),
        });
      });
    });
    return entries.sort((a, b) => a.ageMonths - b.ageMonths);
  }, [selectedVaccines]);

  const groupedEntries = useMemo(() => {
    return AGE_GROUPS
      .map(group => ({
        ...group,
        entries: scheduleEntries.filter(e =>
          e.ageMonths >= group.min && e.ageMonths <= group.max
        ),
      }))
      .filter(g => g.entries.length > 0);
  }, [scheduleEntries]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div className="vf-container" style={{ paddingTop: 24, paddingBottom: 28 }}>
          <button
            onClick={onBack}
            className="no-print"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "none", cursor: "pointer",
              color: "var(--muted)", fontSize: 14, fontWeight: 600,
              fontFamily: "Inter, sans-serif", marginBottom: 20, padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            Back to vaccines
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 32, display: "flex", alignItems: "center", gap: 12 }}>
                <Calendar size={28} color="var(--primary)" />
                Vaccination Schedule Plan
              </h1>
              <p style={{ color: "var(--muted)", fontSize: 14, fontFamily: "Inter, sans-serif", marginTop: 6 }}>
                {selectedVaccines.length} vaccine{selectedVaccines.length !== 1 ? "s" : ""} selected ·{" "}
                {scheduleEntries.length} total doses
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary no-print"
            >
              <Printer size={16} /> Print schedule
            </button>
          </div>
        </div>
      </div>

      <div className="vf-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {selectedVaccines.length === 0 ? (
          /* Empty state */
          <div style={{
            background: "var(--surface)", border: "1px solid var(--line)",
            borderRadius: 22, padding: "64px 32px", textAlign: "center",
          }}>
            <Calendar size={48} color="var(--line)" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>No vaccines selected yet</h2>
            <p style={{ color: "var(--muted)", fontSize: 15, fontFamily: "Inter, sans-serif", maxWidth: 440, margin: "0 auto 28px" }}>
              Go back to the vaccine overview and click <strong>"Add to schedule plan"</strong> on the vaccines you'd like to include.
            </p>
            <button onClick={onBack} className="btn btn-primary">
              Browse vaccines <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 28 }}>
            {/* Gantt */}
            <GanttChart entries={scheduleEntries} vaccines={selectedVaccines} />

            {/* Selected vaccines summary */}
            <div style={{
              background: "var(--surface)", border: "1px solid var(--line)",
              borderRadius: 18, padding: 22,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: 18 }}>Selected vaccines</h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {selectedVaccines.map(v => (
                  <div key={v.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 14px", background: "var(--surface-2)",
                    border: "1px solid var(--line)", borderRadius: 12,
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: v.color }} />
                    <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{v.name}</span>
                    <button
                      onClick={() => onToggle(v.id)}
                      className="no-print"
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--muted)", padding: 2, display: "flex",
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#b91c1c")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule by age groups */}
            <div>
              <h2 style={{ fontSize: 24, marginBottom: 16 }}>Schedule by age window</h2>
              <div style={{ display: "grid", gap: 14 }}>
                {groupedEntries.map(group => (
                  <div key={group.label} style={{
                    background: "var(--surface)", border: "1px solid var(--line)",
                    borderRadius: 18, overflow: "hidden",
                  }}>
                    {/* Group header */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "14px 20px", background: "var(--surface-2)",
                      borderBottom: "1px solid var(--line)",
                    }}>
                      <Clock size={16} color="var(--primary)" />
                      <h3 style={{ fontSize: 16, color: "var(--text)", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                        {group.label}
                      </h3>
                      <span style={{
                        marginLeft: "auto", fontSize: 12, fontFamily: "Inter, sans-serif",
                        color: "var(--muted)", fontWeight: 600,
                      }}>
                        {group.entries.length} dose{group.entries.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Entries */}
                    <div>
                      {group.entries.map((entry, idx) => (
                        <div key={`${entry.vaccine.id}-${entry.dose}-${idx}`} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "16px 20px",
                          borderBottom: idx < group.entries.length - 1 ? "1px solid var(--line)" : "none",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 12,
                              background: entry.vaccine.color,
                              display: "grid", placeItems: "center",
                              color: "white", fontWeight: 800, fontSize: 15,
                              fontFamily: "Inter, sans-serif", flexShrink: 0,
                            }}>
                              {entry.dose}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "Inter, sans-serif" }}>
                                {entry.vaccine.name}
                              </div>
                              <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                                Dose {entry.dose} of {entry.vaccine.schedule.doses}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "Inter, sans-serif", color: "var(--text)" }}>
                                {entry.timing}
                              </div>
                              <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                                recommended window
                              </div>
                            </div>
                            <button
                              onClick={() => onToggle(entry.vaccine.id)}
                              className="no-print"
                              style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "var(--muted)", padding: 6,
                                borderRadius: 8, transition: "color 0.15s ease, background 0.15s ease",
                              }}
                              title="Remove from schedule"
                              onMouseEnter={e => { e.currentTarget.style.color = "#b91c1c"; e.currentTarget.style.background = "#fff1f1"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spacing and conflict notes */}
            <div style={{
              background: "var(--surface)", border: "1px solid var(--line)",
              borderRadius: 18, padding: 22,
            }}>
              <h3 style={{ fontSize: 18, marginBottom: 14 }}>Spacing and combination notes</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {selectedVaccines.map(v => (
                  <div key={v.id} style={{
                    padding: 14, background: "var(--surface-2)",
                    border: "1px solid var(--line)", borderRadius: 12,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
                      {v.name}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                      Minimum interval: {v.schedule.minimumInterval}
                    </div>
                    {v.schedule.canCombineWith.length > 0 && (
                      <div style={{ fontSize: 13, color: "var(--good)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>
                        Can combine with: {v.schedule.canCombineWith.join(", ")}
                      </div>
                    )}
                    {v.schedule.cannotCombineWith.length > 0 && (
                      <div style={{ fontSize: 13, color: "var(--warn)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>
                        Do not combine with: {v.schedule.cannotCombineWith.join(", ")}
                      </div>
                    )}
                    {v.schedule.catchUpNotes && (
                      <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>
                        Catch-up: {v.schedule.catchUpNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              padding: 20, background: "#fffbf0",
              border: "1px solid #fde68a", borderRadius: 16,
            }}>
              <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: 15, marginBottom: 6, fontFamily: "'Source Serif 4', serif" }}>Important notice</h4>
                <p style={{ fontSize: 13, color: "#92400e", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
                  This schedule is for educational reference only. Actual vaccination timing should be discussed
                  with your child's pediatrician. Some vaccines can be given together, and timing may vary based
                  on individual health circumstances, catch-up needs, and local availability.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}