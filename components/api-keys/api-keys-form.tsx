"use client"

import * as React from "react"
import { IconTrash, IconEye, IconEyeOff, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/shadcn/button"
import { Input } from "@/components/ui/shadcn/input"
import { Label } from "@/components/ui/shadcn/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/shadcn/table"

interface ApiKey {
    id: string
    name: string
    value: string
    createdAt: string
}

export function ApiKeysForm() {
    const [keys, setKeys] = React.useState<ApiKey[]>([])
    const [newKeyName, setNewKeyName] = React.useState("")
    const [newKeyValue, setNewKeyValue] = React.useState("")
    const [showKey, setShowKey] = React.useState<Record<string, boolean>>({})

    // Load from localStorage on mount
    React.useEffect(() => {
        const storedKeys = localStorage.getItem("voice_ai_api_keys")
        if (storedKeys) {
            try {
                setKeys(JSON.parse(storedKeys))
            } catch (e) {
                console.error("Failed to parse existing keys", e)
            }
        }
    }, [])

    // Save to localStorage whenever keys change
    const saveKeys = (updatedKeys: ApiKey[]) => {
        setKeys(updatedKeys)
        localStorage.setItem("voice_ai_api_keys", JSON.stringify(updatedKeys))
    }

    const handleAddKey = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newKeyName || !newKeyValue) return

        const newKey: ApiKey = {
            id: crypto.randomUUID(),
            name: newKeyName,
            value: newKeyValue,
            createdAt: new Date().toISOString(),
        }

        saveKeys([...keys, newKey])
        setNewKeyName("")
        setNewKeyValue("")
    }

    const handleDeleteKey = (id: string) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to delete this key?")) {
            saveKeys(keys.filter((k) => k.id !== id))
        }
    }

    const toggleShowKey = (id: string) => {
        setShowKey((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New API Key</CardTitle>
                    <CardDescription>
                        Store your API keys securely in your browser's local storage.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddKey} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="grid w-full gap-2">
                            <Label htmlFor="key-name">Name</Label>
                            <Input
                                id="key-name"
                                placeholder="e.g. OpenAI"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                            />
                        </div>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="key-value">Key Value</Label>
                            <Input
                                id="key-value"
                                type="password"
                                placeholder="sk-..."
                                value={newKeyValue}
                                onChange={(e) => setNewKeyValue(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={!newKeyName || !newKeyValue}>
                            <IconPlus className="mr-2 h-4 w-4" /> Add Key
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your API Keys</CardTitle>
                    <CardDescription>
                        Manage your stored API keys.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {keys.length === 0 ? (
                        <div className="text-center text-muted-foreground py-6">
                            No API keys found. Add one above.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {keys.map((key) => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-medium">{key.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <code className="bg-muted px-2 py-1 rounded text-sm relative font-mono">
                                                    {showKey[key.id] ? key.value : "•".repeat(24)}
                                                </code>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => toggleShowKey(key.id)}
                                                >
                                                    {showKey[key.id] ? (
                                                        <IconEyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <IconEye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(key.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleDeleteKey(key.id)}
                                            >
                                                <IconTrash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
