import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart City - Incident Supervision System",
  description:
    "A modern smart city incident supervision system for reporting and managing urban incidents.",
};

/**
 * Root layout with Inter font and dark theme.
 */
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-slate-950 text-white antialiased"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
