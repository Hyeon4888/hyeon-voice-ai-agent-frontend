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
import { Switch } from "@/components/ui/shadcn/switch"
import {
    BusinessHours,
    getBusinessHours,
    updateBusinessHours
} from "@/lib/api/settings/crud-settings"

export function BusinessHoursSettings() {
    const [hours, setHours] = React.useState<BusinessHours[]>([])
    const [loading, setLoading] = React.useState(true)
    const [saving, setSaving] = React.useState(false)

    React.useEffect(() => {
        const fetchHours = async () => {
            try {
                const data = await getBusinessHours()
                setHours(data)
            } catch (error) {
                console.error("Failed to fetch business hours", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHours()
    }, [])

    const handleDayToggle = (index: number) => {
        const newHours = [...hours]
        newHours[index].isOpen = !newHours[index].isOpen
        setHours(newHours)
    }

    const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
        const newHours = [...hours]
        newHours[index][field] = value
        setHours(newHours)
    }

    const onSave = async () => {
        setSaving(true)
        try {
            await updateBusinessHours(hours)
            // You might want to show a toast here
            alert("Business hours saved successfully")
        } catch (error) {
            console.error("Failed to save business hours", error)
            alert("Failed to save business hours")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>
                    Configure your business operating hours. Interactions outside these hours will be handled differently.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {hours.map((day, index) => (
                        <div key={day.day} className="flex items-center justify-between space-x-4 rounded-lg border p-3">
                            <div className="flex items-center space-x-4">
                                <Switch
                                    checked={day.isOpen}
                                    onCheckedChange={() => handleDayToggle(index)}
                                />
                                <Label className="text-base font-medium w-24">{day.day}</Label>
                            </div>

                            {day.isOpen ? (
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="time"
                                        value={day.start}
                                        onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                                        className="w-32"
                                    />
                                    <span>to</span>
                                    <Input
                                        type="time"
                                        value={day.end}
                                        onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                                        className="w-32"
                                    />
                                </div>
                            ) : (
                                <div className="text-muted-foreground flex-1 text-center">
                                    Closed
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={onSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </CardFooter>
        </Card>
    )
}
