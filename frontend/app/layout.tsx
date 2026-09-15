import type { Metadata } from "next";

import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "QueryDocs",
    template: "%s | QueryDocs",
  },
  description:
    "Ask questions and get answers from your documents using AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
