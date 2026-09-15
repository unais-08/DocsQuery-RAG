import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { SocialButtons } from "@/components/auth/social-buttons";

export default function RegisterPage() {
    return (
        <AuthShell mode="register">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-[2.15rem]">
                    Create your account
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                    Start turning your documents into knowledge.
                </p>
            </div>

            <form className="mt-8 space-y-4">
                <AuthInput
                    label="Full name"
                    name="name"
                    placeholder="Your name"
                />
                <AuthInput
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                />
                <AuthInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                />



                <button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 active:scale-[0.99]"
                >
                    Create account
                </button>


            </form>

            <Divider />

        </AuthShell>
    );
}

function Divider() {
    return (
        <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
        </div>
    );
}