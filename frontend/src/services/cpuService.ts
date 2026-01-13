import type { SimulationPayload, SimulationResult } from '../types/cpu';

import api from '../api/axios';

export const cpuService = {
    simulate: async (payload: SimulationPayload): Promise<SimulationResult> => {
        const response = await api.post<SimulationResult>('/simulate/cpu', payload);
        return response.data;
    },
};
