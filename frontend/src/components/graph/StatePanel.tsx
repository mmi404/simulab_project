import React from 'react';

interface StatePanelProps {
    current: string | null;
    visited: string[];
    frontier: string[];
    algorithm: 'BFS' | 'DFS';
    order: string[];
}

const StatePanel: React.FC<StatePanelProps> = ({ current, visited, frontier, algorithm, order }) => {
    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-6">Execution State</h3>

            {/* Current Node */}
            <div className="mb-6">
                <div className="text-sm text-slate-400 mb-1">Current Node</div>
                <div className="flex items-center">
                    {current ? (
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-blue-400">
                            {current}
                        </div>
                    ) : (
                        <span className="text-slate-600 italic">--</span>
                    )}
                </div>
            </div>

            {/* Frontier (Queue/Stack) */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-slate-400">
                        {algorithm === 'BFS' ? 'Queue (Frontier)' : 'Stack (Frontier)'}
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                        {algorithm === 'BFS' ? 'FIFO' : 'LIFO'}
                    </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg min-h-[60px] flex items-center gap-2 overflow-x-auto border border-slate-800">
                    {frontier.length === 0 ? (
                        <span className="text-slate-600 text-sm italic w-full text-center">Empty</span>
                    ) : (
                        frontier.map((node, i) => (
                            <div key={`${node}-${i}`} className="min-w-[32px] h-8 rounded bg-yellow-600/20 border border-yellow-600/50 flex items-center justify-center text-yellow-500 font-medium text-sm">
                                {node}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Visited List */}
            <div className="mb-6">
                <div className="text-sm text-slate-400 mb-2">Visited Set</div>
                <div className="flex flex-wrap gap-2">
                    {visited.map((node) => (
                        <div key={node} className="w-8 h-8 rounded-full bg-green-600/20 border border-green-600/50 flex items-center justify-center text-green-400 text-sm font-medium">
                            {node}
                        </div>
                    ))}
                </div>
            </div>

            {/* Traversal Order */}
            <div>
                <div className="text-sm text-slate-400 mb-2">Traversal Order</div>
                <div className="font-mono text-sm text-slate-300 break-all leading-relaxed">
                    {order.length > 0 ? order.join(' → ') : <span className="text-slate-600 italic">...</span>}
                </div>
            </div>
        </div>
    );
};

export default StatePanel;
