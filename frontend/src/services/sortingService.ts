import api from '../api/axios';

export interface SortingStep {
    array: number[];
    compare: number[]; // [i, j]
    swap: boolean;
    sortedIndices: number[];
}

export interface SortingStats {
    comparisons: number;
    swaps: number;
}

export interface SortingResponse {
    steps: SortingStep[];
    stats: SortingStats;
}

export interface SortingRequest {
    algorithm: string;
    array: number[];
}

export const simulateSorting = async (payload: SortingRequest): Promise<SortingResponse> => {
    const response = await api.post<SortingResponse>('/simulate/sorting', payload);
    return response.data;
};
