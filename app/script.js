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

    // Prepare the data
    const nodes = data.map(d => ({ id: d.id, name: d.name, connections: d.children.length }));
    const links = data.flatMap(d => d.children.map(childId => ({ source: d.id, target: childId })));

    // Calculate the maximum number of connections
    const maxConnections = Math.max(...nodes.map(d => d.connections));

    // Function to calculate node radius
    const nodeRadius = d => 5 + (d.connections / maxConnections) * 25;

    // Create the force simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(200)) // Increased from 150 to 200
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => nodeRadius(d) + 20))
        .force("attract", attractTowardCenter(0.1))
        .stop(); // Stop the simulation immediately

    // Add this function after the simulation definition
    function attractTowardCenter(strength) {
        return function(alpha) {
            for (let i = 0, n = nodes.length, node, k = alpha * strength; i < n; ++i) {
                node = nodes[i];
                node.vx -= (node.x - width / 2) * k;
                node.vy -= (node.y - height / 2) * k;
            }
        };
    }

    // Create the links
    const link = g.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "#ccc")
        .attr("stroke-opacity", 0) // Initially hide the links
        .attr("stroke-width", 1);

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

    // Load summaries for each node
    const summaryPromises = nodes.map(node => 
        d3.text(`../vocab/${node.name}.md`)
            .then(text => {
                const frontmatter = text.split('---')[1];
                const titleMatch = frontmatter.match(/title:\s*(.+)/);
                const summaryMatch = frontmatter.match(/summary:\s*(.+)/);
                if (titleMatch) {
                    node.title = titleMatch[1].trim().replace(/^["']|["']$/g, '');
                } else {
                    node.title = node.name;
                }
                if (summaryMatch) {
                    node.summary = summaryMatch[1].trim().replace(/^["']|["']$/g, '');
                } else {
                    node.summary = "Summary not available";
                }
            })
            .catch(() => { 
                node.title = node.name;
                node.summary = "Summary not available"; 
            })
    );

    Promise.all(summaryPromises).then(() => {
        // Add search functionality
        searchInput.on("input", function() {
            const searchTerm = this.value.toLowerCase();
            const matchingNodes = nodes.filter(n => n.name.toLowerCase().includes(searchTerm));
            
            node.attr("fill", d => matchingNodes.includes(d) ? "#ff9900" : "#1f77b4")
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

        // Create the nodes
        const node = g.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", nodeRadius)
            .attr("fill", "#1f77b4")
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

        // Add hover event handlers to show tooltip
        node.on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`<strong>${d.title}</strong><br>${d.summary}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition().duration(500).style("opacity", 0);
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
                unhighlightAll();
            } else {
                unhighlightAll();
                highlight(event, d);
                highlightedNode = d;
            }
        }

        function highlight(event, d) {
            // Find connected nodes
            const connectedNodes = new Set();
            links.forEach(link => {
                if (link.source.id === d.id) connectedNodes.add(link.target.id);
                if (link.target.id === d.id) connectedNodes.add(link.source.id);
            });

            // Highlight connected nodes and links
            node.attr("opacity", n => connectedNodes.has(n.id) || n.id === d.id ? 1 : 0.1);
            link.attr("stroke", l => (l.source.id === d.id || l.target.id === d.id) ? "#ff9900" : "#ccc")
                .attr("stroke-opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0) // Show only connected links
                .attr("stroke-width", l => (l.source.id === d.id || l.target.id === d.id) ? 2 : 1);
            label.attr("opacity", n => connectedNodes.has(n.id) || n.id === d.id ? 1 : 0.1);
        }

        function unhighlightAll() {
            highlightedNode = null;
            node.attr("opacity", 1);
            link.attr("stroke", "#ccc")
                .attr("stroke-opacity", 0) // Hide all links again
                .attr("stroke-width", 1);
            label.attr("opacity", 1);
        }
    });
});
