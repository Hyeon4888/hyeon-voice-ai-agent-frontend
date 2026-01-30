import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar"
import { ApiKeysForm } from "@/components/api-keys/api-keys-form"

export default function ApiKeysPage() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 max-w-4xl mx-auto w-full">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-semibold tracking-tight">API Keys</h2>
                                <p className="text-sm text-muted-foreground">
                                    Manage your API keys for various services.
                                </p>
                            </div>
                        </div>
                        <ApiKeysForm />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
