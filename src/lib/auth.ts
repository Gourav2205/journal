import { auth, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "./prisma"

/**
 * Get current user from Clerk authentication
 * Creates user record in database if it doesn't exist
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser() {
    const { userId } = auth()

    if (!userId) {
        return null
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
        where: { clerkId: userId },
    })

    // Create user if doesn't exist (first time login)
    if (!user) {
        const clerkUser = await clerkClient.users.getUser(userId)

        if (clerkUser) {
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || "",
                    firstName: clerkUser.firstName,
                    lastName: clerkUser.lastName,
                    imageUrl: clerkUser.imageUrl,
                },
            })
        }
    }

    return user
}

/**
 * Require authentication - throws error if user not logged in
 * @returns Authenticated user object
 */
export async function requireAuth() {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error("Authentication required")
    }

    return user
}
