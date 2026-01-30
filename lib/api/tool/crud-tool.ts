import api from '../client';

export interface Tool {
    id: string;
    name: string;
    user_id: number;
    appointment_tool: boolean;
}

export interface ToolCreatePayload {
    id: string;
    name: string;
}


export const createTool = async (payload: ToolCreatePayload) => {
    const response = await api.post<Tool>('/tools/create', payload);
    return response.data;
};

export const getTools = async () => {
    const response = await api.get<Tool[]>('/tools/list');
    return response.data;
};

export const getTool = async (toolId: string) => {
    const response = await api.get<Tool>(`/tools/get/${toolId}`);
    return response.data;
};


export const updateTool = async (toolId: string, payload: Partial<Tool>) => {
    const response = await api.patch<Tool>(`/tools/update/${toolId}`, payload);
    return response.data;
};

export const deleteTool = async (toolId: string) => {
    const response = await api.delete(`/tools/delete/${toolId}`);
    return response.data;
};
