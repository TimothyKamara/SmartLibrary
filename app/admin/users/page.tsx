"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  if (user && user.role !== "admin") {
    router.push("/")
    return null
  }

  // Group users by role
  const usersByRole = users.reduce(
    (acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = []
      }
      acc[user.role].push(user)
      return acc
    },
    {} as Record<string, User[]>,
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">View all registered users in the system</p>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersByRole.student?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Student accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(usersByRole.librarian?.length || 0) + (usersByRole.admin?.length || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Librarians & Admins</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {Object.entries(usersByRole).map(([role, roleUsers]) => (
            <section key={role}>
              <h2 className="text-xl font-semibold mb-4 capitalize">{role}s</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roleUsers.map((user) => (
                  <Card key={user.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <CardDescription>{user.email}</CardDescription>
                        </div>
                        <Badge
                          variant={role === "admin" ? "default" : role === "librarian" ? "secondary" : "outline"}
                          className="capitalize"
                        >
                          {role}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>
          ))}

          {users.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No registered users yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
