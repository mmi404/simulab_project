import React from 'react';
import type { SimulationStep, Process } from '../../../types/cpu';

interface CpuStatePanelProps {
    steps: SimulationStep[];
    currentStepIndex: number;
    processes: Process[];
}

export const CpuStatePanel: React.FC<CpuStatePanelProps> = ({ steps, currentStepIndex, processes }) => {
    const currentStep = steps[currentStepIndex];

    if (!currentStep) return <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center text-gray-400">No Data</div>;

    const { state } = currentStep;
    const { running, readyQueue, remaining } = state;

    const getStatus = (p: Process) => {
        if (running === p.id) return { label: 'Running', color: 'text-green-600 bg-green-50 border-green-200' };
        if (readyQueue.includes(p.id)) return { label: 'Ready', color: 'text-blue-600 bg-blue-50 border-blue-200' };

        // Check remaining. If ID not in remaining, it's completed (assuming backend filters > 0)
        // BUT we need to check if it has arrived.
        // If remaining has it, it hasn't completed.
        if (Object.prototype.hasOwnProperty.call(remaining, p.id)) {
            // It is in remaining, so not completed.
            // If not ready and not running, and stored in remaining -> Not Arrived yet?
            // "readyQueue" contains processes from arrival.
            // So yes, Future.
            return { label: 'Waiting (Future)', color: 'text-gray-500 bg-gray-50 border-gray-200' };
        }

        // Not in remaining -> Completed.
        return { label: 'Completed', color: 'text-purple-600 bg-purple-50 border-purple-200' };
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">State Monitor</h2>

            {/* Ready Queue Visualization */}
            <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ready Queue</h3>
                <div className="min-h-[50px] bg-gray-50 rounded-lg p-2 flex gap-2 overflow-x-auto border border-gray-100 items-center">
                    {readyQueue.length === 0 ? (
                        <span className="text-gray-300 text-sm italic w-full text-center">Empty</span>
                    ) : (
                        readyQueue.map((pid: string) => (
                            <div key={pid} className="w-10 h-10 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center font-bold text-blue-600 shadow-sm shrink-0 animate-popIn">
                                {pid}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Process List Status */}
            <div className="flex-1 overflow-auto">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Process Details</h3>
                <div className="space-y-2">
                    {processes.map(p => {
                        const status = getStatus(p);
                        const rem = remaining[p.id] ?? 0;
                        const progress = Math.max(0, Math.min(100, ((p.burstTime - rem) / p.burstTime) * 100));

                        return (
                            <div key={p.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-gray-700">{p.id}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Burst: {p.burstTime}</span>
                                    <span>Rem: {rem}</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
