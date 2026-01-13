package com.simulab.simulation.bankers;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class BankersAlgorithmService {

    public BankersSafetyResponse runSafetyAlgorithm(BankersSafetyRequest request) {
        int[] available = request.getAvailable();
        Map<String, int[]> allocation = request.getAllocation();
        Map<String, int[]> max = request.getMax();

        // Validate inputs consistency
        if (allocation.isEmpty() || max.isEmpty()) {
            throw new IllegalArgumentException("Allocation and Max matrices cannot be empty.");
        }

        // Get process names (sorted to ensure deterministic order if needed, or better, respect input key set iteration if LinkedHashMap used, but basic map order is undefined usually unless specific)
        // Ideally we respect the order provided or sort them P0, P1...
        List<String> processes = new ArrayList<>(allocation.keySet());
        processes.sort(Comparator.naturalOrder()); // e.g. P0, P1, P2...

        int m = available.length; // Number of resources
        int n = processes.size(); // Number of processes

        // Compute Need Matrix
        Map<String, int[]> need = new HashMap<>();
        for (String p : processes) {
            int[] pAlloc = allocation.get(p);
            int[] pMax = max.get(p);
            int[] pNeed = new int[m];
            for (int i = 0; i < m; i++) {
                pNeed[i] = pMax[i] - pAlloc[i];
                if (pNeed[i] < 0) {
                     // Should technically not happen in valid state, but handle gracefully or ignore
                     pNeed[i] = 0; 
                }
            }
            need.put(p, pNeed);
        }

        // Safety Algorithm
        int[] work = Arrays.copyOf(available, m);
        Map<String, Boolean> finish = new HashMap<>();
        for (String p : processes) finish.put(p, false);

        List<String> safeSequence = new ArrayList<>();
        List<BankersStep> steps = new ArrayList<>();

        int count = 0;
        while (count < n) {
            boolean found = false;
            for (String p : processes) {
                if (!finish.get(p)) {
                    int[] pNeed = need.get(p);
                    // Record "Trying" step logic
                    int[] workBefore = Arrays.copyOf(work, m);
                    // DEBUG: System.out.println("Checking " + p + " Need: " + Arrays.toString(pNeed) + " Work: " + Arrays.toString(work));
                    boolean canAlloc = checkLessOrEqual(pNeed, work);
                    
                    if (canAlloc) {
                        // Work += Allocation[p]
                        int[] pAlloc = allocation.get(p);
                        for (int i = 0; i < m; i++) {
                            work[i] += pAlloc[i];
                        }
                        
                        finish.put(p, true);
                        safeSequence.add(p);
                        found = true;
                        count++;
                        
                        // Record Successful Step
                        steps.add(new BankersStep(
                            p,
                            workBefore,
                            pNeed,
                            true,
                            Arrays.copyOf(work, m)
                        ));
                    } else {
                        // Record Failed Step
                        steps.add(new BankersStep(
                            p,
                            workBefore,
                            pNeed,
                            false,
                            workBefore // Work doesn't change
                        ));
                    }
                }
            }
            if (!found) {
                break; // Unsafe state (deadlock possible)
            }
        }

        boolean isSafe = count == n;
        
        BankersSafetyResponse response = new BankersSafetyResponse();
        response.setSafe(isSafe);
        response.setSafeSequence(safeSequence);
        response.setSteps(steps);

        return response;
    }

    private boolean checkLessOrEqual(int[] need, int[] work) {
        for (int i = 0; i < need.length; i++) {
            if (need[i] > work[i]) {
                return false;
            }
        }
        return true;
    }
}
