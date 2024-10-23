// Load the JSON data
d3.json("ai_terms_hierarchy.json").then(data => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Add search input
    const searchInput = d3.select("#graph")
        .insert("input", ":first-child")
        .attr("type", "text")
        .attr("placeholder", "Search nodes...")
        .style("position", "absolute")
        .style("top", "10px")
        .style("left", "10px")
        .style("z-index", "1000")
        .style("padding", "5px");

    // Create the SVG element
    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a group for the graph elements
    const g = svg.append("g");

    // Create zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom);

    // Create a Map to store all node details from the flat structure
    const nodeDetailsMap = new Map();

    // First pass: collect all node details
    data.forEach(node => {
        nodeDetailsMap.set(node.id, {
            id: node.id,
            name: node.name,
            summary: node.summary,
            children: node.children || [],
            categories: node.categories || []
        });
    });

    // Initialize arrays for nodes and links
    const nodes = [];
    const links = [];

    // Helper function to traverse the hierarchical data
    function traverse(nodeId, parent = null) {
        const nodeDetails = nodeDetailsMap.get(nodeId);
        
        // Skip if we've already processed this node or if it doesn't exist
        if (!nodeDetails || nodes.some(n => n.id === nodeId)) {
            return;
        }

        nodes.push({
            id: nodeId,
            name: nodeDetails.name,
            outbound: nodeDetails.children ? nodeDetails.children.length : 0,
            inbound: 0,
            summary: nodeDetails.summary
        });

        if (parent) {
            const childInfo = parent.children.find(child => child.id === nodeId);
            links.push({
                source: parent.id,
                target: nodeId,
                similarity: childInfo ? childInfo.similarity : 0
            });
        }

        // Process children
        if (nodeDetails.children && nodeDetails.children.length > 0) {
            nodeDetails.children.forEach(child => {
                traverse(child.id, nodeDetails);
            });
        }
    }

    // Start traversal from the root nodes
    data.forEach(rootNode => traverse(rootNode.id));

    // Create a Map for quick node lookup
    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    // Count inbound connections
    links.forEach(link => {
        const targetNode = nodeMap.get(link.target);
        if (targetNode) {
            targetNode.inbound++;
        }
    });

    // **Debugging: Log inbound and outbound counts**
    console.log("Node Counts:");
    nodes.forEach(node => {
        console.log(`Node ID: ${node.id}, Outbound: ${node.outbound}, Inbound: ${node.inbound}`);
    });

    // Calculate the maximum number of connections for scaling
    const maxConnections = Math.max(
        ...nodes.map(d => Math.max(d.outbound, d.inbound))
    );

    // Define node radius based on connections
    const nodeRadius = d => 5 + (Math.max(d.inbound, d.outbound) / maxConnections) * 25;

    // **Define the Stroke Width Scale**
    // Extract all similarity values
    const similarityValues = links.map(link => link.similarity);

    // Calculate the minimum and maximum similarity for scaling
    const minSimilarity = d3.min(similarityValues);
    const maxSimilarity = d3.max(similarityValues);

    // Define the stroke width scale with a smaller range
    const strokeWidthScale = d3.scaleLinear()
        .domain([minSimilarity, maxSimilarity])
        .range([1, 5]); // Adjust the range as needed

    // Create the force simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(200))
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => nodeRadius(d) + 20))
        .force("attract", attractTowardCenter(0.1))
        .stop(); // Stop the simulation immediately

    // Function to attract nodes toward the center
    function attractTowardCenter(strength) {
        return function(alpha) {
            for (let i = 0, n = nodes.length, node, k = alpha * strength; i < n; ++i) {
                node = nodes[i];
                node.vx -= (node.x - width / 2) * k;
                node.vy -= (node.y - height / 2) * k;
            }
        };
    }

    // Create the links with lighter gray and thinner lines
    const link = g.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "#ccc")  // Keep light gray color
        .attr("stroke-opacity", 0.3)  // Reduced opacity from 0.7 to 0.3
        .attr("stroke-width", d => strokeWidthScale(d.similarity));

    // Create a tooltip div
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    // Add this after the nodeDetailsMap initialization and before creating nodes
    const categoryColors = d3.scaleOrdinal()
        .domain(['CORE', 'ARCH', 'IMPL', 'DATA', 'MATH', 'BIO'])
        .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b']);

    // Modify the node creation to use category colors
    const node = g.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", nodeRadius)
        .attr("fill", d => {
            // If node has multiple categories, use the first one
            const category = nodeDetailsMap.get(d.id).categories[0];
            return categoryColors(category);
        })
        .attr("stroke", "none")
        .attr("stroke-width", "2px")
        .style("cursor", "pointer");

    // Add labels to the nodes
    const label = g.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .text(d => d.name)
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("dy", d => nodeRadius(d) + 15)
        .style("cursor", "pointer");

    // Add search functionality
    searchInput.on("input", function() {
        const searchTerm = this.value.toLowerCase();
        const matchingNodes = nodes.filter(n => n.name.toLowerCase().includes(searchTerm));
        
        node.attr("fill", d => {
            const category = nodeDetailsMap.get(d.id).categories[0];
            if (matchingNodes.includes(d)) {
                // Make matching nodes brighter while keeping their category color
                return d3.color(categoryColors(category)).brighter(1);
            }
            return categoryColors(category);
        })
        .attr("r", d => matchingNodes.includes(d) ? nodeRadius(d) * 1.5 : nodeRadius(d));
        
        label.attr("font-weight", d => matchingNodes.includes(d) ? "bold" : "normal")
            .attr("font-size", d => matchingNodes.includes(d) ? 12 : 10);
        
        if (matchingNodes.length > 0) {
            const matchingNode = matchingNodes[0];
            const scale = 2;
            const translate = [width / 2 - matchingNode.x * scale, height / 2 - matchingNode.y * scale];
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
            );
        }
    });

    // Add hover event handlers to show tooltip
    node.on("mouseover", function(event, d) {
        // Show tooltip
        showTooltip(event, d);
        
        // Highlight connected nodes
        const connectedNodes = new Set();
        links.forEach(link => {
            if (link.source.id === d.id) connectedNodes.add(link.target.id);
            if (link.target.id === d.id) connectedNodes.add(link.source.id);
        });

        // Add outline to connected nodes
        node.attr("stroke", n => 
            connectedNodes.has(n.id) ? "#ff9900" : "none"
        );

        // Show connections with proportional thickness and colors
        link
            .attr("stroke-opacity", l => 
                (l.source.id === d.id || l.target.id === d.id) ? 0.7 : 0.3
            )
            .attr("stroke", l => {
                if (l.source.id === d.id) return "#4CAF50";  // Green for outgoing
                if (l.target.id === d.id) return "#FFA500";  // Orange for incoming
                return "#ccc";  // Gray for unrelated
            });
    })
    .on("mouseout", function() {
        // Hide tooltip
        tooltip.transition().duration(500).style("opacity", 0);
        
        // Remove outlines
        node.attr("stroke", "none");
        
        // Reset connections to light gray
        link
            .attr("stroke", "#ccc")
            .attr("stroke-opacity", 0.3);  // Reset to lower opacity
    });

    // Run the simulation
    for (let i = 0; i < 300; ++i) simulation.tick();

    // Set the final positions
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    label
        .attr("x", d => d.x)
        .attr("y", d => d.y);

    let highlightedNode = null;

    // Remove hover event handlers and only use click for interactivity
    node.on("click", toggleHighlight);
    label.on("click", toggleHighlight);

    svg.on("click", (event) => {
        if (event.target === svg.node()) {
            unhighlightAll();
        }
    });

    function toggleHighlight(event, d) {
        if (event.defaultPrevented) return; // ignore drag
        event.stopPropagation(); // prevent unhighlighting when clicking on node

        if (highlightedNode === d) {
            resetPositions().then(() => {
                highlightedNode = null;
            });
        } else {
            if (highlightedNode) {
                // First reset, then highlight new node
                resetPositions().then(() => {
                    highlight(event, d);
                    highlightedNode = d;
                });
            } else {
                // Direct highlight if no node was previously highlighted
                highlight(event, d);
                highlightedNode = d;
            }
        }
    }

    // Function to reset node positions
    function resetPositions() {
        // Return a promise that resolves when the transition is complete
        return new Promise(resolve => {
            // Reset node positions
            node.transition()
                .duration(750)
                .attr("opacity", 1)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            // Reset link properties
            link.transition()
                .duration(750)
                .attr("stroke", d => d.source.id < d.target.id ? "#4CAF50" : "#FFA500")
                .attr("stroke-opacity", 0)
                .attr("stroke-width", d => strokeWidthScale(d.similarity))
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            // Reset label positions
            label.transition()
                .duration(750)
                .attr("opacity", 1)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .on("end", resolve); // Resolve the promise when transition ends
        });
    }

    // Function to unhighlight all nodes and links
    function unhighlightAll() {
        if (highlightedNode) {
            node.attr("opacity", 1);
            link
                .attr("stroke", "#ccc")
                .attr("stroke-opacity", 0.3)  // Reset to lower opacity
                .attr("stroke-width", d => strokeWidthScale(d.similarity));
            label.attr("opacity", 1);
            highlightedNode = null;
        }
    }

    // Helper function to format tooltip content
    function formatTooltipContent(d, connectedNodes = null) {
        let content = `<strong style="font-size: larger;">${d.name}</strong><br><br>`;
        content += `${d.summary}<br><br>`;
        content += `<strong>Inbound:</strong> ${d.inbound}<br>`;
        content += `<strong>Outbound:</strong> ${d.outbound}<br>`;
        
        // Add connected nodes if provided (for click interactions)
        if (connectedNodes) {
            const connections = Array.from(connectedNodes).map(nodeId => {
                const node = nodes.find(n => n.id === nodeId);
                return node ? node.name : nodeId;
            });
            content += `<strong>Connected to:</strong><br>${connections.join('<br>')}`;
        }
        
        return content;
    }

    // Function to show tooltip
    function showTooltip(event, d, connectedNodes = null) {
        // Get the current zoom transform
        const transform = d3.zoomTransform(svg.node());
        
        // Apply the transform to the node's coordinates
        const [x, y] = transform.apply([d.x, d.y]);
        
        // Get the SVG's bounding rectangle
        const svgRect = svg.node().getBoundingClientRect();
        
        // Calculate the absolute position on the page
        const tooltipX = svgRect.left + x;
        const tooltipY = svgRect.top + y + nodeRadius(d) + 10; // 10px below the node
        
        // Update tooltip content and position
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(formatTooltipContent(d, connectedNodes))
            .style("left", `${tooltipX}px`)
            .style("top", `${tooltipY}px`)
            .style("transform", "translate(-50%, 0)"); // Center the tooltip horizontally
    }

    // Function to highlight a specific node and its connections
    function highlight(event, d) {
        const connectedNodes = new Set();
        const connectionDetails = new Map();
        
        // Gather connected nodes and their similarity scores
        links.forEach(link => {
            if (link.source.id === d.id) {
                connectedNodes.add(link.target.id);
                connectionDetails.set(link.target.id, link.similarity);
            }
            if (link.target.id === d.id) {
                connectedNodes.add(link.source.id);
                connectionDetails.set(link.source.id, link.similarity);
            }
        });

        // Update visual properties
        node.attr("opacity", n => connectedNodes.has(n.id) || n.id === d.id ? 1 : 0.1);

        link
            .attr("stroke", l => {
                if (l.source.id === d.id) return "#4CAF50";
                if (l.target.id === d.id) return "#FFA500";
                return "#ccc";
            })
            .attr("stroke-opacity", l => {
                if (l.source.id === d.id || l.target.id === d.id) {
                    return 0.7;
                }
                return 0.3;  // Lower opacity for non-highlighted links
            });

        // Update label visibility
        label.attr("opacity", n => connectedNodes.has(n.id) || n.id === d.id ? 1 : 0.1);
    }

    // Update the simulation on each tick
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    // Add this after creating the SVG
    // Create a legend with adjusted positioning
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(20, ${height - 180})`);  // Moved down from the top

    const categories = ['CORE', 'ARCH', 'IMPL', 'DATA', 'MATH', 'BIO'];

    legend.selectAll("circle")
        .data(categories)
        .enter()
        .append("circle")
        .attr("cx", 10)
        .attr("cy", (d, i) => i * 25)
        .attr("r", 7)
        .attr("fill", d => categoryColors(d));

    legend.selectAll("text")
        .data(categories)
        .enter()
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) => i * 25)
        .attr("dy", "0.3em")
        .text(d => d)
        .attr("font-size", "12px")
        .attr("fill", "black");
});
