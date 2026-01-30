import api from '../client';

export interface ConnectionDetails {
    token: string;
    url: string;
}

export const getConnectionDetails = async (agentId: string): Promise<ConnectionDetails> => {
    // Call the backend API endpoint /agents/token
    const response = await api.get<ConnectionDetails>('/agents/token', {
        params: { agent_id: agentId }
    });
    return response.data;
};
