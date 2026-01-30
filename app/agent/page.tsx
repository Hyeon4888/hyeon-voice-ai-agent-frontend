"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AgentSidebar } from "@/components/agent/agent-sidebar"
import { SiteHeader } from "@/components/site-header"
import { AgentConfig } from "@/components/agent/agent-config"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/shadcn/sidebar"
import { Agent } from "@/lib/api/agent/crud-agent";


import { Button } from "@/components/ui/shadcn/button"
import { getConnectionDetails } from "@/lib/api/agent/token";
import { Play } from "lucide-react"


import { VoiceAgent } from "@/components/agent/voice-agent"

export default function AgentPage() {
    const [isConnecting, setIsConnecting] = React.useState(false);
    const [isConnected, setIsConnected] = React.useState(false);
    const [token, setToken] = React.useState<string | null>(null);
    const [url, setUrl] = React.useState<string | null>(null);
    const [agents, setAgents] = React.useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(null);
    const [loadingAgent, setLoadingAgent] = React.useState(false);

    React.useEffect(() => {
        const fetchAgents = async () => {
            try {
                const { getAgents } = await import("@/lib/api/agent/crud-agent");
                const data = await getAgents();
                setAgents(data);
            } catch (error) {
                console.error("Failed to fetch agents", error);
            }
        };
        fetchAgents();
    }, []);

    const handleSelectAgent = async (agent: Agent) => {
        setLoadingAgent(true);
        try {
            console.log("Selected agent:", agent); // Debug: see what data we have

            // Ensure type is available, default to 'realtime' if not specified
            const agentType = agent.type || 'realtime';

            const { getAgent } = await import("@/lib/api/agent/crud-agent");
            const agentData = await getAgent(agent.id);
            setSelectedAgent(agentData);
        } catch (error) {
            console.error("Failed to fetch agent details", error);
        } finally {
            setLoadingAgent(false);
        }
    };

    const handlePlayAgent = async () => {
        if (!selectedAgent) return;
        setIsConnecting(true);
        try {
            const data = await getConnectionDetails(selectedAgent.id);
            if (data.token && data.url) {
                setToken(data.token);
                setUrl(data.url);
                setIsConnected(true);
            }
        } catch (error) {
            console.error("Failed to connect", error);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        setToken(null);
        setUrl(null);
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
            <AgentSidebar
                agents={agents}
                selectedAgentId={selectedAgent?.id}
                onSelectAgent={handleSelectAgent}
            />
            <SidebarInset>
                <SiteHeader title="Agent" />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex items-center justify-between space-y-2 py-4">
                        <h2 className="text-lg font-semibold">Agent Configuration</h2>
                        {!isConnected && (
                            <Button onClick={handlePlayAgent} disabled={isConnecting || !selectedAgent}>
                                <Play className="mr-2 h-4 w-4" />
                                {isConnecting ? "Connecting..." : "Play agent"}
                            </Button>
                        )}
                        {isConnected && (
                            <Button variant="destructive" onClick={handleDisconnect}>
                                Stop Agent
                            </Button>
                        )}
                    </div>
                    {isConnected && token && url ? (
                        <VoiceAgent token={token} url={url} onDisconnect={handleDisconnect} />
                    ) : (
                        <AgentConfig
                            agent={selectedAgent}
                            loading={loadingAgent}
                            onSuccess={() => {
                                if (selectedAgent) {
                                    handleSelectAgent(selectedAgent);
                                }
                            }}
                        />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}





