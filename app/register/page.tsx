"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import { signUp } from "@/lib/api/auth/auth"
import { toast } from "sonner"

export default function RegisterPage() {
    const { signup } = useAuth()
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            // User request:
            // class UserCreate(BaseModel): name: str, email: EmailStr, password: str
            // @router.post("/signup", response_model=Token)

            const response = await signUp({ name, email, password })
            signup(response.access_token)
            toast.success("Account created successfully")
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.detail || "Failed to create account")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                className="bg-background/50"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                            <Label htmlFor="password">Password</Label>
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
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            Already have an account? <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">Sign in</Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
