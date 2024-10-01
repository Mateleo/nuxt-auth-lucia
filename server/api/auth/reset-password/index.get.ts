export default defineEventHandler(async (event) => {
    if (!event.context.session?.resetPassword) {
        return false
    }
    return true
})