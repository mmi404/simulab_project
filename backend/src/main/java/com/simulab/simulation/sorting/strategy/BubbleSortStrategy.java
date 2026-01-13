package com.simulab.simulation.sorting.strategy;

import com.simulab.simulation.sorting.model.SortingResponse;
import com.simulab.simulation.sorting.model.SortingStats;
import com.simulab.simulation.sorting.model.SortingStep;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("BubbleSort")
public class BubbleSortStrategy implements SortingStrategy {

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
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                comparisons++;
                
                // Record comparison step
                steps.add(new SortingStep(array, new int[]{j, j + 1}, false));
                // Update sorted indices for current step
                steps.get(steps.size() - 1).setSortedIndices(new ArrayList<>(sortedIndices));

                if (array[j] > array[j + 1]) {
                    // Swap
                    int temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    swaps++;
                    swapped = true;

                    // Record swap step
                    steps.add(new SortingStep(array, new int[]{j, j + 1}, true));
                    // Update sorted indices for current step
                    steps.get(steps.size() - 1).setSortedIndices(new ArrayList<>(sortedIndices));
                }
            }
            
            // Element at n-i-1 is now sorted
            sortedIndices.add(n - i - 1);
            
            // If no elements were swapped by inner loop, then break
            if (!swapped) {
                // If not swapped, all remaining elements are sorted
                 for (int k = 0; k < n - i - 1; k++) {
                     if (!sortedIndices.contains(k)) {
                         sortedIndices.add(k);
                     }
                 }
                 break;
            }
        }
        
        // Add final sorted indices for the rest if any (handling the early break or end of loop)
        for (int k = 0; k < n; k++) {
             if (!sortedIndices.contains(k)) {
                 sortedIndices.add(k);
             }
        }

        // Add final step with all sorted
        SortingStep finalStep = new SortingStep(array, new int[]{}, false);
        finalStep.setSortedIndices(new ArrayList<>(sortedIndices));
        steps.add(finalStep);

        return new SortingResponse(steps, new SortingStats(comparisons, swaps));
    }
}