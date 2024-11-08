"use client";
import { useRef, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { Node } from "@/types/article";
import { useRouter } from "next/navigation";

interface GridMapProps {
  nodes: Node[];
}

export default function GridMap({ nodes: rawNodes }: GridMapProps) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tooltipContent, setTooltipContent] = useState<{
    title: string;
    content: string;
    year: number | null;
    generality: number | null;
    impact: number | null;
    x: number;
    y: number;
  } | null>(null);
  const [highlightedDecade, setHighlightedDecade] = useState<number | null>(
    null
  );

  // Filter nodes with valid years and generality scores
  const nodes = useMemo(() => {
    return rawNodes
      .filter((node) => node.year != null && node.generality != null)
      .sort((a, b) => (a.year || 0) - (b.year || 0));
  }, [rawNodes]);

  // Add the decades color mapping
  const decadeColors = {
    1950: "#F3722C",
    1960: "#F8961E",
    1970: "#F9C74F",
    1980: "#90BE6D",
    1990: "#43AA8B",
    2000: "#4D908E",
    2010: "#577590",
    2020: "#277DA1",
  };

  // Replace the getDecadeColor function
  const getDecadeColor = (year: number) => {
    if (!year) return "#cccccc"; // Default color for missing years

    // Find the decade for this year
    const decade = Math.floor(year / 10) * 10;

    // Return the corresponding color or default to 2020s color for future years
    return (
      decadeColors[decade as keyof typeof decadeColors] || decadeColors[2020]
    );
  };

  // Add this after the existing getDecadeColor function
  const getNodeSize = (node: Node) => {
    const baseSize = 6; // Base radius
    const connectionCount = node.children?.length || 0;
    // Scale up based on connections, with a minimum size and maximum size
    return Math.max(
      baseSize,
      Math.min(baseSize * (1 + connectionCount * 0.2), baseSize * 3)
    );
  };

  // Helper function to check if a node is from a specific decade
  const isNodeInDecade = (nodeYear: number | null, decade: number): boolean => {
    if (!nodeYear) return false;
    return nodeYear >= decade && nodeYear < decade + 10;
  };

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Clear previous content
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    svg.selectAll("*").remove();

    // Create container group for zoom
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 1]) // Generality range
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 1]) // Impact range
      .range([height - margin.bottom, margin.top]);

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    g.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);

    // Add axis labels
    g.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Generality");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("Impact");

    // Add gridlines before adding nodes

    // Minor gridlines (0.1 intervals)
    const minorGridlines = g
      .append("g")
      .attr("class", "grid-minor")
      .style("stroke", "#e5e7eb") // gray-200
      .style("stroke-width", "0.5px")
      .style("opacity", "0.5");

    // Vertical minor gridlines
    minorGridlines
      .selectAll(".vertical-minor")
      .data(d3.range(0, 1.1, 0.1))
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom);

    // Horizontal minor gridlines
    minorGridlines
      .selectAll(".horizontal-minor")
      .data(d3.range(0, 1.1, 0.1))
      .enter()
      .append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d));

    // Major gridlines (0.5 intervals)
    const majorGridlines = g
      .append("g")
      .attr("class", "grid-major")
      .style("stroke", "#9ca3af") // gray-400
      .style("stroke-width", "1px")
      .style("opacity", "0.5");

    // Vertical major gridline at 0.5
    majorGridlines
      .append("line")
      .attr("x1", xScale(0.5))
      .attr("x2", xScale(0.5))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom);

    // Horizontal major gridline at 0.5
    majorGridlines
      .append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", yScale(0.5))
      .attr("y2", yScale(0.5));

    // Create nodes
    const nodeElements = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node cursor-pointer")
      .attr("transform", (d) => {
        const x = xScale(d.generality || 0);
        const y = yScale(d.impact || 0);
        return `translate(${x},${y})`;
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        router.push(`/${d.slug}`);
      })
      .on("mouseenter", (event, d) => {
        const [x, y] = d3.pointer(event, svg.node());
        setTooltipContent({
          title: d.title || d.slug,
          content: d.summary || "",
          year: d.year,
          generality: d.generality,
          impact: d.impact,
          x: x + 10,
          y: y + 10,
        });
      })
      .on("mouseleave", () => {
        setTooltipContent(null);
      });

    // Add circles
    nodeElements
      .append("circle")
      .attr("r", (d) => getNodeSize(d)) // Dynamic radius based on connections
      .attr("fill", (d) => getDecadeColor(d.year || 0))
      .attr("fill-opacity", 0.6)
      .attr("class", "transition-opacity duration-200")
      .attr("data-year", (d) => d.year) // Add year as data attribute
      .attr(
        "class",
        "hover:stroke-white hover:stroke-2 hover:fill-opacity-100 transition-opacity duration-200"
      );

    // Add effect to handle decade highlighting
    if (highlightedDecade !== null) {
      d3.selectAll("circle").style("opacity", (d: any) => {
        const nodeYear = d.year;
        return isNodeInDecade(nodeYear, highlightedDecade) ? 1 : 0.1;
      });
    } else {
      d3.selectAll("circle").style("opacity", 1);
    }

    // Add text labels (reusing the same text rendering logic from TimelineMap)
    nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#1F2937")
      .attr("font-size", (d) => `${getNodeSize(d) / 2}px`) // Scale font size with node size
      .attr("font-weight", "500")
      .each(function (d) {
        // ... (same text rendering logic as TimelineMap)
        // You can copy the entire text rendering logic from TimelineMap here
      });

    // Initial zoom to fit
    const initialScale = 0.8;
    svg.call(
      zoom.transform as any,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initialScale)
        .translate(-width / 2, -height / 2)
    );

    setIsLoading(false);
  }, [nodes, router, highlightedDecade]);

  // Add this helper function to get decades
  const getDecades = () => {
    const startYear = 1950;
    const endYear = 2024;
    const decades: number[] = [];
    for (let year = startYear; year <= endYear; year += 10) {
      decades.push(year);
    }
    return decades;
  };

  return (
    <div className="absolute inset-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
          Loading Grid...
        </div>
      )}
      <svg
        ref={svgRef}
        className="w-full h-full bg-gray-50"
        style={{ cursor: "grab" }}
      />
      {tooltipContent && (
        <div
          className="absolute z-10 max-w-sm p-2 text-sm bg-white border border-gray-200 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: `${tooltipContent.x}px`,
            top: `${tooltipContent.y}px`,
          }}
        >
          <div className="font-bold mb-1">{tooltipContent.title}</div>
          {tooltipContent.year && (
            <div className="text-gray-600 mb-1">
              Year: {tooltipContent.year}
            </div>
          )}
          <div className="text-gray-600 mb-1">
            Generality: {tooltipContent.generality?.toFixed(3)}
            <br />
            Impact: {tooltipContent.impact?.toFixed(3)}
          </div>
          {tooltipContent.content && <div>{tooltipContent.content}</div>}
        </div>
      )}
      <div className="absolute bottom-0 left-0 p-4 text-sm text-gray-500">
        {`Nodes with dates: ${nodes.length}`}
      </div>

      {/* Decade Legend with hover effects */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center bg-white/80">
        <div className="flex items-center space-x-4">
          {getDecades().map((decade) => (
            <div
              key={decade}
              className="flex items-center cursor-pointer transition-opacity duration-200"
              onMouseEnter={() => setHighlightedDecade(decade)}
              onMouseLeave={() => setHighlightedDecade(null)}
            >
              <div
                className="w-4 h-4 rounded-full mr-1"
                style={{
                  backgroundColor: getDecadeColor(decade),
                  opacity:
                    highlightedDecade === null || highlightedDecade === decade
                      ? 1
                      : 0.3,
                }}
              />
              <span
                className="text-sm text-gray-600"
                style={{
                  opacity:
                    highlightedDecade === null || highlightedDecade === decade
                      ? 1
                      : 0.3,
                }}
              >
                {decade}s
              </span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-4 text-sm text-gray-500">
          {`Nodes with dates: ${nodes.length}`}
        </div>
      </div>
    </div>
  );
}
