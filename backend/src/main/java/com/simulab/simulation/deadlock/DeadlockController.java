package com.simulab.simulation.deadlock;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulate/deadlock")
@RequiredArgsConstructor
public class DeadlockController {

    private final DeadlockDetectionService deadlockService;
    private final com.simulab.simulation.SimulationProgressService progressService;

    @PostMapping
    public ResponseEntity<DeadlockResponse> detectDeadlock(@RequestBody DeadlockRequest request) {
        try {
            String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            progressService.recordSimulationRun(email, "deadlock-detection");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(deadlockService.detectDeadlock(request));
    }
}