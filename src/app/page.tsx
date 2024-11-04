import { getArticles } from "@/lib/getArticles";
import { Suspense } from "react";
import ClientWrapper from "@/components/ClientWrapper";
import ReportMissingButton from "@/components/ReportMissingButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialArticles = await getArticles(48, "generality", "desc", false);

  if (!initialArticles) {
    return <div>Error loading articles</div>;
  }

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientWrapper
          articles={initialArticles}
          displayMode="full"
          showList={true}
        />
      </Suspense>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-center">
        <ReportMissingButton />
      </div>
    </div>
  );
}
