import api from '../client';

export interface Agent {
    id: number;
    user_id: number;
    name: string;
    config: any;
    created_at: string;
}

export const createAgent = async (agent: Partial<Agent>) => {
    const response = await api.post<Agent>('/agents/create', agent);
    return response.data;
};

export const getAgents = async () => {
    const response = await api.get<Agent[]>('/agents/get');
    return response.data;
};
