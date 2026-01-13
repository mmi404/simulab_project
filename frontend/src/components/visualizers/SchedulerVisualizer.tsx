import React from 'react';

interface SimulationStep {
    stepId: number;
    description: string;
    state: {
        time: number;
        running?: string;
        queue?: string[];
        completed?: string;
        [key: string]: any;
    };
}

interface SchedulerVisualizerProps {
    steps: SimulationStep[];
}

const SchedulerVisualizer: React.FC<SchedulerVisualizerProps> = ({ steps }) => {
    if (!steps || steps.length === 0) return <div className="text-center text-gray-500 mt-10">Run simulation to see results</div>;

    // We can render a Timeline or Gantt Chart.
    // Let's do a simple Gantt Bar.
    // Group consecutive steps where same process is running.

    // OR simply render the log for now to verify Phase 1.
    // Let's try to render a visual timeline block.

    return (
        <div className="p-4 overflow-x-auto">
            <h3 className="text-lg font-bold mb-4">Execution Timeline</h3>

            <div className="flex items-center gap-1 mb-6 h-16">
                {steps.map((step, index) => {
                    // Only visualize running steps
                    const isRunning = step.state.running;
                    if (!isRunning && !step.description.includes("Idle")) return null;

                    const width = 40; // px per time unit
                    const color = isRunning ? 'bg-blue-500' : 'bg-gray-300';
                    const label = isRunning ? step.state.running : 'Idle';

                    return (
                        <div key={index}
                            className={`${color} text-white flex items-center justify-center text-xs border-r border-white relative group`}
                            style={{ width: width, height: '100%' }}
                        >
                            {label}
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white p-2 rounded text-xs whitespace-nowrap z-20">
                                Time: {step.state.time} <br />
                                Queue: {JSON.stringify(step.state.queue || [])}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-1">
                <h4 className="font-semibold text-sm">Step Log</h4>
                <div className="h-64 overflow-y-auto border rounded bg-white p-2 text-sm font-mono">
                    {steps.map((step) => (
                        <div key={step.stepId} className="border-b py-1">
                            <span className="text-gray-500">[{step.state.time}]</span> {step.description}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchedulerVisualizer;
