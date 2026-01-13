package com.simulab.simulation.graph;

import java.util.List;

public class GraphSimulationResponse {
    private List<String> order;
    private List<Step> steps;

    public GraphSimulationResponse(List<String> order, List<Step> steps) {
        this.order = order;
        this.steps = steps;
    }

    public List<String> getOrder() {
        return order;
    }

    public void setOrder(List<String> order) {
        this.order = order;
    }

    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }

    public static class Step {
        private String current;
        private List<String> visited;
        private List<String> frontier; // Queue or Stack

        public Step(String current, List<String> visited, List<String> frontier) {
            this.current = current;
            this.visited = visited;
            this.frontier = frontier;
        }

        public String getCurrent() {
            return current;
        }

        public void setCurrent(String current) {
            this.current = current;
        }

        public List<String> getVisited() {
            return visited;
        }

        public void setVisited(List<String> visited) {
            this.visited = visited;
        }

        public List<String> getFrontier() {
            return frontier;
        }

        public void setFrontier(List<String> frontier) {
            this.frontier = frontier;
        }
    }
}