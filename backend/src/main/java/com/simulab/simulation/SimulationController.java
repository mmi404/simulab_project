package com.simulab.simulation;

import com.simulab.engine.SimulationEngine;
import com.simulab.engine.SimulationResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/simulations")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;
    private final SimulationEngine schedulerEngine; // We might have multiple, need resolution strategy later
    
    // For now, simple injection works if we only have one engine implementation or use @Qualifier
    // but simulationService is better place to route?
    // Let's keep logic in Controller for simplicity of "Running" or Service.
    
    @GetMapping
    public ResponseEntity<List<Simulation>> getAllSimulations() {
        return ResponseEntity.ok(simulationService.getAllSimulations());
    }

    @GetMapping("/types")
    public ResponseEntity<List<SimulationType>> getSimulationTypes() {
        return ResponseEntity.ok(simulationService.getAllSimulationTypes());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Simulation> getSimulationBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(simulationService.getSimulationBySlug(slug));
    }

    @PostMapping("/run")
    public ResponseEntity<SimulationResult> runSimulation(@RequestBody Map<String, Object> params) {
        // Decide which engine to use based on params or ID
        // For Phase 1, we assume all requests go to SchedulerEngine if type is "OS"
        // Let's assume params has "type": "OS" or "ALGO"
        
        return ResponseEntity.ok(schedulerEngine.runSimulation(params));
    }
}
