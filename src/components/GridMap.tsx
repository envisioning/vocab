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
  | "safety"
  | "year";

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
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);

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
      1940: "#aec7e8",
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

  // Update the normalizeYear helper function
  const normalizeYear = (year: number | null) => {
    if (!year) return 0;
    const baseYear = 1940;
    const currentYear = new Date().getFullYear();
    // Pre-1940 terms get mapped to 0
    if (year < baseYear) return 0;
    return Math.min((year - baseYear) / (currentYear - baseYear), 1);
  };

  // Now the nodes useMemo can use normalizeYear
  const nodes = useMemo(() => {
    return rawNodes
      .filter((node) => {
        const xValue = xAxis === "year" ? node.year : node[xAxis];
        const yValue = yAxis === "year" ? node.year : node[yAxis];
        return xValue != null && yValue != null;
      })
      .map((node) => ({
        ...node,
        normalizedYear: normalizeYear(node.year),
      }))
      .sort((a, b) => (a.year || 0) - (b.year || 0));
  }, [rawNodes, xAxis, yAxis]);

  // Helper function to get decades for the legend
  const getDecades = () => {
    const startYear = 1940;
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
    "year",
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
      .style("font-weight", (d) => (d === xAxis ? "bold" : "normal"))
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
      .data(metrics.slice().reverse())
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
      .style("font-weight", (d) => (d === yAxis ? "bold" : "normal"))
      .style("cursor", (d) => (d === xAxis ? "not-allowed" : "pointer"))
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .on("click", (_, d) => {
        if (d !== xAxis) {
          setYAxis(d);
        }
      });

    // Add nodes
    const nodeElements = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(
        nodes.sort((a, b) => {
          // Sort by size (connection count) in descending order
          // so larger nodes are rendered first (bottom layer)
          const sizeA = a.children?.length || 0;
          const sizeB = b.children?.length || 0;
          return sizeB - sizeA;
        })
      )
      .enter()
      .append("g")
      .attr("class", (d) => {
        const nodeDecade = Math.floor((d.year || 0) / 10) * 10;
        const isActive = !selectedDecade || nodeDecade === selectedDecade;
        return `node ${isActive ? "cursor-pointer" : "pointer-events-none"}`;
      })
      .attr("transform", (d) => {
        const xValue = xAxis === "year" ? d.normalizedYear : d[xAxis];
        const yValue = yAxis === "year" ? d.normalizedYear : d[yAxis];
        const x = xScale(xValue as number);
        const y = yScale(yValue as number);
        return `translate(${x},${y})`;
      });

    // Add circles
    nodeElements
      .append("circle")
      .attr("r", (d) => getNodeSize(d))
      .attr("fill", (d) => {
        const year = d.year || 0;
        // Group pre-1940 with 1940s
        return getDecadeColor(year < 1940 ? 1940 : year);
      })
      .attr("fill-opacity", (d) => {
        const year = d.year || 0;
        // Treat pre-1940 as part of 1940s decade for filtering
        const nodeDecade = year < 1940 ? 1940 : Math.floor(year / 10) * 10;
        if (selectedDecade !== null) {
          return nodeDecade === selectedDecade ? 0.9 : 0.1;
        }
        return 0.5;
      })
      .attr(
        "class",
        "hover:stroke-white hover:stroke-2 hover:fill-opacity-100 transition-opacity duration-200"
      )
      .style("opacity", (d) => {
        const nodeDecade = Math.floor((d.year || 0) / 10) * 10;
        if (selectedDecade !== null) {
          return nodeDecade === selectedDecade ? 1 : 0.2;
        }
        if (highlightedDecade !== null) {
          return nodeDecade === highlightedDecade ? 1 : 0.2;
        }
        return 1;
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
      .on("mouseleave", () => {
        setTooltipContent(null);
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        router.push(`/${d.slug}`);
      });

    // Instead of applying zoom transform, apply a fixed transform
    const scale = 0.8;
    g.attr(
      "transform",
      `translate(${width / 2},${height / 2}) scale(${scale}) translate(${
        -width / 2
      },${-height / 2})`
    );

    // Add background rect for mouse events
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .lower()
      .on("mousemove", () => {
        setTooltipContent(null);
      });

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
          ...
        </div>
      )}
      <svg ref={svgRef} className="w-full h-full bg-gray-50" />
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
              Year: {Math.floor(tooltipContent.year)}
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
          <div className="flex items-center">
            {getDecades().map((decade) => (
              <div
                key={decade}
                className={`flex items-center cursor-pointer transition-opacity duration-200 
                  px-2 py-4 -ml-px first:ml-0 hover:bg-gray-50/50 
                  ${
                    selectedDecade === decade
                      ? "ring-2 ring-blue-500 ring-offset-2 rounded-lg relative z-10"
                      : ""
                  }`}
                style={{
                  marginTop: "-1rem", // Extend hover area up
                  marginBottom: "-1rem", // Extend hover area down
                  paddingTop: "1rem", // Maintain visual padding
                  paddingBottom: "1rem", // Maintain visual padding
                }}
                onMouseEnter={() =>
                  !selectedDecade && setHighlightedDecade(decade)
                }
                onMouseLeave={() =>
                  !selectedDecade && setHighlightedDecade(null)
                }
                onClick={() => {
                  if (selectedDecade === decade) {
                    setSelectedDecade(null);
                  } else {
                    setSelectedDecade(decade);
                    setHighlightedDecade(null);
                  }
                }}
              >
                <div
                  className="w-4 h-4 rounded-full mr-1"
                  style={{
                    backgroundColor: getDecadeColor(decade),
                    opacity:
                      selectedDecade === null
                        ? 1
                        : selectedDecade === decade
                        ? 1
                        : 0.1,
                  }}
                />
                <span
                  className="text-sm text-gray-600"
                  style={{
                    opacity:
                      selectedDecade === null
                        ? 1
                        : selectedDecade === decade
                        ? 1
                        : 0.1,
                  }}
                >
                  {`${decade}s`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
