package com.simulab.simulation.bankers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulate/bankers")
@CrossOrigin(origins = "*")
public class BankersAlgorithmController {

    @Autowired
    private BankersAlgorithmService bankersService;

    @Autowired
    private com.simulab.simulation.SimulationProgressService progressService;

    @PostMapping("/safety")
    public BankersSafetyResponse runSafetyAlgorithm(@RequestBody BankersSafetyRequest request) {
        try {
            String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            progressService.recordSimulationRun(email, "bankers-algorithm");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bankersService.runSafetyAlgorithm(request);
    }
}