/**
 * GET /api/tickets - Get user tickets with pagination
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user?.access_token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  const query = getQuery(event)
  const config = useRuntimeConfig()

  try {
    const response = await $fetch('/tickets/mine', {
      baseURL: config.apiBaseUrl,
      headers: {
        'Authorization': `Bearer ${session.user.access_token}`,
        'Content-Type': 'application/json'
      },
      query: {
        page: query.page || 1,
        limit: query.limit || 10,
        status: query.status,
        priority: query.priority
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || 'Failed to fetch tickets'
    })
  }
})