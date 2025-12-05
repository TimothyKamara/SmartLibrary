"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: number
  title: string
  author: string
  category: string
  available: boolean
  coverImage: string
  isbn: string
  publishedYear: number
}

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const [isBorrowed, setIsBorrowed] = useState(!book.available)
  const { toast } = useToast()

  const handleBorrow = () => {
    if (isBorrowed) {
      toast({
        title: "Book Returned",
        description: `${book.title} has been returned successfully.`,
      })
      setIsBorrowed(false)
    } else {
      toast({
        title: "Book Borrowed",
        description: `${book.title} has been added to your borrowed books.`,
      })
      setIsBorrowed(true)
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <Image
            src={book.coverImage || "/placeholder.svg"}
            alt={`${book.title} cover`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            {isBorrowed ? (
              <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm">
                <XCircle className="h-3 w-3 mr-1" />
                Borrowed
              </Badge>
            ) : (
              <Badge className="bg-primary/95 backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Available
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-balance">{book.title}</h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
          <div className="flex items-center justify-between pt-2">
            <Badge variant="outline" className="text-xs">
              {book.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{book.publishedYear}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleBorrow} variant={isBorrowed ? "outline" : "default"} className="w-full" disabled={false}>
          <BookOpen className="h-4 w-4 mr-2" />
          {isBorrowed ? "Return Book" : "Borrow Book"}
        </Button>
      </CardFooter>
    </Card>
  )
}
