export type Algorithm = 'FCFS' | 'SJF' | 'SRTF' | 'Priority' | 'RR';

export interface Process {
    id: string;
    arrivalTime: number;
    burstTime: number;
    priority: number;
}

export interface SimulationStep {
    stepId: number;
    description: string;
    state: {
        time: number;
        running: string | null;
        readyQueue: string[];
        remaining: Record<string, number>;
        completed?: string;
    };
}

export interface SimulationResult {
    steps: SimulationStep[];
    gantt: (string | null)[];
    metrics: {
        avgWaitingTime: number;
        avgTurnaroundTime: number;
    };
}

export interface SimulationPayload {
    algorithm: Algorithm;
    quantum?: number;
    processes: Process[];
}
