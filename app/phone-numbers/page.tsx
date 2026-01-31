"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PhoneNumberSidebar } from "@/components/phone-number/phone-number-sidebar"
import { SiteHeader } from "@/components/site-header"
import { PhoneNumberConfig } from "@/components/phone-number/phone-number-config"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/shadcn/sidebar"
import { getPhoneNumbers, PhoneNumber } from "@/lib/api/phone-numbers/crud-phone-numbers"

import { PhoneNumberCreateForm } from "@/components/phone-number/phone-number-create-form"

export default function PhoneNumbersPage() {
    const [phoneNumbers, setPhoneNumbers] = React.useState<PhoneNumber[]>([]);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = React.useState<PhoneNumber | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [isCreating, setIsCreating] = React.useState(false);

    React.useEffect(() => {
        const fetchPhoneNumbers = async () => {
            try {
                const data = await getPhoneNumbers();
                setPhoneNumbers(data);
                if (data.length > 0 && !selectedPhoneNumber) {
                    setSelectedPhoneNumber(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch phone numbers", error);
            }
        };
        fetchPhoneNumbers();
    }, []);

    const handleSelectPhoneNumber = (pn: PhoneNumber) => {
        setSelectedPhoneNumber(pn);
        setIsCreating(false);
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const data = await getPhoneNumbers();
            setPhoneNumbers(data);
            if (!isCreating && !selectedPhoneNumber && data.length > 0) {
                setSelectedPhoneNumber(data[0]);
            }
        } catch (error) {
            console.error("Failed to refresh phone numbers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setIsCreating(true);
        setSelectedPhoneNumber(null);
    };

    const handleCreateSuccess = async () => {
        setIsCreating(false);
        await handleRefresh();
    };

    const handleCreateCancel = () => {
        setIsCreating(false);
        if (phoneNumbers.length > 0) {
            setSelectedPhoneNumber(phoneNumbers[0]);
        }
    };

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <PhoneNumberSidebar
                phoneNumbers={phoneNumbers}
                selectedPhoneNumberId={selectedPhoneNumber?.id}
                onSelectPhoneNumber={handleSelectPhoneNumber}
                onRefresh={handleRefresh}
                onAdd={handleAdd}
            />
            <SidebarInset>
                <SiteHeader title="Phone Numbers" />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex items-center justify-between space-y-2 py-4">
                        <h2 className="text-lg font-semibold">{isCreating ? "Add Phone Number" : "Configuration"}</h2>
                    </div>
                    {isCreating ? (
                        <div className="max-w-xl">
                            <PhoneNumberCreateForm
                                onSuccess={handleCreateSuccess}
                                onCancel={handleCreateCancel}
                            />
                        </div>
                    ) : (
                        <PhoneNumberConfig
                            phoneNumber={selectedPhoneNumber}
                            loading={loading}
                        />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
