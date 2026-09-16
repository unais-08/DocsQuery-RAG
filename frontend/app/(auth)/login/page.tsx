"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthRedirect } from "@/components/auth/auth-redirect";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { useAuth } from "@/context/auth-context";

const sampleCredentials = {
    email: "sample@example.com",
    password: "Pass@123",
};

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!form.email.trim() || !form.password.trim()) {
            setError("Please enter your email and password.");
            return;
        }

        setIsSubmitting(true);

        try {
            await login({
                email: form.email.trim(),
                password: form.password,
            });

            const redirectTarget =
                typeof window !== "undefined"
                    ? new URLSearchParams(window.location.search).get("redirect") ?? "/dashboard"
                    : "/dashboard";

            router.push(redirectTarget);
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to connect to the server. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthRedirect>
            <AuthShell mode="login">
                <div>
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-950">
                            Welcome back
                        </h1>


                    </div>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <AuthInput
                        label="Email address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        disabled={isSubmitting}
                    />

                    <AuthInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        disabled={isSubmitting}
                    />

                    {error && (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 w-full rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button> <button
                        type="button"
                        onClick={() => setForm(sampleCredentials)}
                        disabled={isSubmitting}
                        className="text-xs font-semibold text-brand-600 transition hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Click here get test credentials
                    </button>
                </form>

            </AuthShell>
        </AuthRedirect>
    );
}