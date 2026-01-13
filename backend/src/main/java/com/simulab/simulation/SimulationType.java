package com.simulab.simulation;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "simulation_types")
@Data
@NoArgsConstructor
public class SimulationType {
    @Id
    @jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @jakarta.persistence.Column(name = "short_name")
    private String shortName;

    private String color;
}
