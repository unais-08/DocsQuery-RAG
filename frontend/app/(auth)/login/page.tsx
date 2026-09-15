import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { SocialButtons } from "@/components/auth/social-buttons";

export default function LoginPage() {
    return (
        <AuthShell mode="login">

            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-[2.15rem]">
                    Welcome back
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                    Sign in to continue to your DocsQuery workspace.
                </p>
            </div>

            <form className="mt-8 space-y-5">

                <AuthInput
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                />

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-800"
                        >
                            Password
                        </label>

                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-brand-600 hover:text-brand-700"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <AuthInput
                        label=""
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                    />
                </div>

                <button
                    type="submit"
                    className="h-12 w-full rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 active:scale-[0.99]"
                >
                    Sign in
                </button>

            </form>

            <Divider />

            <SocialButtons />

        </AuthShell>
    );
}

function Divider() {
    return (
        <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-medium uppercase text-gray-400">
                or
            </span>

            <div className="h-px flex-1 bg-gray-200" />
        </div>
    );
}