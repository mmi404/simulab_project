package com.simulab.simulation;

import com.simulab.auth.User;
import com.simulab.auth.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SimulationService {

    private final SimulationRepository simulationRepository;
    private final SimulationTypeRepository simulationTypeRepository;
    private final SimulationRunRepository runRepository;
    private final SimulationProgressRepository progressRepository;
    private final UserRepository userRepository;

    @PostConstruct
    public void seedData() {
        if (simulationRepository.count() == 0) {
            // Helper to get or create type
            SimulationType osType = getOrCreateType("Operating Systems", "OS", "#4F46E5");
            SimulationType algoType = getOrCreateType("Algorithms", "ALGO", "#16A34A");

            saveSimulation("CPU Scheduling", "cpu-scheduling", osType, 
                "Visualize FCFS, SJF, RR algorithms.", 
                "Learn how the Operating System decides which process runs next using various scheduling algorithms like First-Come-First-Serve, Shortest Job First, and Round Robin.",
                "cpu", "beginner");

            saveSimulation("Deadlock Detection", "deadlock-detection", osType, 
                "Understand resource allocation and cycles.", 
                "Interactive Resource Allocation Graph (RAG) visualizer to detect deadlocks in a system.",
                "layers", "intermediate");

            saveSimulation("Page Replacement", "page-replacement", osType, 
                "FIFO, LRU, Optimal page swappers.", 
                "See how memory management units swap pages in and out of physical memory when page faults occur.",
                "server", "intermediate");
        }
        
        // Ensure Sorting is present even if DB was already seeded with others
        if (simulationRepository.findBySlug("sorting").isEmpty()) {
             SimulationType algoType = getOrCreateType("Algorithms", "ALGO", "#16A34A");
             saveSimulation("Sorting Algorithms", "sorting", algoType, 
                "Bubble, Merge, Quick Sort visualized.", 
                "Watch elements swap and move in real-time to understand O(n^2) vs O(n log n) sorting complexities.",
                "arrow-up-down", "beginner");
        }

        if (simulationRepository.findBySlug("graph-traversal").isEmpty()) {
             SimulationType algoType = getOrCreateType("Algorithms", "ALGO", "#16A34A");
             saveSimulation("Graph Traversal", "graph-traversal", algoType, 
                "Visualize BFS and DFS.", 
                "Explore how Breadth-First Search and Depth-First Search traverse graph nodes.",
                "share-2", "intermediate");
        }

        if (simulationRepository.findBySlug("bankers-algorithm").isEmpty()) {
             SimulationType osType = getOrCreateType("Operating Systems", "OS", "#4F46E5");
             saveSimulation("Banker's Algorithm", "bankers-algorithm", osType, 
                "Deadlock Avoidance.", 
                "Simulate resource allocation and safe state checks.",
                "lock", "advanced");
        }


        // No migration needed for category/active flags as user updated DB schema manually.
    }

    private SimulationType getOrCreateType(String name, String shortName, String color) {
        // Simple logic, assume small number of types
        return simulationTypeRepository.findAll().stream()
            .filter(t -> t.getName().equalsIgnoreCase(name))
            .findFirst()
            .orElseGet(() -> {
                SimulationType t = new SimulationType();
                // IDs are usually auto-gen, but user schema implies specific IDs? 
                // We'll let null ID trigger auto-generation or assume repository handles it.
                // If user schema has IDs 1 and 2, we might conflict if we don't check ID.
                // Assuming DB is set up, this is just for dev environments.
                t.setId(name.equals("Operating Systems") ? 1L : 2L); 
                t.setName(name);
                t.setShortName(shortName);
                t.setColor(color);
                return simulationTypeRepository.save(t);
            });
    }

    private void saveSimulation(String title, String slug, SimulationType type, String shortDesc, String longDesc, String icon, String diff) {
        Simulation s = new Simulation();
        s.setTitle(title);
        s.setSlug(slug);
        s.setType(type);
        s.setShortDescription(shortDesc);
        s.setLongDescription(longDesc);
        s.setIcon(icon);
        s.setDifficulty(diff);
        s.setActive(true);
        simulationRepository.save(s);
    }

    public List<Simulation> getAllSimulations() {
        return simulationRepository.findAll();
    }

    public List<SimulationType> getAllSimulationTypes() {
        return simulationTypeRepository.findAll();
    }
    
    public Simulation getSimulation(Long id) {
        return simulationRepository.findById(id).orElseThrow(() -> new RuntimeException("Simulation not found"));
    }

    public Simulation getSimulationBySlug(String slug) {
        return simulationRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Simulation not found: " + slug));
    }

    public List<Simulation> getSimulationsByType(String typeName) {
        return simulationRepository.findByType_Name(typeName);
    }

    public void recordRun(Long userId, Long simulationId, String inputData) {
        User user = userRepository.findById(userId).orElseThrow();
        Simulation simulation = simulationRepository.findById(simulationId).orElseThrow();

        SimulationRun run = new SimulationRun();
        run.setUser(user);
        run.setSimulation(simulation);
        run.setInputData(inputData);
        runRepository.save(run);
    }
    
    public void markCompleted(Long userId, Long simulationId) {
        User user = userRepository.findById(userId).orElseThrow();
        Simulation simulation = simulationRepository.findById(simulationId).orElseThrow();
        
        UserSimulationProgress progress = progressRepository.findByUserIdAndSimulationId(userId, simulationId)
                .orElse(new UserSimulationProgress());
        
        if (progress.getId() == null) {
            progress.setUser(user);
            progress.setSimulation(simulation);
        }
        
        progress.setCompleted(true);
        progressRepository.save(progress);
    }
}
