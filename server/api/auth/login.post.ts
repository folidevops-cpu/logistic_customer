export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Set user session using nuxt-auth-utils
  await setUserSession(event, {
    user: body,
    loggedInAt: new Date()
  })
  
  return { success: true }
})