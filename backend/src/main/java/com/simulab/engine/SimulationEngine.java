package com.simulab.engine;

import java.util.Map;

public interface SimulationEngine {
    SimulationResult runSimulation(Map<String, Object> inputParams);
    String getAlgorithmName();
}
