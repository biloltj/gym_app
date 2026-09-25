"use client";

import { useMemo, useState } from "react";
import { t, type DictionaryKey } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

const inputClass =
  "w-full rounded-lg bg-neutral-950/60 border border-neutral-800 px-3 py-2.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

function classify(bmi: number): { key: DictionaryKey; color: string } {
  if (bmi < 18.5) return { key: "bmiUnderweight", color: "text-sky-400" };
  if (bmi < 25) return { key: "bmiNormal", color: "text-emerald-400" };
  if (bmi < 30) return { key: "bmiOverweight", color: "text-amber-400" };
  return { key: "bmiObese", color: "text-red-400" };
}

export default function BmiCalculator({ locale }: { locale: Locale }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const bmi = useMemo(() => {
    const h = Number(height) / 100;
    const w = Number(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    return w / (h * h);
  }, [height, weight]);

  const result = bmi ? classify(bmi) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-neutral-400 mb-1 text-center">
            {t(locale, "bmiHeightLabel")}
          </label>
          <input
            type="number"
            min={1}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-1 text-center">
            {t(locale, "bmiWeightLabel")}
          </label>
          <input
            type="number"
            min={1}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {bmi !== null && result && (
        <div className="text-center rounded-xl border border-neutral-800 bg-neutral-950/40 py-3">
          <div className="text-xs text-neutral-500">{t(locale, "bmiResultLabel")}</div>
          <div className="text-3xl font-semibold tabular-nums mt-0.5">{bmi.toFixed(1)}</div>
          <div className={`text-sm font-medium mt-1 ${result.color}`}>{t(locale, result.key)}</div>
        </div>
      )}
    </div>
  );
}
