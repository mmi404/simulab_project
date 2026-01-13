export interface BankersStep {
    process: string;
    workBefore: number[];
    need: number[];
    canExecute: boolean;
    workAfter: number[];
}

export interface BankersSafetyResponse {
    safe: boolean;
    safeSequence: string[];
    steps: BankersStep[];
}

export interface BankersProcess {
    id: string;
    allocation: number[];
    max: number[];
    // Need is derived: max - allocation
}

export interface BankersState {
    resources: string[]; // e.g., ["R1", "R2", "R3"]
    totalInstances: number[]; // e.g., [10, 5, 7]
    available: number[]; // Current available resources
    processes: BankersProcess[];
    simulationResult: BankersSafetyResponse | null;
    currentStepIndex: number; // For visualization playback
}
