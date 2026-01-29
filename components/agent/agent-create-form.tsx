"use client"

import * as React from "react"
import { Button } from "@/components/ui/shadcn/button"
import { Input } from "@/components/ui/shadcn/input"
import { Label } from "@/components/ui/shadcn/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select"
import { createAgent } from "@/lib/api/agent/crud-agent"

interface AgentCreateFormProps {
    onSuccess: () => void
    onCancel: () => void
}

export function AgentCreateForm({ onSuccess, onCancel }: AgentCreateFormProps) {
    const [name, setName] = React.useState("")
    const [type, setType] = React.useState<"realtime" | "custom">("realtime")
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return

        setLoading(true)
        try {
            await createAgent({
                name,
                type,
            })
            onSuccess()
        } catch (error) {
            console.error(error)
            alert("Failed to create agent")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                    id="name"
                    placeholder="Enter agent name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="type">Agent Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as "realtime" | "custom")}>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="realtime">Realtime</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading || !name}>
                    {loading ? "Creating..." : "Create Agent"}
                </Button>
            </div>
        </form>
    )
}
