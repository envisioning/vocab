"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface KeyboardNavigationProps {
  availableSlugs: string[];
}

export default function KeyboardNavigation({
  availableSlugs,
}: KeyboardNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSlug = pathname.split("/").pop() || "";

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const currentIndex = availableSlugs.indexOf(currentSlug);

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentIndex < availableSlugs.length - 1) {
          router.push(`/${availableSlugs[currentIndex + 1]}`);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex > 0) {
          router.push(`/${availableSlugs[currentIndex - 1]}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router, currentSlug, availableSlugs]);

  return null;
}
