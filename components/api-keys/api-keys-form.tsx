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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select"

import { listApiKeys, createApiKey, deleteApiKey, ApiKey, ApiKeyCreate } from "@/lib/api/api-keys/api-keys"
import { toast } from "sonner"

// The ApiKey interface is now imported from @/lib/api/api-keys

export function ApiKeysForm() {
    const [keys, setKeys] = React.useState<ApiKey[]>([])
    const [newKeyService, setNewKeyService] = React.useState("OpenAI")
    const [newKeyName, setNewKeyName] = React.useState("")
    const [newKeyValue, setNewKeyValue] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const fetchKeys = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const fetchedKeys = await listApiKeys()
            setKeys(fetchedKeys)
        } catch (error) {
            console.error("Failed to fetch keys", error)
            toast.error("Failed to load API keys")
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchKeys()
    }, [fetchKeys])

    const handleAddKey = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newKeyName || !newKeyValue) return

        try {
            setIsSubmitting(true)
            await createApiKey({
                id: newKeyValue, // Use the user-provided key value as the database ID
                name: newKeyName,
                model: newKeyService, // Mapping service to model as per backend schema
            })

            toast.success("API Key created successfully")
            setNewKeyName("")
            setNewKeyValue("") // Actually the backend schema provided doesn't have a 'value' field in create, but typically it would. 
            // The provided schema:
            // class ApiKeyCreate(BaseModel):
            //     id: str
            //     name: str
            //     model: str
            // Wait, the backend doesn't seem to store the actual key value in the provided snippet?
            // Ah, the user provided:
            // @router.post("/create", response_model=ApiKey)
            // async def create_api_key(api_key_in: ApiKeyCreate, ...):
            //     api_key = ApiKey(id=api_key_in.id, name=api_key_in.name, model=api_key_in.model, user_id=current_user.id)
            // It seems it only stores id, name, and model. 
            // I'll stick to what the user provided.

            fetchKeys()
        } catch (error) {
            console.error("Failed to create key", error)
            toast.error("Failed to create API key")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteKey = async (name: string) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to delete this key?")) {
            try {
                await deleteApiKey(name)
                toast.success("API Key deleted successfully")
                fetchKeys()
            } catch (error) {
                console.error("Failed to delete key", error)
                toast.error("Failed to delete API key")
            }
        }
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
                    <form onSubmit={handleAddKey} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="key-service">Service</Label>
                                <Select value={newKeyService} onValueChange={setNewKeyService}>
                                    <SelectTrigger id="key-service">
                                        <SelectValue placeholder="Select service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="OpenAI">OpenAI</SelectItem>
                                        <SelectItem value="Anthropic">Anthropic</SelectItem>
                                        <SelectItem value="Google Gemini">Google Gemini</SelectItem>
                                        <SelectItem value="Deepgram">Deepgram</SelectItem>
                                        <SelectItem value="ElevenLabs">ElevenLabs</SelectItem>
                                        <SelectItem value="Groq">Groq</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="key-name">Key Name</Label>
                                <Input
                                    id="key-name"
                                    placeholder="e.g. My OpenAI Key"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="key-value">Key Value</Label>
                                <Input
                                    id="key-value"
                                    type="password"
                                    placeholder="sk-..."
                                    value={newKeyValue}
                                    onChange={(e) => setNewKeyValue(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={!newKeyName || !newKeyValue || isSubmitting}>
                                {isSubmitting ? "Adding..." : (
                                    <>
                                        <IconPlus className="mr-2 h-4 w-4" /> Add Key
                                    </>
                                )}
                            </Button>
                        </div>
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
                    {isLoading ? (
                        <div className="text-center text-muted-foreground py-6">
                            Loading API keys...
                        </div>
                    ) : keys.length === 0 ? (
                        <div className="text-center text-muted-foreground py-6">
                            No API keys found. Add one above.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Service/Model</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {keys.map((key) => (
                                    <TableRow key={key.id}>
                                        <TableCell>
                                            <span className="font-medium">{key.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{key.model}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[150px] truncate">
                                                <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                                    ••••••••••••••••
                                                </code>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleDeleteKey(key.name)}
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
