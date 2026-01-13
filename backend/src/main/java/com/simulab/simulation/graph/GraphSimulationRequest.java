package com.simulab.simulation.graph;

import java.util.List;

public class GraphSimulationRequest {
    private String algorithm; // "BFS" or "DFS"
    private String start;
    private List<String> nodes;
    private List<List<String>> edges; // List of [source, target]

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public List<String> getNodes() {
        return nodes;
    }

    public void setNodes(List<String> nodes) {
        this.nodes = nodes;
    }

    public List<List<String>> getEdges() {
        return edges;
    }

    public void setEdges(List<List<String>> edges) {
        this.edges = edges;
    }
}
