package com.simulab.simulation.sorting.strategy;

import com.simulab.simulation.sorting.model.SortingResponse;
import com.simulab.simulation.sorting.model.SortingStats;
import com.simulab.simulation.sorting.model.SortingStep;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("SelectionSort")
public class SelectionSortStrategy implements SortingStrategy {

    @Override
    public SortingResponse sort(int[] initialArray) {
        int[] array = initialArray.clone();
        List<SortingStep> steps = new ArrayList<>();
        int n = array.length;
        int comparisons = 0;
        int swaps = 0;
        List<Integer> sortedIndices = new ArrayList<>();

        // Add initial state
        SortingStep initialStep = new SortingStep(array, new int[]{}, false);
        initialStep.setSortedIndices(new ArrayList<>(sortedIndices));
        steps.add(initialStep);

        for (int i = 0; i < n - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < n; j++) {
                comparisons++;
                
                // Record comparison
                SortingStep compareStep = new SortingStep(array, new int[]{min_idx, j}, false);
                compareStep.setSortedIndices(new ArrayList<>(sortedIndices));
                steps.add(compareStep);

                if (array[j] < array[min_idx]) {
                    min_idx = j;
                }
            }

            // Swap the found minimum element with the first element
            if (min_idx != i) {
                int temp = array[min_idx];
                array[min_idx] = array[i];
                array[i] = temp;
                swaps++;
                
                // Record swap
                SortingStep swapStep = new SortingStep(array, new int[]{i, min_idx}, true);
                swapStep.setSortedIndices(new ArrayList<>(sortedIndices));
                steps.add(swapStep);
            }
            
            // Mark i as sorted
            sortedIndices.add(i);
        }
        
        // The last element is inherently sorted
        sortedIndices.add(n - 1);

        // Add final step
        SortingStep finalStep = new SortingStep(array, new int[]{}, false);
        finalStep.setSortedIndices(new ArrayList<>(sortedIndices));
        steps.add(finalStep);

        return new SortingResponse(steps, new SortingStats(comparisons, swaps));
    }
}