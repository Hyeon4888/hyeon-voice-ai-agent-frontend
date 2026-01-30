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
import { Input } from "@/components/ui/shadcn/input"
import { Label } from "@/components/ui/shadcn/label"
import { Textarea } from "@/components/ui/shadcn/textarea"
import { Switch } from "@/components/ui/shadcn/switch"
import { Tool, updateTool, deleteTool } from "@/lib/api/tool/crud-tool"

export function ToolConfig({ tool, loading, onSuccess }: {
    tool?: Tool | null,
    loading?: boolean,
    onSuccess?: () => void
}) {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [enabled, setEnabled] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    React.useEffect(() => {
        if (tool) {
            setName(tool.name || "");
            setDescription(tool.description || "");
            setEnabled(tool.enabled !== undefined ? tool.enabled : true);
        } else {
            setName("");
            setDescription("");
            setEnabled(true);
        }
    }, [tool]);

    const onSave = async () => {
        if (!tool || !tool.id) return;

        setSaving(true);
        try {
            await updateTool(tool.id, {
                name,
                description,
                enabled,
            });
            alert("Tool updated successfully!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert("Failed to update tool");
        } finally {
            setSaving(false);
        }
    };

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
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="tool-name">Tool Name</Label>
                        <Input
                            id="tool-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="tool-description">Description</Label>
                        <Textarea
                            id="tool-description"
                            className="min-h-[100px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="space-y-0.5">
                            <Label>Enabled</Label>
                            <p className="text-sm text-muted-foreground">
                                Toggle this tool on or off for use by agents.
                            </p>
                        </div>
                        <Switch
                            checked={enabled}
                            onCheckedChange={setEnabled}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="destructive" onClick={onDelete} disabled={deleting || loading}>
                        {deleting ? "Deleting..." : "Delete Tool"}
                    </Button>
                    <Button onClick={onSave} disabled={saving || loading}>
                        {saving ? "Saving..." : "Save Configuration"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
