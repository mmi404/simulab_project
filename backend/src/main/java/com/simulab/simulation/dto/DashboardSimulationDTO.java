package com.simulab.simulation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSimulationDTO {
    private String simulation;
    private String slug;
    private String category;
    private boolean completed;
    private int runsCount;
    private LocalDateTime lastRunAt;
}
