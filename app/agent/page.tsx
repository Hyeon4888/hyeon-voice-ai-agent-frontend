"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AgentSidebar } from "@/components/agent-sidebar"
import { SiteHeader } from "@/components/site-header"
import { AgentConfig } from "@/components/agent-config"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"


export default function AgentPage() {
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
            <AgentSidebar />
            <SidebarInset>
                <SiteHeader title="Agent" />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex items-center justify-between space-y-2 py-4">
                        {/* Header content if needed, currently handled by SiteHeader but can add specific actions here */}
                    </div>
                    <AgentConfig />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
