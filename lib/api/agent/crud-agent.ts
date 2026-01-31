import api from '../client';

export interface BaseAgent {
    id: string;
    name: string;
    user_id: number;
    created_at: string;
}

export interface RealtimeAgent extends BaseAgent {
    type: 'realtime';
    api_key?: string;
    model?: string;
    voice?: string;
    system_prompt?: string;
    greeting_prompt?: string;
    tool_id?: string;
    inbound_id?: string;
}

export interface CustomAgent extends BaseAgent {
    type: 'custom';
    api_key?: string;
    llm_websocket_url?: string;
    inbound_id?: string;
}

export type Agent = RealtimeAgent | CustomAgent;

export interface AgentCreatePayload {
    name: string;
    type: 'realtime' | 'custom';
    api_key?: string;
}


export interface AgentUpdatePayload {
    api_key?: string;
    model?: string;
    voice?: string;
    system_prompt?: string;
    greeting_prompt?: string;
    llm_websocket_url?: string;
    tool_id?: string | null;
    inbound_id?: string | null;
}

export const createAgent = async (payload: AgentCreatePayload) => {
    const response = await api.post<Agent>('/agents/create', payload);
    return response.data;
};

export const getAgents = async () => {
    const response = await api.get<Agent[]>('/agents/get');
    return response.data;
};

export const getAgent = async (agentId: string) => {
    const response = await api.get<Agent>(`/agents/get/${agentId}`);
    return response.data;
};

export const updateAgent = async (agentId: string, payload: AgentUpdatePayload) => {
    const response = await api.put<Agent>(`/agents/update/${agentId}`, payload);
    return response.data;
};
