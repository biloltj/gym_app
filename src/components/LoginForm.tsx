"use client";

import { useActionState } from "react";
import { User, Lock, AlertCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

const initialState: LoginState = {};

export default function LoginForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm text-neutral-300 mb-1.5" htmlFor="username">
          {t(locale, "usernameLabel")}
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            className="w-full rounded-lg bg-neutral-950/60 border border-neutral-800 pl-9 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-neutral-300 mb-1.5" htmlFor="password">
          {t(locale, "passwordLabel")}
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg bg-neutral-950/60 border border-neutral-800 pl-9 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
      </div>
      {state?.error && (
        <p className="flex items-center gap-1.5 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium py-2.5 transition shadow-lg shadow-indigo-950/40"
      >
        {pending ? t(locale, "signingIn") : t(locale, "signIn")}
      </button>
    </form>
  );
}
