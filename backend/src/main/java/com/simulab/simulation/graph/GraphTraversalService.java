package com.simulab.simulation.graph;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GraphTraversalService {

    public GraphSimulationResponse simulate(GraphSimulationRequest request) {
        if ("BFS".equalsIgnoreCase(request.getAlgorithm())) {
            return simulateBFS(request);
        } else if ("DFS".equalsIgnoreCase(request.getAlgorithm())) {
            return simulateDFS(request);
        } else {
            throw new IllegalArgumentException("Unknown algorithm: " + request.getAlgorithm());
        }
    }

    private GraphSimulationResponse simulateBFS(GraphSimulationRequest request) {
        Map<String, List<String>> adj = buildAdjacencyList(request.getNodes(), request.getEdges());
        List<String> visitedOrder = new ArrayList<>();
        List<GraphSimulationResponse.Step> steps = new ArrayList<>();
        
        Set<String> visited = new LinkedHashSet<>();
        Queue<String> queue = new LinkedList<>();

        String start = request.getStart();
        if (start != null && adj.containsKey(start)) {
            visited.add(start);
            queue.add(start);
            
            // Initial step
            steps.add(new GraphSimulationResponse.Step(
                null, 
                new ArrayList<>(visited), 
                new ArrayList<>(queue)
            ));
        }

        while (!queue.isEmpty()) {
            String current = queue.poll();
            visitedOrder.add(current);

            List<String> neighbors = adj.getOrDefault(current, Collections.emptyList());
            // Sort neighbors for deterministic behavior (e.g. alphabetical)
            Collections.sort(neighbors);

            for (String neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }

            steps.add(new GraphSimulationResponse.Step(
                current,
                new ArrayList<>(visited),
                new ArrayList<>(queue)
            ));
        }

        return new GraphSimulationResponse(visitedOrder, steps);
    }

    private GraphSimulationResponse simulateDFS(GraphSimulationRequest request) {
        Map<String, List<String>> adj = buildAdjacencyList(request.getNodes(), request.getEdges());
        List<String> visitedOrder = new ArrayList<>();
        List<GraphSimulationResponse.Step> steps = new ArrayList<>();

        Set<String> visited = new LinkedHashSet<>();
        Stack<String> stack = new Stack<>();

        String start = request.getStart();
        if (start != null && adj.containsKey(start)) {
            stack.push(start);
            
            // Initial step
            steps.add(new GraphSimulationResponse.Step(
                null, 
                new ArrayList<>(visited), 
                new ArrayList<>(stack)
            ));
        }

        while (!stack.isEmpty()) {
            String current = stack.pop();

            if (!visited.contains(current)) {
                visited.add(current);
                visitedOrder.add(current);

                List<String> neighbors = adj.getOrDefault(current, Collections.emptyList());
                // Sort neighbors reversed so that when pushed to stack, they are popped in natural order
                neighbors.sort(Collections.reverseOrder());

                for (String neighbor : neighbors) {
                    if (!visited.contains(neighbor)) {
                        stack.push(neighbor);
                    }
                }
                
                steps.add(new GraphSimulationResponse.Step(
                    current,
                    new ArrayList<>(visited),
                    new ArrayList<>(stack)
                ));
            }
        }

        return new GraphSimulationResponse(visitedOrder, steps);
    }

    private Map<String, List<String>> buildAdjacencyList(List<String> nodes, List<List<String>> edges) {
        Map<String, List<String>> adj = new HashMap<>();
        for (String node : nodes) {
            adj.put(node, new ArrayList<>());
        }
        for (List<String> edge : edges) {
            if (edge.size() >= 2) {
                String u = edge.get(0);
                String v = edge.get(1);
                // Undirected graph
                if (adj.containsKey(u)) adj.get(u).add(v);
                if (adj.containsKey(v)) adj.get(v).add(u);
            }
        }
        return adj;
    }
}