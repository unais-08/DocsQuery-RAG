import type { Metadata } from "next";
import type { ReactNode } from "react";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
