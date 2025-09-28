/**
 * POST /api/tickets/[id]/comments - Add comment to ticket
 */
export default defineEventHandler(async (event) => {
  const ticketId = getRouterParam(event, 'id')
  const body = await readBody(event)
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

  if (!body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Comment content is required'
    })
  }

  const config = useRuntimeConfig()

  try {
    const response = await $fetch(`/tickets/${ticketId}/comments`, {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.access_token}`,
        'Content-Type': 'application/json'
      },
      body: {
        content: body.content.trim()
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || 'Failed to add comment'
    })
  }
})