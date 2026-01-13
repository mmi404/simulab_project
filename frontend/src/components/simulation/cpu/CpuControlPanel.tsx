import React, { useState } from 'react';
import type { Algorithm, Process, SimulationPayload } from '../../../types/cpu';

interface CpuControlPanelProps {
    onRun: (payload: SimulationPayload) => void;
    onReset: () => void;
    isSimulating: boolean;
}

const ALGORITHMS: Algorithm[] = ['FCFS', 'SJF', 'SRTF', 'Priority', 'RR'];

export const CpuControlPanel: React.FC<CpuControlPanelProps> = ({ onRun, onReset, isSimulating }) => {
    const [algorithm, setAlgorithm] = useState<Algorithm>('FCFS');
    const [quantum, setQuantum] = useState<number>(2);
    const [processes, setProcesses] = useState<Process[]>([
        { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 1 },
        { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 2 },
        { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 1 },
    ]);

    const handleAddProcess = () => {
        const newId = `P${processes.length + 1}`;
        setProcesses([...processes, { id: newId, arrivalTime: 0, burstTime: 1, priority: 1 }]);
    };

    const handleRemoveProcess = (index: number) => {
        setProcesses(processes.filter((_, i) => i !== index));
    };

    const handleProcessChange = (index: number, field: keyof Process, value: string | number) => {
        const newProcesses = [...processes];
        newProcesses[index] = { ...newProcesses[index], [field]: value };
        setProcesses(newProcesses);
    };

    const handleSubmit = () => {
        onRun({ algorithm, quantum, processes });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Configuration</h2>

            {/* Algorithm Selection */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Algorithm</label>
                <div className="grid grid-cols-2 gap-2">
                    {ALGORITHMS.map((algo) => (
                        <button
                            key={algo}
                            onClick={() => setAlgorithm(algo)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${algorithm === algo
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            {algo}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantum Input (RR only) */}
            {algorithm === 'RR' && (
                <div className="mb-6 animate-fadeIn">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Time Quantum</label>
                    <input
                        type="number"
                        min="1"
                        value={quantum}
                        onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            )}

            {/* Process Table */}
            <div className="flex-1 overflow-auto mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-600">Processes</label>
                    <button onClick={handleAddProcess} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 border border-green-200">+ Add</button>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="py-2 text-left w-12">ID</th>
                            <th className="py-2 w-16">Arrival</th>
                            <th className="py-2 w-16">Burst</th>
                            <th className="py-2 w-16">Prio</th>
                            <th className="py-2 w-8"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {processes.map((p, i) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="py-2 font-medium text-gray-700">
                                    <input
                                        value={p.id}
                                        onChange={(e) => handleProcessChange(i, 'id', e.target.value)}
                                        className="w-full bg-transparent outline-none"
                                    />
                                </td>
                                <td className="py-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={p.arrivalTime}
                                        onChange={(e) => handleProcessChange(i, 'arrivalTime', parseInt(e.target.value) || 0)}
                                        className="w-full text-center bg-transparent outline-none border rounded border-transparent hover:border-gray-300 focus:border-blue-400"
                                    />
                                </td>
                                <td className="py-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={p.burstTime}
                                        onChange={(e) => handleProcessChange(i, 'burstTime', parseInt(e.target.value) || 1)}
                                        className="w-full text-center bg-transparent outline-none border rounded border-transparent hover:border-gray-300 focus:border-blue-400"
                                    />
                                </td>
                                <td className="py-2">
                                    <input
                                        type="number"
                                        value={p.priority}
                                        onChange={(e) => handleProcessChange(i, 'priority', parseInt(e.target.value) || 0)}
                                        className="w-full text-center bg-transparent outline-none border rounded border-transparent hover:border-gray-300 focus:border-blue-400"
                                    />
                                </td>
                                <td className="py-2 text-right">
                                    <button onClick={() => handleRemoveProcess(i)} className="text-red-400 hover:text-red-600">×</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                    onClick={handleSubmit}
                    disabled={isSimulating}
                    className={`flex-1 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95 ${isSimulating
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                            : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                        }`}
                >
                    {isSimulating ? 'Running...' : 'Run Simulation'}
                </button>
                <button
                    onClick={onReset}
                    className="px-4 py-3 text-gray-600 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};
