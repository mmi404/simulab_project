package com.simulab.simulation.sorting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SortingStep {
    private int[] array;
    private int[] compare; // Indices being compared [i, j]
    private boolean swap;  // Whether a swap occurred
    private List<Integer> sortedIndices; // Indices that are now in their final sorted position

    public SortingStep(int[] array, int[] compare, boolean swap) {
        this.array = array.clone();
        this.compare = compare;
        this.swap = swap;
        this.sortedIndices = new ArrayList<>();
    }
}
