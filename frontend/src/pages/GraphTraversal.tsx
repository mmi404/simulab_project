import React, { useState, useEffect, useRef } from 'react';
import GraphCanvas from '../components/graph/GraphCanvas';
import GraphControls from '../components/graph/GraphControls';
import StatePanel from '../components/graph/StatePanel';
import { simulateGraphTraversal } from '../services/simulationService';
import type { GraphSimulationResponse, Step } from '../types/graph';

// Local utility types for graph state
interface Node {
    id: string;
    x: number;
    y: number;
}
interface Edge {
    from: string;
    to: string;
}

const GraphTraversal: React.FC = () => {
    // 1. Graph State
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const nextNodeLabel = useRef<number>(0); // 0 -> A, 1 -> B ...

    // 2. Simulation Configuration
    const [algorithm, setAlgorithm] = useState<'BFS' | 'DFS'>('BFS');
    const [startNode, setStartNode] = useState<string>('');

    // 3. Execution State
    const [history, setHistory] = useState<Step[]>([]);
    const [stepIndex, setStepIndex] = useState<number>(-1); // -1 means not started
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // Auto-play interval
    const timerRef = useRef<number | null>(null);

    // Helpers
    const getNextLabel = () => {
        const label = String.fromCharCode(65 + nextNodeLabel.current);
        nextNodeLabel.current += 1;
        return label;
    };

    const isOverlapping = (x: number, y: number) => {
        const threshold = 50; // 2 * Radius(20) + Margin(10)
        return nodes.some(n => Math.hypot(n.x - x, n.y - y) < threshold);
    };

    const handleAddNode = (x: number, y: number) => {
        if (isOverlapping(x, y)) return;
        const id = getNextLabel();
        setNodes(prev => [...prev, { id, x, y }]);
    };

    const handleAddConnectedNode = (x: number, y: number, fromId: string) => {
        if (isOverlapping(x, y)) return;
        const id = getNextLabel();
        setNodes(prev => [...prev, { id, x, y }]);
        setEdges(prev => {
            return [...prev, { from: fromId, to: id }];
        });
    };

    const handleAddEdge = (from: string, to: string) => {
        // Prevent duplicates and self-loops
        if (from === to) return;
        const exists = edges.some(e =>
            (e.from === from && e.to === to) || (e.from === to && e.to === from)
        );
        if (!exists) {
            setEdges(prev => [...prev, { from, to }]);
        }
    };

    const handleClear = () => {
        setNodes([]);
        setEdges([]);
        nextNodeLabel.current = 0;
        handleReset();
    };

    const handleReset = () => {
        setIsRunning(false);
        setStepIndex(-1);
        setHistory([]);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleRun = async () => {
        if (!startNode) return;

        try {
            // Transform edges to array of arrays for backend
            const edgeList = edges.map(e => [e.from, e.to]);
            const nodeList = nodes.map(n => n.id);

            const result: GraphSimulationResponse = await simulateGraphTraversal({
                algorithm,
                start: startNode,
                nodes: nodeList,
                edges: edgeList
            });

            console.log("Simulation Result:", result);

            setHistory(result.steps);
            setStepIndex(0);
            setIsRunning(true);

            // Auto-play logic
            if (timerRef.current) clearInterval(timerRef.current);

            timerRef.current = window.setInterval(() => {
                setStepIndex(prev => {
                    const next = prev + 1;
                    if (next >= result.steps.length) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setIsRunning(false);
                        return prev;
                    }
                    return next;
                });
            }, 1000);

        } catch (error) {
            console.error("Simulation failed:", error);
            alert("Simulation failed. Check console.");
        }
    };

    const handleStep = () => {
        if (stepIndex < history.length - 1) {
            setStepIndex(prev => prev + 1);
        }
    };

    // Cleanup timer
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Derived state for Visualization
    const currentStep = stepIndex >= 0 && stepIndex < history.length ? history[stepIndex] : null;
    const currentNode = currentStep ? currentStep.current : null;
    const currentVisited = currentStep ? currentStep.visited : [];
    const currentFrontier = currentStep ? currentStep.frontier : [];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col font-sans">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Graph Traversal Simulation
                    </h1>
                    <p className="text-slate-500 mt-1">Interactive BFS & DFS Visualization</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                    <div>Nodes: {nodes.length}</div>
                    <div>Edges: {edges.length}</div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
                {/* Left: Controls */}
                <div className="lg:col-span-1 h-full">
                    <GraphControls
                        algorithm={algorithm}
                        setAlgorithm={setAlgorithm}
                        startNode={startNode}
                        setStartNode={setStartNode}
                        nodeOptions={nodes.map(n => n.id)}
                        onRun={handleRun}
                        onReset={handleReset}
                        onClear={handleClear}
                        onStep={handleStep}
                        isRunning={isRunning}
                        isFinished={stepIndex >= 0 && stepIndex === history.length - 1}
                    />
                </div>

                {/* Center: Visualization */}
                <div className="lg:col-span-2 h-full flex flex-col">
                    <GraphCanvas
                        nodes={nodes}
                        edges={edges}
                        onAddNode={handleAddNode}
                        onAddConnectedNode={handleAddConnectedNode}
                        onAddEdge={handleAddEdge}
                        current={currentNode}
                        visited={currentVisited}
                        frontier={currentFrontier}
                        readOnly={stepIndex >= 0} // Disable editing during simulation
                    />
                </div>

                {/* Right: State Panel */}
                <div className="lg:col-span-1 h-full">
                    <StatePanel
                        current={currentNode}
                        visited={currentVisited}
                        frontier={currentFrontier}
                        algorithm={algorithm}
                        order={currentVisited}
                    />
                </div>
            </div>
        </div>
    );
};

export default GraphTraversal;