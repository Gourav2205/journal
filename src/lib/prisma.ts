import { PrismaClient } from "@prisma/client"

/**
 * Global Prisma client instance
 * Uses singleton pattern to prevent multiple connections in development
 */
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

/**
 * Prisma client configuration
 * Includes logging for development environment
 */
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
