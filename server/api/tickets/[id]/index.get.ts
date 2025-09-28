/**
 * GET /api/tickets/[id] - Get specific ticket details
 */
export default defineEventHandler(async (event) => {
  const ticketId = getRouterParam(event, 'id')
  const session = await getUserSession(event)
  
  if (!session.user?.access_token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  if (!ticketId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ticket ID is required'
    })
  }

  const config = useRuntimeConfig()

  try {
    const response = await $fetch(`/tickets/${ticketId}`, {
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
      statusMessage: error.data?.detail || 'Failed to fetch ticket details'
    })
  }
})