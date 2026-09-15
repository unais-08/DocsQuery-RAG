import type { ReactNode } from "react";

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ede9fe_0%,#fafbff_35%,#ffffff_100%)]">
            {children}
        </main>
    );
}