package com.simulab.simulation;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "simulations")
@Data
@NoArgsConstructor
public class Simulation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_id")
    private SimulationType type;

    @Column(name = "short_description", length = 255)
    private String shortDescription;

    @Column(name = "long_description", columnDefinition = "TEXT")
    private String longDescription;

    @Column(length = 50)
    private String icon;

    // Mapping Enum to String works fine as long as values are compatible strings.
    // DB has lowercase 'beginner', 'intermediate', etc.
    // We will read them as Strings.
    @Column(columnDefinition = "ENUM('beginner','intermediate','advanced')")
    private String difficulty; 

    // User's schema has BOTH active and is_active.
    // We map to 'active' as per previous code, but ensure we match the column definition if needed.
    // Schema: active tinyint(1) default 1.
    @Column(name = "active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean active = true;

    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1", insertable = false, updatable = false)
    private Boolean isActiveColumn; // Read-only mapping for is_active to avoid confusion or just ignore it.
}
