"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3-force";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: string;
  description?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  description?: string;
  keywords?: string;
  weight?: number;
}

const ENTITY_COLORS: Record<string, string> = {
  organization: "#38bdf8", // Sky blue
  company: "#38bdf8",      // Sky blue
  product: "#ec4899",     // Hot pink
  person: "#fbbf24",      // Amber
  people: "#fbbf24",      // Amber
  project: "#a855f7",     // Purple
  technology: "#10b981",  // Emerald green
  metric: "#f43f5e",      // Rose red
  unknown: "#9ca3af",     // Neutral gray
};

const getEntityColor = (type: string) => {
  const normalized = type.toLowerCase().trim();
  return ENTITY_COLORS[normalized] || ENTITY_COLORS.unknown;
};

export default function GraphView() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // Dimensions
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const dragNodeRef = useRef<GraphNode | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  // Measure container dimensions
  useEffect(() => {
    if (svgRef.current && svgRef.current.parentElement) {
      const { clientWidth, clientHeight } = svgRef.current.parentElement;
      setDimensions({
        width: clientWidth || 600,
        height: clientHeight || 600,
      });
    }
  }, []);

  // Fetch Graph Data
  const fetchGraphData = async () => {
    try {
      const res = await fetch("/api/graph");
      if (!res.ok) throw new Error("Failed to load graph data");
      const data = await res.json();
      
      // Map structures to D3 format using functional updates to preserve coordinates
      setNodes((prevNodes) => {
        return (data.nodes || []).map((n: any) => {
          const existingNode = prevNodes.find(old => old.id === n.id);
          return {
            id: n.id,
            label: n.label,
            type: n.type || "unknown",
            description: n.description || "",
            x: existingNode ? existingNode.x : undefined,
            y: existingNode ? existingNode.y : undefined,
            vx: existingNode ? existingNode.vx : undefined,
            vy: existingNode ? existingNode.vy : undefined,
            fx: existingNode ? existingNode.fx : undefined,
            fy: existingNode ? existingNode.fy : undefined,
          };
        });
      });

      setLinks((prevLinks) => {
        return (data.edges || []).map((e: any) => ({
          source: e.source,
          target: e.target,
          description: e.description || "",
          keywords: e.keywords || "",
          weight: e.weight || 1,
        }));
      });

      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch graph data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
    // Poll graph data every 10 seconds to show real-time ingestion
    const interval = setInterval(fetchGraphData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Setup D3 Force Simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    // Create shallow copies of nodes to avoid mutating state directly
    const nodesCopy: GraphNode[] = nodes.map(n => ({
      id: n.id,
      label: n.label,
      type: n.type,
      description: n.description,
      x: n.x,
      y: n.y,
      vx: n.vx,
      vy: n.vy,
      fx: n.fx,
      fy: n.fy
    }));

    // Reconstruct link references based on new node objects
    const linksCopy: GraphLink[] = links.map(l => {
      const sourceId = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
      const targetId = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
      
      const sourceNode = nodesCopy.find(n => n.id === sourceId);
      const targetNode = nodesCopy.find(n => n.id === targetId);
      
      return {
        source: sourceNode || sourceId,
        target: targetNode || targetId,
        description: l.description,
        keywords: l.keywords,
        weight: l.weight
      };
    });

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const { width, height } = dimensions;

    const simulation = d3.forceSimulation<GraphNode>(nodesCopy)
      .force("link", d3.forceLink<GraphNode, GraphLink>(linksCopy).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(35))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    simulation.on("tick", () => {
      setNodes([...nodesCopy]);
      setLinks([...linksCopy]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [nodes.length, links.length, dimensions]);

  // Drag Handlers
  const handleDragStart = (event: React.MouseEvent<SVGCircleElement>, node: GraphNode) => {
    event.preventDefault();
    if (!simulationRef.current) return;
    
    // Find the actual node inside the simulation
    const simNode = simulationRef.current.nodes().find(n => n.id === node.id);
    if (!simNode) return;

    dragNodeRef.current = simNode;
    simulationRef.current.alphaTarget(0.3).restart();
    simNode.fx = simNode.x;
    simNode.fy = simNode.y;
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!dragNodeRef.current || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    dragNodeRef.current.fx = x;
    dragNodeRef.current.fy = y;
  };

  const handleDragEnd = () => {
    if (!dragNodeRef.current || !simulationRef.current) return;
    
    simulationRef.current.alphaTarget(0);
    dragNodeRef.current.fx = null;
    dragNodeRef.current.fy = null;
    dragNodeRef.current.vx = 0;
    dragNodeRef.current.vy = 0;
    dragNodeRef.current = null;
  };

  if (loading && nodes.length === 0) {
    return (
      <div className="graph-status">
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Loading Memory Graph...</p>
      </div>
    );
  }

  if (error && nodes.length === 0) {
    return (
      <div className="graph-status">
        <p style={{ color: "#ef4444" }}>Error: {error}</p>
        <button onClick={fetchGraphData} className="refresh-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="graph-container">
      <div className="graph-canvas-wrapper" onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}>
        <button onClick={fetchGraphData} className="floating-sync-btn" title="Sync memory graph">
          Sync Graph
        </button>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          onMouseMove={handleMouseMove}
          className="graph-svg"
        >
          {/* Node Glow Filters */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Links / Edges */}
          <g className="links-group">
            {links.map((link, idx) => {
              const sourceNode = link.source as GraphNode;
              const targetNode = link.target as GraphNode;
              if (!sourceNode?.x || !targetNode?.x) return null;
              
              return (
                <line
                  key={`${sourceNode.id}-${targetNode.id}-${idx}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  className="graph-link"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes-group">
            {nodes.map((node) => {
              if (!node.x || !node.y) return null;
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const color = getEntityColor(node.type);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={`node-group ${isSelected ? "selected" : ""} ${isHovered ? "hovered" : ""}`}
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    r={isSelected ? 10 : 8}
                    fill={color}
                    style={{ filter: isHovered || isSelected ? "url(#glow)" : "none" }}
                    className="graph-node-circle"
                    onMouseDown={(e) => handleDragStart(e, node)}
                  />
                  <text
                    dy={-14}
                    textAnchor="middle"
                    className="graph-node-text"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Detail Card */}
        {selectedNode && (
          <div className="detail-card">
            <button onClick={() => setSelectedNode(null)} className="close-card-btn">
              &times;
            </button>
            <div className="card-tag" style={{ borderLeftColor: getEntityColor(selectedNode.type) }}>
              {selectedNode.type}
            </div>
            <h3>{selectedNode.label}</h3>
            <p>{selectedNode.description || "No description available for this entity."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
