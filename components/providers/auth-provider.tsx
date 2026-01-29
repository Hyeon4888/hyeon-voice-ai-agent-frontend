"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { getCurrentUser } from "@/lib/api/auth/auth"

interface User {
    id: number
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (token: string, refreshToken: string) => void
    logout: () => void
    signup: (token: string, refreshToken: string) => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null)
    const [loading, setLoading] = React.useState(true)
    const router = useRouter()
    const pathname = usePathname()

    const fetchUser = React.useCallback(async () => {
        try {
            const token = Cookies.get("token")
            if (!token) {
                setUser(null)
                setLoading(false)
                return
            }

            const user = await getCurrentUser()
            setUser(user)
        } catch (error) {
            console.error("Failed to fetch user", error)
            Cookies.remove("token")
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const login = (token: string, refreshToken: string) => {
        Cookies.set("token", token, { expires: 7 })
        Cookies.set("refresh_token", refreshToken, { expires: 30 })
        fetchUser().then(() => {
            router.push("/")
        })
    }

    const signup = (token: string, refreshToken: string) => {
        Cookies.set("token", token, { expires: 7 })
        Cookies.set("refresh_token", refreshToken, { expires: 30 })
        fetchUser().then(() => {
            router.push("/")
        })
    }

    const logout = () => {
        Cookies.remove("token")
        Cookies.remove("refresh_token")
        setUser(null)
        router.push("/login")
    }

    // Protect routes
    React.useEffect(() => {
        const isAuthPage = pathname === "/login" || pathname === "/register"
        const isPublicPage = pathname === "/forgot-password" // Add other public pages if any

        if (!loading) {
            if (!user && !isAuthPage && !isPublicPage) {
                router.push("/login")
            } else if (user && isAuthPage) {
                router.push("/")
            }
        }
    }, [user, loading, pathname, router])

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
