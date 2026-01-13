package com.simulab.simulation.sorting.service;

import com.simulab.simulation.sorting.model.SortingResponse;
import com.simulab.simulation.sorting.model.SortingRequest;
import com.simulab.simulation.sorting.strategy.SortingStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SortingService {

    private final Map<String, SortingStrategy> strategyMap = new ConcurrentHashMap<>();

    @Autowired
    public SortingService(Map<String, SortingStrategy> strategies) {
        // strategies map will contain bean names as keys (e.g., "BubbleSort")
        this.strategyMap.putAll(strategies);
    }

    public SortingResponse simulateSorting(SortingRequest request) {
        SortingStrategy strategy = strategyMap.get(request.getAlgorithm());
        if (strategy == null) {
            throw new IllegalArgumentException("Unknown algorithm: " + request.getAlgorithm());
        }
        return strategy.sort(request.getArray());
    }
}
