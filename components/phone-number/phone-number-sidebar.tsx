"use client"

import * as React from "react"
import { IconPhone, IconPlus } from "@tabler/icons-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/shadcn/sidebar"

import { PhoneNumber } from "@/lib/api/phone-numbers/crud-phone-numbers"

interface PhoneNumberSidebarProps extends React.ComponentProps<typeof Sidebar> {
    phoneNumbers: PhoneNumber[]
    selectedPhoneNumberId?: string
    onSelectPhoneNumber?: (phoneNumber: PhoneNumber) => void
    onRefresh: () => void
    onAdd?: () => void
}

export function PhoneNumberSidebar({ phoneNumbers, selectedPhoneNumberId, onSelectPhoneNumber, onRefresh, onAdd, ...props }: PhoneNumberSidebarProps) {
    return (
        <Sidebar
            collapsible="none"
            className="hidden h-screen w-64 border-r md:flex"
            {...props}
        >
            <SidebarHeader className="border-b p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Phone Numbers</h3>
                    <button
                        onClick={onAdd}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 w-8"
                    >
                        <IconPlus className="h-4 w-4" />
                    </button>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Your Numbers</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {phoneNumbers.map((pn) => (
                                <SidebarMenuItem key={pn.id}>
                                    <SidebarMenuButton
                                        onClick={() => onSelectPhoneNumber?.(pn)}
                                        isActive={selectedPhoneNumberId === pn.id}
                                        className="h-auto py-3 px-4"
                                    >
                                        <div className="flex w-full items-start gap-3">
                                            <IconPhone className="mt-0.5 h-4 w-4 shrink-0" />
                                            <div className="flex flex-col gap-1 overflow-hidden">
                                                <span className="font-medium leading-none truncate">{pn.label}</span>
                                                <span className="text-xs text-muted-foreground truncate">{pn.number}</span>
                                            </div>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
