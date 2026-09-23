"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

const initialState: LoginState = {};

export default function LoginForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm text-neutral-300 mb-1" htmlFor="username">
          {t(locale, "usernameLabel")}
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-300 mb-1" htmlFor="password">
          {t(locale, "passwordLabel")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium py-2.5 transition"
      >
        {pending ? t(locale, "signingIn") : t(locale, "signIn")}
      </button>
    </form>
  );
}
