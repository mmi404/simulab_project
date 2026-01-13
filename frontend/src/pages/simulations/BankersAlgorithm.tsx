import React, { useState, useEffect } from 'react';
import BankersControlPanel from '../../components/bankers/BankersControlPanel';
import BankersVisualization from '../../components/bankers/BankersVisualization';
import BankersStatePanel from '../../components/bankers/BankersStatePanel';
import type { BankersState, BankersProcess } from '../../types/bankers';
import api from '../../api/axios';

// Initial default state
const DEFAULT_RESOURCES = ["R1", "R2", "R3"];
const DEFAULT_TOTAL = [10, 5, 7];

const INITIAL_PROCESSES: BankersProcess[] = [
    { id: 'P0', allocation: [0, 1, 0], max: [7, 5, 3] },
    { id: 'P1', allocation: [2, 0, 0], max: [3, 2, 2] },
    { id: 'P2', allocation: [3, 0, 2], max: [9, 0, 2] },
    { id: 'P3', allocation: [2, 1, 1], max: [2, 2, 2] },
    { id: 'P4', allocation: [0, 0, 2], max: [4, 3, 3] },
];

export const BankersAlgorithm: React.FC = () => {
    // Defines the entire simulation state
    const [state, setState] = useState<BankersState>({
        resources: DEFAULT_RESOURCES,
        totalInstances: DEFAULT_TOTAL,
        available: [...DEFAULT_TOTAL], // Initially no allocation, so available = total
        processes: INITIAL_PROCESSES,
        simulationResult: null,
        currentStepIndex: -1,
    });

    // Playback Speed (ms)
    const [speed, setSpeed] = useState(1500);
    const [isPlaying, setIsPlaying] = useState(false);

    // Auto-compute available whenever total or allocation changes
    useEffect(() => {
        const newAvailable = [...state.totalInstances];
        state.processes.forEach(p => {
            for (let i = 0; i < state.resources.length; i++) {
                newAvailable[i] -= p.allocation[i];
            }
        });
        // Only update if actually different to avoid loops, though React batching helps
        if (JSON.stringify(newAvailable) !== JSON.stringify(state.available)) {
            setState(prev => ({ ...prev, available: newAvailable }));
        }
    }, [state.totalInstances, state.processes, state.resources.length]);


    // Playback Logic
    // We use a ref to track if we should continue playing, to avoid closure staleness issues with simple intervals
    // or we just use a recursive effect dependent on currentStepIndex?
    // A recursive timeout is safest for variable speed.
    useEffect(() => {
        if (!isPlaying || !state.simulationResult) return;

        const totalSteps = state.simulationResult.steps.length;
        if (state.currentStepIndex > totalSteps) {
            setIsPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
            // Check if we are done
            if (state.currentStepIndex >= totalSteps) { // if matches totalSteps, we just showed the "done" state, so we can stop? 
                // actually our logic allows index to go to totalSteps (one past last index) for "Finished" view
            }

            setState(prev => {
                if (prev.currentStepIndex >= totalSteps) {
                    setIsPlaying(false);
                    return prev;
                }
                return { ...prev, currentStepIndex: prev.currentStepIndex + 1 };
            });

        }, speed);

        return () => clearTimeout(timer);
    }, [state.currentStepIndex, isPlaying, speed, state.simulationResult]);


    const handleRunSafety = async () => {
        // Construct the request payload
        const allocationMap: Record<string, number[]> = {};
        const maxMap: Record<string, number[]> = {};

        state.processes.forEach(p => {
            allocationMap[p.id] = p.allocation;
            maxMap[p.id] = p.max;
        });

        const payload = {
            available: state.available,
            allocation: allocationMap,
            max: maxMap
        };

        try {
            const response = await api.post('/simulate/bankers/safety', payload);

            const result = response.data;

            setState(prev => ({
                ...prev,
                simulationResult: result,
                currentStepIndex: 0 // Start immediately at first step
            }));

            setIsPlaying(true);

        } catch (error) {
            console.error("Simulation failed:", error);
            alert("Failed to run simulation. Ensure backend is running.");
        }
    };

    const handleReset = () => {
        setIsPlaying(false);
        setState({
            resources: DEFAULT_RESOURCES,
            totalInstances: DEFAULT_TOTAL,
            available: [...DEFAULT_TOTAL],
            processes: INITIAL_PROCESSES,
            simulationResult: null,
            currentStepIndex: -1,
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            {/* Header / Title if needed, or Main Content Area */}
            <div className="flex-1 p-6 grid grid-cols-12 gap-6 h-full overflow-hidden">
                {/* Left Panel: Controls */}
                <div className="col-span-3 h-full overflow-hidden">
                    <BankersControlPanel
                        config={state}
                        onConfigChange={setState}
                        onRun={handleRunSafety}
                        onReset={handleReset}
                        speed={speed}
                        onSpeedChange={setSpeed}
                    />
                </div>

                {/* Center Panel: Visualization */}
                <div className="col-span-6 h-full overflow-hidden">
                    <BankersVisualization state={state} />
                </div>

                {/* Right Panel: State Results */}
                <div className="col-span-3 h-full overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-bold text-gray-800">Simulation State</h2>
                    </div>
                    <BankersStatePanel state={state} />
                </div>
            </div>
        </div>
    );
};

export default BankersAlgorithm;
