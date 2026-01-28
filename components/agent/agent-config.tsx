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

const defaultPrompt = `You are Sarah, a professional and polite receptionist for Gemini Health Clinic.
Your primary role is to assist patients with scheduling, rescheduling, or canceling their medical appointments.

# Output rules

You are interacting with the user via voice, and must apply the following rules to ensure your output sounds natural in a text-to-speech system:
- Respond in plain text only. Never use JSON, markdown, lists, tables, code, emojis, or other complex formatting.
- Keep replies brief by default: one to three sentences. Ask one question at a time.
- Spell out numbers, phone numbers, or email addresses.
- Omit \`https://\` and other formatting if listing a web URL.
- Avoid acronyms and words with unclear pronunciation, when possible.

# Tools
You have access to :
    - check_availability(date: str, time: str): Check if a specific date and time is available.
    - book_appointment(name: str, date: str, time: str): Use this tool to book available appointment slots.
    - call_forward(): Use this tool when you cannot satisfy the user's request or when the user asks to be transferred to a live agent.
when you gather all the information (Name, Date, and Time), call this tool to book an appointment for user.

    
# Goal

Assist the patient in managing their clinic visits. You will accomplish the following:
- Identify if they want to book, reschedule, or cancel an appointment.
- Check availability for their requested date and time.
- Collect their name for their visit.
- **DO NOT ask the user for their phone number.** The phone number is automatically detected by the system and will be used when booking.
- Confirm the appointment details clearly with the patient.
# Guardrails

- Stay within safe, lawful, and appropriate use; decline harmful or outâ€‘ofâ€‘scope requests.
- For medical, legal, or financial topics, provide general information only and suggest consulting a qualified professional.
- Protect privacy and minimize sensitive data.
- The clinic is open Monday through Friday, 9:00 AM to 5:00 PM.


# Conversational flow

- Help the user accomplish their objective efficiently and correctly. Prefer the simplest safe step first. Check understanding and adapt.
- Provide guidance in small steps and confirm completion before continuing.
- Summarize key results when closing a topic.`

export function AgentConfig() {
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get("name") as string;
        const model = formData.get("model") as string || "openai-realtime"; // Select might not be in formData if not native select
        // For Shadcn select, we might need controlled state or hidden input.
        // Simplifying for now: assuming native inputs or easy extraction.
        // Actually Shadcn Select is not a native select, so FormData won't pick it up directly unless we used a hidden input.
        // Let's use controlled state for Selects to be safe.
    }
    // ...
    // Wait, replacing the whole function is better to introduce state.
    // I will rewrite the component to use state for form values.

    const [name, setName] = React.useState("my-voice-assistant");
    const [model, setModel] = React.useState("openai-realtime");
    const [voice, setVoice] = React.useState("coral");
    const [prompt, setPrompt] = React.useState(defaultPrompt);
    const [loading, setLoading] = React.useState(false);

    const onSave = async () => {
        setLoading(true);
        try {
            const { createAgent } = await import("@/lib/api/agent/crud-agent");
            await createAgent({
                name,
                config: {
                    model,
                    voice,
                    instructions: prompt,
                }
            });
            alert("Agent created successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to create agent");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 lg:col-span-5 space-y-4">
                <Tabs defaultValue="realtime" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="realtime">Realtime Model</TabsTrigger>
                        <TabsTrigger value="customize">Customize</TabsTrigger>
                    </TabsList>
                    <TabsContent value="realtime">
                        <Card>
                            <CardHeader>
                                <CardTitle>Agent Configuration</CardTitle>
                                <CardDescription>
                                    Configure your voice AI agent settings to match the backend.
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="model">LLM Model</Label>
                                            <Select value={model} onValueChange={setModel}>
                                                <SelectTrigger id="model">
                                                    <SelectValue placeholder="Select a model" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="openai-realtime">OpenAI Realtime</SelectItem>
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
                                        <Label htmlFor="prompt">System Prompt</Label>
                                        <Textarea
                                            id="prompt"
                                            className="min-h-[300px] font-mono text-sm"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Appointment Tools</Label>
                                            <CardDescription>
                                                Enable booking, checking availability, and call forwarding (AppointmentTools).
                                            </CardDescription>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Discard Changes</Button>
                                <Button onClick={onSave} disabled={loading}>
                                    {loading ? "Saving..." : "Save Configuration"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="customize">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customize</CardTitle>
                                <CardDescription>
                                    Advanced customization settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                                Customize settings coming soon.
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Card>
                    <CardHeader>
                        <CardTitle>Transcripts & Logs</CardTitle>
                        <CardDescription>View recent session reports and transcripts from `call_records`.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            No recent calls found.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}



