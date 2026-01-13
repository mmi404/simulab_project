package com.simulab.simulation;

import com.simulab.auth.User;
import com.simulab.auth.UserRepository;
import com.simulab.simulation.dto.DashboardSimulationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SimulationProgressService {

    private final SimulationRepository simulationRepository;
    private final SimulationProgressRepository progressRepository;
    private final UserRepository userRepository;

    @Transactional
    public void recordSimulationRun(Long userId, String simulationSlug) {
        Simulation simulation = simulationRepository.findBySlug(simulationSlug)
                .orElseThrow(() -> {
                     System.out.println("DEBUG: Simulation not found for slug: " + simulationSlug);
                     return new RuntimeException("Simulation not found: " + simulationSlug);
                });
        System.out.println("DEBUG: Simulation found: " + simulation.getId());

        UserSimulationProgress progress = progressRepository.findByUserIdAndSimulationId(userId, simulation.getId())
                .orElseGet(() -> {
                    UserSimulationProgress p = new UserSimulationProgress();
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    p.setUser(user);
                    p.setSimulation(simulation);
                    p.setFirstRunAt(LocalDateTime.now());
                    return p;
                });

        progress.setRunsCount(progress.getRunsCount() + 1);
        progress.setLastRunAt(LocalDateTime.now());
        progress.setCompleted(true); // Auto-complete on run for now

        progressRepository.saveAndFlush(progress);
    }

    @Transactional
    public void recordSimulationRun(String email, String simulationSlug) {
        System.out.println("DEBUG: recordSimulationRun called for email: " + email + ", slug: " + simulationSlug);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("DEBUG: User not found for email: " + email);
                    return new RuntimeException("User not found: " + email);
                });
        System.out.println("DEBUG: User found: " + user.getId());
        recordSimulationRun(user.getId(), simulationSlug);
    }

    public List<DashboardSimulationDTO> getUserDashboard(String email) {
         User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return getUserDashboard(user.getId());
    }

    public List<DashboardSimulationDTO> getUserDashboard(Long userId) {
        List<Simulation> allSimulations = simulationRepository.findByActiveTrue();
        List<UserSimulationProgress> userProgress = progressRepository.findByUserId(userId);

        Map<Long, UserSimulationProgress> progressMap = userProgress.stream()
                .collect(Collectors.toMap(p -> p.getSimulation().getId(), p -> p));

        return allSimulations.stream().map(sim -> {
            UserSimulationProgress p = progressMap.get(sim.getId());
            return DashboardSimulationDTO.builder()
                    .simulation(sim.getTitle())
                    .slug(sim.getSlug())
                    .category(sim.getType() != null ? sim.getType().getName() : "Unknown")
                    .completed(p != null && p.isCompleted())
                    .runsCount(p != null ? p.getRunsCount() : 0)
                    .lastRunAt(p != null ? p.getLastRunAt() : null)
                    .build();
        }).collect(Collectors.toList());
    }
}
