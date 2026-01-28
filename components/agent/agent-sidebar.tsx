"use client"

import * as React from "react"
import { IconPlus, IconRobot } from "@tabler/icons-react"

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
    SidebarSeparator,
} from "@/components/ui/sidebar"

import { Agent } from "@/lib/api/agent/crud-agent"

interface AgentSidebarProps extends React.ComponentProps<typeof Sidebar> {
    agents: Agent[]
}

export function AgentSidebar({ agents, ...props }: AgentSidebarProps) {
    return (
        <Sidebar
            collapsible="none"
            className="hidden h-screen w-64 border-r md:flex"
            {...props}
        >
            <SidebarHeader className="border-b p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Agents</h3>
                    <a href="/create-agent" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 w-8">
                        <IconPlus className="h-4 w-4" />
                    </a>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Your Agents</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {agents.map((agent) => (
                                <SidebarMenuItem key={agent.id}>
                                    <SidebarMenuButton asChild>
                                        <a href="#">
                                            <IconRobot />
                                            <span>{agent.name}</span>
                                        </a>
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
