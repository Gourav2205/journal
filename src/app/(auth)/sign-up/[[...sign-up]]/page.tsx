import { SignUp } from "@clerk/nextjs"

/**
 * Sign-up page component
 * Uses Clerk's pre-built SignUp component
 * Styled to match the app's design system
 */
export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-muted-foreground">Start tracking your trades today</p>
                </div>
                <SignUp
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
