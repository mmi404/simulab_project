import React, { useState, useEffect, useRef } from 'react';
import { simulateSorting, type SortingStep, type SortingStats } from '../../services/sortingService';
import SortingControls from '../../components/sorting/SortingControls';
import SortingVisualizer from '../../components/sorting/SortingVisualizer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SortingSimulation: React.FC = () => {
    const [arraySize, setArraySize] = useState<number>(20);
    const [array, setArray] = useState<number[]>([]);
    const [algorithm, setAlgorithm] = useState<string>('BubbleSort');
    const [speed, setSpeed] = useState<number>(500);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [steps, setSteps] = useState<SortingStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [stats, setStats] = useState<SortingStats>({ comparisons: 0, swaps: 0 });
    const [currentStats, setCurrentStats] = useState<SortingStats>({ comparisons: 0, swaps: 0 }); // Dynamic stats
    const [loading, setLoading] = useState<boolean>(false);

    // Store enriched steps with cumulative stats pre-calculated
    type EnrichedSortingStep = SortingStep & { cumulativeComparisons: number; cumulativeSwaps: number };
    const [enrichedSteps, setEnrichedSteps] = useState<EnrichedSortingStep[]>([]);

    // Playback refs
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Initial Random Array
    useEffect(() => {
        generateRandomArray(arraySize);
    }, [arraySize]);

    const generateRandomArray = (size: number) => {
        const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5);
        setArray(newArray);
        setSteps([]);
        setEnrichedSteps([]);
        setCurrentStepIndex(0);
        setIsPlaying(false);
        setStats({ comparisons: 0, swaps: 0 });
        setCurrentStats({ comparisons: 0, swaps: 0 });
    };

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const result = await simulateSorting({
                algorithm,
                array: array
            });

            // Pre-process steps to calculate cumulative stats
            let runningComparisons = 0;
            let runningSwaps = 0;

            const processedSteps = result.steps.map(step => {
                // If compare array is not empty, it's a comparison
                if (step.compare.length > 0) {
                    runningComparisons++;
                }
                // If swap is true, it's a swap
                if (step.swap) {
                    runningSwaps++;
                }

                return {
                    ...step,
                    cumulativeComparisons: runningComparisons,
                    cumulativeSwaps: runningSwaps
                };
            });

            setSteps(result.steps);
            setEnrichedSteps(processedSteps);
            setStats(result.stats); // Final totals
            setCurrentStepIndex(0);
            setIsPlaying(true);
        } catch (error) {
            console.error("Simulation failed", error);
        } finally {
            setLoading(false);
        }
    };

    const togglePlay = () => {
        if (steps.length === 0) {
            handleSimulate();
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
        generateRandomArray(arraySize);
    };

    const handleStepForward = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (isPlaying && steps.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentStepIndex(prev => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, speed);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, steps, speed]);

    // Update current stats when step changes
    useEffect(() => {
        if (enrichedSteps.length > 0 && enrichedSteps[currentStepIndex]) {
            setCurrentStats({
                comparisons: enrichedSteps[currentStepIndex].cumulativeComparisons,
                swaps: enrichedSteps[currentStepIndex].cumulativeSwaps
            });
        } else if (currentStepIndex === 0) {
            setCurrentStats({ comparisons: 0, swaps: 0 });
        }
    }, [currentStepIndex, enrichedSteps]);

    // Current State
    const currentStep = steps[currentStepIndex];
    const displayArray = currentStep ? currentStep.array : array;
    const compareIndices = currentStep ? currentStep.compare : [];
    const swapOccurred = currentStep ? currentStep.swap : false;
    const sortedIndices = currentStep ? currentStep.sortedIndices : [];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Link to="/explore" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Sorting Algorithms
                        </h1>
                        <p className="text-gray-400 text-sm">Visualize how sorting works step-by-step</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
                {/* Controls Panel */}
                <div className="col-span-3 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 h-full overflow-y-auto">
                    <SortingControls
                        algorithm={algorithm}
                        setAlgorithm={setAlgorithm}
                        arraySize={arraySize}
                        setArraySize={setArraySize}
                        speed={speed}
                        setSpeed={setSpeed}
                        onRandomize={() => generateRandomArray(arraySize)}
                        isPlaying={isPlaying}
                        onTogglePlay={togglePlay}
                        onReset={handleReset}
                        onStep={handleStepForward}
                        loading={loading}
                    />
                </div>

                {/* Visualization Panel */}
                <div className="col-span-6 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 h-full flex items-end justify-center relative">
                    <SortingVisualizer
                        array={displayArray}
                        compareIndices={compareIndices}
                        swapOccurred={swapOccurred}
                        sortedIndices={sortedIndices}
                    />
                </div>

                {/* Stats Panel */}
                <div className="col-span-3 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 h-full">
                    <h2 className="text-lg font-semibold mb-4 text-gray-200">Simulation Stats</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                            <span className="text-gray-400 text-sm block">Current Step</span>
                            <span className="text-2xl font-mono text-blue-400">{currentStepIndex + 1} / {steps.length > 0 ? steps.length : '-'}</span>
                        </div>
                        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                            <span className="text-gray-400 text-sm block">Comparisons</span>
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-mono text-purple-400">{currentStats.comparisons}</span>
                                <span className="text-xs text-gray-500 mb-1">Total: {stats.comparisons}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                            <span className="text-gray-400 text-sm block">Swaps</span>
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-mono text-yellow-400">{currentStats.swaps}</span>
                                <span className="text-xs text-gray-500 mb-1">Total: {stats.swaps}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortingSimulation;