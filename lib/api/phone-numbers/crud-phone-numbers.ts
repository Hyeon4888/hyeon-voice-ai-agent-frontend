import api from '../client';

export interface PhoneNumber {
    id: string;
    number: string;
    provider: string;
    label: string;
    user_id: number;
    // Status is not in create payload, but might be in model? The mock had it.
    // Given the backend code doesn't show status being set, it might default or not exist.
    // I will make it optional in interface for now, or omit if not returned.
    // It's safer to only include what we know. Backend create returns PhoneNumber.
    status?: string;
}

export interface PhoneNumberCreate {
    label: string;
    number: string;
    provider: string;
}

export const createPhoneNumber = async (payload: PhoneNumberCreate) => {
    const response = await api.post<PhoneNumber>('/phone_numbers/create', payload);
    return response.data;
};

export const getPhoneNumbers = async () => {
    const response = await api.get<PhoneNumber[]>('/phone_numbers/get');
    return response.data;
};

export const getPhoneNumber = async (id: string) => {
    const response = await api.get<PhoneNumber>(`/phone_numbers/get/${id}`);
    return response.data;
};

export const deletePhoneNumber = async (id: string) => {
    const response = await api.delete(`/phone_numbers/delete/${id}`);
    return response.data;
};
