package com.simulab.simulation;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SimulationRunRepository extends JpaRepository<SimulationRun, Long> {
    List<SimulationRun> findByUserId(Long userId);
    List<SimulationRun> findByUserIdAndSimulationId(Long userId, Long simulationId);
}
