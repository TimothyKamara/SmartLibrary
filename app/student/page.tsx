"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useBooks } from "@/lib/books-context"
import { Navigation } from "@/components/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Search, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const { user } = useAuth()
  const { books, requestBorrow, borrowRequests } = useBooks()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { toast } = useToast()
  const router = useRouter()

  const categories = ["all", ...Array.from(new Set(books.map((book) => book.category)))]

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)
      const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [books, searchQuery, selectedCategory])

  if (user && user.role !== "student") {
    router.push("/")
    return null
  }

  const handleBorrow = (bookId: string) => {
    if (!user) return

    const book = books.find((b) => b.id === bookId)
    if (!book) return

    if (book.availableCopies === 0) {
      toast({
        title: "Book unavailable",
        description: "No copies available at the moment",
        variant: "destructive",
      })
      return
    }

    // Check if already requested
    const alreadyRequested = borrowRequests.some(
      (r) => r.bookId === bookId && r.studentId === user.id && r.status === "pending",
    )

    if (alreadyRequested) {
      toast({
        title: "Already requested",
        description: "You have already requested this book",
        variant: "destructive",
      })
      return
    }

    requestBorrow(bookId, user.id, user.name)
    toast({
      title: "Borrow request sent",
      description: "Your request has been sent to the librarian",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Books</h1>
          <p className="text-muted-foreground">Explore our collection and request books to borrow</p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="flex flex-col">
              <CardHeader className="pb-4">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted mb-4">
                  <img
                    src={book.coverUrl || "/placeholder.svg"}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
                <CardDescription className="line-clamp-1">{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">{book.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-medium">
                    {book.availableCopies} / {book.totalCopies}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ISBN</span>
                  <span className="font-mono text-xs">{book.isbn}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleBorrow(book.id)} disabled={book.availableCopies === 0}>
                  {book.availableCopies === 0 ? "Unavailable" : "Request to Borrow"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
