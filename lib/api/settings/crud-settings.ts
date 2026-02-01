import api from "../client";

export interface BusinessHour {
    id?: number;
    day: string;
    start_time: string;
    end_time: string;
    is_open: boolean;
}

export type BusinessHourUpdatePayload = Partial<Omit<BusinessHour, "id" | "day">>;

const DEFAULT_HOURS: Omit<BusinessHour, "id">[] = [
    { day: "Monday", start_time: "09:00", end_time: "17:00", is_open: true },
    { day: "Tuesday", start_time: "09:00", end_time: "17:00", is_open: true },
    { day: "Wednesday", start_time: "09:00", end_time: "17:00", is_open: true },
    { day: "Thursday", start_time: "09:00", end_time: "17:00", is_open: true },
    { day: "Friday", start_time: "09:00", end_time: "17:00", is_open: true },
    { day: "Saturday", start_time: "09:00", end_time: "17:00", is_open: false },
    { day: "Sunday", start_time: "09:00", end_time: "17:00", is_open: false },
];

export const getBusinessHours = async (): Promise<BusinessHour[]> => {
    try {
        const response = await api.get('/business-hours/get');
        const data = response.data;

        if (!data || data.length === 0) {
            // If no data exists, return default structure (without IDs)
            // The component will handle creating them on save
            return DEFAULT_HOURS.map(h => ({ ...h }));
        }

        // Sort by day to ensure Monday-Sunday order
        const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return data.sort((a: BusinessHour, b: BusinessHour) => {
            return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        });
    } catch (error) {
        console.error("Error fetching business hours:", error);
        throw error;
    }
};

export const updateBusinessHours = async (hours: BusinessHour[]): Promise<void> => {
    try {
        const promises = hours.map(hour => {
            if (hour.id) {
                // Update existing record
                return api.put(`/business-hours/update/${hour.id}`, {
                    start_time: hour.start_time,
                    end_time: hour.end_time,
                    is_open: hour.is_open,
                });
            } else {
                // Create new record
                return api.post('/business-hours/create', {
                    day: hour.day,
                    start_time: hour.start_time,
                    end_time: hour.end_time,
                    is_open: hour.is_open,
                });
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error("Error updating business hours:", error);
        throw error;
    }
};
