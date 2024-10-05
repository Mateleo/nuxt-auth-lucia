import { generateRandomInteger } from 'oslo/crypto'
import { db } from './prisma'
import { sendVerificationEmailWithNodemailer } from './email-service'

const VERIFICATION_CODE_LENGTH = 6
const VERIFICATION_CODE_EXPIRY = 60 * 60 * 1000 // 1 hours in milliseconds
const MAX_VERIFICATION_ATTEMPTS = 10

// function generateVerificationCode(): string {
//     const recoveryCodeBytes = new Uint8Array(8);
//     crypto.getRandomValues(recoveryCodeBytes);
//     const recoveryCode = base32.encode(recoveryCodeBytes);
//     return recoveryCode;
// }

export function generateVerificationCode(VERIFICATION_CODE_LENGTH: number): string {
    const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < VERIFICATION_CODE_LENGTH; i++) {
        const randomIndex = generateRandomInteger(characters.length);
        result += characters[randomIndex];
    }
    return result;
}


// This has to be changed in the future
// For now the rate limit is also applied to the sendVerificationEmail (bc sending email is expensive) 
// The issue is that the rate limit is common to both function (sendVerificationEmail and verifyEmail)

export async function sendVerificationEmail(userId: string): Promise<string> {
    const user = await db.user.findUnique({ where: { id: userId }, include: { VerificationEmail: true } })
    if (!user) {
        throw new Error('User not found')
    }
    if (user.VerificationEmail?.verificationAttempts && user.VerificationEmail?.verificationAttempts >= 10) {
        throw new Error('Please wait before requesting a new code')
    }

    const verificationCode = generateVerificationCode(VERIFICATION_CODE_LENGTH)
    const verificationCodeExpires = new Date(Date.now() + VERIFICATION_CODE_EXPIRY)

    await db.verificationEmail.upsert({
        where: { id: user.VerificationEmail?.id ?? "undefined" },
        create: {
            userId: userId,
            verificationCode: verificationCode,
            verificationCodeExpires: verificationCodeExpires,
            lastVerificationAttempt: new Date(Date.now())
        },
        update: {
            verificationCode: verificationCode,
            verificationCodeExpires: verificationCodeExpires,
            verificationAttempts: {
                increment: 1
            },
            lastVerificationAttempt: new Date(Date.now())

        }
    })

    // TODO: Implement actual email sending
    console.log(`Verification code for ${user.email}: ${verificationCode}`)

    await sendVerificationEmailWithNodemailer(user.email, verificationCode)

    return verificationCode
}

export async function verifyEmail(userId: string, code: string): Promise<boolean> {
    const user = await db.user.findUnique({ where: { id: userId }, include: { VerificationEmail: true } })
    if (!user) {
        throw new Error('User not found')
    }

    if (user.verified) {
        throw new Error('Email already verified')
    }

    if (!user.VerificationEmail) {
        throw new Error('Please request a verification code before')
    }

    const now = new Date()

    // Check for rate limiting
    if (user.VerificationEmail.verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
        throw new Error('Too many verification attempts. Please try again later.')
    }

    // Update attempt count
    await db.verificationEmail.update({
        where: { id: user.VerificationEmail.id },
        data: {
            verificationAttempts: {
                increment: 1,
            },
            lastVerificationAttempt: now,
        },
    })

    if (!user.VerificationEmail.verificationCode || !user.VerificationEmail.verificationCodeExpires) {
        throw new Error('No verification code found')
    }

    if (now > user.VerificationEmail.verificationCodeExpires) {
        throw new Error('Verification code has expired')
    }

    if (user.VerificationEmail.verificationCode !== code) {
        console.log("The code is wrong!")
        return false
    }

    // Verification successful
    await db.user.update({
        where: { id: user.id },
        data: {
            verified: true,

        },
    })

    await db.verificationEmail.delete({
        where: {
            id: user.VerificationEmail.id
        }
    })
    // Invalidate all sessions
    await db.session.deleteMany({
        where: { userId: userId },
    })

    return true
}