import React from 'react';

interface GraphControlsProps {
    algorithm: 'BFS' | 'DFS';
    setAlgorithm: (algo: 'BFS' | 'DFS') => void;
    startNode: string;
    setStartNode: (node: string) => void;
    nodeOptions: string[];
    onRun: () => void;
    onReset: () => void;
    onClear: () => void;
    onStep: () => void;
    isRunning: boolean;
    isFinished: boolean;
}

const GraphControls: React.FC<GraphControlsProps> = ({
    algorithm,
    setAlgorithm,
    startNode,
    setStartNode,
    nodeOptions,
    onRun,
    onReset,
    onClear,
    onStep,
    isRunning,
    isFinished
}) => {
    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Traversal Controls</h3>

                {/* Algorithm Selection */}
                <div className="space-y-3 mb-6">
                    <label className="text-sm text-slate-400 block">Algorithm</label>
                    <div className="flex bg-slate-900 rounded-lg p-1">
                        <button
                            className={`flex-1 py-1 px-3 rounded text-sm font-medium transition-colors ${algorithm === 'BFS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                                }`}
                            onClick={() => setAlgorithm('BFS')}
                            disabled={isRunning || isFinished}
                        >
                            BFS
                        </button>
                        <button
                            className={`flex-1 py-1 px-3 rounded text-sm font-medium transition-colors ${algorithm === 'DFS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                                }`}
                            onClick={() => setAlgorithm('DFS')}
                            disabled={isRunning || isFinished}
                        >
                            DFS
                        </button>
                    </div>
                </div>

                {/* Start Node Selection */}
                <div className="space-y-3 mb-6">
                    <label className="text-sm text-slate-400 block">Start Node</label>
                    <select
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        value={startNode}
                        onChange={(e) => setStartNode(e.target.value)}
                        disabled={isRunning || isFinished}
                    >
                        <option value="">Select Start Node</option>
                        {nodeOptions.map(node => (
                            <option key={node} value={node}>{node}</option>
                        ))}
                    </select>
                </div>

                {/* Main Actions */}
                <div className="space-y-3">
                    {!isRunning && !isFinished ? (
                        <button
                            onClick={onRun}
                            disabled={!startNode}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ▶ Run
                        </button>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={onStep}
                                disabled={isFinished}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                            >
                                ⏭ Step
                            </button>
                            <button
                                onClick={onReset}
                                className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded transition-colors"
                            >
                                🔁 Reset
                            </button>
                        </div>
                    )}

                    <button
                        onClick={onClear}
                        className="w-full bg-red-900/50 hover:bg-red-900 text-red-200 py-2 px-4 rounded text-sm transition-colors border border-red-900"
                    >
                        Clear Graph
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Instructions</h4>
                <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                    <li>Click canvas to add Node</li>
                    <li>Drag between nodes to add Edge</li>
                    <li>Select Start Node and Algorithm</li>
                    <li>Press Run/Step to visualize</li>
                </ul>
            </div>
        </div>
    );
};

export default GraphControls;
