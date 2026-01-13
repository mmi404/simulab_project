import React from 'react';
import type { BankersState } from '../../types/bankers';
import { Plus, Trash2, Play, RotateCcw } from 'lucide-react';

interface BankersControlPanelProps {
    config: BankersState;
    onConfigChange: (newConfig: BankersState) => void;
    onRun: () => void;
    onReset: () => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
}

const BankersControlPanel: React.FC<BankersControlPanelProps> = ({ config, onConfigChange, onRun, onReset, speed, onSpeedChange }) => {

    const updateAvailable = (state: BankersState): BankersState => {
        const newAvailable = [...state.totalInstances];
        state.processes.forEach(p => {
            for (let i = 0; i < state.resources.length; i++) {
                newAvailable[i] -= p.allocation[i];
            }
        });
        return { ...state, available: newAvailable };
    };

    const updateConfig = (newState: BankersState) => {
        onConfigChange(updateAvailable(newState));
    };

    const handleTotalInstancesChange = (index: number, value: number) => {
        const newTotal = [...config.totalInstances];
        newTotal[index] = value;
        const newConfig = { ...config, totalInstances: newTotal };
        updateConfig(newConfig);
    };

    const handleProcessChange = (procIndex: number, field: 'allocation' | 'max', resIndex: number, value: number) => {
        const newProcesses = [...config.processes];
        const proc = { ...newProcesses[procIndex] };

        if (field === 'allocation') {
            const newAlloc = [...proc.allocation];
            newAlloc[resIndex] = value;
            proc.allocation = newAlloc;
        } else {
            const newMax = [...proc.max];
            newMax[resIndex] = value;
            proc.max = newMax;
        }

        newProcesses[procIndex] = proc;
        const newConfig = { ...config, processes: newProcesses };
        updateConfig(newConfig);
    };

    const addResource = () => {
        const newResCount = config.resources.length + 1;
        const newResourceName = `R${newResCount}`;

        const newResources = [...config.resources, newResourceName];
        const newTotalInstances = [...config.totalInstances, 0];

        const newProcesses = config.processes.map(p => ({
            ...p,
            allocation: [...p.allocation, 0],
            max: [...p.max, 0]
        }));

        updateConfig({
            ...config,
            resources: newResources,
            totalInstances: newTotalInstances,
            processes: newProcesses
        });
    };

    const removeResource = (index: number) => {
        if (config.resources.length <= 1) return;

        const newResources = config.resources.filter((_, i) => i !== index);
        const newTotalInstances = config.totalInstances.filter((_, i) => i !== index);

        const newProcesses = config.processes.map(p => ({
            ...p,
            allocation: p.allocation.filter((_, i) => i !== index),
            max: p.max.filter((_, i) => i !== index)
        }));

        updateConfig({
            ...config,
            resources: newResources,
            totalInstances: newTotalInstances,
            processes: newProcesses
        });
    };

    const addProcess = () => {
        const newProcId = `P${config.processes.length}`;
        const newProcess = {
            id: newProcId,
            allocation: Array(config.resources.length).fill(0),
            max: Array(config.resources.length).fill(0)
        };

        updateConfig({
            ...config,
            processes: [...config.processes, newProcess]
        });
    };

    const removeProcess = (index: number) => {
        if (config.processes.length <= 1) return;

        const newProcesses = config.processes.filter((_, i) => i !== index);

        const reindexedProcesses = newProcesses.map((p, i) => ({
            ...p,
            id: `P${i}`
        }));

        updateConfig({
            ...config,
            processes: reindexedProcesses
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-6 h-full overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800">Configuration</h2>

            <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 text-sm">Simulation Speed</h3>
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border">
                    <span className="text-xs font-medium text-gray-500">Slow</span>
                    <input
                        type="range"
                        min="500"
                        max="3000"
                        step="250"
                        value={3500 - speed}
                        onChange={(e) => onSpeedChange(3500 - parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-500">Fast</span>
                </div>
                <div className="text-center text-xs text-gray-400">
                    Step Delay: {speed}ms
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">Resources</h3>
                    <button
                        onClick={addResource}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    >
                        <Plus size={14} /> Add Resource
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {config.resources.map((res, i) => (
                        <div key={res} className="relative group p-2 border rounded-lg bg-gray-50 flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-gray-600">{res}</label>
                                <button
                                    onClick={() => removeResource(i)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove Resource"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <input
                                type="number"
                                className="border rounded p-1 text-sm w-full"
                                value={config.totalInstances[i]}
                                onChange={(e) => handleTotalInstancesChange(i, parseInt(e.target.value) || 0)}
                                placeholder="Total"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">Processes</h3>
                    <button
                        onClick={addProcess}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    >
                        <Plus size={14} /> Add Process
                    </button>
                </div>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-gray-500 border-b">
                                <th className="p-2 w-16">Proc</th>
                                <th className="p-2 text-center border-l" colSpan={config.resources.length}>Allocation</th>
                                <th className="p-2 text-center border-l" colSpan={config.resources.length}>Max</th>
                                <th className="p-2 w-8"></th>
                            </tr>
                            <tr>
                                <th className="border-b"></th>
                                {config.resources.map(r => <th key={`alloc-${r}`} className="text-xs font-normal text-gray-400 px-1 border-l border-b bg-gray-50">{r}</th>)}
                                {config.resources.map(r => <th key={`max-${r}`} className="text-xs font-normal text-gray-400 px-1 border-l border-b bg-gray-50">{r}</th>)}
                                <th className="border-b bg-gray-50"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {config.processes.map((p, pIdx) => (
                                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 group">
                                    <td className="py-2 px-2 font-medium text-gray-700">{p.id}</td>
                                    {p.allocation.map((val, rIdx) => (
                                        <td key={`alloc-${p.id}-${rIdx}`} className="p-1 border-l text-center">
                                            <input
                                                type="number"
                                                className="w-10 border rounded p-1 text-center text-sm"
                                                value={val}
                                                onChange={(e) => handleProcessChange(pIdx, 'allocation', rIdx, parseInt(e.target.value) || 0)}
                                            />
                                        </td>
                                    ))}
                                    {p.max.map((val, rIdx) => (
                                        <td key={`max-${p.id}-${rIdx}`} className="p-1 border-l text-center">
                                            <input
                                                type="number"
                                                className="w-10 border rounded p-1 text-center text-sm"
                                                value={val}
                                                onChange={(e) => handleProcessChange(pIdx, 'max', rIdx, parseInt(e.target.value) || 0)}
                                            />
                                        </td>
                                    ))}
                                    <td className="p-1 text-center">
                                        <button
                                            onClick={() => removeProcess(pIdx)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex gap-2 mt-auto pt-4 border-t">
                <button
                    onClick={onRun}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Play size={18} />
                    Run
                </button>
                <button
                    onClick={onReset}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2 transition-colors"
                >
                    <RotateCcw size={18} />
                    Reset
                </button>
            </div>
        </div>
    );
};

export default BankersControlPanel;