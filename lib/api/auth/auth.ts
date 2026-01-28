import api from '../client';

export const signIn = async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
};

export const signUp = async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};
