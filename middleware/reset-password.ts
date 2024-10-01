export default defineNuxtRouteMiddleware(async (to, from) => {
    try {
        const { data, error } = await useFetch('/api/auth/reset-password', {
        })
        if (error.value) {
            // If there's an error, redirect to login
            return await navigateTo('/login')
        }
        if (!data.value) {
            return await navigateTo("/login")
        }
    } catch (error) {
        console.error('Error checking reset password access:', error)
        return await navigateTo('/login')
    }
})