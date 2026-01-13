import api from '../api/axios';
import type { GraphSimulationRequest, GraphSimulationResponse } from '../types/graph';

export interface Process {
    id: string;
    arrivalTime: number;
    burstTime: number;
}

export interface SimulationCategory {
    id: number;
    name: string;
    shortName: string; // Mapped from backend short_name column (snake_case to camelCase usually if automatic, but let's check field name)
    // Actually backend returns camelCase `shortName` if standard Jackson used.
    color: string;
}

export interface Simulation {
    id: number;
    title: string;
    slug: string;
    type: SimulationCategory; // Changed from category string to nested object
    shortDescription: string;
    longDescription?: string;
    icon: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    active: boolean;
}

export const getAllSimulations = async (): Promise<Simulation[]> => {
    const response = await api.get<Simulation[]>('/simulations');
    return response.data;
};

export const getSimulationTypes = async (): Promise<SimulationCategory[]> => {
    const response = await api.get<SimulationCategory[]>('/simulations/types');
    return response.data;
};

export const getSimulationBySlug = async (slug: string): Promise<Simulation> => {
    const response = await api.get<Simulation>(`/simulations/${slug}`);
    return response.data;
};

export const runSimulation = async (algorithm: string, processes: Process[]) => {
    // Transform simple process list to format expected by backend if needed
    // Backend expects map with "inputs"? No, inputParams Map.
    // SchedulerEngine expects "algorithm" and "processes" (List<Map>)

    // We can just pass the array of objects if keys match OsProcess fields.
    // OsProcess keys: id, arrivalTime, burstTime.

    const payload = {
        algorithm,
        processes
    };

    const response = await api.post('/simulations/run', payload);
    return response.data;
};

export const detectDeadlock = async (processes: string[], resources: string[], edges: { from: string, to: string, type: 'REQUEST' | 'ALLOCATED' }[]) => {
    const payload = {
        processes,
        resources,
        edges
    };
    const response = await api.post('/simulate/deadlock', payload);
    return response.data;
};

export const runBankersSafety = async (available: number[], allocation: Record<string, number[]>, max: Record<string, number[]>) => {
    const payload = {
        available,
        allocation,
        max
    };
    const response = await api.post('/simulate/bankers/safety', payload);
    return response.data;
};

export const simulateGraphTraversal = async (request: GraphSimulationRequest): Promise<GraphSimulationResponse> => {
    const response = await api.post<GraphSimulationResponse>('/simulate/graph/traversal', request);
    return response.data;
};

export interface DashboardSimulation {
    simulation: string;
    slug: string;
    category: string;
    completed: boolean;
    runsCount: number;
    lastRunAt: string | null;
}

export const getUserDashboard = async (): Promise<DashboardSimulation[]> => {
    const response = await api.get<DashboardSimulation[]>('/dashboard/simulations');
    return response.data;
};
