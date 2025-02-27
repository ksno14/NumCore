import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import Sidebar from "@/components/shared/Sidebar";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Locale, routing } from "@/i18n/routing";

const varelaRound = Varela_Round({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-varela-round",
});

export const metadata: Metadata = {
  title: "NumCore",
  description: "Calculadora online de métodos numéricos.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${varelaRound.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex bg-white">
            <Sidebar />
            <div>{children}</div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
