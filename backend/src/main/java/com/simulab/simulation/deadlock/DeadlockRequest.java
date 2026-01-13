package com.simulab.simulation.deadlock;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class DeadlockRequest {
    private List<String> processes;
    private List<String> resources;
    private List<Edge> edges;

    @Data
    @NoArgsConstructor
    public static class Edge {
        private String from;
        private String to;
        private String type; // "REQUEST" or "ALLOCATED"
    }
}