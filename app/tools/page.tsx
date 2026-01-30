"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ToolSidebar } from "@/components/tool/tool-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ToolConfig } from "@/components/tool/tool-config"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/shadcn/sidebar"
import { Tool, getTools, getTool } from "@/lib/api/tool/crud-tool"

export default function ToolsPage() {
    const [tools, setTools] = React.useState<Tool[]>([]);
    const [selectedTool, setSelectedTool] = React.useState<Tool | null>(null);
    const [loadingTool, setLoadingTool] = React.useState(false);

    const fetchTools = React.useCallback(async () => {
        try {
            const data = await getTools();
            setTools(data);
        } catch (error) {
            console.error("Failed to fetch tools", error);
        }
    }, []);

    React.useEffect(() => {
        fetchTools();
    }, [fetchTools]);

    const handleSelectTool = async (tool: Tool) => {
        setLoadingTool(true);
        try {
            const toolData = await getTool(tool.id);
            setSelectedTool(toolData);
        } catch (error) {
            console.error("Failed to fetch tool details", error);
        } finally {
            setLoadingTool(false);
        }
    };

    const handleRefresh = () => {
        fetchTools();
        setSelectedTool(null);
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
            <ToolSidebar
                tools={tools}
                selectedToolId={selectedTool?.id}
                onSelectTool={handleSelectTool}
                onRefresh={handleRefresh}
            />
            <SidebarInset>
                <SiteHeader title="Tools" />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex items-center justify-between space-y-2 py-4">
                        <h2 className="text-lg font-semibold">Tool Configuration</h2>
                    </div>
                    <ToolConfig
                        tool={selectedTool}
                        loading={loadingTool}
                        onSuccess={() => {
                            fetchTools();
                        }}
                    />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
