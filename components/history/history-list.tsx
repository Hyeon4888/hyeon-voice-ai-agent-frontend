"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Badge } from "@/components/ui/shadcn/badge"
import { ScrollArea } from "@/components/ui/shadcn/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { getHistory, clearHistory, History } from "@/lib/api/history/crud-history"
import { Button } from "@/components/ui/shadcn/button"
import { Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog"
import { toast } from "sonner"

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
    const [clearing, setClearing] = React.useState(false)

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

    const handleClearHistory = async () => {
        setClearing(true)
        try {
            await clearHistory(agentId)
            setHistory([])
            toast.success("History cleared successfully")
        } catch (error) {
            console.error("Failed to clear history", error)
            toast.error("Failed to clear history")
        } finally {
            setClearing(false)
        }
    }

    if (loading) {
        return <div className="p-4 text-center text-muted-foreground">Loading history...</div>
    }

    if (history.length === 0) {
        return <div className="p-4 text-center text-muted-foreground">No history found for this agent.</div>
    }

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-end">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={clearing}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Empty History
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete all call history for this agent.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    {clearing ? "Clearing..." : "Empty History"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
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
