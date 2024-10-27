import "./globals.css";
import { ReactNode, Suspense } from "react";
import FilterBarWrapper from "../components/FilterBarWrapper";
import { getArticles } from "@/lib/articles"; // Use this instead of aiTerms

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const articles = await getArticles();

  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-gray-100">
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={<div className="h-16 bg-gray-100" />}>
            <FilterBarWrapper allArticles={articles} />
          </Suspense>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
