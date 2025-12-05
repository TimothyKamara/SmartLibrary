"use client"

import { useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useBooks } from "@/lib/books-context"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Calendar, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BorrowedBooksPage() {
  const { user } = useAuth()
  const { borrowedBooks, returnBook } = useBooks()
  const { toast } = useToast()
  const router = useRouter()

  const activeBorrows = useMemo(() => {
    return borrowedBooks.filter((b) => !b.returnDate)
  }, [borrowedBooks])

  const returnedBorrows = useMemo(() => {
    return borrowedBooks.filter((b) => b.returnDate)
  }, [borrowedBooks])

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

  if (user && user.role !== "librarian") {
    router.push("/")
    return null
  }

  const handleReturn = (borrowId: string, bookTitle: string) => {
    returnBook(borrowId)
    toast({
      title: "Book returned",
      description: `"${bookTitle}" has been marked as returned`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Borrowed Books</h1>
          <p className="text-muted-foreground">Track and manage all borrowed books</p>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Currently Out</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBorrows.length}</div>
              <p className="text-xs text-muted-foreground">Books with students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Returned</CardTitle>
              <RotateCcw className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{returnedBorrows.length}</div>
              <p className="text-xs text-muted-foreground">Total returns</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Currently Borrowed</h2>
            {activeBorrows.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No books currently borrowed</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeBorrows.map((borrowed) => {
                  const daysUntilDue = getDaysUntilDue(borrowed.dueDate)
                  const isOverdue = daysUntilDue < 0
                  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0

                  return (
                    <Card key={borrowed.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{borrowed.bookTitle}</CardTitle>
                            <CardDescription>Borrowed by {borrowed.studentName}</CardDescription>
                          </div>
                          {isOverdue && <Badge variant="destructive">Overdue by {Math.abs(daysUntilDue)} days</Badge>}
                          {isDueSoon && !isOverdue && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-900">
                              Due in {daysUntilDue} days
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Borrowed: {formatDate(borrowed.borrowDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Due:</span>
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
                          </div>
                          <Button onClick={() => handleReturn(borrowed.id, borrowed.bookTitle)} className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Mark as Returned
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Return History</h2>
            {returnedBorrows.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <RotateCcw className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No returned books yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {returnedBorrows
                  .slice(-10)
                  .reverse()
                  .map((borrowed) => (
                    <Card key={borrowed.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-base">{borrowed.bookTitle}</CardTitle>
                            <CardDescription>Borrowed by {borrowed.studentName}</CardDescription>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-900">
                            Returned
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Borrowed:</span>
                            <div className="font-medium">{formatDate(borrowed.borrowDate)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Returned:</span>
                            <div className="font-medium">{borrowed.returnDate && formatDate(borrowed.returnDate)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
