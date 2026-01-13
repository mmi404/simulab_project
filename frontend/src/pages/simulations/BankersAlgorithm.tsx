import React, { useState, useEffect } from 'react';
import BankersControlPanel from '../../components/bankers/BankersControlPanel';
import BankersVisualization from '../../components/bankers/BankersVisualization';
import BankersStatePanel from '../../components/bankers/BankersStatePanel';
import type { BankersState, BankersProcess } from '../../types/bankers';
import api from '../../api/axios';

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
    const [state, setState] = useState<BankersState>({
        resources: DEFAULT_RESOURCES,
        totalInstances: DEFAULT_TOTAL,
        available: [...DEFAULT_TOTAL],
        processes: INITIAL_PROCESSES,
        simulationResult: null,
        currentStepIndex: -1,
    });

    const [speed, setSpeed] = useState(1500);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const newAvailable = [...state.totalInstances];
        state.processes.forEach(p => {
            for (let i = 0; i < state.resources.length; i++) {
                newAvailable[i] -= p.allocation[i];
            }
        });
        if (JSON.stringify(newAvailable) !== JSON.stringify(state.available)) {
            setState(prev => ({ ...prev, available: newAvailable }));
        }
    }, [state.totalInstances, state.processes, state.resources.length]);

    useEffect(() => {
        if (!isPlaying || !state.simulationResult) return;

        const totalSteps = state.simulationResult.steps.length;
        if (state.currentStepIndex > totalSteps) {
            setIsPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
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
                currentStepIndex: 0
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
            <div className="flex-1 p-6 grid grid-cols-12 gap-6 h-full overflow-hidden">
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

                <div className="col-span-6 h-full overflow-hidden">
                    <BankersVisualization state={state} />
                </div>

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
