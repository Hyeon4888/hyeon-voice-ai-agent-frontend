"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { HistorySidebar } from "@/components/history/history-sidebar"
import { HistoryList, HistoryItem } from "@/components/history/history-list"
import { HistoryDetail } from "@/components/history/history-detail"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/shadcn/sidebar"
import { Agent } from "@/lib/api/agent/crud-agent"

export default function HistoryPage() {
    const [agents, setAgents] = React.useState<Agent[]>([])
    const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(null)
    const [selectedCall, setSelectedCall] = React.useState<HistoryItem | null>(null)

    React.useEffect(() => {
        const fetchAgents = async () => {
            try {
                const { getAgents } = await import("@/lib/api/agent/crud-agent")
                const data = await getAgents()
                setAgents(data)
                if (data.length > 0 && !selectedAgent) {
                    // Optionally select the first agent automatically
                    // setSelectedAgent(data[0])
                }
            } catch (error) {
                console.error("Failed to fetch agents", error)
            }
        }
        fetchAgents()
    }, [])

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
            <HistorySidebar
                agents={agents}
                selectedAgentId={selectedAgent?.id}
                onSelectAgent={(agent) => {
                    setSelectedAgent(agent)
                    setSelectedCall(null) // Reset selected call when switching agents
                }}
            />
            <SidebarInset>
                <SiteHeader title="History" />
                <div className="flex flex-1 h-[calc(100vh-theme(spacing.12))] overflow-hidden">
                    {selectedAgent ? (
                        <>
                            {!selectedCall ? (
                                <div className="w-full h-full overflow-hidden">
                                    <HistoryList
                                        agentId={selectedAgent.id}
                                        onSelectCall={setSelectedCall}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full overflow-hidden bg-background">
                                    <HistoryDetail
                                        call={selectedCall}
                                        onClose={() => setSelectedCall(null)}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
                            Select an agent to view history
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
