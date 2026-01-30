import api from '../client';

export interface ApiKey {
    id: string;
    name: string;
    model: string;
    user_id: string;
    created_at?: string;
    updated_at?: string;
}

export interface ApiKeyCreate {
    id: string;
    name: string;
    model: string;
}

export const listApiKeys = async (): Promise<ApiKey[]> => {
    const response = await api.get<ApiKey[]>('/api-keys/list');
    return response.data;
};

export const createApiKey = async (apiKeyCreate: ApiKeyCreate): Promise<ApiKey> => {
    const response = await api.post<ApiKey>('/api-keys/create', apiKeyCreate);
    return response.data;
};

export const getApiKey = async (name: string): Promise<ApiKey> => {
    const response = await api.get<ApiKey>(`/api-keys/${name}`);
    return response.data;
};

export const deleteApiKey = async (name: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api-keys/${name}`);
    return response.data;
};
