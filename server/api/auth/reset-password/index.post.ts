// reset-password.ts
import { defineEventHandler, H3Event } from 'h3'
import { createHash, randomBytes } from 'crypto'
// import { sendEmail } from './utils/email' // Assuming you have an email utility



// Helper function to generate a secure token
function generateSecureToken(): string {
    return randomBytes(20).toString('hex') // 160 bits of entropy
}

// Helper function to hash the token
function hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
}

// Password reset request
export default defineEventHandler(async (event: H3Event) => {
    console.log("reset password flow")
    const body = await readBody(event)
    const { email } = body
    console.log(body)

    const user = await db.user.findUnique({ where: { email: email } })

    if (user) {
        const token = generateSecureToken()
        const hashedToken = hashToken(token)

        // Invalidate any existing tokens
        await db.passwordReset.deleteMany({ where: { userId: user.id } })

        // Create a new password reset token
        await db.passwordReset.create({
            data: {
                userId: user.id,
                token: hashedToken,
                expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
            },
        })

        // Send email with reset link
        console.log(`Your Reset password token is: ${token}`)
        const resetLink = `https://yourdomain.com/reset-password/${token}`
        // await sendEmail(email, 'Password Reset', `Click here to reset your password: ${resetLink}`)
    }

    // Always return a success message to prevent email enumeration
    return { message: 'If an account with that email exists, a password reset link has been sent.' }
})