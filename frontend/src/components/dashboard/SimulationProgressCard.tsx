import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, CheckCircle, BarChart2 } from 'lucide-react';

interface SimulationProgressCardProps {
    simulation: string;
    slug: string;
    category: string;
    completed: boolean;
    runsCount: number;
    lastRunAt: string | null;
}

const SimulationProgressCard: React.FC<SimulationProgressCardProps> = ({
    simulation,
    slug,
    category,
    completed,
    runsCount,
    lastRunAt,
}) => {
    const navigate = useNavigate();

    const getStatusColor = () => {
        if (completed) return 'text-green-700 bg-green-100 border-green-200';
        if (runsCount > 0) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
        return 'text-gray-600 bg-gray-100 border-gray-200';
    };

    const getStatusText = () => {
        if (completed) return 'Completed';
        if (runsCount > 0) return 'In Progress';
        return 'Not Started';
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getProgressPercent = () => {
        if (completed) return 100;
        // Simple heuristic: 1 run is 50%, 0 runs is 0%. Can be adjusted.
        return runsCount > 0 ? 50 : 0;
    };

    const progress = getProgressPercent();

    return (
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border mb-2 transition-colors ${getStatusColor()}`}>
                            {getStatusText()}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {simulation}
                        </h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{category}</p>
                    </div>
                    <div className={`p-3 rounded-xl shadow-sm ${completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {completed ? <CheckCircle size={24} /> : <BarChart2 size={24} />}
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${completed ? 'bg-green-500' : 'bg-blue-600'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                            <Play size={14} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Runs</p>
                            <p className="text-sm font-semibold text-gray-900">{runsCount}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                            <Clock size={14} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Last Active</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(lastRunAt === 'Never' ? null : lastRunAt)}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/sim/${slug}`)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                >
                    <Play size={16} fill="currentColor" />
                    {runsCount > 0 ? 'Continue Simulation' : 'Start Simulation'}
                </button>
            </div>
        </div>
    );
};

export default SimulationProgressCard;
