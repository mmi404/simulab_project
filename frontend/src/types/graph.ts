export interface Step {
    current: string | null;
    visited: string[];
    frontier: string[];
}

export interface GraphSimulationResponse {
    order: string[];
    steps: Step[];
}

export interface GraphSimulationRequest {
    algorithm: 'BFS' | 'DFS';
    start: string;
    nodes: string[];
    edges: string[][]; // Array of [from, to]
}
