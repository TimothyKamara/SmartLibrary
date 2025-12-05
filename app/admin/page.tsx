"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useBooks, type Book } from "@/lib/books-context"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { books, addBook, updateBook, deleteBook } = useBooks()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    coverUrl: "",
    description: "",
    totalCopies: 1,
    publishedYear: new Date().getFullYear(),
  })

  if (user && user.role !== "admin") {
    router.push("/")
    return null
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      coverUrl: "",
      description: "",
      totalCopies: 1,
      publishedYear: new Date().getFullYear(),
    })
  }

  const handleAdd = () => {
    if (!formData.title || !formData.author || !formData.isbn) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    addBook({
      ...formData,
      availableCopies: formData.totalCopies,
    })

    toast({
      title: "Book added",
      description: `"${formData.title}" has been added to the library`,
    })

    resetForm()
    setIsAddOpen(false)
  }

  const handleEdit = () => {
    if (!editingBook) return

    if (!formData.title || !formData.author || !formData.isbn) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const currentBook = books.find((b) => b.id === editingBook.id)
    const copiesDiff = formData.totalCopies - (currentBook?.totalCopies || 0)

    updateBook(editingBook.id, {
      ...formData,
      availableCopies: (currentBook?.availableCopies || 0) + copiesDiff,
    })

    toast({
      title: "Book updated",
      description: `"${formData.title}" has been updated`,
    })

    resetForm()
    setEditingBook(null)
  }

  const handleDelete = (bookId: string, title: string) => {
    deleteBook(bookId)
    toast({
      title: "Book deleted",
      description: `"${title}" has been removed from the library`,
      variant: "destructive",
    })
  }

  const openEditDialog = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      coverUrl: book.coverUrl,
      description: book.description,
      totalCopies: book.totalCopies,
      publishedYear: book.publishedYear,
    })
    setEditingBook(book)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Books</h1>
            <p className="text-muted-foreground">Add, edit, and remove books from the library</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={resetForm}>
                <Plus className="h-4 w-4" />
                Add New Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>Fill in the book details to add it to the library</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="isbn">ISBN *</Label>
                    <Input
                      id="isbn"
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="coverUrl">Cover Image URL</Label>
                  <Input
                    id="coverUrl"
                    value={formData.coverUrl}
                    onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                    placeholder="/placeholder.svg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="totalCopies">Total Copies</Label>
                    <Input
                      id="totalCopies"
                      type="number"
                      min="1"
                      value={formData.totalCopies}
                      onChange={(e) => setFormData({ ...formData, totalCopies: Number.parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="publishedYear">Published Year</Label>
                    <Input
                      id="publishedYear"
                      type="number"
                      value={formData.publishedYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishedYear: Number.parseInt(e.target.value) || new Date().getFullYear(),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add Book</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 mb-8 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{books.length}</div>
              <p className="text-xs text-muted-foreground">In the library</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Copies</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{books.reduce((sum, book) => sum + book.totalCopies, 0)}</div>
              <p className="text-xs text-muted-foreground">All copies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{books.reduce((sum, book) => sum + book.availableCopies, 0)}</div>
              <p className="text-xs text-muted-foreground">Ready to borrow</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Borrowed</CardTitle>
              <BookOpen className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {books.reduce((sum, book) => sum + (book.totalCopies - book.availableCopies), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Currently out</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
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
                  <span className="text-muted-foreground">Copies</span>
                  <span className="font-medium">
                    {book.availableCopies} / {book.totalCopies}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ISBN</span>
                  <span className="font-mono text-xs">{book.isbn}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Dialog open={editingBook?.id === book.id} onOpenChange={(open) => !open && setEditingBook(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 bg-transparent"
                      onClick={() => openEditDialog(book)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Book</DialogTitle>
                      <DialogDescription>Update the book details</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-title">Title *</Label>
                        <Input
                          id="edit-title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-author">Author *</Label>
                        <Input
                          id="edit-author"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-isbn">ISBN *</Label>
                          <Input
                            id="edit-isbn"
                            value={formData.isbn}
                            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-category">Category</Label>
                          <Input
                            id="edit-category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-coverUrl">Cover Image URL</Label>
                        <Input
                          id="edit-coverUrl"
                          value={formData.coverUrl}
                          onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-totalCopies">Total Copies</Label>
                          <Input
                            id="edit-totalCopies"
                            type="number"
                            min="1"
                            value={formData.totalCopies}
                            onChange={(e) =>
                              setFormData({ ...formData, totalCopies: Number.parseInt(e.target.value) || 1 })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-publishedYear">Published Year</Label>
                          <Input
                            id="edit-publishedYear"
                            type="number"
                            value={formData.publishedYear}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                publishedYear: Number.parseInt(e.target.value) || new Date().getFullYear(),
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingBook(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEdit}>Update Book</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(book.id, book.title)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No books yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first book to the library</p>
            <Button onClick={() => setIsAddOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Book
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
