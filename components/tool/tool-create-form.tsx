"use client"

import * as React from "react"
import { Button } from "@/components/ui/shadcn/button"
import { Input } from "@/components/ui/shadcn/input"
import { Label } from "@/components/ui/shadcn/label"
import { Textarea } from "@/components/ui/shadcn/textarea"
import { createTool } from "@/lib/api/tool/crud-tool"

interface ToolCreateFormProps {
    onSuccess: () => void
    onCancel: () => void
}

export function ToolCreateForm({ onSuccess, onCancel }: ToolCreateFormProps) {
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return

        setLoading(true)
        try {
            await createTool({
                name,
                description,
            })
            onSuccess()
        } catch (error) {
            console.error(error)
            alert("Failed to create tool")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="name">Tool Name</Label>
                <Input
                    id="name"
                    placeholder="Enter tool name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Briefly describe what this tool does"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading || !name}>
                    {loading ? "Creating..." : "Create Tool"}
                </Button>
            </div>
        </form>
    )
}
