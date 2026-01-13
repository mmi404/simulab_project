import React from 'react';
import type { BankersState } from '../../types/bankers';

interface BankersVisualizationProps {
    state: BankersState;
}

const BankersVisualization: React.FC<BankersVisualizationProps> = ({ state }) => {
    const { processes, resources, simulationResult, currentStepIndex } = state;

    const currentStep = simulationResult?.steps[currentStepIndex];

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
                            const isCurrentStep = currentStepIndex >= 0 && currentStepIndex < (simulationResult?.steps.length || 0) && currentStep?.process === p.id;

                            const isDone = simulationResult?.steps
                                .slice(0, currentStepIndex)
                                .some(s => s.process === p.id && s.canExecute);

                            let rowClass = "border-b last:border-0 transition-colors duration-300";
                            if (isCurrentStep) {
                                if (currentStep?.canExecute) {
                                    rowClass += " bg-blue-100 border-l-4 border-blue-600 shadow-inner";
                                } else {
                                    rowClass += " bg-red-50 border-l-4 border-red-400";
                                }
                            } else if (isDone) {
                                rowClass += " bg-green-50/50 opacity-60";
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

    const getNeed = (p: any) => {
        return p.max.map((m: number, i: number) => m - p.allocation[i]);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 rounded-xl p-4 gap-6 overflow-hidden">
            <div className="bg-white p-4 rounded-lg border shadow-sm flex items-center justify-between">
                <span className="font-semibold text-gray-700">Available Resources (Current Work)</span>
                <div className="flex gap-4">
                    {resources.map((r, i) => (
                        <div key={r} className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">{r}:</span>
                            <span className="font-mono font-bold text-blue-600 text-lg">
                                {currentStep ? currentStep.workBefore[i] : state.available[i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
                {renderTable("Allocation", (p) => p.allocation)}
                {renderTable("Max", (p) => p.max)}
                {renderTable("Need (Max - Alloc)", getNeed)}
            </div>

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