import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import FilterBarWrapper from "@/components/FilterBarWrapper";
import { getArticles } from "@/lib/getArticles";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const articles = await getArticles();

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-gray-100">
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={<div>Loading...</div>}>
            <FilterBarWrapper articles={articles} />
          </Suspense>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
