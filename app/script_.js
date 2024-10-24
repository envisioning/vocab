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

    // First pass: collect all nodes
    data.forEach(node => {
        nodes.push({
            id: node.id,
            name: node.name,
            outbound: node.children ? node.children.length : 0,
            inbound: 0,  // Will be counted in the next step
            summary: node.summary
        });

        // Add all child relationships to links
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

    // Count inbound connections - Fixed version
    links.forEach(link => {
        const targetNode = nodes.find(n => n.id === link.target);
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
        .range([0.2, 0.5]); // Adjusted to much thinner lines

    // Create the force simulation with adjusted parameters
    const simulation = d3.forceSimulation(nodes)
        .force("collide", d3.forceCollide()
            .radius(d => nodeRadius(d) + 10)
            .strength(1))
        .force("link", d3.forceLink(links)
            .id(d => d.id)
            .distance(50)
            .strength(0.1))
        .on("tick", () => {
            node
                .attr("cx", d => Math.max(nodeRadius(d), Math.min(width - nodeRadius(d), d.x)))
                .attr("cy", d => Math.max(nodeRadius(d), Math.min(height - nodeRadius(d), d.y)));
            
            label
                .attr("x", d => Math.max(nodeRadius(d), Math.min(width - nodeRadius(d), d.x)))
                .attr("y", d => Math.max(nodeRadius(d), Math.min(height - nodeRadius(d), d.y)));
            
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
        })
        .alphaDecay(0.02)
        .velocityDecay(0.4);

    // Remove any center-based forces as positions are now fixed

    // Update the node drag behavior to maintain fixed positions
    const drag = d3.drag()
        .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        })
        .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            // Keep the node fixed where it was dragged
            d.fx = event.x;
            d.fy = event.y;
        });

    // Apply the drag behavior to nodes
    const node = g.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", nodeRadius)
        .attr("fill", d => {
            // Use first category for fill
            const primaryCategory = nodeDetailsMap.get(d.id).categories[0];
            return categoryColors(primaryCategory);
        })
        .attr("stroke", d => {
            // Use second category for stroke if it exists
            const categories = nodeDetailsMap.get(d.id).categories;
            return categories.length > 1 ? categoryColors(categories[1]) : "none";
        })
        .attr("stroke-width", d => {
            // Only show stroke if there's a secondary category
            return nodeDetailsMap.get(d.id).categories.length > 1 ? "3px" : "0px";
        })
        .style("cursor", "pointer")
        .call(drag);

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
        node.attr("stroke", n => {
            if (connectedNodes.has(n.id)) return "#ff9900";
            const categories = nodeDetailsMap.get(n.id).categories;
            return categories.length > 1 ? categoryColors(categories[1]) : "none";
        });

        // Show connections with proportional thickness and colors
        link
            .attr("stroke-opacity", l => 
                (l.source.id === d.id || l.target.id === d.id) ? 0.7 : 0
            )
            .attr("stroke", l => {
                if (l.source.id === d.id) return "#333";  
                if (l.target.id === d.id) return "#444";  
                return "#ccc";
            });
    })
    .on("mouseout", function() {
        // Hide tooltip
        tooltip.transition().duration(500).style("opacity", 0);
        
        // Remove outlines
        node.attr("stroke", n => {
            const categories = nodeDetailsMap.get(n.id).categories;
            return categories.length > 1 ? categoryColors(categories[1]) : "none";
        });
        
        // Reset connections to light gray
        link
            .attr("stroke", "#ccc")
            .attr("stroke-opacity", 0.3);  // Reset to lower opacity
    });

    // Instead, run the simulation once and immediately stop it
    simulation.tick();
    simulation.stop();

    // Set the final positions immediately
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
                .attr("stroke", "#ccc") // Changed from green/orange to light gray
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
        
        // Calculate total connections based on either the connectedNodes set or the larger of inbound/outbound
        const totalConnections = connectedNodes ? connectedNodes.size : Math.max(d.inbound, d.outbound);
        content += `<strong>Total Connections:</strong> ${totalConnections}<br>`;
        
        // Add connected nodes if provided (for click interactions)
        if (connectedNodes) {
            const connections = Array.from(connectedNodes).map(nodeId => {
                const node = nodes.find(n => n.id === nodeId);
                return node ? node.name : nodeId;
            });
            if (connections.length > 0) {
                content += `<br><strong>Connected to:</strong><br>${connections.join('<br>')}`;
            }
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
            .attr("stroke", l => (l.source.id === d.id || l.target.id === d.id) ? "#333" : "#ccc") // Changed to dark gray
            .attr("stroke-opacity", l => {
                if (l.source.id === d.id || l.target.id === d.id) return 0.7; // Show connected lines
                return 0.15; // Keep other lines at default low opacity
            });

        // Update label visibility
        label.attr("opacity", n => connectedNodes.has(n.id) || n.id === d.id ? 1 : 0.1);
    }

    // Define category descriptions (move this before the legend creation)
    const categoryDescriptions = {
        "CORE": "Core AI Concepts",
        "ARCH": "Architecture & Models",
        "IMPL": "Implementation & Tools",
        "DATA": "Data Processing",
        "MATH": "Mathematical Foundations",
        "BIO": "Biological & Neural",
        "GOV": "Governance & Ethics"
    };

    // Create a legend with adjusted positioning
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(20, ${height - 180})`);

    const categories = ['CORE', 'ARCH', 'IMPL', 'DATA', 'MATH', 'BIO', 'GOV'];

    // Add a state to track the active filter
    let activeFilter = null;

    // Create legend items with click event listeners
    legend.selectAll("circle")
        .data(categories)
        .enter()
        .append("circle")
        .attr("cx", 10)
        .attr("cy", (d, i) => i * 25)
        .attr("r", 7)
        .attr("fill", d => categoryColors(d))
        .style("cursor", "pointer")  // Change cursor to pointer on hover
        .on("click", function(event, category) {
            if (activeFilter === category) {
                activeFilter = null;  // Reset filter if the same category is clicked
            } else {
                activeFilter = category;  // Set new filter
            }
            applyFilter();
            updateLegendVisuals();
        });

    // Add labels to the legend items with expanded titles
    legend.selectAll("text")
        .data(categories)
        .enter()
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) => i * 25)
        .attr("dy", "0.35em")  // Vertical alignment
        .text(d => categoryDescriptions[d])
        .attr("font-size", "12px")
        .attr("fill", "black")
        .style("cursor", "pointer")  // Change cursor to pointer on hover
        .on("click", function(event, category) {
            // Trigger click on the corresponding circle
            legend.selectAll("circle").filter(c => c === category).dispatch("click");
        });

    // Function to apply the active filter to nodes and links
    function applyFilter() {
        if (activeFilter) {
            // Filter nodes and links
            const visibleNodes = nodes.filter(d => 
                nodeDetailsMap.get(d.id).categories.includes(activeFilter)
            );
            const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
            
            const visibleLinks = links.filter(l => 
                visibleNodeIds.has(l.source.id) && visibleNodeIds.has(l.target.id)
            );

            // Update visibility
            node.style("display", d => visibleNodeIds.has(d.id) ? null : "none");
            label.style("display", d => visibleNodeIds.has(d.id) ? null : "none");
            link.style("display", l => 
                visibleNodeIds.has(l.source.id) && visibleNodeIds.has(l.target.id) ? null : "none"
            );

            // Restart simulation with only visible nodes and links
            simulation.nodes(visibleNodes);
            simulation.force("link").links(visibleLinks);
            simulation
                .alpha(0.3) // Reduced initial alpha (was 1)
                .restart();
        } else {
            // Reset display if no filter is active
            node.style("display", null);
            label.style("display", null);
            link.style("display", null);

            // Restart simulation with all nodes and links
            simulation.nodes(nodes);
            simulation.force("link").links(links);
            simulation
                .alpha(0.3) // Reduced initial alpha (was 1)
                .restart();
        }
    }

    // Function to update the visual state of the legend
    function updateLegendVisuals() {
        legend.selectAll("circle")
            .attr("stroke", d => d === activeFilter ? "#000" : "none")
            .attr("stroke-width", d => d === activeFilter ? 2 : 0);
        
        legend.selectAll("text")
            .attr("font-weight", d => d === activeFilter ? "bold" : "normal");
    }

    // Initial call to set the correct visuals
    applyFilter();
    updateLegendVisuals();

    // Function to organize nodes radially from the center
    function organizeNodes() {
        // 1. Clear any existing forces and fixed positions
        nodes.forEach(node => {
            delete node.fx;
            delete node.fy;
        });

        // 2. Create concentric circles based on generality
        const levels = 10; // Split into 10 levels
        const levelGroups = new Array(levels).fill().map(() => []);
        
        // Group nodes by generality level
        nodes.forEach(node => {
            const generality = nodeDetailsMap.get(node.id).generality || 0;
            const levelIndex = Math.floor(generality * (levels - 1));
            levelGroups[levelIndex].push(node);
        });

        // 3. Position nodes level by level
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) * 0.45; // Use 90% of available space
        
        levelGroups.forEach((group, levelIndex) => {
            if (group.length === 0) return;
            
            // Calculate radius for this level
            const radius = (levelIndex / (levels - 1)) * maxRadius;
            
            // Position nodes in this level
            group.forEach((node, i) => {
                const angleStep = (2 * Math.PI) / group.length;
                const angle = i * angleStep;
                
                // Set initial positions
                node.x = centerX + radius * Math.cos(angle);
                node.y = centerY + radius * Math.sin(angle);
            });
        });
    }

    // Call organizeNodes to set initial positions
    organizeNodes();

    // After simulation stabilizes, optionally fix positions
    simulation.on("end", () => {
        nodes.forEach(node => {
            node.fx = node.x;
            node.fy = node.y;
        });
    });

    function layoutNodes() {
        // Sort nodes by generality (highest to lowest)
        const sortedNodes = [...nodes].sort((a, b) => {
            const genA = nodeDetailsMap.get(a.id).generality || 0;
            const genB = nodeDetailsMap.get(b.id).generality || 0;
            return genB - genA;
        });

        const centerX = width / 2;
        const centerY = height / 2;
        const padding = 5; // Space between nodes

        // Start with center node
        const firstNode = sortedNodes[0];
        firstNode.x = centerX;
        firstNode.y = centerY;

        // Place remaining nodes in a spiral pattern
        for (let i = 1; i < sortedNodes.length; i++) {
            const node = sortedNodes[i];
            const angle = i * 2.4; // Golden angle in radians
            let radius = 0;
            
            // Increase radius until we find a non-overlapping position
            let overlap;
            do {
                radius += 1;
                node.x = centerX + radius * Math.cos(angle);
                node.y = centerY + radius * Math.sin(angle);
                
                // Check for overlap with all previously placed nodes
                overlap = false;
                for (let j = 0; j < i; j++) {
                    const otherNode = sortedNodes[j];
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = nodeRadius(node) + nodeRadius(otherNode) + padding;
                    
                    if (distance < minDistance) {
                        overlap = true;
                        break;
                    }
                }
            } while (overlap);
        }

        // Update node and label positions
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);

        // Update link positions
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    }

    // Remove force simulation entirely
    // const simulation = d3.forceSimulation... can be deleted

    // Call the layout function after creating nodes
    layoutNodes();
});
