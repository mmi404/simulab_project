package com.simulab.simulation.sorting.model;

import java.util.ArrayList;
import java.util.List;

public class SortingStep {
    private int[] array;
    private int[] compare; // Indices being compared [i, j]
    private boolean swap;  // Whether a swap occurred
    private List<Integer> sortedIndices; // Indices that are now in their final sorted position

    public SortingStep() {}

    public SortingStep(int[] array, int[] compare, boolean swap) {
        this.array = array.clone();
        this.compare = compare;
        this.swap = swap;
        this.sortedIndices = new ArrayList<>();
    }

    public SortingStep(int[] array, int[] compare, boolean swap, List<Integer> sortedIndices) {
        this.array = array.clone();
        this.compare = compare;
        this.swap = swap;
        this.sortedIndices = sortedIndices;
    }

    public int[] getArray() {
        return array;
    }

    public void setArray(int[] array) {
        this.array = array;
    }

    public int[] getCompare() {
        return compare;
    }

    public void setCompare(int[] compare) {
        this.compare = compare;
    }

    public boolean isSwap() {
        return swap;
    }

    public void setSwap(boolean swap) {
        this.swap = swap;
    }

    public List<Integer> getSortedIndices() {
        return sortedIndices;
    }

    public void setSortedIndices(List<Integer> sortedIndices) {
        this.sortedIndices = sortedIndices;
    }
}