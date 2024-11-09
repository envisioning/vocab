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
      1940: "#F94144", // Pre-1950s red
      1950: "#F3722C", // Orange
      1960: "#F8961E", // Light orange
      1970: "#F9C74F", // Yellow
      1980: "#90BE6D", // Light green
      1990: "#43AA8B", // Teal
      2000: "#4D908E", // Blue-teal
      2010: "#577590", // Blue
      2020: "#277DA1", // Deep blue
    };
    return colors[decade] || "#F94144"; // Default to pre-1950s color
  };

  // Normalize year for scaling
  const normalizeYear = (year: number | null) => {
    if (!year) return 0;
    const baseYear = 1940;
    const currentYear = new Date().getFullYear();
    // Pre-1940 terms get mapped to 0
    if (year < baseYear) return 0;
    return Math.min((year - baseYear) / (currentYear - baseYear), 1);
  };

  // Processed nodes with normalization
  const processedNodes = useMemo(() => {
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

  // Array of metrics
  const metrics: MetricKey[] = [
    "generality",
    "impact",
    "complexity",
    "popularity",
    "safety",
    "year",
  ];

  // Initialize SVG only once
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = { top: 100, right: 50, bottom: 100, left: 100 }; // Increased bottom margin for x-axis labels

    svg.attr("width", width).attr("height", height);

    // Create the main group element
    const g = svg.append("g").attr("class", "main-group");

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

    // **Append Axes After Gridlines**

    // Create and add axes
    const xAxisGen = d3.axisBottom(xScale);
    const yAxisGen = d3.axisLeft(yScale);

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxisGen);

    g.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxisGen);

    // **Append Axis Labels (Ordering Options)**

    // X-Axis Labels
    g.append("g")
      .attr("class", "x-axis-labels")
      .selectAll("text")
      .data(metrics)
      .enter()
      .append("text")
      .attr("transform", (_, i) => {
        const xPos =
          margin.left +
          ((width - margin.left - margin.right) / metrics.length) * (i + 0.5);
        return `translate(${xPos},${height - margin.bottom + 40})`;
      })
      .attr("text-anchor", "middle")
      .attr("class", (d) =>
        d === yAxis
          ? "cursor-not-allowed text-gray-300"
          : "cursor-pointer transition-colors duration-200"
      )
      .style("fill", (d) => (d === xAxis ? "#000000" : "#6B7280")) // Black when selected, gray otherwise
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .on("click", (_, d) => {
        if (d !== yAxis && d !== xAxis) {
          setXAxis(d);
        }
      });

    // Y-Axis Labels
    g.append("g")
      .attr("class", "y-axis-labels")
      .selectAll("text")
      .data(metrics.slice().reverse())
      .enter()
      .append("text")
      .attr("transform", (_, i) => {
        const yPos =
          margin.top +
          ((height - margin.top - margin.bottom) / metrics.length) * (i + 0.5);
        return `translate(${margin.left - 40},${yPos}) rotate(-90)`;
      })
      .attr("text-anchor", "middle")
      .attr("class", (d) =>
        d === xAxis
          ? "cursor-not-allowed text-gray-300"
          : "cursor-pointer transition-colors duration-200"
      )
      .style("fill", (d) => (d === yAxis ? "#000000" : "#6B7280")) // Black when selected, gray otherwise
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .on("click", (_, d) => {
        if (d !== xAxis && d !== yAxis) {
          setYAxis(d);
        }
      });

    // **Append Nodes Group After Gridlines and Labels**

    // Add the nodes group here
    g.append("g").attr("class", "nodes");

    // Responsive handling
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      svg.attr("width", newWidth).attr("height", newHeight);

      // Update scales
      xScale.range([margin.left, newWidth - margin.right]).nice();
      yScale.range([newHeight - margin.bottom, margin.top]).nice();

      // Update gridlines
      g.selectAll(".grid-minor.x-grid line")
        .attr("x1", (d: number) => xScale(d))
        .attr("x2", (d: number) => xScale(d));

      g.selectAll(".grid-minor.y-grid line")
        .attr("x1", margin.left)
        .attr("x2", newWidth - margin.right)
        .attr("y1", (d: number) => yScale(d))
        .attr("y2", (d: number) => yScale(d));

      g.selectAll(".grid-major.x-grid line")
        .attr("x1", (d: number) => xScale(d))
        .attr("x2", (d: number) => xScale(d));

      g.selectAll(".grid-major.y-grid line")
        .attr("x1", margin.left)
        .attr("x2", newWidth - margin.right)
        .attr("y1", (d: number) => yScale(d))
        .attr("y2", (d: number) => yScale(d));

      // Update axes
      g.select<SVGGElement>(".x-axis")
        .attr("transform", `translate(0,${newHeight - margin.bottom})`)
        .call(xAxisGen);

      g.select<SVGGElement>(".y-axis").call(yAxisGen);

      // Update axis labels positions
      // X-Axis Labels
      g.selectAll("g.x-axis-labels text").attr("transform", (_, i) => {
        const xPos =
          margin.left +
          ((newWidth - margin.left - margin.right) / metrics.length) *
            (i + 0.5);
        return `translate(${xPos},${newHeight - margin.bottom + 40})`;
      });

      // Y-Axis Labels
      g.selectAll("g.y-axis-labels text").attr("transform", (_, i) => {
        const yPos =
          margin.top +
          ((newHeight - margin.top - margin.bottom) / metrics.length) *
            (i + 0.5);
        return `translate(${margin.left - 40},${yPos}) rotate(-90)`;
      });

      // Update nodes transition scales
      g.selectAll("g.nodes g.node").each(function (d: any) {
        const node = d3.select(this);
        const xValue = xAxis === "year" ? d.normalizedYear : d[xAxis];
        const yValue = yAxis === "year" ? d.normalizedYear : d[yAxis];
        const x = xScale(xValue as number);
        const y = yScale(yValue as number);
        node
          .transition()
          .duration(1000)
          .attr("transform", `translate(${x},${y})`);
      });
    };

    window.addEventListener("resize", handleResize);

    setIsLoading(false);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [xAxis, yAxis, metrics]);

  // Update nodes when data or axes change
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select<SVGGElement>("g.main-group");
    const margin = { top: 50, right: 50, bottom: 100, left: 100 };
    const width = window.innerWidth;
    const height = window.innerHeight;

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

    // Data Binding
    const nodeSelection = g
      .select<SVGGElement>("g.nodes")
      .selectAll<SVGGElement, Node>("g.node")
      .data(processedNodes, (d: any) => d.id || d.slug);

    // Enter Selection
    const nodeEnter = nodeSelection
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

    nodeEnter
      .append("circle")
      .attr("r", (d) => getNodeSize(d))
      .attr("fill", (d) => {
        const year = d.year || 0;
        return getDecadeColor(year < 1940 ? 1940 : year);
      })
      .attr("fill-opacity", (d) => {
        const year = d.year || 0;
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

    // Merge Enter and Update selections
    nodeSelection
      .merge(nodeEnter as any)
      .transition()
      .duration(1000)
      .attr("transform", (d) => {
        const xValue = xAxis === "year" ? d.normalizedYear : d[xAxis];
        const yValue = yAxis === "year" ? d.normalizedYear : d[yAxis];
        const x = xScale(xValue as number);
        const y = yScale(yValue as number);
        return `translate(${x},${y})`;
      });

    // Update circles if radius or fill changes
    nodeSelection
      .select("circle")
      .transition()
      .duration(1000)
      .attr("r", (d) => getNodeSize(d))
      .attr("fill", (d) => {
        const year = d.year || 0;
        return getDecadeColor(year < 1940 ? 1940 : year);
      })
      .attr("fill-opacity", (d) => {
        const year = d.year || 0;
        const nodeDecade = year < 1940 ? 1940 : Math.floor(year / 10) * 10;
        if (selectedDecade !== null) {
          return nodeDecade === selectedDecade ? 0.9 : 0.1;
        }
        return 0.5;
      })
      .style("opacity", (d) => {
        const nodeDecade = Math.floor((d.year || 0) / 10) * 10;
        if (selectedDecade !== null) {
          return nodeDecade === selectedDecade ? 1 : 0.2;
        }
        if (highlightedDecade !== null) {
          return nodeDecade === highlightedDecade ? 1 : 0.2;
        }
        return 1;
      });

    // Exit Selection
    nodeSelection.exit().remove();
  }, [processedNodes, xAxis, yAxis, selectedDecade, highlightedDecade, router]);

  // Update the color transitions in the update effect
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select<SVGGElement>("g.main-group");

    // Update x-axis label colors
    g.selectAll("g.x-axis-labels text")
      .transition()
      .duration(200)
      .style("fill", (d) => (d === xAxis ? "#000000" : "#6B7280"));

    // Update y-axis label colors
    g.selectAll("g.y-axis-labels text")
      .transition()
      .duration(200)
      .style("fill", (d) => (d === yAxis ? "#000000" : "#6B7280"));
  }, [xAxis, yAxis, processedNodes, selectedDecade, highlightedDecade, router]);

  return (
    <div className="absolute inset-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
          Loading...
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
                  marginTop: "-1rem",
                  marginBottom: "-1rem",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
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
