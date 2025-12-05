"use client"

import { useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useBooks } from "@/lib/books-context"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Clock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LibrarianDashboard() {
  const { user } = useAuth()
  const { borrowRequests, approveBorrow, rejectBorrow } = useBooks()
  const { toast } = useToast()
  const router = useRouter()

  const pendingRequests = useMemo(() => {
    return borrowRequests.filter((r) => r.status === "pending")
  }, [borrowRequests])

  const processedRequests = useMemo(() => {
    return borrowRequests.filter((r) => r.status !== "pending")
  }, [borrowRequests])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (user && user.role !== "librarian") {
    router.push("/")
    return null
  }

  const handleApprove = (requestId: string, bookTitle: string) => {
    approveBorrow(requestId)
    toast({
      title: "Request approved",
      description: `Approved borrow request for "${bookTitle}"`,
    })
  }

  const handleReject = (requestId: string, bookTitle: string) => {
    rejectBorrow(requestId)
    toast({
      title: "Request rejected",
      description: `Rejected borrow request for "${bookTitle}"`,
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Borrow Requests</h1>
          <p className="text-muted-foreground">Review and manage student book borrow requests</p>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{borrowRequests.filter((r) => r.status === "approved").length}</div>
              <p className="text-xs text-muted-foreground">Total approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <X className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{borrowRequests.filter((r) => r.status === "rejected").length}</div>
              <p className="text-xs text-muted-foreground">Total rejected</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{request.bookTitle}</CardTitle>
                          <CardDescription>Requested by {request.studentName}</CardDescription>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <Clock className="inline h-4 w-4 mr-1" />
                          {formatDate(request.requestDate)}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(request.id, request.bookTitle)}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request.id, request.bookTitle)}
                            className="gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Decisions</h2>
            {processedRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No processed requests yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {processedRequests
                  .slice(-10)
                  .reverse()
                  .map((request) => (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-base">{request.bookTitle}</CardTitle>
                            <CardDescription>Requested by {request.studentName}</CardDescription>
                          </div>
                          <Badge variant={request.status === "approved" ? "default" : "destructive"}>
                            {request.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="inline h-4 w-4 mr-1" />
                          {formatDate(request.requestDate)}
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
