import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeadlockControlPanel from '../../components/deadlock/DeadlockControlPanel';
import RAGVisualization from '../../components/deadlock/RAGVisualization';
import { detectDeadlock } from '../../services/simulationService';

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

const DeadlockDetection: React.FC = () => {
    const [processes, setProcesses] = useState<string[]>(['P1', 'P2']);
    const [resources, setResources] = useState<string[]>(['R1', 'R2']);
    const [edges, setEdges] = useState<Edge[]>([
        { from: 'P1', to: 'R1', type: 'REQUEST' },
        { from: 'R1', to: 'P2', type: 'ALLOCATED' }
    ]);

    const [steps, setSteps] = useState<Step[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [cycle, setCycle] = useState<string[]>([]);
    const [deadlockDetected, setDeadlockDetected] = useState<boolean | undefined>(undefined);
    const [isSimulating, setIsSimulating] = useState(false);

    const [simulationSpeed, setSimulationSpeed] = useState(1000);

    // Auto-play steps
    useEffect(() => {
        if (steps.length > 0 && currentStepIndex < steps.length - 1 && isSimulating) {
            const timer = setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, simulationSpeed);
            return () => clearTimeout(timer);
        } else if (steps.length > 0 && currentStepIndex === steps.length - 1) {
            setIsSimulating(false);
        }
    }, [steps, currentStepIndex, isSimulating, simulationSpeed]);

    const handleAddProcess = () => {
        const nextId = processes.length + 1;
        setProcesses([...processes, `P${nextId}`]);
    };

    const handleAddResource = () => {
        const nextId = resources.length + 1;
        setResources([...resources, `R${nextId}`]);
    };

    const handleRemoveProcess = (id: string) => {
        setProcesses(processes.filter(p => p !== id));
        setEdges(edges.filter(e => e.from !== id && e.to !== id));
    };

    const handleRemoveResource = (id: string) => {
        setResources(resources.filter(r => r !== id));
        setEdges(edges.filter(e => e.from !== id && e.to !== id));
    };

    const handleAddEdge = (edge: Edge) => {
        // Avoid duplicates
        if (edges.some(e => e.from === edge.from && e.to === edge.to)) return;
        setEdges([...edges, edge]);
    };

    const handleRemoveEdge = (index: number) => {
        setEdges(edges.filter((_, i) => i !== index));
    };

    const runDetection = async () => {
        setSteps([]);
        setCycle([]);
        setDeadlockDetected(undefined);
        setCurrentStepIndex(-1);
        setIsSimulating(true);

        try {
            const result = await detectDeadlock(processes, resources, edges);
            console.log("Simulation Result:", result);

            if (!result || !result.steps || result.steps.length === 0) {
                console.warn("No steps returned from simulation backend.");
                alert("Simulation returned no steps. Check backend logs.");
                setIsSimulating(false);
                return;
            }

            setSteps(result.steps);
            setCycle(result.cycle || []);
            setDeadlockDetected(result.deadlockDetected);

            // Start animation
            setCurrentStepIndex(0);

        } catch (error) {
            console.error("Simulation failed", error);
            alert("Simulation failed. See console for details.");
            setIsSimulating(false);
        }
    };

    const reset = () => {
        setProcesses(['P1', 'P2']);
        setResources(['R1', 'R2']);
        setEdges([
            { from: 'P1', to: 'R1', type: 'REQUEST' },
            { from: 'R1', to: 'P2', type: 'ALLOCATED' }
        ]);
        setSteps([]);
        setCycle([]);
        setDeadlockDetected(undefined);
        setCurrentStepIndex(-1);
        setIsSimulating(false);
    };

    return (
        <div className="h-full flex flex-col bg-[#0F1116] text-white font-sans selection:bg-blue-500/30">
            {/* Header */}
            <header className="border-b border-white/10 bg-[#0F1116]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/explore" className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Deadlock Detection
                            </h1>
                            <span className="text-xs text-gray-500">Resource Allocation Graph (RAG) Simulation</span>
                        </div>
                    </div>
                    {/* Speed Control */}
                    <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <span className="text-xs text-gray-400">Speed:</span>
                        <input
                            type="range"
                            min="200"
                            max="2000"
                            step="100"
                            value={simulationSpeed}
                            onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                            className="w-24 accent-blue-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-mono w-12 text-right">{simulationSpeed}ms</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 flex-1 min-h-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    {/* Left Panel: Configuration (Full Height) */}
                    <div className="lg:col-span-3 h-full overflow-hidden">
                        <DeadlockControlPanel
                            processes={processes}
                            resources={resources}
                            edges={edges}
                            onAddProcess={handleAddProcess}
                            onAddResource={handleAddResource}
                            onRemoveProcess={handleRemoveProcess}
                            onRemoveResource={handleRemoveResource}
                            onAddEdge={handleAddEdge}
                            onRemoveEdge={handleRemoveEdge}
                            onRunDetection={runDetection}
                            onReset={reset}
                            isSimulating={isSimulating}
                        />
                    </div>

                    {/* Center: Visualization */}
                    <div className="lg:col-span-6 h-full flex flex-col gap-4 overflow-hidden">
                        <div className="flex-grow min-h-0 relative">
                            <RAGVisualization
                                processes={processes}
                                resources={resources}
                                edges={edges}
                                currentStep={currentStepIndex >= 0 ? steps[currentStepIndex] : undefined}
                                cycle={deadlockDetected && steps.length > 0 && currentStepIndex === steps.length - 1 ? cycle : undefined}
                                deadlockDetected={currentStepIndex === steps.length - 1 ? deadlockDetected : undefined}
                                onEdgeCreate={handleAddEdge}
                            />
                        </div>

                        {/* Persistent Result Banner */}
                        {steps.length > 0 && currentStepIndex === steps.length - 1 && (
                            <div className={`p-4 rounded-xl border flex items-center justify-center gap-3 shadow-2xl ${deadlockDetected ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}>
                                <span className="text-2xl">{deadlockDetected ? '⚠️' : '✅'}</span>
                                <div>
                                    <h3 className="font-bold text-lg">{deadlockDetected ? 'Deadlock Detected' : 'Safety Verified'}</h3>
                                    <p className="text-sm opacity-80">{deadlockDetected ? 'A cyclic dependency was found in the Resource Allocation Graph.' : 'No cycles found. The system is in a safe state.'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Execution Log (Full Height) */}
                    <div className="lg:col-span-3 h-full overflow-hidden">
                        <div className="h-full bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col overflow-hidden">
                            <h3 className="text-sm font-semibold text-gray-300 mb-2 border-b border-white/10 pb-2">Execution Log</h3>
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 text-xs font-mono">
                                {steps
                                    .slice(0, currentStepIndex + 1)
                                    .reverse()
                                    .map((step, reverseIdx) => {
                                        const originalIdx = currentStepIndex - reverseIdx;
                                        return (
                                            <div
                                                key={originalIdx}
                                                className={`p-2 rounded border border-l-4 ${originalIdx === currentStepIndex ? 'bg-blue-500/10 border-blue-500 border-l-blue-500 text-blue-200' : 'bg-transparent border-transparent border-l-gray-600 text-gray-500'}`}
                                            >
                                                <div className="flex justify-between opacity-70 mb-0.5">
                                                    <span>Step {originalIdx + 1}</span>
                                                    <span>{step.currentNode}</span>
                                                </div>
                                                <div>{step.action}</div>
                                            </div>
                                        );
                                    })}
                                {steps.length === 0 && <div className="text-gray-600 italic">No steps yet...</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DeadlockDetection;
