"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/context/theme-context";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const darkModeEnabled = theme === "dark";

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight text-gray-950">Settings</h1>
      <p className="mt-2 text-sm text-gray-500">
        Adjust your account, preferences, and document configuration.
      </p>

      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            {darkModeEnabled ? <Moon size={18} /> : <Sun size={18} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Dark mode</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Use a darker color scheme across DocsQuery.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={darkModeEnabled}
          aria-label="Toggle dark mode"
          onClick={() => setTheme(darkModeEnabled ? "light" : "dark")}
          className={`relative h-6 w-11 rounded-full transition ${
            darkModeEnabled ? "bg-brand-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
              darkModeEnabled ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
