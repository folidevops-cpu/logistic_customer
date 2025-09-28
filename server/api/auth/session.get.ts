/**
 * GET /api/auth/session - Get current session information
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user) {
    return { user: null, loggedIn: false }
  }

  return {
    user: session.user,
    loggedIn: true,
    loggedInAt: session.loggedInAt
  }
})