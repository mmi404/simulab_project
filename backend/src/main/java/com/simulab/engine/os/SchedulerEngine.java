package com.simulab.engine.os;

import com.simulab.engine.SimulationEngine;
import com.simulab.engine.SimulationResult;
import com.simulab.engine.SimulationStep;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class SchedulerEngine implements SimulationEngine {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String getAlgorithmName() {
        return "CPU_SCHEDULER";
    }

    @Override
    public SimulationResult runSimulation(Map<String, Object> inputParams) {
        String algorithm = (String) inputParams.get("algorithm");
        int quantum = inputParams.containsKey("quantum") ? (int) inputParams.get("quantum") : 2;

        List<Map<String, Object>> processesRaw = (List<List<Map<String, Object>>>) inputParams.get("processes") instanceof List 
                ? (List<Map<String, Object>>) inputParams.get("processes") 
                : new ArrayList<>();
        
        List<OsProcess> processes = processesRaw.stream()
                .map(p -> mapper.convertValue(p, OsProcess.class))
                .collect(Collectors.toList());
        
        // Initialize state
        processes.forEach(p -> {
            p.setRemainingTime(p.getBurstTime());
            p.setStartTime(-1);
        });

        switch (algorithm) {
            case "FCFS":
                return runScheduler(processes, new FCFSComparator(), false, 0);
            case "SJF":
                return runScheduler(processes, new SJFComparator(), false, 0);
            case "SRTF": // Preemptive SJF
                return runScheduler(processes, new SJFComparator(), true, 0);
            case "Priority":
                return runScheduler(processes, new PriorityComparator(), false, 0);
            case "RR":
                return runRoundRobin(processes, quantum);
            default:
                throw new IllegalArgumentException("Unknown algorithm: " + algorithm);
        }
    }

    private SimulationResult runScheduler(List<OsProcess> processes, Comparator<OsProcess> comparator, boolean preemptive, int quantum) {
        List<SimulationStep> steps = new ArrayList<>();
        List<String> gantt = new ArrayList<>();
        
        List<OsProcess> readyQueue = new ArrayList<>();
        List<OsProcess> completed = new ArrayList<>();
        
        List<OsProcess> pendingArrivals = new ArrayList<>(processes);
        pendingArrivals.sort(Comparator.comparingInt(OsProcess::getArrivalTime));
        
        int currentTime = 0;
        OsProcess currentProcess = null;
        int completedCount = 0;
        int n = processes.size();
        
        while (completedCount < n) {
            Iterator<OsProcess> it = pendingArrivals.iterator();
            boolean newArrival = false;
            while (it.hasNext()) {
                OsProcess p = it.next();
                if (p.getArrivalTime() <= currentTime) {
                    readyQueue.add(p);
                    it.remove();
                    newArrival = true;
                } else {
                    break;
                }
            }

            if (preemptive && currentProcess != null && newArrival) {
                 OsProcess best = readyQueue.stream().min(comparator).orElse(null);
                 if (best != null && comparator.compare(best, currentProcess) < 0) {
                     readyQueue.add(currentProcess);
                     currentProcess = null;
                 }
            }

            if (currentProcess == null && !readyQueue.isEmpty()) {
                readyQueue.sort(comparator);
                currentProcess = readyQueue.remove(0);
                if (currentProcess.getStartTime() == -1) {
                    currentProcess.setStartTime(currentTime);
                }
            }

            steps.add(createStep(steps.size(), currentTime, currentProcess, readyQueue, processes));

            if (currentProcess != null) {
                currentProcess.setRemainingTime(currentProcess.getRemainingTime() - 1);
                gantt.add(currentProcess.getId());
                
                if (currentProcess.getRemainingTime() == 0) {
                    currentProcess.setCompletionTime(currentTime + 1);
                    currentProcess.setTurnAroundTime(currentProcess.getCompletionTime() - currentProcess.getArrivalTime());
                    currentProcess.setWaitingTime(currentProcess.getTurnAroundTime() - currentProcess.getBurstTime());
                    
                    completed.add(currentProcess);
                    completedCount++;
                    currentProcess = null;
                }
            } else {
                gantt.add(null);
            }
            
            currentTime++;
        }
        
        steps.add(createStep(steps.size(), currentTime, null, readyQueue, processes));

        return buildResult(steps, gantt, completed);
    }
    
    private SimulationResult runRoundRobin(List<OsProcess> processes, int quantum) {
        List<SimulationStep> steps = new ArrayList<>();
        List<String> gantt = new ArrayList<>();
        Deque<OsProcess> readyQueue = new ArrayDeque<>();
        List<OsProcess> completed = new ArrayList<>();
        
        List<OsProcess> pendingArrivals = new ArrayList<>(processes);
        pendingArrivals.sort(Comparator.comparingInt(OsProcess::getArrivalTime));
        
        int currentTime = 0;
        OsProcess currentProcess = null;
        int completedCount = 0;
        int n = processes.size();
        int currentQuantum = 0;
        
        while (completedCount < n) {
            Iterator<OsProcess> it = pendingArrivals.iterator();
            while (it.hasNext()) {
                OsProcess p = it.next();
                if (p.getArrivalTime() <= currentTime) {
                    readyQueue.addLast(p);
                    it.remove();
                } else {
                    break;
                }
            }

            if (currentProcess == null && !readyQueue.isEmpty()) {
                currentProcess = readyQueue.pollFirst();
                currentQuantum = 0;
                if (currentProcess.getStartTime() == -1) {
                    currentProcess.setStartTime(currentTime);
                }
            }

            steps.add(createStep(steps.size(), currentTime, currentProcess, new ArrayList<>(readyQueue), processes));

            if (currentProcess != null) {
                currentProcess.setRemainingTime(currentProcess.getRemainingTime() - 1);
                gantt.add(currentProcess.getId());
                currentQuantum++;
                
                if (currentProcess.getRemainingTime() == 0) {
                    currentProcess.setCompletionTime(currentTime + 1);
                    currentProcess.setTurnAroundTime(currentProcess.getCompletionTime() - currentProcess.getArrivalTime());
                    currentProcess.setWaitingTime(currentProcess.getTurnAroundTime() - currentProcess.getBurstTime());
                    completed.add(currentProcess);
                    completedCount++;
                    currentProcess = null;
                    currentQuantum = 0;
                } else if (currentQuantum >= quantum) {
                    readyQueue.addLast(currentProcess);
                    currentProcess = null;
                    currentQuantum = 0;
                }
            } else {
                gantt.add(null);
            }
            
            currentTime++;
        }
        
        steps.add(createStep(steps.size(), currentTime, null, new ArrayList<>(readyQueue), processes));

        return buildResult(steps, gantt, completed);
    }

    private SimulationStep createStep(int id, int time, OsProcess running, List<OsProcess> queue, List<OsProcess> allProcesses) {
        Map<String, Number> remaining = allProcesses.stream()
                .filter(p -> p.getRemainingTime() > 0)
                .collect(Collectors.toMap(OsProcess::getId, OsProcess::getRemainingTime));

        List<String> queueIds = queue.stream().map(OsProcess::getId).collect(Collectors.toList());

        return SimulationStep.builder()
                .stepId(id)
                .description("Time " + time)
                .state(Map.of(
                        "time", time,
                        "running", running != null ? running.getId() : "IDLE",
                        "readyQueue", queueIds,
                        "remaining", remaining
                ))
                .build();
    }

    private SimulationResult buildResult(List<SimulationStep> steps, List<String> gantt, List<OsProcess> completed) {
         double avgWait = completed.stream().mapToInt(OsProcess::getWaitingTime).average().orElse(0.0);
         double avgTurnaround = completed.stream().mapToInt(OsProcess::getTurnAroundTime).average().orElse(0.0);
         
         return SimulationResult.builder()
                 .steps(steps)
                 .gantt(gantt)
                 .metrics(Map.of(
                         "avgWaitingTime", avgWait,
                         "avgTurnaroundTime", avgTurnaround
                 ))
                 .build();
    }
    
    static class FCFSComparator implements Comparator<OsProcess> {
        @Override
        public int compare(OsProcess p1, OsProcess p2) {
             return Integer.compare(p1.getArrivalTime(), p2.getArrivalTime());
        }
    }

    static class SJFComparator implements Comparator<OsProcess> {
        @Override
        public int compare(OsProcess p1, OsProcess p2) {
            int burstCompare = Integer.compare(p1.getRemainingTime(), p2.getRemainingTime());
            if (burstCompare != 0) return burstCompare;
            return Integer.compare(p1.getArrivalTime(), p2.getArrivalTime());
        }
    }
    
    static class PriorityComparator implements Comparator<OsProcess> {
        @Override
        public int compare(OsProcess p1, OsProcess p2) {
            int prioCompare = Integer.compare(p1.getPriority(), p2.getPriority());
            if (prioCompare != 0) return prioCompare; 
            return Integer.compare(p1.getArrivalTime(), p2.getArrivalTime());
        }
    }
}
