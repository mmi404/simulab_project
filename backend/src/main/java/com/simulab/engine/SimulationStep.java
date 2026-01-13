package com.simulab.engine;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class SimulationStep {
    private int stepId;
    private String description;
    private Map<String, Object> state;
}
