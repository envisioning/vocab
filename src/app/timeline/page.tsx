import { getNodes } from "@/lib/getNodes";
import { Suspense } from "react";
import TimelineMap from "@/components/TimelineMap";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const nodes = await getNodes(1000);

  if (!nodes) {
    return <div>Error loading nodes</div>;
  }

  return (
    <main className="w-screen h-screen overflow-hidden bg-gray-50">
      <Suspense fallback={<div>Loading Timeline...</div>}>
        <TimelineMap nodes={nodes} />
      </Suspense>
    </main>
  );
}
