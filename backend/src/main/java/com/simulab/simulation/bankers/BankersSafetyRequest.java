package com.simulab.simulation.bankers;

import java.util.Map;

public class BankersSafetyRequest {
    private int[] available;
    private Map<String, int[]> allocation;
    private Map<String, int[]> max;

    public BankersSafetyRequest() {}

    public int[] getAvailable() { return available; }
    public void setAvailable(int[] available) { this.available = available; }

    public Map<String, int[]> getAllocation() { return allocation; }
    public void setAllocation(Map<String, int[]> allocation) { this.allocation = allocation; }

    public Map<String, int[]> getMax() { return max; }
    public void setMax(Map<String, int[]> max) { this.max = max; }
}