package com.simulab.simulation.bankers;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class BankersAlgorithmService {

    public BankersSafetyResponse runSafetyAlgorithm(BankersSafetyRequest request) {
        int[] available = request.getAvailable();
        Map<String, int[]> allocation = request.getAllocation();
        Map<String, int[]> max = request.getMax();

        if (allocation.isEmpty() || max.isEmpty()) {
            throw new IllegalArgumentException("Allocation and Max matrices cannot be empty.");
        }

        List<String> processes = new ArrayList<>(allocation.keySet());
        processes.sort(Comparator.naturalOrder());

        int m = available.length;
        int n = processes.size();

        Map<String, int[]> need = new HashMap<>();
        for (String p : processes) {
            int[] pAlloc = allocation.get(p);
            int[] pMax = max.get(p);
            int[] pNeed = new int[m];
            for (int i = 0; i < m; i++) {
                pNeed[i] = pMax[i] - pAlloc[i];
                if (pNeed[i] < 0) {
                     pNeed[i] = 0; 
                }
            }
            need.put(p, pNeed);
        }

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
                    int[] workBefore = Arrays.copyOf(work, m);
                    boolean canAlloc = checkLessOrEqual(pNeed, work);
                    
                    if (canAlloc) {
                        int[] pAlloc = allocation.get(p);
                        for (int i = 0; i < m; i++) {
                            work[i] += pAlloc[i];
                        }
                        
                        finish.put(p, true);
                        safeSequence.add(p);
                        found = true;
                        count++;
                        
                        steps.add(new BankersStep(
                            p,
                            workBefore,
                            pNeed,
                            true,
                            Arrays.copyOf(work, m)
                        ));
                    } else {
                        steps.add(new BankersStep(
                            p,
                            workBefore,
                            pNeed,
                            false,
                            workBefore
                        ));
                    }
                }
            }
            if (!found) {
                break;
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