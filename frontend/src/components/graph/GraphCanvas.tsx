import React, { useRef, useState } from 'react';

interface Node {
    id: string;
    x: number;
    y: number;
}

interface Edge {
    from: string;
    to: string;
}

interface GraphCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onAddNode: (x: number, y: number) => void;
    onAddConnectedNode?: (x: number, y: number, fromId: string) => void;
    onAddEdge: (from: string, to: string) => void;
    current: string | null;
    visited: string[];
    frontier: string[];
    readOnly?: boolean;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
    nodes,
    edges,
    onAddNode,
    onAddConnectedNode,
    onAddEdge,
    current,
    visited,
    frontier,
    readOnly = false
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [draggingNode, setDraggingNode] = useState<string | null>(null);
    const [drawingEdgeStart, setDrawingEdgeStart] = useState<{ id: string, x: number, y: number } | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    // Handle SVG Click to add node
    const handleSvgClick = (e: React.MouseEvent) => {
        if (readOnly) return;
        if (draggingNode || drawingEdgeStart) return;

        // Prevent adding node if clicking on existing node (handled by stopPropagation)
        // But for safety:
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
            onAddNode(e.clientX - rect.left, e.clientY - rect.top);
        }
    };

    const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string, x: number, y: number) => {
        if (readOnly) return;
        e.stopPropagation();
        // Start drawing edge on right click or shift click? 
        // Or drag from edge of node? 
        // Let's use Shift+Drag for edge creation, Simple Drag for moving? 
        // Or mimic Banker's: Click node (select source), click another (target).
        // Let's try Drag-and-Drop for edges:
        // If clicking center -> Move?
        // If clicking outer ring -> Edge? 

        // Simpler: Left Click Drag = Move Node. 
        // Right Click Drag or Shift+Left Drag = Create Edge.

        if (e.shiftKey || e.button === 2) {
            setDrawingEdgeStart({ id: nodeId, x, y });
        } else {
            // For now just implementation of "Move" logic would require lifting state up more complexly 
            // (setNodes). If we strictly follow "Drag and Drop Edge Add as like we did in Banker", 
            // actually Banker's was click-click. 
            // User prompt: "use drag and drop edge add".
            // So: MouseDown on Node -> Start Dragging Line -> MouseUp on Node -> Add Edge.
            setDrawingEdgeStart({ id: nodeId, x, y });
        }
    };

    // We need to track mouse move for the temporary edge line
    const handleMouseMove = (e: React.MouseEvent) => {
        if (readOnly) return;
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const handleNodeMouseUp = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        if (drawingEdgeStart && drawingEdgeStart.id !== nodeId) {
            onAddEdge(drawingEdgeStart.id, nodeId);
            setDrawingEdgeStart(null);
        }
    };

    const handleSvgMouseUp = (e: React.MouseEvent) => {
        if (drawingEdgeStart && onAddConnectedNode && svgRef.current) {
            // If dragging edge and released on empty space -> Create Connected Node
            const rect = svgRef.current.getBoundingClientRect();
            onAddConnectedNode(e.clientX - rect.left, e.clientY - rect.top, drawingEdgeStart.id);
        }
        setDrawingEdgeStart(null);
        setDraggingNode(null);
    };

    // Prevent context menu on right click
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-700 overflow-hidden relative shadow-inner">
            <svg
                ref={svgRef}
                className="w-full h-full cursor-crosshair"
                onClick={handleSvgClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleSvgMouseUp}
                onContextMenu={handleContextMenu}
            >
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                    </marker>
                </defs>

                {/* Edges */}
                {edges.map((edge, idx) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;

                    return (
                        <line
                            key={`${edge.from}-${edge.to}-${idx}`}
                            x1={fromNode.x} y1={fromNode.y}
                            x2={toNode.x} y2={toNode.y}
                            stroke="#64748b"
                            strokeWidth="2"
                            strokeOpacity="0.6"
                        />
                    );
                })}

                {/* Dragging Line */}
                {drawingEdgeStart && (
                    <line
                        x1={drawingEdgeStart.x} y1={drawingEdgeStart.y}
                        x2={mousePos.x} y2={mousePos.y}
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                    />
                )}

                {/* Nodes */}
                {nodes.map(node => {
                    let fill = "#1e293b"; // Default slate-800
                    let stroke = "#94a3b8"; // Default slate-400
                    let strokeWidth = "2";

                    if (current === node.id) {
                        fill = "#3b82f6"; // Blue-500
                        stroke = "#bfdbfe"; // Blue-200
                        strokeWidth = "3";
                    } else if (visited.includes(node.id)) {
                        fill = "#22c55e"; // Green-500
                        stroke = "#86efac"; // Green-300
                    } else if (frontier.includes(node.id)) {
                        fill = "#eab308"; // Yellow-500
                        stroke = "#fef08a"; // Yellow-200
                    }

                    return (
                        <g
                            key={node.id}
                            transform={`translate(${node.x}, ${node.y})`}
                            onMouseDown={(e) => handleNodeMouseDown(e, node.id, node.x, node.y)}
                            onMouseUp={(e) => handleNodeMouseUp(e, node.id)}
                            onClick={(e) => e.stopPropagation()} // Prevent bubble to SVG click
                            className="cursor-pointer transition-all duration-300 ease-in-out"
                        >
                            <circle
                                r="20"
                                fill={fill}
                                stroke={stroke}
                                strokeWidth={strokeWidth}
                                className="shadow-lg hover:filter hover:brightness-110"
                            />
                            <text
                                dy=".3em"
                                textAnchor="middle"
                                fill="white"
                                fontSize="14"
                                fontWeight="bold"
                                pointerEvents="none"
                            >
                                {node.id}
                            </text>

                            {/* Hover ring (invisible hit area extension or visual) */}
                        </g>
                    );
                })}
            </svg>

            {!readOnly && (
                <div className="absolute top-4 left-4 bg-slate-800/80 p-3 rounded text-xs text-slate-300 pointer-events-none backdrop-blur-sm">
                    <p>Expected Interactions:</p>
                    <ul className="list-disc ml-4 mt-1 space-y-1">
                        <li>Click empty space to add Node</li>
                        <li>Drag from Node to Node to add Edge</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GraphCanvas;