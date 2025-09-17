import { SignIn } from "@clerk/nextjs"

/**
 * Sign-in page component
 * Uses Clerk's pre-built SignIn component
 * Styled to match the app's design system
 */
export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your trading journal account</p>
                </div>
                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                            card: "shadow-lg",
                        },
                    }}
                />
            </div>
        </div>
    )
}
