"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

interface AuthInputProps {
    label: string;
    type?: "text" | "email" | "password";
    placeholder: string;
    name: string;
    action?: ReactNode; // ← new: renders right-aligned in the label row
}

export function AuthInput({
    label,
    type = "text",
    placeholder,
    name,
    action,
}: AuthInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        type === "password" && showPassword ? "text" : type;

    return (
        <div className="space-y-1.5">
            {/* Label row — only renders if label text OR action is provided */}
            {(label || action) && (
                <div className="flex items-center justify-between">
                    {label && (
                        <label
                            htmlFor={name}
                            className="text-sm font-medium text-gray-800"
                        >
                            {label}
                        </label>
                    )}
                    {action && (
                        <span className="ml-auto">{action}</span>
                    )}
                </div>
            )}

            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
}