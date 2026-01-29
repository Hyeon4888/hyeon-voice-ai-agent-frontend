"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
import { useAuth } from "@/components/providers/auth-provider"
import { signIn } from "@/lib/api/auth/auth"
import { toast } from "sonner"

export default function LoginPage() {
    const { login } = useAuth()
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            // User request:
            // class UserLogin(BaseModel): email: EmailStr, password: str
            // @router.post("/signin", response_model=Token)

            const response = await signIn({ email, password })
            login(response.access_token, response.refresh_token)
            toast.success("Logged in successfully")

            // Note: I will need to clean up the import of 'api' as well in a separate step or via multi-replace if I want to be cleaner, but I'll start with logic replacement.
            // Wait, I can only update one block relative to what I see. 
            // I will just replace the handleSubmit logic and the import in separate steps if needed, but since I can't see the top of the file right now (except from memory/previous view), I better stay safe.
            // My previous view showed 'api' imported at line 19.
            // I'll update line 19 and then line 37.
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.detail || "Failed to login")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
                    <CardDescription>
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className="bg-background/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-primary hover:underline underline-offset-4"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                className="bg-background/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full font-semibold" size="lg" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            Don't have an account? <Link href="/register" className="font-medium text-primary hover:underline underline-offset-4">Sign up</Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}



