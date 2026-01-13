package com.simulab.simulation.deadlock;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeadlockStep {
    private String currentNode;
    private List<String> visited;
    private List<String> recursionStack;
    private String action; // e.g., "visiting", "back-edge found", "backtracking"
}