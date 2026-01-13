import React, { useState, useEffect, useRef } from 'react';
import { CpuControlPanel } from '../../components/simulation/cpu/CpuControlPanel';
import { CpuVisualization } from '../../components/simulation/cpu/CpuVisualization';
import { CpuStatePanel } from '../../components/simulation/cpu/CpuStatePanel';
import { cpuService } from '../../services/cpuService';
import type { SimulationPayload, SimulationResult, Process } from '../../types/cpu';

export const CpuScheduling: React.FC = () => {
    // Simulation State
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [processes, setProcesses] = useState<Process[]>([]); // To pass to StatePanel

    // Playback State
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(1000); // ms per step

    const timerRef = useRef<number | null>(null);

    // Auto-advance
    useEffect(() => {
        if (isPlaying && result) {
            timerRef.current = window.setInterval(() => {
                setCurrentStepIndex(prev => {
                    if (prev < result.steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, speed);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, result, speed]);

    const handleRun = async (payload: SimulationPayload) => {
        try {
            setIsPlaying(false);
            setProcesses(payload.processes); // Store for visualization
            const data = await cpuService.simulate(payload);
            setResult(data);
            setCurrentStepIndex(0);
            setIsPlaying(true);
        } catch (error) {
            console.error(error);
            alert('Simulation failed. Check console.');
        }
    };

    const handleReset = () => {
        setIsPlaying(false);
        setResult(null);
        setCurrentStepIndex(0);
    };

    const handleStepForward = () => {
        if (result && currentStepIndex < result.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handleStepBack = () => {
        if (result && currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        CPU
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">CPU Scheduling</h1>
                        <p className="text-xs text-gray-500 font-medium">Interactive OS Simulator</p>
                    </div>
                </div>

                {/* Playback Controls (Only if result exists) */}
                {result && (
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setCurrentStepIndex(0)} className="p-2 hover:bg-white rounded-md transition text-gray-600">⏮</button>
                        <button onClick={handleStepBack} className="p-2 hover:bg-white rounded-md transition text-gray-600">◀</button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="px-4 py-2 bg-white rounded-md shadow-sm font-bold text-indigo-600 min-w-[80px]"
                        >
                            {isPlaying ? 'PAUSE' : 'PLAY'}
                        </button>
                        <button onClick={handleStepForward} className="p-2 hover:bg-white rounded-md transition text-gray-600">▶</button>
                        <button onClick={() => setCurrentStepIndex(result.steps.length - 1)} className="p-2 hover:bg-white rounded-md transition text-gray-600">⏭</button>

                        <div className="h-4 w-px bg-gray-300 mx-2" />

                        <select
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="bg-transparent text-xs font-bold text-gray-600 outline-none"
                        >
                            <option value={2000}>0.5x</option>
                            <option value={1000}>1.0x</option>
                            <option value={500}>2.0x</option>
                            <option value={200}>5.0x</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Main Grid Layout */}
            <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] mx-auto w-full">

                {/* Left: Input/Controls (3 cols) */}
                <div className="lg:col-span-3 min-h-[500px]">
                    <CpuControlPanel
                        onRun={handleRun}
                        onReset={handleReset}
                        isSimulating={!!result}
                    />
                </div>

                {/* Center: Visualization (6 cols) */}
                <div className="lg:col-span-6 min-h-[500px]">
                    {result ? (
                        <CpuVisualization
                            steps={result.steps}
                            gantt={result.gantt}
                            currentStepIndex={currentStepIndex}
                            isPlaying={isPlaying}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 text-gray-400 p-12 text-center">
                            <div className="text-6xl mb-4 opacity-20">⚙️</div>
                            <h3 className="text-xl font-bold mb-2">Ready to Simulate</h3>
                            <p className="max-w-xs">Configure your processes and algorithm on the left, then click Run to see the scheduling in action.</p>
                        </div>
                    )}
                </div>

                {/* Right: State Panel (3 cols) */}
                <div className="lg:col-span-3 min-h-[500px]">
                    {result ? (
                        <CpuStatePanel
                            steps={result.steps}
                            currentStepIndex={currentStepIndex}
                            processes={processes}
                        />
                    ) : (
                        <div className="h-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                            Waiting for visualization...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
