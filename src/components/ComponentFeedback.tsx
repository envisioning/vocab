"use client";

import { useCallback, useState } from "react";
import { ThumbsUp, ThumbsDown, Zap } from "lucide-react";

export default function ComponentFeedback({ slug }: { slug: string }) {
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = useCallback(
    (isPositive: boolean) => {
      console.log("Attempting to track feedback...", {
        slug,
        feedback: isPositive ? "good" : "bad",
      });

      if (typeof window !== "undefined") {
        console.log("Plausible available:", !!(window as any).plausible);
      }

      if (typeof window !== "undefined" && (window as any).plausible) {
        try {
          (window as any).plausible("Component Vote", {
            props: {
              slug,
              feedback: isPositive ? "good" : "bad",
            },
          });
          console.log("Successfully tracked feedback");
        } catch (error) {
          console.error("Error tracking feedback:", error);
        }
      }
      setHasVoted(true);
    },
    [slug]
  );

  if (hasVoted) {
    return (
      <p className="text-sm text-gray-500 mt-4">Thank you for your feedback!</p>
    );
  }

  return (
    <div className="mt-4 flex items-center gap-4">
      <span className="text-sm text-gray-500">
        <Zap className="w-4 h-4 inline-block mr-1" /> Was this{" "}
        <a
          href="/vocab/about/#explainer"
          className="underline underline-offset-4"
        >
          explainer
        </a>{" "}
        helpful?
      </span>
      <button
        onClick={() => handleVote(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Yes, helpful"
      >
        <ThumbsUp className="w-5 h-5 text-gray-500" />
      </button>
      <button
        onClick={() => handleVote(false)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="No, not helpful"
      >
        <ThumbsDown className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
}
