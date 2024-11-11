import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import FilterBarWrapper from "@/components/FilterBarWrapper";
import { getArticles } from "@/lib/getArticles";
import { ThemeProvider } from "@/contexts/ThemeContext";
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

// Add this just before the existing RootLayout component
const themeScript = `
  (function() {
    function getInitialTheme() {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        return savedTheme
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    const theme = getInitialTheme()
    document.documentElement.classList.toggle('dark', theme === 'dark')
  })()
`;

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const articles = await getArticles();

  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="min-h-screen bg-gray-900 text-foreground transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <PlausibleProvider domain="envisioning.io">
            <div className="flex flex-col min-h-screen">
              <Suspense fallback={<div>Loading...</div>}>
                <FilterBarWrapper articles={articles} namesData={namesData} />
              </Suspense>
              <main className="flex-grow container mx-auto">{children}</main>
            </div>
          </PlausibleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
