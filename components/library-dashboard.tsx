"use client"

import { useState } from "react"
import { BookCard } from "@/components/book-card"
import { SearchBar } from "@/components/search-bar"
import { Badge } from "@/components/ui/badge"
import { Book } from "lucide-react"

// Sample book data
const booksData = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic Literature",
    available: true,
    coverImage: "/the-great-gatsby-book-cover-classic-1920s-art-deco.jpg",
    isbn: "978-0743273565",
    publishedYear: 1925,
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Classic Literature",
    available: true,
    coverImage: "/to-kill-a-mockingbird-book-cover-tree-courthouse.jpg",
    isbn: "978-0061120084",
    publishedYear: 1960,
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    category: "Science Fiction",
    available: false,
    coverImage: "/1984-book-cover-dystopian-eye-surveillance.jpg",
    isbn: "978-0451524935",
    publishedYear: 1949,
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    available: true,
    coverImage: "/pride-and-prejudice-book-cover-regency-era-elegant.jpg",
    isbn: "978-0141439518",
    publishedYear: 1813,
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Classic Literature",
    available: true,
    coverImage: "/the-catcher-in-the-rye-book-cover-minimalist-red.jpg",
    isbn: "978-0316769174",
    publishedYear: 1951,
  },
  {
    id: 6,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    category: "Fantasy",
    available: false,
    coverImage: "/harry-potter-book-cover-magical-lightning-scar-hog.jpg",
    isbn: "978-0439708180",
    publishedYear: 1997,
  },
  {
    id: 7,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    available: true,
    coverImage: "/the-hobbit-book-cover-mountain-dragon-adventure.jpg",
    isbn: "978-0547928227",
    publishedYear: 1937,
  },
  {
    id: 8,
    title: "Brave New World",
    author: "Aldous Huxley",
    category: "Science Fiction",
    available: true,
    coverImage: "/brave-new-world-book-cover-futuristic-society.jpg",
    isbn: "978-0060850524",
    publishedYear: 1932,
  },
]

export default function LibraryDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(booksData.map((book) => book.category)))]

  // Filter books based on search query and category
  const filteredBooks = booksData.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Book className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">Student Library Portal</h1>
              <p className="text-sm text-muted-foreground">Browse and borrow books from our collection</p>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer transition-colors hover:bg-primary/90"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg border p-4">
            <div className="text-2xl font-bold text-primary">{booksData.length}</div>
            <div className="text-sm text-muted-foreground">Total Books</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-2xl font-bold text-primary">{booksData.filter((b) => b.available).length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-2xl font-bold text-primary">{filteredBooks.length}</div>
            <div className="text-sm text-muted-foreground">Search Results</div>
          </div>
        </div>

        {/* Book Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No books found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  )
}
