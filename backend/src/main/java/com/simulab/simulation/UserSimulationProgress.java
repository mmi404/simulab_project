package com.simulab.simulation;

import com.simulab.auth.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_simulation_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "simulation_id"})
})
@Data
@NoArgsConstructor
public class UserSimulationProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "simulation_id", nullable = false)
    private Simulation simulation;

    @Column(name = "runs_count", nullable = false)
    private int runsCount = 0;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean completed = false;

    @Column(name = "first_run_at")
    private LocalDateTime firstRunAt;

    @Column(name = "last_run_at")
    private LocalDateTime lastRunAt;
}
