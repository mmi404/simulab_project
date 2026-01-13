import React from 'react';

interface SortingVisualizerProps {
    array: number[];
    compareIndices: number[];
    swapOccurred: boolean;
    sortedIndices: number[];
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ array, compareIndices, swapOccurred, sortedIndices }) => {
    // 100% height container
    // Max value is 100 based on my generation logic (5-105)

    const getBarColor = (index: number) => {
        if (sortedIndices.includes(index)) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'; // Sorted
        if (compareIndices.includes(index)) {
            if (swapOccurred) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'; // Swapping
            return 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]'; // Comparing
        }
        return 'bg-blue-500/80 hover:bg-blue-400 transition-colors'; // Default
    };

    return (
        <div className="w-full h-full flex items-end justify-center space-x-1 px-4 pb-4">
            {array.map((value, idx) => (
                <div
                    key={idx}
                    className={`flex-1 rounded-t-sm transition-all duration-100 ease-in-out ${getBarColor(idx)}`}
                    style={{
                        height: `${Math.min(value, 100)}%`, // Ensure it doesn't overflow if I somehow get >100
                        // calculate width dynamically or let flex handle it
                    }}
                    title={`Value: ${value} | Index: ${idx}`}
                >
                    {/* Optional: Show number if bars are wide enough */}
                    {/* <span className="text-[10px] text-white block text-center -mt-4">{value}</span> */}
                </div>
            ))}
        </div>
    );
};

export default SortingVisualizer;
