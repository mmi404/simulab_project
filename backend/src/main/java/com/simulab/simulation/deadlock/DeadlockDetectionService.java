package com.simulab.simulation.deadlock;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DeadlockDetectionService {

    public DeadlockResponse detectDeadlock(DeadlockRequest request) {
        DeadlockResponse response = new DeadlockResponse();
        List<DeadlockStep> steps = new ArrayList<>();
        
        System.out.println("Deadlock Detection Request: " + request);

        Map<String, List<String>> adj = new HashMap<>();
        Set<String> allNodes = new HashSet<>();
        
        if (request.getProcesses() != null) allNodes.addAll(request.getProcesses());
        if (request.getResources() != null) allNodes.addAll(request.getResources());

        for (String node : allNodes) {
            adj.putIfAbsent(node, new ArrayList<>());
        }

        if (request.getEdges() != null) {
            for (DeadlockRequest.Edge edge : request.getEdges()) {
                String u = edge.getFrom();
                String v = edge.getTo();
                
                if (u == null || v == null) continue;
                
                adj.putIfAbsent(u, new ArrayList<>());
                adj.get(u).add(v);
                
                if (!allNodes.contains(u)) allNodes.add(u);
                if (!allNodes.contains(v)) allNodes.add(v);
            }
        }

        Set<String> visited = new HashSet<>();
        Set<String> recStack = new HashSet<>();
        List<String> cyclePath = new ArrayList<>();
        boolean cycleFound = false;

        List<String> sortedNodes = new ArrayList<>(allNodes);
        Collections.sort(sortedNodes);

        for (String node : sortedNodes) {
            if (!visited.contains(node)) {
                if (dfs(node, adj, visited, recStack, steps, cyclePath)) {
                    cycleFound = true;
                    break;
                }
            }
        }

        response.setDeadlockDetected(cycleFound);
        response.setSteps(steps);
        if (cycleFound) {
            response.setCycle(cyclePath);
        }
        
        return response;
    }

    private boolean dfs(String node, Map<String, List<String>> adj, Set<String> visited, Set<String> recStack, List<DeadlockStep> steps, List<String> cyclePath) {
        visited.add(node);
        recStack.add(node);
        
        steps.add(new DeadlockStep(node, new ArrayList<>(visited), new ArrayList<>(recStack), "visiting"));

        List<String> neighbors = adj.getOrDefault(node, Collections.emptyList());
        for (String neighbor : neighbors) {
            if (!visited.contains(neighbor)) {
                if (dfs(neighbor, adj, visited, recStack, steps, cyclePath)) {
                    return true;
                }
            } else if (recStack.contains(neighbor)) {
                steps.add(new DeadlockStep(neighbor, new ArrayList<>(visited), new ArrayList<>(recStack), "back-edge found to " + neighbor));
                
                cyclePath.add(neighbor);
                cyclePath.add(node);
                return true;
            }
        }

        recStack.remove(node);
        steps.add(new DeadlockStep(node, new ArrayList<>(visited), new ArrayList<>(recStack), "backtracking"));
        
        return false;
    }
}