"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Badge } from "@/components/ui/shadcn/badge"
import { ScrollArea } from "@/components/ui/shadcn/scroll-area"
import { formatDistanceToNow } from "date-fns"

export interface HistoryItem {
    id: string
    agentId: string
    startedAt: Date
    durationSeconds: number
    status: "completed" | "failed" | "in-progress"
    summary: string
}

// Mock data generator
const generateMockHistory = (agentId: string): HistoryItem[] => {
    return Array.from({ length: 10 }).map((_, i) => {
        const status: "completed" | "failed" | "in-progress" = Math.random() > 0.8 ? "failed" : "completed"
        return {
            id: `call-${agentId}-${i}`,
            agentId,
            startedAt: new Date(Date.now() - Math.random() * 1000000000),
            durationSeconds: Math.floor(Math.random() * 600),
            status,
            summary: `Call summary for conversation ${i}. This is a mock summary of what happened during the call.`
        }
    }).sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
}

interface HistoryListProps {
    agentId: string
    onSelectCall: (call: HistoryItem) => void
}

export function HistoryList({ agentId, onSelectCall }: HistoryListProps) {
    const history = React.useMemo(() => generateMockHistory(agentId), [agentId])

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-4">
                {history.map((item) => (
                    <Card
                        key={item.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onSelectCall(item)}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base">
                                    {formatDistanceToNow(item.startedAt, { addSuffix: true })}
                                </CardTitle>
                                <Badge variant={item.status === "completed" ? "default" : "destructive"}>
                                    {item.status}
                                </Badge>
                            </div>
                            <CardDescription>
                                Duration: {Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.summary}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    )
}
