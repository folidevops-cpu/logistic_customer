/**
 * POST /api/tickets - Create new ticket
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const session = await getUserSession(event)
  
  if (!session.user?.access_token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  // Validate required fields
  const required = ['subject', 'category', 'priority', 'description']
  const missing = required.filter(field => !body[field])
  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missing.join(', ')}`
    })
  }

  const config = useRuntimeConfig()

  try {
    const response = await $fetch('/tickets/', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.access_token}`,
        'Content-Type': 'application/json'
      },
      body: {
        subject: body.subject,
        category: body.category,
        priority: body.priority,
        description: body.description,
        shipment_reference: body.shipment_reference || null
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || 'Failed to create ticket'
    })
  }
})