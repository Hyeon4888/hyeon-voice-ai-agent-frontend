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
import { mockPhoneNumbers, PhoneNumber } from "@/lib/api/phone-numbers/mock-data"

export default function PhoneNumbersPage() {
    const [phoneNumbers, setPhoneNumbers] = React.useState<PhoneNumber[]>(mockPhoneNumbers);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = React.useState<PhoneNumber | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleSelectPhoneNumber = (pn: PhoneNumber) => {
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            setSelectedPhoneNumber(pn);
            setLoading(false);
        }, 300);
    };

    const handleRefresh = () => {
        // Reset or re-fetch logic if needed
        setPhoneNumbers([...mockPhoneNumbers]);
        setSelectedPhoneNumber(null);
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
            />
            <SidebarInset>
                <SiteHeader title="Phone Numbers" />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex items-center justify-between space-y-2 py-4">
                        <h2 className="text-lg font-semibold">Configuration</h2>
                    </div>
                    <PhoneNumberConfig
                        phoneNumber={selectedPhoneNumber}
                        loading={loading}
                    />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
