"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, LogOut, User, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
}

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          {(pathname === "/events/create" || pathname.startsWith("/events/") && pathname !== "/events") && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/events">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Calendar className="h-6 w-6" />
            <span>EventEra</span>
          </Link>

          <div className="hidden gap-6 md:flex">
            {isLoggedIn && (
              <>
                <Link
                  href="/events"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground",
                    pathname === "/events" ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  Events
                </Link>
                <Link
                  href="/hosting"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground",
                    pathname === "/hosting" ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  Hosting
                </Link>
                <Link
                  href="/registered"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground",
                    pathname === "/registered" ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  Registered
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user.name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
