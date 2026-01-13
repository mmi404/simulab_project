package com.simulab.simulation;

import com.simulab.engine.SimulationResult;
import com.simulab.engine.os.SchedulerEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/simulate")
public class CpuSimulationController {

    private final SchedulerEngine schedulerEngine;
    private final SimulationProgressService progressService;

    public CpuSimulationController(SchedulerEngine schedulerEngine, SimulationProgressService progressService) {
        this.schedulerEngine = schedulerEngine;
        this.progressService = progressService;
    }

    @PostMapping("/cpu")
    public ResponseEntity<SimulationResult> simulateCpu(@RequestBody Map<String, Object> payload) {
        try {
            String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            progressService.recordSimulationRun(email, "cpu-scheduling");
        } catch (Exception e) {
            e.printStackTrace();
        }

        SimulationResult result = schedulerEngine.runSimulation(payload);
        return ResponseEntity.ok(result);
    }
}
