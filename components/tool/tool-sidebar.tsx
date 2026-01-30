"use client"

import * as React from "react"
import { IconPlus, IconTools } from "@tabler/icons-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/shadcn/dialog"
import { ToolCreateForm } from "@/components/tool/tool-create-form"

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

import { Tool } from "@/lib/api/tool/crud-tool"

interface ToolSidebarProps extends React.ComponentProps<typeof Sidebar> {
    tools: Tool[]
    selectedToolId?: string
    onSelectTool?: (tool: Tool) => void
    onRefresh: () => void
}

export function ToolSidebar({ tools, selectedToolId, onSelectTool, onRefresh, ...props }: ToolSidebarProps) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    return (
        <Sidebar
            collapsible="none"
            className="hidden h-screen w-64 border-r md:flex"
            {...props}
        >
            <SidebarHeader className="border-b p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Tools</h3>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 w-8">
                                <IconPlus className="h-4 w-4" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Tool</DialogTitle>
                            </DialogHeader>
                            <ToolCreateForm
                                onSuccess={() => {
                                    setIsDialogOpen(false)
                                    onRefresh()
                                }}
                                onCancel={() => setIsDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Your Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {tools.map((tool) => (
                                <SidebarMenuItem key={tool.id}>
                                    <SidebarMenuButton
                                        onClick={() => onSelectTool?.(tool)}
                                        isActive={selectedToolId === tool.id}
                                    >
                                        <IconTools className="h-4 w-4" />
                                        <span>{tool.name}</span>
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
