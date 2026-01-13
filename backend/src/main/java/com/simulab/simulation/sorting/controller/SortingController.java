package com.simulab.simulation.sorting.controller;

import com.simulab.simulation.sorting.model.SortingRequest;
import com.simulab.simulation.sorting.model.SortingResponse;
import com.simulab.simulation.sorting.service.SortingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulate/sorting")
@CrossOrigin(origins = "*")
public class SortingController {

    private final SortingService sortingService;
    private final com.simulab.simulation.SimulationProgressService progressService;

    @Autowired
    public SortingController(SortingService sortingService, com.simulab.simulation.SimulationProgressService progressService) {
        this.sortingService = sortingService;
        this.progressService = progressService;
    }

    @PostMapping
    public ResponseEntity<SortingResponse> simulateSorting(@RequestBody SortingRequest request) {
        // Record progress
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            System.out.println("DEBUG: SortingController auth name: " + email);
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(email)) {
                 System.out.println("DEBUG: User is not authenticated or anonymous.");
            } else {
                 // Assuming "sorting" is the slug for Sorting Algorithms
                 progressService.recordSimulationRun(email, "sorting");
            }
        } catch (Exception e) {
            System.out.println("DEBUG: Error in SortingController progress recording:");
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(sortingService.simulateSorting(request));
    }
}