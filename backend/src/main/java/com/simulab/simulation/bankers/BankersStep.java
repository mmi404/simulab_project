package com.simulab.simulation.bankers;

public class BankersStep {
    private String process;
    private int[] workBefore;
    private int[] need;
    private boolean canExecute;
    private int[] workAfter;

    public BankersStep() {}

    public BankersStep(String process, int[] workBefore, int[] need, boolean canExecute, int[] workAfter) {
        this.process = process;
        this.workBefore = workBefore;
        this.need = need;
        this.canExecute = canExecute;
        this.workAfter = workAfter;
    }

    public String getProcess() { return process; }
    public void setProcess(String process) { this.process = process; }

    public int[] getWorkBefore() { return workBefore; }
    public void setWorkBefore(int[] workBefore) { this.workBefore = workBefore; }

    public int[] getNeed() { return need; }
    public void setNeed(int[] need) { this.need = need; }

    public boolean isCanExecute() { return canExecute; }
    public void setCanExecute(boolean canExecute) { this.canExecute = canExecute; }

    public int[] getWorkAfter() { return workAfter; }
    public void setWorkAfter(int[] workAfter) { this.workAfter = workAfter; }
}