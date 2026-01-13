package com.simulab.simulation.sorting.strategy;

import com.simulab.simulation.sorting.model.SortingResponse;
import com.simulab.simulation.sorting.model.SortingStats;
import com.simulab.simulation.sorting.model.SortingStep;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("InsertionSort")
public class InsertionSortStrategy implements SortingStrategy {

    @Override
    public SortingResponse sort(int[] initialArray) {
        int[] array = initialArray.clone();
        List<SortingStep> steps = new ArrayList<>();
        int n = array.length;
        int comparisons = 0;
        int swaps = 0; // In insertion sort, shifts can be counted as swaps or distinct moves
        List<Integer> sortedIndices = new ArrayList<>(); // Insertion sort grows the sorted part, but usually only truly "sorted" relative to itself until the end.
        // However, we can visualize indices 0..i as the sorted partition.

        // Add initial state
        SortingStep initialStep = new SortingStep(array, new int[]{}, false);
        initialStep.setSortedIndices(new ArrayList<>(sortedIndices));
        steps.add(initialStep);

        for (int i = 1; i < n; ++i) {
            int key = array[i];
            int j = i - 1;

            // Visualizing the key selection
            SortingStep keyStep = new SortingStep(array, new int[]{i}, false);
            // In insertion sort, 0 to i-1 are "sorted" relative to each other
            List<Integer> currentSorted = new ArrayList<>();
            for(int k=0; k<i; k++) currentSorted.add(k);
            keyStep.setSortedIndices(currentSorted);
            steps.add(keyStep);

            /* Move elements of arr[0..i-1], that are
               greater than key, to one position ahead
               of their current position */
            while (j >= 0) {
                comparisons++;
                
                // Compare key with array[j]
                // Note: key is not in the array at 'i' anymore effectively, but for viz we show swaps
                // We'll treat array[j+1] vs array[j] comparisons effectively as we bubble the key down
                
                SortingStep compareStep = new SortingStep(array, new int[]{j, j + 1}, false);
                compareStep.setSortedIndices(new ArrayList<>(currentSorted));
                steps.add(compareStep);

                if (array[j] > key) {
                    array[j + 1] = array[j];
                    // We can visualize this as a swap or just overwrite. A swap is clearer for visualization usually.
                    // Let's reflect the virtual swap in the array for visualization
                    array[j] = key; // Temporarily put key here for visualization if we treat it as swap
                     
                    swaps++;
                    SortingStep swapStep = new SortingStep(array, new int[]{j, j + 1}, true);
                    swapStep.setSortedIndices(new ArrayList<>(currentSorted));
                    steps.add(swapStep);
                    
                    // Restore true logic state (array[j] was overwritten by shifting, key is 'floating')
                    // But to keep visualization consistent with "swapping down", we leave key at array[j]
                    // The standard algorithm overwrites. But visualizers often show swapping.
                    // Let's stick to the swapping metaphor for visual clarity.
                    
                    j = j - 1;
                } else {
                    // Important: if we didn't enter the loop body, we still did a comparison above.
                    // But we need to break.
                    break;
                }
            }
            array[j + 1] = key;
        }

        // Final sorted state
        for(int k=0; k<n; k++) sortedIndices.add(k);
        SortingStep finalStep = new SortingStep(array, new int[]{}, false);
        finalStep.setSortedIndices(new ArrayList<>(sortedIndices));
        steps.add(finalStep);

        return new SortingResponse(steps, new SortingStats(comparisons, swaps));
    }
}
