// reset-password.ts
import { defineEventHandler, H3Event, readBody, appendHeader } from 'h3'
import { createHash, randomBytes } from 'crypto'

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
    const token = getRouterParam(event, "token")
    if (token) {
        // Token is provided, handle password reset
        const hashedToken = hashToken(token)
        const resetRequest = await db.passwordReset.findFirst({
            where: {
                token: hashedToken,
                expiresAt: { gt: new Date() }
            }
        })

        if (resetRequest) {
            const existingUser = await db.user.findUnique({ where: { id: resetRequest.userId } })

            if (existingUser) {
                // Create a session
                // We need to create a custom session for 10 min
                // TODO !! Lucia issue here (can't create custom lifetime session)
                // + I'm creating a session with resetPassword boolean
                // 
                const session = await lucia.createSession(existingUser.id, { resetPassword: true });
                appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());

                // Optionally, you can delete the used token
                await db.passwordReset.delete({ where: { id: resetRequest.id } })

                return { message: 'Password reset successful. A new session has been created.' }
            }
        }

        return { message: 'Invalid or expired token.' }
    }
})