export interface PhoneNumber {
    id: string;
    phoneNumber: string;
    provider: "Twilio" | "Telnyx" | "SignalWire";
    label: string;
    status: "Active" | "Inactive";
}

export const mockPhoneNumbers: PhoneNumber[] = [
    {
        id: "pn_1",
        phoneNumber: "+12345678901",
        provider: "Twilio",
        label: "Main Support Line",
        status: "Active",
    },
    {
        id: "pn_2",
        phoneNumber: "+19876543210",
        provider: "Twilio",
        label: "Sales Line",
        status: "Active",
    },
    {
        id: "pn_3",
        phoneNumber: "+11223344556",
        provider: "Telnyx",
        label: "Marketing Campaign A",
        status: "Inactive",
    },
    {
        id: "pn_4",
        phoneNumber: "+15556667777",
        provider: "SignalWire",
        label: "Internal Testing",
        status: "Active",
    }
];
