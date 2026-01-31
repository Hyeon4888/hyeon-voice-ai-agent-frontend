"use client"

import { History } from "@/lib/api/history/crud-history"
import { getHistoryDate } from "./history-list"
import { Separator } from "@/components/ui/shadcn/separator"
import { Button } from "@/components/ui/shadcn/button"
import { IconX, IconUser, IconRobot, IconBolt } from "@tabler/icons-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/shadcn/badge"

interface HistoryDetailProps {
    call: History
    onClose: () => void
}

export function HistoryDetail({ call, onClose }: HistoryDetailProps) {
    const date = getHistoryDate(call)

    // Helper to safely get content string
    const getContent = (content: any): string => {
        if (Array.isArray(content)) {
            return content.join("\n")
        }
        return typeof content === 'string' ? content : JSON.stringify(content)
    }

    return (
        <div className="h-full flex flex-col bg-background">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">Call Details</h3>
                    <p className="text-xs text-muted-foreground">{format(date, "PPpp")}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <IconX className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                            <h4 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Duration</h4>
                            <p className="text-2xl font-bold">{Math.floor(call.duration / 60)}m {call.duration % 60}s</p>
                        </div>
                        <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                            <h4 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Items</h4>
                            <p className="text-2xl font-bold">
                                {Array.isArray(call.conversation) ? call.conversation.length : 0}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Summary</h4>
                        <p className="text-sm leading-relaxed text-foreground/90">{call.summary || "No summary available."}</p>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-4">Transcript</h4>
                        <div className="space-y-6">
                            {Array.isArray(call.conversation) ? (
                                call.conversation.map((item: any, index: number) => {
                                    // Handle standard messages
                                    if (item.type === 'message' || (!item.type && item.role)) {
                                        const isUser = item.role === 'user';

                                        return (
                                            <div key={item.id || index} className={cn(
                                                "flex w-full gap-2",
                                                isUser ? "justify-end" : "justify-start"
                                            )}>
                                                {!isUser && (
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                                                        <IconRobot className="w-5 h-5 text-primary" />
                                                    </div>
                                                )}

                                                <div className={cn(
                                                    "flex flex-col max-w-[80%] min-w-[100px]",
                                                    isUser ? "items-end" : "items-start"
                                                )}>
                                                    <div className={cn(
                                                        "px-4 py-2.5 rounded-2xl shadow-sm text-sm whitespace-pre-wrap leading-relaxed",
                                                        isUser
                                                            ? "bg-primary text-primary-foreground rounded-br-sm"
                                                            : "bg-muted text-foreground rounded-bl-sm"
                                                    )}>
                                                        {getContent(item.content)}
                                                    </div>
                                                    {(item.created_at || item.timestamp) && (
                                                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                                            {new Date((item.created_at || item.timestamp) * (typeof (item.created_at || item.timestamp) === 'number' && (item.created_at || item.timestamp) < 10000000000 ? 1000 : 1)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>

                                                {isUser && (
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1">
                                                        <IconUser className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }

                                    // Handle function executions
                                    if (item.type === 'function_tools_executed') {
                                        return (
                                            <div key={index} className="flex flex-col items-center gap-2 my-4 w-full">
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className="h-px bg-border flex-1" />
                                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                                                        <IconBolt className="w-3 h-3" /> Tool Execution
                                                    </span>
                                                    <div className="h-px bg-border flex-1" />
                                                </div>

                                                <div className="w-full space-y-3">
                                                    {item.function_calls?.map((fnCall: any, fnIndex: number) => {
                                                        const output = item.function_call_outputs?.find(
                                                            (o: any) => o.call_id === fnCall.call_id
                                                        );

                                                        return (
                                                            <div key={fnCall.id || fnIndex} className="bg-muted/30 border rounded-md p-3 text-xs space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <Badge variant="outline" className="font-mono text-[10px]">
                                                                        {fnCall.name}
                                                                    </Badge>
                                                                    <span className="text-[10px] text-muted-foreground font-mono">
                                                                        ID: {fnCall.call_id?.slice(-6)}
                                                                    </span>
                                                                </div>

                                                                <div className="grid gap-2">
                                                                    <div className="space-y-1">
                                                                        <span className="text-[10px] font-semibold text-muted-foreground block">Input</span>
                                                                        <pre className="bg-background/50 p-2 rounded border overflow-x-auto whitespace-pre-wrap font-mono text-muted-foreground">
                                                                            {fnCall.arguments}
                                                                        </pre>
                                                                    </div>
                                                                    {output && (
                                                                        <div className="space-y-1">
                                                                            <span className="text-[10px] font-semibold text-muted-foreground block">Output</span>
                                                                            <pre className="bg-background/50 p-2 rounded border overflow-x-auto whitespace-pre-wrap font-mono text-muted-foreground">
                                                                                {output.output}
                                                                            </pre>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    }

                                    return null
                                })
                            ) : typeof call.conversation === 'object' ? (
                                <pre className="whitespace-pre-wrap text-xs bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(call.conversation, null, 2)}</pre>
                            ) : (
                                <p className="text-sm text-muted-foreground">{call.conversation || "No transcript available."}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
