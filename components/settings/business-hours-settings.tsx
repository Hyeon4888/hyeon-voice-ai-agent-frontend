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
    BusinessHour,
    getBusinessHours,
    updateBusinessHours
} from "@/lib/api/settings/crud-settings"

export function BusinessHoursSettings() {
    const [hours, setHours] = React.useState<BusinessHour[]>([])
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
        newHours[index].is_open = !newHours[index].is_open
        setHours(newHours)
    }

    const handleTimeChange = (index: number, field: 'start_time' | 'end_time', value: string) => {
        const newHours = [...hours]
        newHours[index][field] = value
        setHours(newHours)
    }

    const onSave = async () => {
        setSaving(true)
        try {
            await updateBusinessHours(hours)
            // Re-fetch to get IDs for any newly created records
            const data = await getBusinessHours()
            setHours(data)
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
                                    checked={day.is_open}
                                    onCheckedChange={() => handleDayToggle(index)}
                                />
                                <Label className="text-base font-medium w-24">{day.day}</Label>
                            </div>

                            {day.is_open ? (
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="time"
                                        value={day.start_time}
                                        onChange={(e) => handleTimeChange(index, 'start_time', e.target.value)}
                                        className="w-32"
                                    />
                                    <span>to</span>
                                    <Input
                                        type="time"
                                        value={day.end_time}
                                        onChange={(e) => handleTimeChange(index, 'end_time', e.target.value)}
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
                    {saving ? "Saving..." : (hours.length > 0 && !hours[0].id ? "Create" : "Save Changes")}
                </Button>
            </CardFooter>
        </Card>
    )
}
