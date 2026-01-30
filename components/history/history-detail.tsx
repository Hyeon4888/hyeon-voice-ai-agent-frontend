"use client"

import * as React from "react"
import { HistoryItem } from "./history-list"
import { Separator } from "@/components/ui/shadcn/separator"
import { Button } from "@/components/ui/shadcn/button"
import { IconX } from "@tabler/icons-react"
import { format } from "date-fns"

interface HistoryDetailProps {
    call: HistoryItem
    onClose: () => void
}

export function HistoryDetail({ call, onClose }: HistoryDetailProps) {
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
                    <p className="text-sm">{format(call.startedAt, "PPpp")}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Duration</h4>
                        <p className="text-sm">{Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                        <p className="text-sm capitalize">{call.status}</p>
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Summary</h4>
                    <p className="text-sm leading-relaxed">{call.summary}</p>
                </div>

                <Separator />

                <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Transcript (Mock)</h4>
                    <div className="bg-muted p-4 rounded-md space-y-3 text-sm">
                        <p><span className="font-semibold text-primary">AI:</span> Hello! How can I help you today?</p>
                        <p><span className="font-semibold">User:</span> I'd like to check my appointment status.</p>
                        <p><span className="font-semibold text-primary">AI:</span> Sure, let me look that up for you...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
