import type { Metadata } from "next";

import { AuthProvider } from "@/context/auth-context";

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
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
