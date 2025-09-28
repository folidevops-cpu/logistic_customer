/**
 * GET /api/profile - Get current user profile
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user?.access_token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  const config = useRuntimeConfig()

  try {
    const response = await $fetch('/users/me', {
      baseURL: config.apiBaseUrl,
      headers: {
        'Authorization': `Bearer ${session.user.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || 'Failed to fetch profile'
    })
  }
})