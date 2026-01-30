"use client"

import * as React from "react"
import { IconRobot } from "@tabler/icons-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/shadcn/sidebar"

import { Agent } from "@/lib/api/agent/crud-agent"

interface HistorySidebarProps extends React.ComponentProps<typeof Sidebar> {
    agents: Agent[]
    selectedAgentId?: string
    onSelectAgent?: (agent: Agent) => void
}

export function HistorySidebar({ agents, selectedAgentId, onSelectAgent, ...props }: HistorySidebarProps) {
    return (
        <Sidebar
            collapsible="none"
            className="hidden h-screen w-64 border-r md:flex"
            {...props}
        >
            <SidebarHeader className="border-b p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">History</h3>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Agents</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {agents.map((agent) => (
                                <SidebarMenuItem key={agent.id}>
                                    <SidebarMenuButton
                                        onClick={() => onSelectAgent?.(agent)}
                                        isActive={selectedAgentId === agent.id}
                                    >
                                        <IconRobot />
                                        <span>{agent.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
