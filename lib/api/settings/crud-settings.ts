import api from "../client";

export interface BusinessHours {
    day: string; // "Monday", "Tuesday", etc.
    start: string; // "09:00"
    end: string; // "17:00"
    isOpen: boolean;
}

const DEFAULT_HOURS: BusinessHours[] = [
    { day: "Monday", start: "09:00", end: "17:00", isOpen: true },
    { day: "Tuesday", start: "09:00", end: "17:00", isOpen: true },
    { day: "Wednesday", start: "09:00", end: "17:00", isOpen: true },
    { day: "Thursday", start: "09:00", end: "17:00", isOpen: true },
    { day: "Friday", start: "09:00", end: "17:00", isOpen: true },
    { day: "Saturday", start: "09:00", end: "17:00", isOpen: false },
    { day: "Sunday", start: "09:00", end: "17:00", isOpen: false },
];

// Mock API calls for now
export const getBusinessHours = async (): Promise<BusinessHours[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would be:
    // const response = await api.get('/settings/business-hours');
    // return response.data;

    // Retrieve from local storage to simulate persistence
    const stored = localStorage.getItem('business_hours');
    if (stored) {
        return JSON.parse(stored);
    }
    return DEFAULT_HOURS;
};

export const updateBusinessHours = async (hours: BusinessHours[]): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would be:
    // await api.put('/settings/business-hours', hours);

    // Save to local storage for persistence simulation
    localStorage.setItem('business_hours', JSON.stringify(hours));
};
