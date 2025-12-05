"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  coverUrl: string
  description: string
  totalCopies: number
  availableCopies: number
  publishedYear: number
}

export interface BorrowRequest {
  id: string
  bookId: string
  studentId: string
  studentName: string
  bookTitle: string
  requestDate: string
  status: "pending" | "approved" | "rejected"
}

export interface BorrowedBook {
  id: string
  bookId: string
  studentId: string
  studentName: string
  bookTitle: string
  borrowDate: string
  dueDate: string
  returnDate?: string
}

interface BooksContextType {
  books: Book[]
  borrowRequests: BorrowRequest[]
  borrowedBooks: BorrowedBook[]
  addBook: (book: Omit<Book, "id">) => void
  updateBook: (id: string, book: Partial<Book>) => void
  deleteBook: (id: string) => void
  requestBorrow: (bookId: string, studentId: string, studentName: string) => void
  approveBorrow: (requestId: string) => void
  rejectBorrow: (requestId: string) => void
  returnBook: (borrowId: string) => void
}

const BooksContext = createContext<BooksContextType | undefined>(undefined)

const initialBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    category: "Fiction",
    coverUrl: "/the-great-gatsby-book-cover-classic-1920s-art-deco.jpg",
    description: "A classic novel of the Jazz Age",
    totalCopies: 5,
    availableCopies: 3,
    publishedYear: 1925,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    category: "Fiction",
    coverUrl: "/to-kill-a-mockingbird-book-cover-tree-courthouse.jpg",
    description: "A gripping tale of racial injustice and childhood innocence",
    totalCopies: 4,
    availableCopies: 2,
    publishedYear: 1960,
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    category: "Science Fiction",
    coverUrl: "/1984-book-cover-dystopian-eye-surveillance.jpg",
    description: "A dystopian social science fiction novel",
    totalCopies: 6,
    availableCopies: 4,
    publishedYear: 1949,
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    category: "Romance",
    coverUrl: "/pride-and-prejudice-book-cover-regency-era-elegant.jpg",
    description: "A romantic novel of manners",
    totalCopies: 3,
    availableCopies: 1,
    publishedYear: 1813,
  },
]

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([])
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([])
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])

  useEffect(() => {
    // Load from localStorage or use initial data
    const storedBooks = localStorage.getItem("books")
    const storedRequests = localStorage.getItem("borrowRequests")
    const storedBorrowed = localStorage.getItem("borrowedBooks")

    setBooks(storedBooks ? JSON.parse(storedBooks) : initialBooks)
    setBorrowRequests(storedRequests ? JSON.parse(storedRequests) : [])
    setBorrowedBooks(storedBorrowed ? JSON.parse(storedBorrowed) : [])
  }, [])

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books))
  }, [books])

  useEffect(() => {
    localStorage.setItem("borrowRequests", JSON.stringify(borrowRequests))
  }, [borrowRequests])

  useEffect(() => {
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks))
  }, [borrowedBooks])

  const addBook = (book: Omit<Book, "id">) => {
    const newBook = { ...book, id: Date.now().toString() }
    setBooks([...books, newBook])
  }

  const updateBook = (id: string, updatedBook: Partial<Book>) => {
    setBooks(books.map((book) => (book.id === id ? { ...book, ...updatedBook } : book)))
  }

  const deleteBook = (id: string) => {
    setBooks(books.filter((book) => book.id !== id))
  }

  const requestBorrow = (bookId: string, studentId: string, studentName: string) => {
    const book = books.find((b) => b.id === bookId)
    if (!book) return

    const newRequest: BorrowRequest = {
      id: Date.now().toString(),
      bookId,
      studentId,
      studentName,
      bookTitle: book.title,
      requestDate: new Date().toISOString(),
      status: "pending",
    }
    setBorrowRequests([...borrowRequests, newRequest])
  }

  const approveBorrow = (requestId: string) => {
    const request = borrowRequests.find((r) => r.id === requestId)
    if (!request) return

    // Update request status
    setBorrowRequests(borrowRequests.map((r) => (r.id === requestId ? { ...r, status: "approved" as const } : r)))

    // Create borrowed book record
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // 2 weeks loan period

    const borrowedBook: BorrowedBook = {
      id: Date.now().toString(),
      bookId: request.bookId,
      studentId: request.studentId,
      studentName: request.studentName,
      bookTitle: request.bookTitle,
      borrowDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
    }
    setBorrowedBooks([...borrowedBooks, borrowedBook])

    // Decrease available copies
    setBooks(
      books.map((book) => (book.id === request.bookId ? { ...book, availableCopies: book.availableCopies - 1 } : book)),
    )
  }

  const rejectBorrow = (requestId: string) => {
    setBorrowRequests(borrowRequests.map((r) => (r.id === requestId ? { ...r, status: "rejected" as const } : r)))
  }

  const returnBook = (borrowId: string) => {
    const borrowed = borrowedBooks.find((b) => b.id === borrowId)
    if (!borrowed) return

    // Mark as returned
    setBorrowedBooks(borrowedBooks.map((b) => (b.id === borrowId ? { ...b, returnDate: new Date().toISOString() } : b)))

    // Increase available copies
    setBooks(
      books.map((book) =>
        book.id === borrowed.bookId ? { ...book, availableCopies: book.availableCopies + 1 } : book,
      ),
    )
  }

  return (
    <BooksContext.Provider
      value={{
        books,
        borrowRequests,
        borrowedBooks,
        addBook,
        updateBook,
        deleteBook,
        requestBorrow,
        approveBorrow,
        rejectBorrow,
        returnBook,
      }}
    >
      {children}
    </BooksContext.Provider>
  )
}

export function useBooks() {
  const context = useContext(BooksContext)
  if (context === undefined) {
    throw new Error("useBooks must be used within a BooksProvider")
  }
  return context
}
