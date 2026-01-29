import api from '../client';

export interface BaseAgent {
    id: string;
    name: string;
    user_id: number;
    created_at: string;
}

export interface RealtimeAgent extends BaseAgent {
    type: 'realtime';
    model?: string;
    voice?: string;
    system_prompt?: string;
    greeting_prompt?: string;
}

export interface CustomAgent extends BaseAgent {
    type: 'custom';
    llm_websocket_url?: string;
}

export type Agent = RealtimeAgent | CustomAgent;

export interface AgentCreatePayload {
    name: string;
    type: 'realtime' | 'custom';
}

export const createAgent = async (payload: AgentCreatePayload) => {
    const response = await api.post<Agent>('/agents/create', payload);
    return response.data;
};

export const getAgents = async () => {
    const response = await api.get<Agent[]>('/agents/get');
    return response.data;
};

export const getAgent = async (agentId: string, type: 'realtime' | 'custom') => {
    const response = await api.get<Agent>(`/agents/get/${agentId}`, {
        params: { type }
    });
    return response.data;
};
