package com.simulab.simulation.sorting.model;

import java.util.List;

public class SortingResponse {
    private List<SortingStep> steps;
    private SortingStats stats;

    public SortingResponse() {}

    public SortingResponse(List<SortingStep> steps, SortingStats stats) {
        this.steps = steps;
        this.stats = stats;
    }

    public List<SortingStep> getSteps() {
        return steps;
    }

    public void setSteps(List<SortingStep> steps) {
        this.steps = steps;
    }

    public SortingStats getStats() {
        return stats;
    }

    public void setStats(SortingStats stats) {
        this.stats = stats;
    }
}