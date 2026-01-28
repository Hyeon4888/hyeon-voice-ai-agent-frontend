import { Metadata } from "next"
import Link from "next/link"

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

export const metadata: Metadata = {
  title: "Login - Voice AI Agent",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                className="bg-background/50"
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
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button className="w-full font-semibold" size="lg">Sign in</Button>
            <div className="text-sm text-center text-muted-foreground">
                Don't have an account? <Link href="/register" className="font-medium text-primary hover:underline underline-offset-4">Sign up</Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  )
}
