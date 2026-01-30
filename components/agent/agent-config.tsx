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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select"
import { Textarea } from "@/components/ui/shadcn/textarea"
import { Switch } from "@/components/ui/shadcn/switch"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/shadcn/tabs"
import api from "@/lib/api/client"
import { updateAgent, AgentUpdatePayload } from "@/lib/api/agent/crud-agent";
import { listApiKeys, ApiKey } from "@/lib/api/api-keys/api-keys";



export function AgentConfig({ agent, loading, onSuccess }: {
    agent?: any,
    loading?: boolean,
    onSuccess?: () => void
}) {
    const [name, setName] = React.useState("");
    const [model, setModel] = React.useState("openai-realtime");
    const [voice, setVoice] = React.useState("coral");
    const [prompt, setPrompt] = React.useState("");
    const [greetingPrompt, setGreetingPrompt] = React.useState("");
    const [llmWebsocketUrl, setLlmWebsocketUrl] = React.useState("");
    const [apiKeyId, setApiKeyId] = React.useState("");
    const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
    const [saving, setSaving] = React.useState(false);

    // Fetch API keys on mount
    React.useEffect(() => {
        const fetchKeys = async () => {
            try {
                const keys = await listApiKeys();
                setApiKeys(keys);
            } catch (error) {
                console.error("Failed to fetch API keys", error);
            }
        };
        fetchKeys();
    }, []);

    // Update form when agent data is loaded
    React.useEffect(() => {
        if (agent) {
            setName(agent.name || "");
            if (agent.type === 'realtime') {
                setModel(agent.model || "openai-realtime");
                setVoice(agent.voice || "coral");
                setPrompt(agent.system_prompt || "");
                setGreetingPrompt(agent.greeting_prompt || "");
                setApiKeyId(agent.api_key || "");
            } else if (agent.type === 'custom') {
                setLlmWebsocketUrl(agent.llm_websocket_url || "");
                setApiKeyId(agent.api_key || "");
            }
        } else {
            // Reset to empty when no agent selected
            setName("");
            setPrompt("");
            setGreetingPrompt("");
            setApiKeyId("");
        }
    }, [agent]);

    const onSave = async () => {
        if (!agent || !agent.id) {
            alert("No agent selected");
            return;
        }

        setSaving(true);
        try {
            const payload: AgentUpdatePayload = {};

            if (agent.type === 'realtime') {
                payload.model = model;
                payload.voice = voice;
                payload.system_prompt = prompt;
                payload.greeting_prompt = greetingPrompt;
                payload.api_key = apiKeyId;
            } else if (agent.type === 'custom') {
                payload.llm_websocket_url = llmWebsocketUrl;
                payload.api_key = apiKeyId;
            } else {
                throw new Error(`Unknown agent type: ${agent.type}`);
            }

            await updateAgent(agent.id, payload);

            alert("Agent configuration updated successfully!");
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.detail || "Failed to update agent";
            alert(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (!agent) {
        return null;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 lg:col-span-5 space-y-4">
                <Tabs
                    value={agent?.type === 'custom' ? 'customize' : 'realtime'}
                    className="w-full"
                >
                    {agent && (
                        <TabsList className="grid w-full grid-cols-1 mb-4">
                            {agent.type === 'realtime' && (
                                <TabsTrigger value="realtime">Realtime Model</TabsTrigger>
                            )}
                            {agent.type === 'custom' && (
                                <TabsTrigger value="customize">Customize</TabsTrigger>
                            )}
                        </TabsList>
                    )}
                    <TabsContent value="realtime">
                        <Card>
                            <CardHeader>
                                <CardTitle>Agent Configuration</CardTitle>
                                <CardDescription>
                                    {loading
                                        ? "Loading agent configuration..."
                                        : agent
                                            ? "Configure your voice AI agent settings."
                                            : "Select an agent from the sidebar to view and edit its configuration."
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">Agent Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Agent Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <p className="text-sm text-muted-foreground">The name used in CLI and logs.</p>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="api-key">API Key</Label>
                                        <Select value={apiKeyId} onValueChange={setApiKeyId}>
                                            <SelectTrigger id="api-key">
                                                <SelectValue placeholder="Select an API key" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {apiKeys.map((key) => (
                                                    <SelectItem key={key.id} value={key.id}>
                                                        {key.name} ({key.model})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground">The API key used by the agent for LLM/Speech services.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="model">LLM Model</Label>
                                            <Select value={model} onValueChange={setModel}>
                                                <SelectTrigger id="model">
                                                    <SelectValue placeholder="Select a model" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="openai-realtime">OpenAi Realtime</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="voice">Voice</Label>
                                            <Select value={voice} onValueChange={setVoice}>
                                                <SelectTrigger id="voice">
                                                    <SelectValue placeholder="Select a voice" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="alloy">Alloy</SelectItem>
                                                    <SelectItem value="echo">Echo</SelectItem>
                                                    <SelectItem value="shimmer">Shimmer</SelectItem>
                                                    <SelectItem value="coral">Coral</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="greeting-prompt">Greeting Prompt</Label>
                                        <Textarea
                                            id="greeting-prompt"
                                            className="min-h-[100px] font-mono text-sm"
                                            value={greetingPrompt}
                                            onChange={(e) => setGreetingPrompt(e.target.value)}
                                            placeholder="Enter the initial greeting message (optional)..."
                                        />
                                        <p className="text-sm text-muted-foreground">The message your agent will say when the conversation starts.</p>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="prompt">System Prompt</Label>
                                        <Textarea
                                            id="prompt"
                                            className="min-h-[300px] font-mono text-sm"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Enter the system prompt for your agent..."
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button onClick={onSave} disabled={saving}>
                                    {saving ? "Saving..." : "Save Configuration"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="customize">
                        <Card>
                            <CardHeader>
                                <CardTitle>Custom Agent Configuration</CardTitle>
                                <CardDescription>
                                    {loading
                                        ? "Loading agent configuration..."
                                        : agent
                                            ? "Configure your custom voice AI agent."
                                            : "Select an agent from the sidebar to view and edit its configuration."
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="custom-name">Agent Name</Label>
                                        <Input
                                            id="custom-name"
                                            placeholder="Agent Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <p className="text-sm text-muted-foreground">The name used in CLI and logs.</p>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="custom-api-key">API Key</Label>
                                        <Select value={apiKeyId} onValueChange={setApiKeyId}>
                                            <SelectTrigger id="custom-api-key">
                                                <SelectValue placeholder="Select an API key" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {apiKeys.map((key) => (
                                                    <SelectItem key={key.id} value={key.id}>
                                                        {key.name} ({key.model})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground">The API key used by the agent for LLM/Speech services.</p>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="llm-websocket-url">LLM WebSocket URL</Label>
                                        <Input
                                            id="llm-websocket-url"
                                            placeholder="wss://your-llm-websocket-endpoint.com"
                                            value={llmWebsocketUrl}
                                            onChange={(e) => setLlmWebsocketUrl(e.target.value)}
                                        />
                                        <p className="text-sm text-muted-foreground">WebSocket endpoint for your custom LLM integration.</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button onClick={onSave} disabled={saving}>
                                    {saving ? "Saving..." : "Save Configuration"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
