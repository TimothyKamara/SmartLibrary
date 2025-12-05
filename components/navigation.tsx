"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, BookMarked, LogOut, LayoutDashboard } from "lucide-react"

export function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const getNavItems = () => {
    switch (user.role) {
      case "student":
        return [
          { href: "/student", label: "All Books", icon: BookOpen },
          { href: "/student/borrowed", label: "My Books", icon: BookMarked },
        ]
      case "librarian":
        return [
          { href: "/librarian", label: "Borrow Requests", icon: LayoutDashboard },
          { href: "/librarian/borrowed", label: "Borrowed Books", icon: BookMarked },
        ]
      case "admin":
        return [
          { href: "/admin", label: "Manage Books", icon: BookOpen },
          { href: "/admin/users", label: "View Users", icon: Users },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="border-b bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
              <BookOpen className="h-6 w-6" />
              LibraryHub
            </Link>
            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button variant={isActive ? "secondary" : "ghost"} className="gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-muted-foreground capitalize">{user.role}</div>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
