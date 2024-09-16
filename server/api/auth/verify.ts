export default defineEventHandler(async (event) => {

  const formData = await readFormData(event)
  // In your verification handler
  if (!event.context.user) {
    throw createError({
      statusMessage: "User not found",
      statusCode: 400
    });
  }

  const code = formData.get("code")
  if (!code || typeof code !== "string") {
    throw createError({
      statusMessage: "Code not found",
      statusCode: 400
    });
  }
  const success = await verifyEmail(event.context.user.id, code)
  console.log(success)
})

