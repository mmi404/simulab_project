import { useEffect, useState } from 'react';
import { Clock, Cpu, Layers } from 'lucide-react';

const MockSimulation = () => {
    const [step, setStep] = useState(0);

    // Auto-advance simulation steps for visual effect
    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700 w-full max-w-lg mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500">
            {/* Header / Stats */}
            <div className="flex justify-between items-center mb-6 text-slate-400 text-xs font-mono uppercase tracking-wider">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Time: {step * 10}ms</span>
                </div>
                <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-green-400" />
                    <span>CPU Load: {45 + step * 12}%</span>
                </div>
            </div>

            {/* Gantt Chart Area */}
            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-white font-mono text-sm w-8">P1</span>
                    <div className="h-8 flex-1 bg-slate-800 rounded overflow-hidden relative">
                        <div
                            className={`h-full bg-blue-500 transition-all duration-500 ease-in-out ${step === 0 || step === 2 ? 'w-full opacity-100' : 'w-0 opacity-50'}`}
                        />
                    </div>
                    <span className="text-slate-500 text-xs">Running</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-white font-mono text-sm w-8">P2</span>
                    <div className="h-8 flex-1 bg-slate-800 rounded overflow-hidden relative">
                        <div
                            className={`h-full bg-purple-500 transition-all duration-500 ease-in-out ${step === 1 ? 'w-full opacity-100' : 'w-0 opacity-50'}`}
                        />
                    </div>
                    <span className="text-slate-500 text-xs">Waiting</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-white font-mono text-sm w-8">P3</span>
                    <div className="h-8 flex-1 bg-slate-800 rounded overflow-hidden relative">
                        <div
                            className={`h-full bg-emerald-500 transition-all duration-500 ease-in-out ${step === 3 ? 'w-full opacity-100' : 'w-0 opacity-50'}`}
                        />
                    </div>
                    <span className="text-slate-500 text-xs">Ready</span>
                </div>
            </div>

            {/* Ready Queue Visual */}
            <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                    <Layers className="w-4 h-4" /> Ready Queue
                </div>
                <div className="flex gap-2 font-mono text-xs">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`px-3 py-1.5 rounded transition-colors duration-300 ${(step + i) % 3 === 0 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                (step + i) % 3 === 1 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                        >
                            P{i}
                        </div>
                    ))}
                </div>
            </div>

            {/* Play bar mock */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-700 pt-4">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <PlaySmallIcon />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                        <PauseSmallIcon />
                    </div>
                </div>
                <div className="h-1 bg-slate-700 flex-1 mx-4 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3 animate-pulse"></div>
                </div>
                <span className="text-slate-500 text-xs font-mono">x1.0</span>
            </div>
        </div>
    );
};

const PlaySmallIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);
const PauseSmallIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
);

export default MockSimulation;
