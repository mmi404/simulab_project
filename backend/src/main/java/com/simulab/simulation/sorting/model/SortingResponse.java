package com.simulab.simulation.sorting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SortingResponse {
    private List<SortingStep> steps;
    private SortingStats stats;
}
