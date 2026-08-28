import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Deris — Find services & talent near you",
  description:
    "Deris connects people offering services, talents, and short-term projects with people who need them.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900 antialiased">
        <LocaleProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
