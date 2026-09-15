import type { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: ReactNode;
}

export function StatCard({
    title,
    value,
    description,
    icon,
}: StatCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-docs-card">

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-gray-950">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        {description}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    {icon}
                </div>

            </div>

        </div>
    );
}