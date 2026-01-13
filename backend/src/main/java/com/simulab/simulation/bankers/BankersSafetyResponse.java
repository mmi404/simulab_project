package com.simulab.simulation.bankers;

import java.util.List;

public class BankersSafetyResponse {
    private boolean safe;
    private List<String> safeSequence;
    private List<BankersStep> steps;

    public BankersSafetyResponse() {}

    public boolean isSafe() { return safe; }
    public void setSafe(boolean safe) { this.safe = safe; }

    public List<String> getSafeSequence() { return safeSequence; }
    public void setSafeSequence(List<String> safeSequence) { this.safeSequence = safeSequence; }

    public List<BankersStep> getSteps() { return steps; }
    public void setSteps(List<BankersStep> steps) { this.steps = steps; }
}