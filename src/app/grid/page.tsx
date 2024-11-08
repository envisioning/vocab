import {
    getNodes
}

from "@/lib/getNodes";

import {
    Suspense
}

from "react";
import GridMap from "@/components/GridMap";

export const dynamic="force-dynamic";

export default async function GridPage() {
    const nodes=await getNodes(1000);

    if ( !nodes) {
        return <div>Error loading nodes</div>;
    }

    return (<main className="w-screen h-screen overflow-hidden bg-gray-50" > <Suspense fallback= {
            <div>Loading Grid...</div>
        }

        > <GridMap nodes= {
            nodes
        }

        /> </Suspense> </main>);
}