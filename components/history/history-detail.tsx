"use client"

import { History } from "@/lib/api/history/crud-history"
import { getHistoryDate } from "./history-list"
import { Separator } from "@/components/ui/shadcn/separator"
import { Button } from "@/components/ui/shadcn/button"
import { IconX } from "@tabler/icons-react"
import { format } from "date-fns"

interface HistoryDetailProps {
    call: History
    onClose: () => void
}

export function HistoryDetail({ call, onClose }: HistoryDetailProps) {
    const date = getHistoryDate(call)

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Call Details</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <IconX className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Date & Time</h4>
                    <p className="text-sm">{format(date, "PPpp")}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Duration</h4>
                        <p className="text-sm">{Math.floor(call.duration / 60)}m {call.duration % 60}s</p>
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Summary</h4>
                    <p className="text-sm leading-relaxed">{call.summary || "No summary available."}</p>
                </div>

                <Separator />

                <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Transcript</h4>
                    <div className="bg-muted p-4 rounded-md space-y-3 text-sm whitespace-pre-wrap font-mono">
                        {call.conversation || "No transcript available."}
                    </div>
                </div>
            </div>
        </div>
    )
}
