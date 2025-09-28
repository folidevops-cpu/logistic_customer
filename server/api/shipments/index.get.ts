/**
 * GET /api/shipments - Get user shipments
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
    const response = await $fetch('/shipments/my', {
      baseURL: config.apiBaseUrl,
      headers: {
        'Authorization': `Bearer ${session.user.access_token}`,
        'Content-Type': 'application/json'
      },
      query: {
        limit: query.limit || 10,
        offset: query.offset || 0
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || 'Failed to fetch shipments'
    })
  }
})