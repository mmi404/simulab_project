import React from 'react';
import type { BankersState } from '../../types/bankers';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface BankersStatePanelProps {
    state: BankersState;
}

const BankersStatePanel: React.FC<BankersStatePanelProps> = ({ state }) => {
    const { simulationResult, currentStepIndex } = state;

    if (!simulationResult) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm p-4 text-center">
                Run the simulation to see results.
            </div>
        );
    }

    const totalSteps = simulationResult.steps.length;
    const isFinished = currentStepIndex >= totalSteps;

    // Derive visible sequence from steps processed so far
    const visibleSequence = simulationResult.steps
        .slice(0, Math.min(currentStepIndex + 1, totalSteps)) // include current step if it finished? actually step logic is "checking process X". If successful, it appends to sequence.
        .filter(step => step.canExecute)
        .map(step => step.process);

    // If not safe, and we reached the point where it failed (last step was false?)
    // steps usually contains all logical checks.

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Status Card - Only Show when Finished */}
            <div className={`transition-all duration-500 transform ${isFinished ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none absolute'}`}>
                <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${simulationResult.safe
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                    {simulationResult.safe ? <CheckCircle size={32} /> : <XCircle size={32} />}
                    <span className="font-bold text-lg">
                        {simulationResult.safe ? 'Safe State' : 'Unsafe State'}
                    </span>
                    <span className="text-xs text-center opacity-80">
                        {simulationResult.safe
                            ? 'System is in a safe state. A safe sequence exists.'
                            : 'System is in an unsafe state. Deadlock is possible.'}
                    </span>
                </div>
            </div>

            {/* Placeholder for layout stability when status is hidden */}
            {!isFinished && (
                <div className="p-4 rounded-xl border border-dashed border-gray-200 text-gray-400 flex flex-col items-center gap-2 bg-gray-50 h-[130px] justify-center">
                    <span className="animate-pulse">Analyzing...</span>
                </div>
            )}

            {/* Safe Sequence - Builds Progressive */}
            <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider flex justify-between">
                    Safe Sequence
                    <span className="text-xs font-normal text-gray-500 normal-case">
                        {visibleSequence.length} / {simulationResult.safeSequence.length}
                    </span>
                </h3>
                <div className="flex flex-wrap gap-2 items-center min-h-[40px]">
                    {visibleSequence.map((proc, idx) => (
                        <div key={`${proc}-${idx}`} className="flex items-center animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="bg-white border-2 border-green-100 shadow-sm px-3 py-1.5 rounded-lg font-mono font-bold text-gray-800 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                {proc}
                            </div>
                            {idx < visibleSequence.length - 1 && (
                                <ArrowRight size={16} className="text-gray-300 mx-1" />
                            )}
                            {/* If this is the last visible item, show arrow if more to come? nice to have but optional */}
                        </div>
                    ))}

                    {/* Unsafe Indicator if finished and unsafe */}
                    {isFinished && !simulationResult.safe && (
                        <div className="flex items-center text-red-500 animate-in fade-in duration-500">
                            <ArrowRight size={16} className="text-red-300 mx-1" />
                            <span className="bg-red-100 px-2 py-1 rounded text-xs font-bold uppercase">Deadlock</span>
                        </div>
                    )}
                </div>
            </div>

            {isFinished && !simulationResult.safe && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-800 animate-in fade-in slide-in-from-bottom-2">
                    Process {simulationResult.steps[simulationResult.steps.length - 1]?.process} could not proceed. No safe sequence found.
                </div>
            )}
        </div>
    );
};

export default BankersStatePanel;
