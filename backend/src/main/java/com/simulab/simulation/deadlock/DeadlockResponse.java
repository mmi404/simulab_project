package com.simulab.simulation.deadlock;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class DeadlockResponse {
    private boolean deadlockDetected;
    private List<DeadlockStep> steps;
    private List<String> cycle;
}
