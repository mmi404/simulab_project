export interface GraphSimulationRequest {
    algorithm: string;
    start: string;
    nodes: string[];
    edges: string[][];
}

export interface Step {
    current: string | null;
    visited: string[];
    frontier: string[];
}

export interface GraphSimulationResponse {
    order: string[];
    steps: Step[];
}