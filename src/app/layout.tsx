import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import FilterBarWrapper from "@/components/FilterBarWrapper";
import { getArticles } from "@/lib/getArticles";
import PlausibleProvider from "next-plausible";
import { Metadata } from "next";
import namesData from "@/data/names.json";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://envisioning.io"
  ),
  title: {
    default: "Envisioning Vocab",
    template: "%s | Envisioning Vocab",
  },
  description: "Explore AI terminology and concepts",
  openGraph: {
    type: "website",
    siteName: "Envisioning Vocab",
    images: ["/vocab/default-social.webp"], // Add a default OG image
  },
  twitter: {
    creator: "@envisioning",
    site: "@envisioning",
    card: "summary_large_image", // Changed to summary_large_image for better sharing
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const articles = await getArticles();

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-gray-100 text-foreground">
        <PlausibleProvider domain="envisioning.io">
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<div>Loading...</div>}>
              <FilterBarWrapper articles={articles} namesData={namesData} />
            </Suspense>
            <main className="flex-grow container mx-auto">{children}</main>
          </div>
        </PlausibleProvider>
      </body>
    </html>
  );
}
