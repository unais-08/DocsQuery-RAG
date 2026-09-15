import {
    FileUp,
    MessageCircle,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const features = [
    {
        icon: FileUp,
        title: "Upload your documents",
        description:
            "Upload PDFs, DOCX, TXT and other supported documents into your private knowledge base.",
    },
    {
        icon: MessageCircle,
        title: "Ask anything",
        description:
            "Ask questions naturally and let DocsQuery find the relevant information for you.",
    },
    {
        icon: Sparkles,
        title: "AI-powered answers",
        description:
            "Get concise answers generated from the relevant parts of your documents.",
    },
    {
        icon: ShieldCheck,
        title: "Source-backed responses",
        description:
            "See exactly which document and page helped generate the answer.",
    },
];

export function Features() {
    return (
        <section
            id="features"
            className="border-y border-gray-100 bg-white py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                        Features
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                        Everything you need to work with your documents
                    </h2>
                    <p className="mt-4 text-base leading-7 text-gray-500">
                        Turn your documents into a searchable knowledge base
                        and get answers without manually searching through
                        every file.
                    </p>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-docs-card transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                                    <Icon size={21} />
                                </div>
                                <h3 className="mt-5 font-semibold text-gray-950">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}