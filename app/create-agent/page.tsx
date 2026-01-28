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

export default function CreateAgentPage() {
    return (
        <div className="flex flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Create Agent</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Agent Details</CardTitle>
                        <CardDescription>
                            Configure your new voice AI agent.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Agent Name</Label>
                                    <Input id="name" placeholder="My Support Agent" />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" placeholder="A helpful support agent..." />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="voice">Voice</Label>
                                    <Select>
                                        <SelectTrigger id="voice">
                                            <SelectValue placeholder="Select a voice" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="alloy">Alloy</SelectItem>
                                            <SelectItem value="echo">Echo</SelectItem>
                                            <SelectItem value="fable">Fable</SelectItem>
                                            <SelectItem value="onyx">Onyx</SelectItem>
                                            <SelectItem value="nova">Nova</SelectItem>
                                            <SelectItem value="shimmer">Shimmer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="model">LLM Model</Label>
                                    <Select>
                                        <SelectTrigger id="model">
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="prompt">System Prompt</Label>
                                    <Textarea id="prompt" placeholder="You are a helpful assistant..." className="min-h-[100px]" />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button>Create Agent</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}



