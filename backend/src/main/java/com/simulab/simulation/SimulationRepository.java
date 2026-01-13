package com.simulab.simulation;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SimulationRepository extends JpaRepository<Simulation, Long> {
    List<Simulation> findByActiveTrue();
    // findByCategory is replaced by findByType_Name or findByType
    List<Simulation> findByType_Name(String typeName);
    Optional<Simulation> findBySlug(String slug);
}
