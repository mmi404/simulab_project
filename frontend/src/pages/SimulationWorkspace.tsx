import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { runSimulation, type Process } from '../services/simulationService';
import SchedulerVisualizer from '../components/visualizers/SchedulerVisualizer';

const SimulationWorkspace = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    // State for Controls
    const [algorithm, setAlgorithm] = useState('FCFS');
    const [processes, setProcesses] = useState<Process[]>([
        { id: "P1", arrivalTime: 0, burstTime: 5 },
        { id: "P2", arrivalTime: 1, burstTime: 3 }
    ]);

    // New Process State
    const [newProcess, setNewProcess] = useState({ id: '', arrivalTime: 0, burstTime: 0 });

    const addProcess = () => {
        if (!newProcess.id || newProcess.burstTime <= 0) return;
        setProcesses([...processes, { ...newProcess, arrivalTime: Number(newProcess.arrivalTime), burstTime: Number(newProcess.burstTime) }]);
        setNewProcess({ id: '', arrivalTime: 0, burstTime: 0 });
    };

    const handleRun = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await runSimulation(algorithm, processes);
            setResult(data);
        } catch (err) {
            console.error(err);
            setError("Failed to run simulation. Please ensure you are logged in and backend is running.");
        } finally {
            setLoading(false);
        }
    };

    if (id !== '1' && id !== '101') {
        // 1 might be from Explore mock data
        // Simple guard for now
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Simulation Not Implemented Yet</h1>
                <p>We are currently working on {id === '2' ? 'Deadlock Detection' : id === '3' ? 'Sorting Algorithms' : 'this module'}.</p>
                <p className="mt-4"><a href="/explore" className="text-primary hover:underline">Go Back</a></p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <header className="px-6 py-4 bg-white border-b flex justify-between items-center">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-gray-500 font-normal">Simulation /</span>
                    CPU Scheduling
                </h1>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50" onClick={() => setResult(null)}>Reset</button>
                    <button className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-blue-600" onClick={handleRun} disabled={loading}>
                        {loading ? 'Running...' : 'Run'}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Controls Panel */}
                <aside className="w-80 bg-white border-r p-6 overflow-y-auto z-10 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Configuration</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Algorithm</label>
                            <select
                                value={algorithm}
                                onChange={(e) => setAlgorithm(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
                            >
                                <option value="FCFS">FCFS</option>
                                <option value="SJF">SJF (Non-Preemptive)</option>
                                <option value="RR">Round Robin</option>
                            </select>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Process List</label>
                            <div className="space-y-2 mb-4">
                                {processes.map(p => (
                                    <div key={p.id} className="p-3 bg-gray-50 rounded text-sm border flex justify-between">
                                        <span>{p.id}</span>
                                        <span className="text-gray-500">Arr: {p.arrivalTime}, Burst: {p.burstTime}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Add Process Form */}
                            <div className="space-y-2 border-t pt-2">
                                <input
                                    placeholder="ID (e.g. P3)"
                                    className="w-full text-sm border rounded p-1"
                                    value={newProcess.id}
                                    onChange={e => setNewProcess({ ...newProcess, id: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="number" placeholder="Arr"
                                        className="w-1/2 text-sm border rounded p-1"
                                        value={newProcess.arrivalTime}
                                        onChange={e => setNewProcess({ ...newProcess, arrivalTime: Number(e.target.value) })}
                                    />
                                    <input
                                        type="number" placeholder="Burst"
                                        className="w-1/2 text-sm border rounded p-1"
                                        value={newProcess.burstTime}
                                        onChange={e => setNewProcess({ ...newProcess, burstTime: Number(e.target.value) })}
                                    />
                                </div>
                                <button
                                    onClick={addProcess}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary bg-blue-50 hover:bg-blue-100"
                                >
                                    + Add Process
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Canvas / Visualization Area */}
                <main className="flex-1 relative bg-gray-100 overflow-hidden canvas-container flex flex-col">
                    <div className="flex-1 overflow-auto p-6">
                        {loading && <div className="text-center mt-10">Running Simulation...</div>}
                        {result && <SchedulerVisualizer steps={result.steps} />}
                        {!result && !loading && (
                            <div className="text-center mt-20">
                                <p className="text-gray-400 font-medium text-lg">Visualization Canvas</p>
                                <p className="text-gray-400 text-sm">Run the simulation to see results</p>
                            </div>
                        )}
                        {error && <div className="text-red-500 text-center mt-10">{error}</div>}
                    </div>
                </main>
            </div>

            {/* Timeline / Footer */}
            <footer className="h-16 bg-white border-t px-6 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Time: {result && result.steps ? result.steps.length : 0}</span>
                    <span>Status: {loading ? 'Running' : (result ? 'Completed' : 'Ready')}</span>
                    {result && result.metrics && (
                        <span className="ml-4 font-semibold text-primary">Avg Waiting Time: {result.metrics.averageWaitingTime}</span>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default SimulationWorkspace;
