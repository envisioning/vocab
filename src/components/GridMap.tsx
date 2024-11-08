"use client";
import { useRef, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { Node } from "@/types/article";
import { useRouter } from "next/navigation";

type MetricKey =
  | "generality"
  | "impact"
  | "complexity"
  | "popularity"
  | "safety";

interface GridMapProps {
  nodes: Node[];
}

export default function GridMap({ nodes: rawNodes }: GridMapProps) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [xAxis, setXAxis] = useState<MetricKey>("generality");
  const [yAxis, setYAxis] = useState<MetricKey>("impact");
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

  // Helper function to get node size
  const getNodeSize = (node: Node) => {
    const baseSize = 6;
    const connectionCount = node.children?.length || 0;
    return Math.max(
      baseSize,
      Math.min(baseSize * (1 + connectionCount * 0.2), baseSize * 3)
    );
  };

  // Helper function to get color based on decade
  const getDecadeColor = (year: number) => {
    const decade = Math.floor(year / 10) * 10;
    const colors: { [key: number]: string } = {
      1950: "#ff7f0e", // Orange
      1960: "#ffbb78", // Light orange
      1970: "#ffd92f", // Yellow
      1980: "#98df8a", // Light green
      1990: "#2ca02c", // Green
      2000: "#1f77b4", // Blue
      2010: "#17becf", // Cyan
      2020: "#9467bd", // Purple
    };
    return colors[decade] || "#aec7e8";
  };

  // Memoize the filtered nodes
  const nodes = useMemo(() => {
    return rawNodes
      .filter((node) => {
        const xValue = node[xAxis];
        const yValue = node[yAxis];
        return (
          node.year != null &&
          xValue !== null &&
          xValue !== undefined &&
          yValue !== null &&
          yValue !== undefined
        );
      })
      .sort((a, b) => (a.year || 0) - (b.year || 0));
  }, [rawNodes, xAxis, yAxis]);

  // Helper function to get decades for the legend
  const getDecades = () => {
    const startYear = 1950;
    const endYear = 2024;
    const decades: number[] = [];
    for (let year = startYear; year <= endYear; year += 10) {
      decades.push(year);
    }
    return decades;
  };

  // Add this array of metrics
  const metrics: MetricKey[] = [
    "generality",
    "impact",
    "complexity",
    "popularity",
    "safety",
  ];

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Clear existing content
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    // Create the main group element
    const g = svg.append("g");

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([margin.left, width - margin.right])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top])
      .nice();

    // Add minor gridlines (0.1 intervals)
    g.append("g")
      .attr("class", "grid-minor")
      .selectAll("line")
      .data(d3.range(0, 1.1, 0.1))
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#e5e5e5")
      .attr("stroke-width", (d) => (d % 0.5 === 0 ? 0 : 1));

    g.append("g")
      .attr("class", "grid-minor")
      .selectAll("line")
      .data(d3.range(0, 1.1, 0.1))
      .enter()
      .append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#e5e5e5")
      .attr("stroke-width", (d) => (d % 0.5 === 0 ? 0 : 1));

    // Add major gridlines (0.5 intervals)
    g.append("g")
      .attr("class", "grid-major")
      .selectAll("line")
      .data([0, 0.5, 1])
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#d4d4d4")
      .attr("stroke-width", 1);

    g.append("g")
      .attr("class", "grid-major")
      .selectAll("line")
      .data([0, 0.5, 1])
      .enter()
      .append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#d4d4d4")
      .attr("stroke-width", 1);

    // Create and add axes
    const xAxisGen = d3.axisBottom(xScale);
    const yAxisGen = d3.axisLeft(yScale);

    g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxisGen);

    g.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxisGen);

    // Update the axis labels to be clickable
    // Replace the existing axis label code with:

    // X-axis labels
    g.append("g")
      .attr("class", "x-axis-labels")
      .attr("transform", `translate(0,${height - 5})`)
      .selectAll("text")
      .data(metrics)
      .enter()
      .append("text")
      .attr(
        "x",
        (_, i) =>
          margin.left +
          ((width - margin.left - margin.right) * (i + 0.5)) / metrics.length
      )
      .attr("text-anchor", "middle")
      .attr("class", "cursor-pointer")
      .style("text-decoration", (d) => (d === xAxis ? "underline" : "none"))
      .style("fill", (d) => (d === yAxis ? "#9CA3AF" : "#000000"))
      .style("cursor", (d) => (d === yAxis ? "not-allowed" : "pointer"))
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .on("click", (_, d) => {
        if (d !== yAxis) {
          setXAxis(d);
        }
      });

    // Y-axis labels - moved further left
    g.append("g")
      .attr("class", "y-axis-labels")
      .selectAll("text")
      .data(metrics)
      .enter()
      .append("text")
      .attr("transform", (_, i) => {
        const y =
          margin.top +
          ((height - margin.top - margin.bottom) * (i + 0.5)) / metrics.length;
        return `translate(${10},${y}) rotate(-90)`;
      })
      .attr("text-anchor", "middle")
      .attr("class", "cursor-pointer")
      .style("text-decoration", (d) => (d === yAxis ? "underline" : "none"))
      .style("fill", (d) => (d === xAxis ? "#9CA3AF" : "#000000"))
      .style("cursor", (d) => (d === xAxis ? "not-allowed" : "pointer"))
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .on("click", (_, d) => {
        if (d !== xAxis) {
          setYAxis(d);
        }
      });

    // Create zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    // Apply zoom to svg
    svg.call(zoom as any);

    // Add nodes
    const nodeElements = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node cursor-pointer")
      .attr("transform", (d) => {
        const x = xScale(d[xAxis] as number);
        const y = yScale(d[yAxis] as number);
        return `translate(${x},${y})`;
      });

    // Add circles
    nodeElements
      .append("circle")
      .attr("r", (d) => getNodeSize(d))
      .attr("fill", (d) => getDecadeColor(d.year || 0))
      .attr("fill-opacity", 0.6)
      .attr(
        "class",
        "hover:stroke-white hover:stroke-2 hover:fill-opacity-100 transition-opacity duration-200"
      )
      .style("opacity", (d) => {
        if (highlightedDecade === null) return 1;
        const nodeDecade = Math.floor((d.year || 0) / 10) * 10;
        return nodeDecade === highlightedDecade ? 1 : 0.2;
      });

    // Add tooltip behavior
    nodeElements
      .on("click", (event, d) => {
        event.stopPropagation();
        router.push(`/${d.slug}`);
      })
      .on("mouseenter", (event, d) => {
        const [x, y] = d3.pointer(event, svg.node());
        setTooltipContent({
          title: d.title || "",
          content: d.summary || "",
          year: d.year,
          generality: d[xAxis] as number,
          impact: d[yAxis] as number,
          x,
          y,
        });
      })
      .on("mouseleave", () => setTooltipContent(null));

    // Apply initial zoom transform
    const initialScale = 0.8;
    svg.call(
      zoom.transform as any,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initialScale)
        .translate(-width / 2, -height / 2)
    );

    setIsLoading(false);

    // Cleanup function
    return () => {
      svg.selectAll("*").remove();
    };
  }, [nodes, xAxis, yAxis, highlightedDecade, router, metrics]);

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
            {xAxis}: {tooltipContent.generality?.toFixed(3)}
            <br />
            {yAxis}: {tooltipContent.impact?.toFixed(3)}
          </div>
          {tooltipContent.content && <div>{tooltipContent.content}</div>}
        </div>
      )}

      {/* Bottom controls container */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80">
        <div className="p-4 flex justify-center items-center">
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
        </div>
      </div>
    </div>
  );
}
