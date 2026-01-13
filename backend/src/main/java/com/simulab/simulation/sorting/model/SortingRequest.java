package com.simulab.simulation.sorting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SortingRequest {
    private String algorithm;
    private int[] array;
}
