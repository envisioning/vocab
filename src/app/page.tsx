import { getArticles } from "@/lib/getArticles";
import { Suspense } from "react";
import ClientWrapper from "@/components/ClientWrapper";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = await getArticles();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientWrapper articles={articles} displayMode="full" showList={true} />
    </Suspense>
  );
}
