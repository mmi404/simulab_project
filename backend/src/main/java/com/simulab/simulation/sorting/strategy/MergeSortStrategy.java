package com.simulab.simulation.sorting.strategy;

import com.simulab.simulation.sorting.model.SortingResponse;
import com.simulab.simulation.sorting.model.SortingStats;
import com.simulab.simulation.sorting.model.SortingStep;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("MergeSort")
public class MergeSortStrategy implements SortingStrategy {

    @Override
    public SortingResponse sort(int[] initialArray) {
        int[] array = initialArray.clone();
        List<SortingStep> steps = new ArrayList<>();
        int n = array.length;
        int[] stats = {0, 0}; // comparisons, swaps (overwrites)

        // Add initial state
        steps.add(new SortingStep(array, new int[]{}, false));

        mergeSort(array, 0, n - 1, steps, stats);

        // Final sorted state
        List<Integer> sortedIndices = new ArrayList<>();
        for(int k=0; k<n; k++) sortedIndices.add(k);
        SortingStep finalStep = new SortingStep(array, new int[]{}, false);
        finalStep.setSortedIndices(sortedIndices);
        steps.add(finalStep);

        return new SortingResponse(steps, new SortingStats(stats[0], stats[1]));
    }

    private void mergeSort(int[] array, int left, int right, List<SortingStep> steps, int[] stats) {
        if (left < right) {
            int mid = left + (right - left) / 2;

            mergeSort(array, left, mid, steps, stats);
            mergeSort(array, mid + 1, right, steps, stats);

            merge(array, left, mid, right, steps, stats);
        }
    }

    private void merge(int[] array, int left, int mid, int right, List<SortingStep> steps, int[] stats) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        int[] L = new int[n1];
        int[] R = new int[n2];

        for (int i = 0; i < n1; ++i)
            L[i] = array[left + i];
        for (int j = 0; j < n2; ++j)
            R[j] = array[mid + 1 + j];

        int i = 0, j = 0;
        int k = left;

        // Merge logic
        while (i < n1 && j < n2) {
            stats[0]++; // Comparison
            
            if (L[i] <= R[j]) {
                array[k] = L[i];
                i++;
            } else {
                array[k] = R[j];
                j++;
            }
            stats[1]++; // Overwrite counted as swap/move
            
            // Record step: Overwrite at k
            steps.add(new SortingStep(array, new int[]{k}, true));
            k++;
        }

        while (i < n1) {
            array[k] = L[i];
            i++;
            k++;
            stats[1]++;
            steps.add(new SortingStep(array, new int[]{k-1}, true));
        }

        while (j < n2) {
            array[k] = R[j];
            j++;
            k++;
            stats[1]++;
            steps.add(new SortingStep(array, new int[]{k-1}, true));
        }
    }
}