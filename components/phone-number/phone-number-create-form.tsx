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
import { createPhoneNumber, PhoneNumberCreate } from "@/lib/api/phone-numbers/crud-phone-numbers"

interface PhoneNumberCreateFormProps {
    onSuccess: () => void
    onCancel: () => void
}

export function PhoneNumberCreateForm({ onSuccess, onCancel }: PhoneNumberCreateFormProps) {
    const [label, setLabel] = React.useState("")
    const [number, setNumber] = React.useState("")
    const [provider, setProvider] = React.useState("Twilio")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const payload: PhoneNumberCreate = {
                label,
                number,
                provider,
            }
            await createPhoneNumber(payload)
            onSuccess()
        } catch (error) {
            console.error("Failed to create phone number", error)
            alert("Failed to create phone number")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Phone Number</CardTitle>
                <CardDescription>
                    Register a new phone number.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="label">Label</Label>
                        <Input
                            id="label"
                            placeholder="e.g. Support Line"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="number">Phone Number</Label>
                        <Input
                            id="number"
                            placeholder="+1234567890"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="provider">Provider</Label>
                        <Select value={provider} onValueChange={setProvider}>
                            <SelectTrigger id="provider">
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Twilio">Twilio</SelectItem>
                                <SelectItem value="Telnyx">Telnyx</SelectItem>
                                <SelectItem value="SignalWire">SignalWire</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Phone Number"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
