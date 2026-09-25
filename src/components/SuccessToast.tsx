"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function SuccessToast({
  pending,
  error,
  message,
}: {
  pending: boolean;
  error?: string;
  message: string;
}) {
  const [visible, setVisible] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    const finishedSuccessfully = wasPending.current && !pending && !error;
    wasPending.current = pending;
    if (!finishedSuccessfully) return;

    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timeout);
  }, [pending, error]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2.5 text-sm text-white shadow-xl animate-toast-in">
      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
      {message}
    </div>
  );
}
