import { defineCronHandler } from '#nuxt/cron'

export default defineCronHandler('hourly', async () => {
  await db.verificationEmail.updateMany({
    data: {
      verificationAttempts: 0
    }
  })
  console.log("[CRON]: Rate limit has been reset !")
})