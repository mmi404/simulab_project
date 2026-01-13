package com.simulab.simulation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SimulationProgressRepository extends JpaRepository<UserSimulationProgress, Long> {
    Optional<UserSimulationProgress> findByUserIdAndSimulationId(Long userId, Long simulationId);
    List<UserSimulationProgress> findByUserId(Long userId);
}
