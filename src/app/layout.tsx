import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Trading Journal - Track Your Trading Performance",
    description:
        "Professional trading journal app to track trades, analyze performance, and improve your trading strategy.",
    keywords: ["trading", "journal", "forex", "analytics", "performance"],
}

/**
 * Root layout component
 * Provides global providers and layout structure
 * Includes Clerk authentication and theme providers
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={inter.className}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <div className="min-h-screen bg-background">
                            <Navbar />
                            <main className="container mx-auto px-4 py-8">{children}</main>
                        </div>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
