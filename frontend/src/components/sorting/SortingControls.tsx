import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Shuffle } from 'lucide-react';

interface SortingControlsProps {
    algorithm: string;
    setAlgorithm: (algo: string) => void;
    arraySize: number;
    setArraySize: (size: number) => void;
    speed: number;
    setSpeed: (speed: number) => void;
    onRandomize: () => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onReset: () => void;
    onStep: () => void;
    loading: boolean;
}

const SortingControls: React.FC<SortingControlsProps> = ({
    algorithm,
    setAlgorithm,
    arraySize,
    setArraySize,
    speed,
    setSpeed,
    onRandomize,
    isPlaying,
    onTogglePlay,
    onReset,
    onStep,
    loading
}) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Algorithm</label>
                <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                    disabled={isPlaying}
                >
                    <option value="BubbleSort">Bubble Sort</option>
                    <option value="SelectionSort">Selection Sort</option>
                    <option value="InsertionSort">Insertion Sort</option>
                    <option value="MergeSort">Merge Sort</option>
                    <option value="QuickSort">Quick Sort</option>
                </select>
                <p className="text-xs text-gray-500">
                    {algorithm === 'BubbleSort' && "Simple but slow. Swaps adjacent elements."}
                    {algorithm === 'SelectionSort' && "Finds minimum and places it at the beginning."}
                    {algorithm === 'InsertionSort' && "Builds sorted array one item at a time."}
                    {algorithm === 'MergeSort' && "Divide and conquer. Recursive splitting and merging."}
                    {algorithm === 'QuickSort' && "Fast, recursive partitioning around a pivot."}
                </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-700/50">
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <label className="text-gray-300">Array Size ({arraySize})</label>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={arraySize}
                        onChange={(e) => setArraySize(Number(e.target.value))}
                        disabled={isPlaying}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <label className="text-gray-300">Speed ({speed}ms)</label>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={1010 - speed} // Invert so right is faster
                        onChange={(e) => setSpeed(1010 - Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Slow</span>
                        <span>Fast</span>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-700/50 space-y-3">
                <button
                    onClick={onRandomize}
                    disabled={isPlaying}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                    <Shuffle className="w-4 h-4" />
                    <span>Randomize Array</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={onTogglePlay}
                        disabled={loading}
                        className={`col-span-2 flex items-center justify-center space-x-2 p-3 rounded-lg font-medium transition-all ${isPlaying
                            ? 'bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/30'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                            } disabled:opacity-50`}
                    >
                        {isPlaying ? (
                            <>
                                <Pause className="w-5 h-5 fill-current" />
                                <span>Pause</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5 fill-current" />
                                <span>{loading ? 'Thinking...' : 'Start Sorting'}</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={onStep}
                        disabled={isPlaying}
                        className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <SkipForward className="w-4 h-4" />
                        <span>Step</span>
                    </button>

                    <button
                        onClick={onReset}
                        className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SortingControls;