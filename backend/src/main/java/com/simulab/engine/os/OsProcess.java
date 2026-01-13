package com.simulab.engine.os;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OsProcess implements Cloneable {
    private String id;
    private int arrivalTime;
    private int burstTime;
    private int priority;
    
    // State during simulation
    private int remainingTime;
    @Builder.Default
    private int startTime = -1;
    private int completionTime;
    private int waitingTime;
    private int turnAroundTime;
    
    @Override
    public OsProcess clone() {
        try {
            return (OsProcess) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
