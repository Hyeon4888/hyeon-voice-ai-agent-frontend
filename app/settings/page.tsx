"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/shadcn/sidebar"
import { BusinessHoursSettings } from "@/components/settings/business-hours-settings"

export default function SettingsPage() {
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
            <SidebarInset>
                <SiteHeader title="Settings" />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex items-center justify-between space-y-2 py-4">
                        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                        <BusinessHoursSettings />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
