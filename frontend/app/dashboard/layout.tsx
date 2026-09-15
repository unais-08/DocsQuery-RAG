import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">

            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="lg:pl-64">

                {/* Navbar */}
                <Navbar />

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

            </div>

        </div>
    );
}