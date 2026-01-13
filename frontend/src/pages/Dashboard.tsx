import { useState, useEffect } from 'react';
import { getUserDashboard, type DashboardSimulation } from '../services/simulationService';
import SimulationProgressCard from '../components/dashboard/SimulationProgressCard';
import { LayoutDashboard, AlertCircle, Loader2, CheckCircle, Play, BarChart2 } from 'lucide-react';

const Dashboard = () => {
    const [simulations, setSimulations] = useState<DashboardSimulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await getUserDashboard();
                setSimulations(data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600 flex items-center justify-center gap-2">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    const totalCompleted = simulations.filter((s) => s.completed).length;
    const totalRuns = simulations.reduce((acc, curr) => acc + curr.runsCount, 0);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-600 shadow-md rounded-lg text-white">
                    <LayoutDashboard size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Track your progress across {simulations.length} simulations
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="relative overflow-hidden rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-100 p-6 shadow-sm">
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-green-800">Simulations Completed</p>
                        <p className="text-4xl font-bold text-green-900 mt-2">{totalCompleted}</p>
                    </div>
                    <CheckCircle className="absolute right-4 bottom-4 text-green-600/10 h-24 w-24 -rotate-12" />
                </div>
                <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-sm">
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-blue-800">Total Runs</p>
                        <p className="text-4xl font-bold text-blue-900 mt-2">{totalRuns}</p>
                    </div>
                    <Play className="absolute right-4 bottom-4 text-blue-600/10 h-24 w-24 -rotate-12" />
                </div>
                <div className="relative overflow-hidden rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-fuchsia-100 p-6 shadow-sm">
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-purple-800">Active Simulations</p>
                        <p className="text-4xl font-bold text-purple-900 mt-2">{simulations.filter(s => s.runsCount > 0).length}</p>
                    </div>
                    <BarChart2 className="absolute right-4 bottom-4 text-purple-600/10 h-24 w-24 -rotate-12" />
                </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-6">Simulation Progress</h2>

            {simulations.length === 0 ? (
                <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No simulations found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {simulations.map((sim, index) => (
                        <SimulationProgressCard key={index} {...sim} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
