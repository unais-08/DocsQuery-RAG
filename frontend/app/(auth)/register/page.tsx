"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthRedirect } from "@/components/auth/auth-redirect";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            setError("Please complete all fields before creating your account.");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setIsSubmitting(true);

        try {
            await register({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
            });

            router.push("/dashboard");
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to create your account right now. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthRedirect>
            <AuthShell mode="register">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-950">
                        Create your account
                    </h1>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <AuthInput
                        label="Full name"
                        name="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                        disabled={isSubmitting}
                    />
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
                        placeholder="Create a password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
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
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                </form>
            </AuthShell>
        </AuthRedirect>
    );
}