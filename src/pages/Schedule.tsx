import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchSchedule, type AzuraScheduleItem } from "@/lib/azuracast";
import { Loader2, Radio } from "lucide-react";

const days = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
const dayLabelsEs: Record<string, string> = { lun: "Lunes", mar: "Martes", mie: "Miércoles", jue: "Jueves", vie: "Viernes", sab: "Sábado", dom: "Domingo" };

// Map AzuraCast day (0-6, Sunday=0) to our day index (Monday=0)
const dayMap: Record<number, string> = {
  0: "dom", // Sunday
  1: "lun", // Monday
  2: "mar", // Tuesday
  3: "mie", // Wednesday
  4: "jue", // Thursday
  5: "vie", // Friday
  6: "sab", // Saturday
};

const todayIndex = (): string => {
  const d = new Date().getDay();
  return dayMap[d] || "lun";
};

const Schedule = () => {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState(todayIndex());
  const [scheduleData, setScheduleData] = useState<AzuraScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedule from backend when day changes
  useEffect(() => {
    let active = true;

    const loadSchedule = async () => {
      setLoading(true);
      setError(null);

      try {
        // Convert our day index to AzuraCast day (0=Sunday)
        const dayToAzura: Record<string, number> = {
          dom: 0, lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6,
        };
        const azuraDay = dayToAzura[selectedDay] ?? 1;

        const data = await fetchSchedule(azuraDay);
        if (active) {
          setScheduleData(data.schedule || []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load schedule");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSchedule();

    return () => {
      active = false;
    };
  }, [selectedDay]);

  const isToday = selectedDay === todayIndex();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">{t("schedule.title")}</h1>
          <p className="text-muted-foreground mb-10">{t("schedule.subtitle")}</p>

          {/* Day tabs */}
          <div className="flex gap-1.5 mb-8 overflow-x-auto pb-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedDay === day
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {dayLabelsEs[day]}
                {day === todayIndex() && (
                  <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-4 mb-8 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Schedule items */}
          {!loading && !error && (
            <div className="space-y-3">
              {scheduleData.length > 0 ? (
                scheduleData.map((item, i) => (
                  <motion.div
                    key={`${item.name}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-stretch rounded-xl border border-border overflow-hidden"
                  >
                    {/* Time column */}
                    <div className="flex flex-col items-center justify-center px-4 py-4 min-w-[90px] bg-secondary/50">
                      <span className="text-sm font-mono font-semibold text-foreground">
                        {item.start_time.substring(0, 5)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.end_time.substring(0, 5)}
                      </span>
                    </div>

                    {/* Program info */}
                    <div className="flex-1 p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {item.name}
                          </h3>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.streamers && item.streamers.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            🎙️ {item.streamers.map(s => s.display_name).join(", ")}
                          </p>
                        )}
                      </div>
                      {item.color && (
                        <span
                          className="text-xs px-2.5 py-1 rounded-full border"
                          style={{
                            backgroundColor: `${item.color}20`,
                            borderColor: `${item.color}40`,
                            color: item.color,
                          }}
                        >
                          Program
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Radio className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No hay programas programados para este día.
                  </p>
                </div>
              )}
            </div>
          )}

          {scheduleData.length === 0 && !loading && !error && (
            <p className="text-center text-muted-foreground py-12">
              No hay programas programados para este día.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Schedule;
