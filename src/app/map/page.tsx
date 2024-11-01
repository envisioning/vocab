import { getNodes } from "@/lib/getNodes";
import { Suspense } from "react";
import ArticleMap from "@/components/ArticleMap";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const nodes = await getNodes(1000);

  if (!nodes) {
    return <div>Error loading nodes</div>;
  }

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <ArticleMap nodes={nodes} />
      </Suspense>
    </main>
  );
}
