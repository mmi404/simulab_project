import { Cpu, Layers, Server, ArrowUpDown, Play } from 'lucide-react';
import type { Simulation } from '../../services/simulationService';
import { useNavigate } from 'react-router-dom';

const iconMap: { [key: string]: any } = {
    'cpu': Cpu,
    'layers': Layers,
    'server': Server,
    'arrow-up-down': ArrowUpDown
};

interface SimulationCardProps {
    simulation: Simulation;
}

const SimulationCard = ({ simulation }: SimulationCardProps) => {
    const navigate = useNavigate();
    const Icon = iconMap[simulation.icon] || Cpu;

    const isOS = simulation.type?.name === 'Operating Systems';

    // Tailwind dynamic classes (safe list approach preferred in prod, simple here)
    const borderColor = isOS ? 'border-l-blue-500' : 'border-l-emerald-500';
    const textColor = isOS ? 'text-blue-600' : 'text-emerald-600';
    const bgColor = isOS ? 'bg-blue-50' : 'bg-emerald-50';

    return (
        <div
            className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden border-l-4 ${borderColor} hover:-translate-y-1`}
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <span
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: simulation.type?.color || '#3B82F6' }}
                        >
                            {simulation.type?.shortName || 'Sim'}
                        </span>
                        {/* Active/Status indicator if needed */}
                        <span className="text-xs font-semibold text-slate-400 border border-slate-100 px-2 py-1 rounded">
                            {simulation.difficulty}
                        </span>
                    </div>
                    <div className={`p-2 rounded-lg ${bgColor} bg-opacity-50 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${textColor}`} />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {simulation.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
                    {simulation.shortDescription}
                </p>

                <button
                    onClick={() => navigate(`/sim/${simulation.slug}`)}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                >
                    <Play className="w-4 h-4 fill-current" />
                    Launch Simulation
                </button>
            </div>

            {/* Hover shine effect */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
        </div>
    );
};

export default SimulationCard;
