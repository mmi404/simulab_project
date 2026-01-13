package com.simulab.simulation.sorting.strategy;

import com.simulab.simulation.sorting.model.SortingResponse;
import com.simulab.simulation.sorting.model.SortingStats;
import com.simulab.simulation.sorting.model.SortingStep;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("QuickSort")
public class QuickSortStrategy implements SortingStrategy {

    @Override
    public SortingResponse sort(int[] initialArray) {
        int[] array = initialArray.clone();
        List<SortingStep> steps = new ArrayList<>();
        int n = array.length;
        int[] stats = {0, 0}; // comparisons, swaps

        // Add initial state
        steps.add(new SortingStep(array, new int[]{}, false));

        quickSort(array, 0, n - 1, steps, stats);

        // Final sorted step
        List<Integer> sortedIndices = new ArrayList<>();
        for(int k=0; k<n; k++) sortedIndices.add(k);
        SortingStep finalStep = new SortingStep(array, new int[]{}, false);
        finalStep.setSortedIndices(sortedIndices);
        steps.add(finalStep);

        return new SortingResponse(steps, new SortingStats(stats[0], stats[1]));
    }

    private void quickSort(int[] array, int low, int high, List<SortingStep> steps, int[] stats) {
        if (low < high) {
            int pi = partition(array, low, high, steps, stats);

            quickSort(array, low, pi - 1, steps, stats);
            quickSort(array, pi + 1, high, steps, stats);
        }
    }

    private int partition(int[] array, int low, int high, List<SortingStep> steps, int[] stats) {
        int pivot = array[high];
        int i = (low - 1);
        
        // Visualize pivot selection? 
        // Maybe just let normal comparison highlight it.

        for (int j = low; j < high; j++) {
            stats[0]++; // Comparison
            
            // Visualize comparison: array[j] vs pivot (array[high])
            steps.add(new SortingStep(array, new int[]{j, high}, false));

            if (array[j] < pivot) {
                i++;

                // Swap array[i] and array[j]
                int temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                stats[1]++;
                
                // Visualize swap
                if (i != j) {
                    steps.add(new SortingStep(array, new int[]{i, j}, true));
                }
            }
        }

        // Swap array[i+1] and array[high] (or pivot)
        int temp = array[i + 1];
        array[i + 1] = array[high];
        array[high] = temp;
        stats[1]++;
        
        // Visualize pivot placement
        if (i+1 != high) {
           steps.add(new SortingStep(array, new int[]{i + 1, high}, true));
        }

        return i + 1;
    }
}
