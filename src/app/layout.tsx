import "./globals.css";
import { ReactNode } from "react";
import FilterBarWrapper from "@/components/FilterBarWrapper";
import { getArticles } from "@/lib/getArticles";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const articles = await getArticles();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <div className="flex flex-col min-h-screen">
          <FilterBarWrapper articles={articles} />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
