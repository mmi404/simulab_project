import React from 'react';
import type { SimulationStep } from '../../../types/cpu';

interface CpuVisualizationProps {
    steps: SimulationStep[];
    currentStepIndex: number;
    gantt: (string | null)[];
    isPlaying: boolean;
}

export const CpuVisualization: React.FC<CpuVisualizationProps> = ({ steps, currentStepIndex, gantt, isPlaying }) => {
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return <div className="h-full flex items-center justify-center text-gray-400">Press Run to Start</div>;

    const { state } = currentStep;
    const time = state.time;
    const running = state.running;

    // Determine history to show
    // If step 0 (Time 0), history is empty.
    // If step 1 (Time 1), history has 0->1 i.e. gantt[0].
    const history = gantt.slice(0, currentStepIndex);

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Visualization</h2>

            {/* Top Area: CPU and Clock */}
            <div className="flex justify-center gap-12 mb-12 items-center">
                {/* CPU Box */}
                <div className={`
                    w-40 h-40 rounded-2xl flex flex-col items-center justify-center border-4 transition-all duration-300 relative
                    ${running ? 'border-green-500 bg-green-50 shadow-green-200 shadow-xl' : 'border-gray-200 bg-gray-50'}
                    ${running && isPlaying ? 'scale-105' : ''}
                `}>
                    <div className="text-gray-400 font-bold mb-2">CPU</div>
                    <div className={`text-4xl font-black ${running ? 'text-green-600' : 'text-gray-300'}`}>
                        {running || "IDLE"}
                    </div>
                    {running && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    )}
                </div>

                {/* Clock */}
                <div className="flex flex-col items-center">
                    <div className="text-6xl font-mono font-bold text-gray-800 mb-2">
                        {String(time).padStart(2, '0')}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Time Units</div>
                </div>
            </div>

            {/* Gantt Chart Area */}
            <div className="flex-1 overflow-x-auto min-h-[100px] flex flex-col">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Gantt Chart (Timeline)</h3>

                {/* Scrollable Container with explicit width management */}
                <div className="flex-1 overflow-x-auto border border-gray-100 rounded-lg bg-gray-50">
                    <div className="flex h-16 min-w-full w-max">
                        {history.map((pid, idx) => (
                            <div
                                key={idx}
                                className={`
                                    h-full flex items-center justify-center border-r border-white/20 text-white font-bold text-sm min-w-[40px] w-10 transition-all animate-fadeIn
                                    ${getColor(pid)}
                                `}
                                title={`Time ${idx}: ${pid || 'Idle'}`}
                            >
                                {pid || '∅'}
                            </div>
                        ))}
                        {/* Spacer to push content if it doesn't fill width, or just be empty */}
                        <div className="flex-1 bg-transparent min-w-[20px]" />
                    </div>
                </div>

                <div className="flex text-xs text-gray-400 mt-1 justify-between px-1 font-mono">
                    <span>0</span>
                    <span>{time}</span>
                </div>
            </div>
        </div>
    );
};

// Helper for consistent colors
const getColor = (pid: string | null) => {
    if (!pid) return 'bg-gray-300';
    const hash = pid.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colors = [
        'bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500',
        'bg-teal-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-emerald-500'
    ];
    return colors[hash % colors.length];
};
