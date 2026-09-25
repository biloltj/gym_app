"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

const STORAGE_KEY = "gym-timer-settings";

type Phase = "idle" | "work" | "rest" | "done";

type Settings = { work: number; rest: number; rounds: number };

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore — fall back to defaults
  }
  return { work: 30, rest: 15, rounds: 5 };
}

function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore — non-persistent is fine
  }
}

const inputClass =
  "w-full rounded-lg bg-neutral-950/60 border border-neutral-800 px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50";

export default function WorkoutTimer({ locale }: { locale: Locale }) {
  const [settings, setSettings] = useState<Settings>({ work: 30, rest: 15, rounds: 5 });
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(1);
  const [remaining, setRemaining] = useState(30);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    setRemaining(loaded.work);
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev > 1) return prev - 1;

        setPhase((currentPhase) => {
          if (currentPhase === "work") {
            setRound((r) => r);
            return "rest";
          }
          if (currentPhase === "rest") {
            setRound((r) => {
              if (r >= settings.rounds) return r;
              return r + 1;
            });
            return "work";
          }
          return currentPhase;
        });

        return 0;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, settings.rounds]);

  useEffect(() => {
    if (remaining !== 0 || !running) return;
    if (phase === "rest" && round >= settings.rounds) {
      setPhase("done");
      setRunning(false);
      return;
    }
    if (phase === "work") setRemaining(settings.work);
    if (phase === "rest") setRemaining(settings.rest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function updateSetting(key: keyof Settings, value: number) {
    const next = { ...settings, [key]: Math.max(1, value) };
    setSettings(next);
    saveSettings(next);
    if (phase === "idle") setRemaining(key === "work" ? next.work : settings.work);
  }

  function start() {
    if (phase === "idle" || phase === "done") {
      setPhase("work");
      setRound(1);
      setRemaining(settings.work);
    }
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setPhase("idle");
    setRound(1);
    setRemaining(settings.work);
  }

  const phaseColor =
    phase === "work"
      ? "text-emerald-400"
      : phase === "rest"
        ? "text-amber-400"
        : phase === "done"
          ? "text-indigo-400"
          : "text-neutral-300";

  const phaseLabel =
    phase === "work"
      ? t(locale, "timerWorkPhase")
      : phase === "rest"
        ? t(locale, "timerRestPhase")
        : phase === "done"
          ? t(locale, "timerDone")
          : "—";

  const phaseDuration = phase === "rest" ? settings.rest : settings.work;
  const progress = phase === "work" || phase === "rest" ? 1 - remaining / phaseDuration : 0;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className={`text-sm font-medium mb-1 ${phaseColor}`}>{phaseLabel}</div>
        <div className="text-6xl font-semibold tabular-nums tracking-tight">
          {phase === "done" ? "🎉" : remaining}
        </div>
        {phase !== "idle" && phase !== "done" && (
          <div className="text-xs text-neutral-500 mt-2">
            {t(locale, "timerRoundOf", { current: round, total: settings.rounds })}
          </div>
        )}
        <div className="h-1.5 rounded-full bg-neutral-800 mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${phase === "rest" ? "bg-amber-500" : "bg-emerald-500"}`}
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-neutral-400 mb-1 text-center">
            {t(locale, "timerWorkLabel")}
          </label>
          <input
            type="number"
            min={1}
            disabled={running}
            value={settings.work}
            onChange={(e) => updateSetting("work", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-1 text-center">
            {t(locale, "timerRestLabel")}
          </label>
          <input
            type="number"
            min={1}
            disabled={running}
            value={settings.rest}
            onChange={(e) => updateSetting("rest", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-1 text-center">
            {t(locale, "timerRoundsLabel")}
          </label>
          <input
            type="number"
            min={1}
            disabled={running}
            value={settings.rounds}
            onChange={(e) => updateSetting("rounds", Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {running ? (
          <button
            onClick={pause}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium py-2.5 transition active:scale-[0.97]"
          >
            <Pause className="h-4 w-4" />
            {t(locale, "timerPause")}
          </button>
        ) : (
          <button
            onClick={start}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 transition active:scale-[0.97]"
          >
            <Play className="h-4 w-4" />
            {t(locale, "timerStart")}
          </button>
        )}
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 px-4 py-2.5 transition active:scale-[0.97]"
        >
          <RotateCcw className="h-4 w-4" />
          {t(locale, "timerReset")}
        </button>
      </div>
    </div>
  );
}
