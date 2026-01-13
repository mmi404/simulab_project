package com.simulab.engine;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class SimulationResult {
    private List<SimulationStep> steps;
    private List<String> gantt;
    private Map<String, Object> metrics;
}
