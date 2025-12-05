"use client"

import { useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useBooks } from "@/lib/books-context"
import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MyBooksPage() {
  const { user } = useAuth()
  const { borrowRequests, borrowedBooks } = useBooks()
  const router = useRouter()

  const myRequests = useMemo(() => {
    if (!user) return []
    return borrowRequests.filter((r) => r.studentId === user.id)
  }, [borrowRequests, user])

  const myBorrowedBooks = useMemo(() => {
    if (!user) return []
    return borrowedBooks.filter((b) => b.studentId === user.id && !b.returnDate)
  }, [borrowedBooks, user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Redirect if not student
  if (user && user.role !== "student") {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Books</h1>
          <p className="text-muted-foreground">Track your borrow requests and currently borrowed books</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Borrow Requests</h2>
            {myRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{request.bookTitle}</CardTitle>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "default"
                              : request.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Requested {formatDate(request.requestDate)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Currently Borrowed</h2>
            {myBorrowedBooks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No books currently borrowed</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myBorrowedBooks.map((borrowed) => {
                  const daysUntilDue = getDaysUntilDue(borrowed.dueDate)
                  const isOverdue = daysUntilDue < 0
                  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0

                  return (
                    <Card key={borrowed.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{borrowed.bookTitle}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Borrowed {formatDate(borrowed.borrowDate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Due date:</span>
                          <span
                            className={
                              isOverdue
                                ? "text-destructive font-medium"
                                : isDueSoon
                                  ? "text-yellow-600 font-medium"
                                  : "font-medium"
                            }
                          >
                            {formatDate(borrowed.dueDate)}
                          </span>
                        </div>
                        {isOverdue && (
                          <Badge variant="destructive" className="w-full justify-center">
                            Overdue by {Math.abs(daysUntilDue)} days
                          </Badge>
                        )}
                        {isDueSoon && !isOverdue && (
                          <Badge variant="secondary" className="w-full justify-center bg-yellow-100 text-yellow-900">
                            Due in {daysUntilDue} days
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
