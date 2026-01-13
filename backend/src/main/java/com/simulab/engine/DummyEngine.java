package com.simulab.engine;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@Primary
public class DummyEngine implements SimulationEngine {

    @Override
    public SimulationResult runSimulation(Map<String, Object> inputParams) {
        return SimulationResult.builder()
                .steps(Collections.emptyList())
                .gantt(Collections.emptyList())
                .metrics(Collections.emptyMap())
                .build();
    }

    @Override
    public String getAlgorithmName() {
        return "Not Implemented";
    }
}
