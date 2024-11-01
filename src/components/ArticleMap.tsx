"use client";
import { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { Node } from "@/types/article";

interface ArticleMapProps {
  nodes: Node[];
}

interface Link {
  source: Node;
  target: Node;
  type: "parent" | "child";
}

export default function ArticleMap({ nodes }: ArticleMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Define helper functions first
  const calculateNodeSizes = (nodes: Node[], links: Link[]) => {
    const connectionCounts = new Map<string, number>();

    // Count both incoming and outgoing connections
    links.forEach((link) => {
      const sourceSlug = (link.source as Node).slug;
      const targetSlug = (link.target as Node).slug;

      connectionCounts.set(
        sourceSlug,
        (connectionCounts.get(sourceSlug) || 0) + 1
      );
      connectionCounts.set(
        targetSlug,
        (connectionCounts.get(targetSlug) || 0) + 1
      );
    });

    // Scale node sizes between 20 and 60 based on connection count
    const minConnections = Math.min(...connectionCounts.values());
    const maxConnections = Math.max(...connectionCounts.values());
    const scale = d3
      .scaleLinear()
      .domain([minConnections, maxConnections])
      .range([20, 60]); // min and max radius

    // Return a function that gets the scaled size for a node
    return (slug: string) => {
      const connections = connectionCounts.get(slug) || 0;
      return scale(connections);
    };
  };

  // Create links array from node relationships
  const createLinks = (nodes: Node[]): Link[] => {
    const links: Link[] = [];
    const slugMap = new Map(nodes.map((node) => [node.slug, node]));

    // Add outgoing (child) connections
    nodes.forEach((node) => {
      if (Array.isArray(node.children)) {
        node.children.forEach((child) => {
          const childSlug = typeof child === "string" ? child : child.slug;
          const childNode = slugMap.get(childSlug);
          if (childNode) {
            links.push({
              source: node,
              target: childNode,
              type: "child",
            });
          }
        });
      }
    });

    // Add incoming (parent) connections
    nodes.forEach((node) => {
      if (Array.isArray(node.parents)) {
        node.parents.forEach((parent) => {
          const parentSlug = typeof parent === "string" ? parent : parent.slug;
          const parentNode = slugMap.get(parentSlug);
          if (parentNode) {
            links.push({
              source: parentNode,
              target: node,
              type: "parent",
            });
          }
        });
      }
    });

    return links;
  };

  // Memoize expensive calculations
  const links = useMemo(() => createLinks(nodes), [nodes]);
  const getNodeSize = useMemo(
    () => calculateNodeSizes(nodes, links),
    [nodes, links]
  );

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    // Debounce resize handling
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Optimize force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.slug)
          .distance(35)
      )
      .force("charge", d3.forceManyBody().strength(-100)) // Reduced strength
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => getNodeSize((d as Node).slug))
      );

    // Reduce simulation ticks while maintaining stability
    simulation.stop();
    simulation.tick(300); // Reduced from 500
    simulation.stop();

    // Setup SVG with zoom support
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Clear previous content but keep the stats text
    svg.selectAll("*:not(.stats-text)").remove();

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

    // Add links with pre-calculated positions
    const linkElements = g
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d) => (d.type === "parent" ? "#3B82F6" : "#93C5FD"))
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6)
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    // Create nodes with pre-calculated positions
    const nodeElements = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

    // Add circles with dynamic radius
    nodeElements
      .append("circle")
      .attr("r", (d) => getNodeSize(d.slug))
      .attr("fill", "#93C5FD")
      .attr("stroke", "#3B82F6")
      .attr("stroke-width", 2)
      .attr("class", "hover:stroke-blue-400");

    // Add text with scaled size
    const textElements = nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#1E3A8A")
      .attr("font-size", (d) => {
        const radius = getNodeSize(d.slug);
        return `${Math.max(8, radius / 3)}px`; // Scale text with node, min 8px
      })
      .attr("font-weight", "500")
      .text((d) => d.title);

    // Add title with line breaks if needed
    textElements.each(function (d: any) {
      const text = d3.select(this);
      const title = d.title || d.name || d.slug || "";
      const words = title.split(/\s+/);
      const lineHeight = 12;

      if (words.length === 1) {
        text.append("tspan").attr("x", 0).attr("y", 0).text(words[0]);
      } else {
        const midpoint = Math.ceil(words.length / 2);
        const firstLine = words.slice(0, midpoint).join(" ");
        const secondLine = words.slice(midpoint).join(" ");

        text
          .append("tspan")
          .attr("x", 0)
          .attr("y", -lineHeight / 2)
          .text(firstLine);

        text
          .append("tspan")
          .attr("x", 0)
          .attr("y", lineHeight / 2)
          .text(secondLine);
      }
    });

    // Initial zoom to fit
    const initialScale = 0.75;
    svg.call(
      zoom.transform as any,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initialScale)
        .translate(-width / 2, -height / 2)
    );
  }, [nodes, links, getNodeSize]);

  return (
    <div className="flex flex-col h-full">
      <svg
        ref={svgRef}
        className="w-full flex-1 bg-gray-50"
        style={{ cursor: "grab" }}
      />
      <div className="p-4 text-sm text-gray-500">
        {`Nodes: ${nodes.length} | Connections: ${links.length}`}
      </div>
    </div>
  );
}
