import React, { useState } from 'react';
import { Plus, Trash2, Play, RotateCcw } from 'lucide-react';

interface Edge {
    from: string;
    to: string;
    type: 'REQUEST' | 'ALLOCATED';
}

interface DeadlockControlPanelProps {
    processes: string[];
    resources: string[];
    edges: Edge[];
    onAddProcess: () => void;
    onAddResource: () => void;
    onRemoveProcess: (id: string) => void;
    onRemoveResource: (id: string) => void;
    onAddEdge: (edge: Edge) => void;
    onRemoveEdge: (index: number) => void;
    onRunDetection: () => void;
    onReset: () => void;
    isSimulating: boolean;
}

const DeadlockControlPanel: React.FC<DeadlockControlPanelProps> = ({
    processes,
    resources,
    edges,
    onAddProcess,
    onAddResource,
    onRemoveProcess,
    onRemoveResource,
    onAddEdge,
    onRemoveEdge,
    onRunDetection,
    onReset,
    isSimulating
}) => {
    const [selectedProcess, setSelectedProcess] = useState('');
    const [selectedResource, setSelectedResource] = useState('');
    const [edgeType, setEdgeType] = useState<'REQUEST' | 'ALLOCATED'>('REQUEST');

    const handleAddEdge = () => {
        if (!selectedProcess || !selectedResource) return;

        // REQUEST: Process -> Resource
        // ALLOCATED: Resource -> Process
        const from = edgeType === 'REQUEST' ? selectedProcess : selectedResource;
        const to = edgeType === 'REQUEST' ? selectedResource : selectedProcess;

        onAddEdge({ from, to, type: edgeType });
        setSelectedProcess('');
        setSelectedResource('');
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 h-full flex flex-col gap-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white">System Configuration</h2>
                <div className="flex gap-2 w-full">
                    <button
                        onClick={onRunDetection}
                        disabled={isSimulating}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        <Play size={18} />
                        Run
                    </button>
                    <button
                        onClick={onReset}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        <RotateCcw size={18} />
                        Reset
                    </button>
                </div>
            </div>

            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                {/* Nodes Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-300">Processes</h3>
                            <button
                                onClick={onAddProcess}
                                className="p-1 hover:bg-white/10 rounded transition-colors text-blue-400"
                                title="Add Process"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {processes.map(p => (
                                <div key={p} className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm">
                                    <span>{p}</span>
                                    <button onClick={() => onRemoveProcess(p)} className="hover:text-red-400 ml-1">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {processes.length === 0 && <span className="text-xs text-gray-500 italic">No processes</span>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-300">Resources</h3>
                            <button
                                onClick={onAddResource}
                                className="p-1 hover:bg-white/10 rounded transition-colors text-purple-400"
                                title="Add Resource"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {resources.map(r => (
                                <div key={r} className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm">
                                    <span>{r}</span>
                                    <button onClick={() => onRemoveResource(r)} className="hover:text-red-400 ml-1">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {resources.length === 0 && <span className="text-xs text-gray-500 italic">No resources</span>}
                        </div>
                    </div>
                </div>

                {/* Edges Creation Section */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-gray-300">Add Connection</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <select
                            value={selectedProcess}
                            onChange={(e) => setSelectedProcess(e.target.value)}
                            className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select Process...</option>
                            {processes.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>

                        <select
                            value={edgeType}
                            onChange={(e) => setEdgeType(e.target.value as 'REQUEST' | 'ALLOCATED')}
                            className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                        >
                            <option value="REQUEST">Requests →</option>
                            <option value="ALLOCATED">Allocated To ←</option>
                        </select>

                        <select
                            value={selectedResource}
                            onChange={(e) => setSelectedResource(e.target.value)}
                            className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select Resource...</option>
                            {resources.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>

                        <button
                            onClick={handleAddEdge}
                            disabled={!selectedProcess || !selectedResource}
                            className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <Plus size={16} />
                            Add Edge
                        </button>
                    </div>
                </div>

                {/* Existing Edges List */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-gray-300">Active Connections</h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {edges.map((edge, idx) => (
                            <div key={idx} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg border border-white/10 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className={edge.type === 'REQUEST' ? "text-blue-300" : "text-purple-300"}>{edge.from}</span>
                                    <span className="text-gray-500">→</span>
                                    <span className={edge.type === 'REQUEST' ? "text-purple-300" : "text-blue-300"}>{edge.to}</span>
                                    <span className="text-xs text-gray-500 ml-2">({edge.type === 'REQUEST' ? 'Req' : 'Alloc'})</span>
                                </div>
                                <button onClick={() => onRemoveEdge(idx)} className="text-gray-500 hover:text-red-400">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {edges.length === 0 && <div className="text-center text-xs text-gray-600 py-2">No edges defined</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeadlockControlPanel;
