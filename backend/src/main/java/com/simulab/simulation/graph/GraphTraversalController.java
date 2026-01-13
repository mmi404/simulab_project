package com.simulab.simulation.graph;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulate/graph")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class GraphTraversalController {

    private final GraphTraversalService graphTraversalService;
    private final com.simulab.simulation.SimulationProgressService progressService;

    @Autowired
    public GraphTraversalController(GraphTraversalService graphTraversalService, com.simulab.simulation.SimulationProgressService progressService) {
        this.graphTraversalService = graphTraversalService;
        this.progressService = progressService;
    }

    @PostMapping("/traversal")
    public ResponseEntity<GraphSimulationResponse> simulateTraversal(@RequestBody GraphSimulationRequest request) {
        try {
            String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            progressService.recordSimulationRun(email, "graph-traversal");
        } catch (Exception e) {
            e.printStackTrace();
        }
        GraphSimulationResponse response = graphTraversalService.simulate(request);
        return ResponseEntity.ok(response);
    }
}
