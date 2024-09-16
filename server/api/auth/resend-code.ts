export default defineEventHandler(async (event) => {
    if (event.context.user) {
        return await sendVerificationEmail(event.context.user.id)
    }
})