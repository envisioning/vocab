// Data loading and processing remains similar
d3.json("ai_terms_hierarchy.json").then(data => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Create base SVG
    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        
    // Create a group for zoom/pan
    const g = svg.append("g");
    
    // Setup zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);

    // Process data similarly to original
    const nodeDetailsMap = new Map();
    const nodes = [];
    const links = [];

    // First pass: collect node details
    data.forEach(node => {
        nodeDetailsMap.set(node.id, {
            id: node.id,
            name: node.name,
            summary: node.summary,
            children: node.children || [],
            categories: node.categories || [],
            generality: node.generality || 0
        });
    });

    // Build nodes and links arrays
    data.forEach(node => {
        nodes.push({
            id: node.id,
            name: node.name,
            generality: node.generality || 0,
            summary: node.summary
        });

        if (node.children) {
            node.children.forEach(child => {
                links.push({
                    source: node.id,
                    target: child.id,
                    similarity: child.similarity
                });
            });
        }
    });

    // New visualization code starts here
    function createGeneralityLayout() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate connections
        nodes.forEach(node => {
            node.connections = links.filter(l => 
                l.source === node.id || l.target === node.id
            ).length;
        });

        const maxConnections = Math.max(...nodes.map(n => n.connections));
        
        // Calculate node sizes
        nodes.forEach(node => {
            node.radius = 12 + (node.connections / maxConnections * 40);
        });

        // Sort nodes by generality (highest first)
        nodes.sort((a, b) => b.generality - a.generality);

        // Create exponential scale for radius calculation
        const radiusScale = d3.scalePow()
            .exponent(3) // More dramatic exponential scaling
            .domain([0, 1])  // Domain from low to high generality
            .range([Math.min(width, height) * 0.45, 0]); // Range from outer to center

        // Position nodes with exponential spacing
        nodes.forEach((node, i) => {
            const radius = radiusScale(node.generality); // Use generality directly for radius
            
            const goldenRatio = (1 + Math.sqrt(5)) / 2;
            const angle = i * 2.5 * Math.PI / goldenRatio;
            
            node.x = centerX + radius * Math.cos(angle);
            node.y = centerY + radius * Math.sin(angle);
        });

        // Create force simulation with stronger center force for high generality
        const simulation = d3.forceSimulation(nodes)
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(d => d.radius * 1.8))
            .force("radial", d3.forceRadial(
                d => radiusScale(d.generality), // Use same exponential scale
                width / 2,
                height / 2
            ).strength(1)) // Strong radial force
            .stop();

        // Run simulation
        for (let i = 0; i < 400; ++i) simulation.tick();

        // Color scale
        const colorScale = d3.scaleLinear()
            .domain([0, 1])
            .range(["#e6f3ff", "#0047ab"]);

        // Create tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        function showTooltip(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <strong>${d.name}</strong><br>
                Connections: ${d.connections}<br>
                Generality: ${d.generality.toFixed(2)}<br>
                ${d.summary}
            `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        }

        function hideTooltip() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }

        // Create a group for links that will be shown/hidden
        const linksGroup = g.append("g").attr("class", "links");

        // Draw nodes with click interaction
        const nodeElements = g.selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.radius)
            .attr("fill", d => colorScale(d.generality))
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .style("cursor", "pointer")
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip)
            .on("click", handleNodeClick);

        // Add centered labels with smaller text
        const labelElements = g.selectAll("text")
            .data(nodes)
            .join("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .text(d => d.name)
            .attr("font-size", d => 5 + (d.generality * 1)) // Reduced from 6 + 1.5
            .attr("fill", "#333")
            .style("pointer-events", "all")
            .style("cursor", "pointer")
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip)
            .on("click", handleNodeClick);

        let activeNode = null;

        function handleNodeClick(event, d) {
            if (activeNode === d) {
                // If clicking the same node, reset the view
                resetView();
                activeNode = null;
            } else {
                // Show connections for the clicked node
                showConnections(d);
                activeNode = d;
            }
        }

        function showConnections(node) {
            // Find connected nodes (parents and children)
            const connectedNodes = new Set();
            connectedNodes.add(node.id);
            
            // Add parents and children to connected nodes
            links.forEach(link => {
                if (link.source === node.id) {
                    connectedNodes.add(link.target);
                }
                if (link.target === node.id) {
                    connectedNodes.add(link.source);
                }
            });

            // Update nodes opacity
            nodeElements.style("opacity", d => 
                connectedNodes.has(d.id) ? 1 : 0.1
            );

            // Update labels opacity
            labelElements.style("opacity", d => 
                connectedNodes.has(d.id) ? 1 : 0.1
            );

            // Remove existing links
            linksGroup.selectAll("line").remove();

            // Draw new links
            linksGroup.selectAll("line")
                .data(links.filter(l => 
                    (l.source === node.id || l.target === node.id)
                ))
                .join("line")
                .attr("x1", l => nodes.find(n => n.id === l.source).x)
                .attr("y1", l => nodes.find(n => n.id === l.source).y)
                .attr("x2", l => nodes.find(n => n.id === l.target).x)
                .attr("y2", l => nodes.find(n => n.id === l.target).y)
                .attr("stroke", "#999")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 0.6);
        }

        function resetView() {
            // Reset all nodes and labels to full opacity
            nodeElements.style("opacity", 1);
            labelElements.style("opacity", 1);
            
            // Remove all links
            linksGroup.selectAll("line").remove();
        }
    }

    // Initialize the visualization
    createGeneralityLayout();

    // Log data for debugging
    console.log("Nodes:", nodes);
    console.log("Links:", links);
}).catch(error => {
    console.error("Error loading the data:", error);
});
