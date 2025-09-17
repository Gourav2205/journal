"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

/**
 * Global Error Component
 * Displayed when an error occurs in the application
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <CardTitle>Something went wrong!</CardTitle>
                    <CardDescription>An unexpected error occurred. Please try again.</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    {process.env.NODE_ENV === "development" && (
                        <div className="text-left bg-muted p-4 rounded-md">
                            <p className="text-sm font-mono text-destructive">{error.message}</p>
                        </div>
                    )}
                    <Button onClick={reset} className="w-full">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
