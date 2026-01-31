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
import { Label } from "@/components/ui/shadcn/label"
import { PhoneNumber } from "@/lib/api/phone-numbers/mock-data"

export function PhoneNumberConfig({ phoneNumber, loading }: {
    phoneNumber?: PhoneNumber | null,
    loading?: boolean,
}) {

    if (!phoneNumber && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p>Select a phone number to view and edit its details.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Phone Number Details</CardTitle>
                    <CardDescription>
                        {loading ? "Loading details..." : "View configuration for this phone number."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-1.5 pb-4">
                        <Label className="text-muted-foreground">Phone ID</Label>
                        <div className="font-mono text-sm bg-muted p-2 rounded-md">
                            {phoneNumber?.id}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1.5 pb-4">
                        <Label className="text-muted-foreground">Label</Label>
                        <div className="text-lg font-medium">
                            {phoneNumber?.label}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1.5 pb-4">
                        <Label className="text-muted-foreground">Number</Label>
                        <div className="font-mono text-base">
                            {phoneNumber?.phoneNumber}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1.5 pb-4">
                        <Label className="text-muted-foreground">Provider</Label>
                        <div>
                            {phoneNumber?.provider}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1.5 pb-4">
                        <Label className="text-muted-foreground">Status</Label>
                        <div>
                            {phoneNumber?.status}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
