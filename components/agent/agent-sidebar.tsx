"use client"

import * as React from "react"
import { IconPlus, IconRobot } from "@tabler/icons-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/shadcn/dialog"
import { AgentCreateForm } from "@/components/agent/agent-create-form"

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
} from "@/components/ui/shadcn/sidebar"

import { Agent } from "@/lib/api/agent/crud-agent"

interface AgentSidebarProps extends React.ComponentProps<typeof Sidebar> {
    agents: Agent[]
    selectedAgentId?: string
    onSelectAgent?: (agent: Agent) => void
}

export function AgentSidebar({ agents, selectedAgentId, onSelectAgent, ...props }: AgentSidebarProps) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    return (
        <Sidebar
            collapsible="none"
            className="hidden h-screen w-64 border-r md:flex"
            {...props}
        >
            <SidebarHeader className="border-b p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Agents</h3>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 w-8">
                                <IconPlus className="h-4 w-4" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Agent</DialogTitle>
                            </DialogHeader>
                            <AgentCreateForm
                                onSuccess={() => {
                                    setIsDialogOpen(false)
                                    // Optionally trigger a refresh of the agents list
                                    window.location.reload()
                                }}
                                onCancel={() => setIsDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Your Agents</SidebarGroupLabel>
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



