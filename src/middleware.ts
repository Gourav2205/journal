import { authMiddleware } from "@clerk/nextjs/server"

/**
 * Clerk authentication middleware
 * Protects routes that require authentication
 * Redirects unauthenticated users to sign-in page
 */
export default authMiddleware({
    // Public routes that don't require authentication
    publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhooks(.*)"],

    // Routes that require authentication
    // All /dashboard, /trades, /export routes are protected
    ignoredRoutes: ["/api/webhooks(.*)"],

    // Redirect after sign in
    afterAuth(auth, req) {
        // If user is signed in and on a public route, redirect to dashboard
        if (auth.userId && req.nextUrl.pathname === "/") {
            return Response.redirect(new URL("/dashboard", req.url))
        }

        // If user is not signed in and on a protected route, redirect to sign-in
        if (!auth.userId && !auth.isPublicRoute) {
            return Response.redirect(new URL("/sign-in", req.url))
        }
    },
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
