import { db } from "../utils/prisma"

export default eventHandler(async (event) => {

    const user = await db.user.findFirst()
    if (!user) {
        throw createError({
            statusMessage: "User not found",
            statusCode: 400
        });
    }
    console.log(user)
    // In your registration handler
    const code = await sendVerificationEmail(user.id)

    // // In your verification handler
    // const success = await verifyEmail(user.id, code)
    // if (success) {
    //     // Email verified successfully
    // } else {
    //     // Verification failed
    // }
})

