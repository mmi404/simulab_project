package com.simulab.simulation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimulationTypeRepository extends JpaRepository<SimulationType, Long> {
}
