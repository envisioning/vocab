import { getArticles } from "@/lib/getArticles";
import { Suspense } from "react";
import ClientWrapper from "@/components/ClientWrapper";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialArticles = await getArticles(24);

  if (!initialArticles) {
    return <div>Error loading articles</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientWrapper
        articles={initialArticles}
        displayMode="full"
        showList={true}
      />
    </Suspense>
  );
}
