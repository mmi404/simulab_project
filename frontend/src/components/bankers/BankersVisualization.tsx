import React from 'react';
import type { BankersState } from '../../types/bankers';

interface BankersVisualizationProps {
    state: BankersState;
}

const BankersVisualization: React.FC<BankersVisualizationProps> = ({ state }) => {
    const { processes, resources, simulationResult, currentStepIndex } = state;

    // Determine which process is currently being "executed" or was just executed in the step view
    const currentStep = simulationResult?.steps[currentStepIndex];

    // If we are visualizing steps, we might want to show the state *after* the current step
    // or *before* depending on UX. Usually "Current State" is best.
    // Let's assume the parent updates 'state.available' and 'state.processes' (allocation) 
    // as we step through.

    // Helper to render a matrix table
    const renderTable = (title: string, dataAccessor: (p: any) => number[]) => (
        <div className="flex-1 min-w-[200px]">
            <h4 className="text-sm font-semibold text-gray-600 mb-2 text-center">{title}</h4>
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">P</th>
                            {resources.map(r => <th key={r} className="py-2 px-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{r}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {processes.map((p) => {
                            // Highlights: 
                            // 1. Current Step Active (Blue if checking/pass, Red if fail)
                            const isCurrentStep = currentStepIndex >= 0 && currentStepIndex < (simulationResult?.steps.length || 0) && currentStep?.process === p.id;

                            // Check if this process has already been marked safe in previous steps (excluding current step if it failed)
                            const isDone = simulationResult?.steps
                                .slice(0, currentStepIndex) // Look at *previous* completed steps
                                .some(s => s.process === p.id && s.canExecute); // Must have executed successfully

                            let rowClass = "border-b last:border-0 transition-colors duration-300";
                            if (isCurrentStep) {
                                if (currentStep?.canExecute) {
                                    rowClass += " bg-blue-100 border-l-4 border-blue-600 shadow-inner";
                                } else {
                                    rowClass += " bg-red-50 border-l-4 border-red-400"; // Failed check styling
                                }
                            } else if (isDone) {
                                rowClass += " bg-green-50/50 opacity-60"; // Completed
                            }

                            return (
                                <tr key={p.id} className={rowClass}>
                                    <td className={`py-2 px-3 font-medium ${isCurrentStep ? (currentStep?.canExecute ? 'text-blue-700 font-bold' : 'text-red-700 font-bold') : 'text-gray-700'}`}>
                                        {p.id}
                                        {isDone && <span className="ml-1 text-green-600 text-[10px]">✔</span>}
                                        {isCurrentStep && !currentStep?.canExecute && <span className="ml-1 text-red-500 text-[10px]">Wait</span>}
                                    </td>
                                    {dataAccessor(p).map((val, i) => (
                                        <td key={i} className={`py-2 px-3 text-center ${isCurrentStep ? (currentStep?.canExecute ? 'text-blue-900 font-bold' : 'text-red-900 font-bold') : 'text-gray-600'}`}>
                                            {val}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Calculate Need on the fly if not present, or use pre-calculated
    const getNeed = (p: any) => {
        return p.max.map((m: number, i: number) => m - p.allocation[i]);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 rounded-xl p-4 gap-6 overflow-hidden">
            {/* Top Bar: Available Resources */}
            <div className="bg-white p-4 rounded-lg border shadow-sm flex items-center justify-between">
                <span className="font-semibold text-gray-700">Available Resources (Current Work)</span>
                <div className="flex gap-4">
                    {resources.map((r, i) => (
                        <div key={r} className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">{r}:</span>
                            <span className="font-mono font-bold text-blue-600 text-lg">
                                {/* If stepping, show Work from the step, else show global state available */}
                                {currentStep ? currentStep.workBefore[i] : state.available[i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Matrix Visualization */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {renderTable("Allocation", (p) => p.allocation)}
                {renderTable("Max", (p) => p.max)}
                {renderTable("Need (Max - Alloc)", getNeed)}
            </div>

            {/* Step Explanation */}
            {currentStep && (
                <div className="mt-auto bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 flex items-center gap-3">
                    <span className="font-bold whitespace-nowrap">Step {currentStepIndex + 1}:</span>
                    <span>
                        Checking <span className="font-bold">{currentStep.process}</span>.
                        Need {`[${currentStep.need.join(', ')}]`} ≤ Available {`[${currentStep.workBefore.join(', ')}]`}?
                        <span className="font-bold ml-1">{currentStep.canExecute ? "YES ✔" : "NO ❌"}</span>
                        {currentStep.canExecute && " → Resources reclaimed."}
                    </span>
                </div>
            )}
        </div>
    );
};

export default BankersVisualization;
