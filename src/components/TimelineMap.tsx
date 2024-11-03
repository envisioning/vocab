"use client";
import { useRef, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { Node } from "@/types/article";
import { useRouter } from "next/navigation";

interface TimelineMapProps {
  nodes: Node[];
}

export default function TimelineMap({ nodes: rawNodes }: TimelineMapProps) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tooltipContent, setTooltipContent] = useState<{
    title: string;
    content: string;
    year: number | null;
    x: number;
    y: number;
  } | null>(null);

  // Filter nodes with valid years and sort by year
  const nodes = useMemo(() => {
    return rawNodes
      .filter((node) => node.year != null)
      .sort((a, b) => (a.year || 0) - (b.year || 0));
  }, [rawNodes]);

  // Calculate decade colors
  const getDecadeColor = (year: number) => {
    const decades = {
      1950: "#F3722C",
      1960: "#F8961E",
      1970: "#F9C74F",
      1980: "#90BE6D",
      1990: "#43AA8B",
      2000: "#4D908E",
      2010: "#577590",
      2020: "#277DA1",
    };

    const decade = Math.floor(year / 10) * 10;
    return decade < 1950 ? "#F94144" : decades[decade as keyof typeof decades]; // Teal-blue for pre-1950s
  };

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const nodeRadius = 30; // Increased from 20 (50% larger)
    const padding = nodeRadius * 1.6; // This will automatically adjust spacing between nodes

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

    // Calculate positions using sunflower pattern
    const centerX = width / 2;
    const centerY = height / 2;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    nodes.forEach((node, i) => {
      const index = i + 1;
      const radius = Math.sqrt(index) * padding;
      const theta = index * goldenAngle;
      node.x = centerX + radius * Math.cos(theta);
      node.y = centerY + radius * Math.sin(theta);
    });

    // Create nodes
    const nodeElements = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node cursor-pointer")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
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
      .attr("r", nodeRadius)
      .attr("fill", (d) => getDecadeColor(d.year || 0))
      .attr("class", "hover:stroke-white hover:stroke-2"); // White hover effect works well with these bright colors

    // Add text labels
    nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#1F2937")
      .attr("font-size", "8px")
      .attr("font-weight", "500")
      .each(function (d) {
        const text = d3.select(this);
        const words = (d.title || d.slug).split(/\s+/);
        const lineHeight = 12;
        const maxWidth = nodeRadius * 2;

        let line: string[] = [];
        let lineNumber = 0;
        let totalLines = 0;

        // First pass to count total lines
        for (const word of words) {
          line.push(word);
          const testLine = line.join(" ");
          if (testLine.length * 4.5 > maxWidth) {
            totalLines++;
            if (totalLines >= 2) break; // Reduced to 2 lines to make room for year
            line = [word];
          }
        }
        if (line.length > 0 && totalLines < 2) totalLines++;

        // Calculate starting Y position to center all lines including the year
        const startY = -((totalLines + 1 - 1) * lineHeight) / 2; // Added +1 for year line

        // Reset for actual text creation
        line = [];
        lineNumber = 0;

        // Second pass to create the text
        for (const word of words) {
          line.push(word);
          const testLine = line.join(" ");

          if (testLine.length * 4.5 > maxWidth || lineNumber >= 2) {
            if (lineNumber < 2) {
              const displayText = line.slice(0, -1).join(" ");
              const needsEllipsis =
                lineNumber === 1 || words.length > line.length;
              text
                .append("tspan")
                .attr("x", 0)
                .attr("y", startY + lineNumber * lineHeight)
                .text(needsEllipsis ? displayText + "..." : displayText);
              line = [word];
              lineNumber++;
            }
            if (lineNumber >= 2) break;
          }
        }

        // Add remaining text if we haven't hit the line limit
        if (lineNumber < 2 && line.length > 0) {
          const displayText = line.join(" ");
          const needsEllipsis = words.length > line.length + lineNumber * 2;
          text
            .append("tspan")
            .attr("x", 0)
            .attr("y", startY + lineNumber * lineHeight)
            .text(needsEllipsis ? displayText + "..." : displayText);
        }

        // Add year on the last line
        text
          .append("tspan")
          .attr("x", 0)
          .attr("y", startY + totalLines * lineHeight)
          .attr("fill", "#1F2937") // Changed to black to match title
          .attr("font-size", "7px")
          .text(d.year?.toString()); // Removed parentheses
      });

    // Initial zoom to fit
    const initialScale = 0.6;
    svg.call(
      zoom.transform as any,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initialScale)
        .translate(-width / 2, -height / 2)
    );

    setIsLoading(false);
  }, [nodes, router]);

  return (
    <div className="absolute inset-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
          Loading Timeline...
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
          {tooltipContent.content && <div>{tooltipContent.content}</div>}
        </div>
      )}
      <div className="absolute bottom-0 left-0 p-4 text-sm text-gray-500">
        {`Nodes with dates: ${nodes.length}`}
      </div>
    </div>
  );
}
