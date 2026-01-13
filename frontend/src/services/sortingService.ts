import api from '../api/axios';

export interface SortingStep {
    array: number[];
    compare: number[];
    swap: boolean;
    sortedIndices: number[];
}

export interface SortingStats {
    comparisons: number;
    swaps: number;
}

export interface SortingRequest {
    algorithm: string;
    array: number[];
}

export interface SortingResponse {
    steps: SortingStep[];
    stats: SortingStats;
}

export const simulateSorting = async (request: SortingRequest): Promise<SortingResponse> => {
    const response = await api.post('/simulate/sorting', request);
    return response.data;
};