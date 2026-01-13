package com.simulab.simulation;

import com.simulab.auth.User;
import com.simulab.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SimulationProgressService {

    private final UserRepository userRepository;
    private final SimulationRepository simulationRepository;
    private final SimulationRunRepository runRepository;

    public void recordSimulationRun(String email, String simulationSlug) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) return;

            Simulation simulation = simulationRepository.findBySlug(simulationSlug).orElse(null);
            if (simulation == null) return;

            SimulationRun run = new SimulationRun();
            run.setUser(user);
            run.setSimulation(simulation);
            run.setInputData("{}"); // Empty JSON for now
            runRepository.save(run);
        } catch (Exception e) {
            // Log error but don't fail the simulation
            System.err.println("Failed to record simulation run: " + e.getMessage());
        }
    }
}