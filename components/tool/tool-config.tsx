"use client"

import * as React from "react"
import { Button } from "@/components/ui/shadcn/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card"
import { Label } from "@/components/ui/shadcn/label"
import { Switch } from "@/components/ui/shadcn/switch"
import { Tool, deleteTool } from "@/lib/api/tool/crud-tool"

export function ToolConfig({ tool, loading, onSuccess }: {
    tool?: Tool | null,
    loading?: boolean,
    onSuccess?: () => void
}) {
    const [saving, setSaving] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [isAppointmentTool, setIsAppointmentTool] = React.useState(false);

    React.useEffect(() => {
        if (tool) {
            setIsAppointmentTool(Boolean((tool as any).appointment_tool));
        } else {
            setIsAppointmentTool(false);
        }
    }, [tool]);


    const onDelete = async () => {
        if (!tool || !tool.id) return;
        if (!confirm("Are you sure you want to delete this tool?")) return;

        setDeleting(true);
        try {
            await deleteTool(tool.id);
            alert("Tool deleted successfully!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert("Failed to delete tool");
        } finally {
            setDeleting(false);
        }
    }

    if (!tool && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p>Select a tool to view and edit its configuration.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Tool Configuration</CardTitle>
                    <CardDescription>
                        {loading ? "Loading tool configuration..." : "Manage your tool settings and status."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-1.5 pb-4">
                        <Label className="text-muted-foreground">Tool ID</Label>
                        <div className="font-mono text-sm bg-muted p-2 rounded-md">
                            {tool?.id}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1.5 pb-4">
                        <Label className="text-muted-foreground">Tool Name</Label>
                        <div className="text-lg font-medium">
                            {tool?.name}
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="space-y-0.5">
                            <Label>Appointment Tool</Label>
                            <p className="text-sm text-muted-foreground">
                                Mark this tool as an appointment-related tool (Placeholder).
                            </p>
                        </div>
                        <Switch
                            checked={isAppointmentTool}
                            onCheckedChange={setIsAppointmentTool}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="destructive" className="w-full" onClick={onDelete} disabled={deleting || loading}>
                        {deleting ? "Deleting..." : "Delete Tool"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
