package com.simulab.simulation.sorting.model;

public class SortingStats {
    private int comparisons;
    private int swaps;

    public SortingStats() {}

    public SortingStats(int comparisons, int swaps) {
        this.comparisons = comparisons;
        this.swaps = swaps;
    }

    public int getComparisons() {
        return comparisons;
    }

    public void setComparisons(int comparisons) {
        this.comparisons = comparisons;
    }

    public int getSwaps() {
        return swaps;
    }

    public void setSwaps(int swaps) {
        this.swaps = swaps;
    }
}