import { Sidebar } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/dashboard/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">

            {/* Sidebar */}
            <Sidebar />

            {/* Main area */}
            <div className="lg:pl-64">

                <Navbar />

                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

            </div>

        </div>
    );
}