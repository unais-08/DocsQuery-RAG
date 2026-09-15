import {
    FileUp,
    MessageCircle,
    Search,
    Sparkles,
} from "lucide-react";

const steps = [
    {
        number: "01",
        icon: FileUp,
        title: "Upload",
        description:
            "Upload the documents you want DocsQuery to understand.",
    },
    {
        number: "02",
        icon: Sparkles,
        title: "Process",
        description:
            "DocsQuery processes your documents and prepares them for search.",
    },
    {
        number: "03",
        icon: MessageCircle,
        title: "Ask",
        description:
            "Ask questions in natural language about your documents.",
    },
    {
        number: "04",
        icon: Search,
        title: "Discover",
        description:
            "Get an answer along with the sources used to generate it.",
    },
];

export function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="bg-gray-50/70 py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="text-center">

                    <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                        How it works
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                        From documents to answers
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
                        A simple workflow that turns your files into a
                        searchable AI knowledge base.
                    </p>

                </div>

                <div className="relative mt-14 grid gap-y-10 gap-x-8 sm:grid-cols-2 md:grid-cols-4">

                    {/* Connector line, desktop only, sits behind the icons */}
                    <div className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-gray-200 md:block" />

                    {steps.map((step) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className="relative text-center"
                            >
                                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-gray-100">
                                    <Icon size={24} />
                                </div>

                                <p className="mt-5 text-xs font-bold tracking-widest text-brand-600">
                                    {step.number}
                                </p>

                                <h3 className="mt-2 font-semibold text-gray-950">
                                    {step.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}

                </div>

            </div>
        </section>
    );
}