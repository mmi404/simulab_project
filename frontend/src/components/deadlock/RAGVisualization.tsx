import React, { useEffect, useRef } from 'react';

interface Edge {
    from: string;
    to: string;
    type: 'REQUEST' | 'ALLOCATED';
}

interface Step {
    currentNode: string;
    visited: string[];
    recursionStack: string[];
    action: string;
}

interface RAGVisualizationProps {
    processes: string[];
    resources: string[];
    edges: Edge[];
    currentStep?: Step;
    cycle?: string[];
    deadlockDetected?: boolean;
    onEdgeCreate?: (edge: Edge) => void;
}

const RAGVisualization: React.FC<RAGVisualizationProps> = ({
    processes,
    resources,
    edges,
    currentStep,
    cycle,
    onEdgeCreate
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dragStartNode, setDragStartNode] = React.useState<string | null>(null);
    const [dragCurrentPos, setDragCurrentPos] = React.useState<{ x: number, y: number } | null>(null);
    const nodePositionsRef = useRef<Map<string, { x: number, y: number, r: number }>>(new Map());

    const getClickedNode = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        for (const [node, pos] of nodePositionsRef.current.entries()) {
            if (Math.abs(x - pos.x) <= pos.r && Math.abs(y - pos.y) <= pos.r) {
                return node;
            }
        }
        return null;
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!onEdgeCreate) return;
        const clickedNode = getClickedNode(e.clientX, e.clientY);
        if (clickedNode) {
            setDragStartNode(clickedNode);
            const pos = nodePositionsRef.current.get(clickedNode);
            if (pos) {
                setDragCurrentPos({ x: pos.x, y: pos.y });
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!dragStartNode || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setDragCurrentPos({ x, y });
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (dragStartNode) {
            const droppedNode = getClickedNode(e.clientX, e.clientY);

            if (droppedNode && droppedNode !== dragStartNode) {
                const isProcess1 = processes.includes(dragStartNode);
                const isProcess2 = processes.includes(droppedNode);
                const isResource1 = resources.includes(dragStartNode);
                const isResource2 = resources.includes(droppedNode);

                if ((isProcess1 && isResource2) || (isResource1 && isProcess2)) {
                    let from, to;
                    let type: 'REQUEST' | 'ALLOCATED';

                    if (isProcess1) {
                        from = dragStartNode;
                        to = droppedNode;
                        type = 'REQUEST';
                    } else {
                        from = dragStartNode;
                        to = droppedNode;
                        type = 'ALLOCATED';
                    }
                    onEdgeCreate?.({ from, to, type });
                }
            }
            setDragStartNode(null);
            setDragCurrentPos(null);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            const rect = canvas.getBoundingClientRect();
            if (canvas.width !== rect.width || canvas.height !== rect.height) {
                canvas.width = rect.width;
                canvas.height = rect.height;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const width = canvas.width;
            const height = canvas.height;
            const nodeCoordinates: Record<string, { x: number, y: number }> = {};

            nodePositionsRef.current.clear();

            const maxNodes = Math.max(processes.length, resources.length, 1);
            const dynamicGap = height / (maxNodes + 1);
            const nodeRadius = Math.min(30, Math.max(12, dynamicGap * 0.35));

            const processX = width * 0.2;
            const processGap = height / (processes.length + 1);
            processes.forEach((p, idx) => {
                const x = processX;
                const y = processGap * (idx + 1);
                nodeCoordinates[p] = { x, y };
                nodePositionsRef.current.set(p, { x, y, r: nodeRadius });
            });

            const resourceX = width * 0.8;
            const resourceGap = height / (resources.length + 1);
            resources.forEach((r, idx) => {
                const x = resourceX;
                const y = resourceGap * (idx + 1);
                nodeCoordinates[r] = { x, y };
                nodePositionsRef.current.set(r, { x, y, r: nodeRadius });
            });

            drawEdges(ctx, nodeCoordinates, nodeRadius);

            if (dragStartNode && dragCurrentPos && nodeCoordinates[dragStartNode]) {
                const start = nodeCoordinates[dragStartNode];
                drawArrow(ctx, start.x, start.y, dragCurrentPos.x, dragCurrentPos.y, '#ffffff', 2, 0);
            }

            drawNodes(ctx, nodeCoordinates, nodeRadius);
        };

        const drawEdges = (ctx: CanvasRenderingContext2D, nodeCoordinates: Record<string, { x: number, y: number }>, nodeRadius: number) => {
            const cycleEdgeSet = new Set<string>();
            if (cycle && cycle.length > 1) {
                for (let i = 0; i < cycle.length - 1; i++) {
                    cycleEdgeSet.add(`${cycle[i]}->${cycle[i + 1]}`);
                }
            }

            edges.forEach(edge => {
                const start = nodeCoordinates[edge.from];
                const end = nodeCoordinates[edge.to];
                if (!start || !end) return;

                const edgeKey = `${edge.from}->${edge.to}`;
                const isCycleEdge = cycleEdgeSet.has(edgeKey);

                let color = '#4B5563';
                let lineWidth = 2;
                if (isCycleEdge) {
                    color = '#EF4444';
                    lineWidth = 4;
                }

                drawArrow(ctx, start.x, start.y, end.x, end.y, color, lineWidth, nodeRadius);
            });
        };

        const drawNodes = (ctx: CanvasRenderingContext2D, nodeCoordinates: Record<string, { x: number, y: number }>, radius: number) => {
            const allNodes = [...processes, ...resources];
            allNodes.forEach(node => {
                const coord = nodeCoordinates[node];
                if (!coord) return;
                const { x, y } = coord;
                const isProcess = processes.includes(node);

                ctx.beginPath();
                if (isProcess) {
                    ctx.arc(x, y, radius, 0, 2 * Math.PI);
                } else {
                    ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
                }

                let fillStyle = isProcess ? '#1E3A8A' : '#581C87';

                if (node === dragStartNode) {
                    fillStyle = '#ffff00';
                    ctx.shadowColor = 'rgba(255, 255, 0, 0.5)';
                    ctx.shadowBlur = 15;
                } else {
                    ctx.shadowBlur = 0;
                }

                if (currentStep) {
                    if (currentStep.currentNode === node) fillStyle = '#F59E0B';
                    else if (currentStep.recursionStack.includes(node)) fillStyle = '#B45309';
                    else if (currentStep.visited.includes(node)) fillStyle = '#065F46';
                }
                if (cycle && cycle.includes(node)) fillStyle = '#EF4444';

                ctx.fillStyle = fillStyle;
                ctx.fill();

                ctx.strokeStyle = node === dragStartNode ? '#FFFFFF' : '#E5E7EB';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.shadowBlur = 0;

                ctx.fillStyle = (node === dragStartNode) ? '#000' : '#F3F4F6';
                ctx.font = 'bold 14px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(node, x, y);
            });
        };

        render();
        const parent = canvas.parentElement;
        if (!parent) return;
        const resizeObserver = new ResizeObserver(() => render());
        resizeObserver.observe(parent);
        return () => resizeObserver.disconnect();
    }, [processes, resources, edges, currentStep, cycle, dragStartNode, dragCurrentPos, onEdgeCreate]);

    const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, width: number, nodeRadius: number) => {
        const headlen = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const stopDistance = nodeRadius + 5;
        const endX = toX - stopDistance * Math.cos(angle);
        const endY = toY - stopDistance * Math.sin(angle);
        const startX = fromX + stopDistance * Math.cos(angle);
        const startY = fromY + stopDistance * Math.sin(angle);

        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.fill();
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-black/20 rounded-xl border border-white/10 p-4 relative overflow-hidden">
            <canvas
                ref={canvasRef}
                className={`w-full h-full block ${onEdgeCreate ? 'cursor-pointer' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => { setDragStartNode(null); setDragCurrentPos(null); }}
            />

            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-white/10 text-[10px] text-gray-300 space-y-1.5 pointer-events-none">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-900 border border-white/50"></span> Process</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-purple-900 border border-white/50"></span> Resource</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Current</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-800"></span> Visited</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Deadlock</div>
                <div className="pt-1.5 border-t border-white/10 grid grid-cols-1 gap-1">
                    <div className="flex items-center gap-2"><span className="w-6 h-0.5 bg-gray-500"></span> Request</div>
                    <div className="flex items-center gap-2"><span className="w-6 h-0.5 bg-gray-500"></span> Allocated</div>
                </div>
            </div>
        </div>
    );
};

export default RAGVisualization;