package com.simulab.simulation.sorting.strategy;

import com.simulab.simulation.sorting.model.SortingResponse;

public interface SortingStrategy {
    SortingResponse sort(int[] array);
}
