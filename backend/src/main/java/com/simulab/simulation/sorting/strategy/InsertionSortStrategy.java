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
        int swaps = 0;
        List<Integer> sortedIndices = new ArrayList<>();

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

            while (j >= 0) {
                comparisons++;
                
                SortingStep compareStep = new SortingStep(array, new int[]{j, j + 1}, false);
                compareStep.setSortedIndices(new ArrayList<>(currentSorted));
                steps.add(compareStep);

                if (array[j] > key) {
                    array[j + 1] = array[j];
                    array[j] = key;
                     
                    swaps++;
                    SortingStep swapStep = new SortingStep(array, new int[]{j, j + 1}, true);
                    swapStep.setSortedIndices(new ArrayList<>(currentSorted));
                    steps.add(swapStep);
                    
                    j = j - 1;
                } else {
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