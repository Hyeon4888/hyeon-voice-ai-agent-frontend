"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Badge } from "@/components/ui/shadcn/badge"
import { ScrollArea } from "@/components/ui/shadcn/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { getHistory, History } from "@/lib/api/history/crud-history"

// Helper to convert backend date/time to Date object
export const getHistoryDate = (history: History) => {
    return new Date(`${history.date}T${history.time}`)
}

interface HistoryListProps {
    agentId: string
    onSelectCall: (call: History) => void
}

export function HistoryList({ agentId, onSelectCall }: HistoryListProps) {
    const [history, setHistory] = React.useState<History[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            try {
                const data = await getHistory(agentId)
                setHistory(data)
            } catch (error) {
                console.error("Failed to fetch history", error)
            } finally {
                setLoading(false)
            }
        }
        if (agentId) {
            fetchHistory()
        }
    }, [agentId])

    if (loading) {
        return <div className="p-4 text-center text-muted-foreground">Loading history...</div>
    }

    if (history.length === 0) {
        return <div className="p-4 text-center text-muted-foreground">No history found for this agent.</div>
    }

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-4">
                {history.map((item) => {
                    const date = getHistoryDate(item)
                    return (
                        <Card
                            key={item.id}
                            className="cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => onSelectCall(item)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-base">
                                        {formatDistanceToNow(date, { addSuffix: true })}
                                    </CardTitle>
                                    <Badge variant="outline">
                                        Completed
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Duration: {Math.floor(item.duration / 60)}m {item.duration % 60}s
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {item.summary || "No summary available"}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </ScrollArea>
    )
}
