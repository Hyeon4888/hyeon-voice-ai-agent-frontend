import api from '../client';

export interface Tool {
    id: string;
    name: string;
    description?: string;
    enabled: boolean;
    user_id: number;
    created_at: string;
}

export interface ToolCreatePayload {
    name: string;
    description?: string;
}

export interface ToolUpdatePayload {
    name?: string;
    description?: string;
    enabled?: boolean;
}

export const createTool = async (payload: ToolCreatePayload) => {
    const response = await api.post<Tool>('/tools/create', payload);
    return response.data;
};

export const getTools = async () => {
    const response = await api.get<Tool[]>('/tools/get');
    return response.data;
};

export const getTool = async (toolId: string) => {
    const response = await api.get<Tool>(`/tools/get/${toolId}`);
    return response.data;
};

export const updateTool = async (toolId: string, payload: ToolUpdatePayload) => {
    const response = await api.put<Tool>(`/tools/update/${toolId}`, payload);
    return response.data;
};

export const deleteTool = async (toolId: string) => {
    const response = await api.delete(`/tools/delete/${toolId}`);
    return response.data;
};
