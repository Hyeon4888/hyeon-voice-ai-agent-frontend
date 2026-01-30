import api from '../client';

export interface History {
    id: number;
    user_id: number;
    agent_id: string;
    date: string;
    time: string;
    duration: number;
    summary?: string;
    conversation?: string;
}

export const getHistory = async (agentId: string) => {
    const response = await api.get<History[]>(`/history/get/${agentId}`);
    return response.data;
};
