/**
 * POST /api/shipments - Create new shipment
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
  const required = ['pickup_point_id', 'dropoff_point_id', 'weight', 'receiver_name', 'receiver_phone']
  const missing = required.filter(field => !body[field])
  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missing.join(', ')}`
    })
  }

  const config = useRuntimeConfig()

  try {
    const response = await $fetch('/shipments/', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.access_token}`,
        'Content-Type': 'application/json'
      },
      body: {
        pickup_point_id: parseInt(body.pickup_point_id),
        dropoff_point_id: parseInt(body.dropoff_point_id),
        weight: body.weight,
        dimensions_length: body.dimensions_length || 0,
        dimensions_width: body.dimensions_width || 0,
        dimensions_height: body.dimensions_height || 0,
        description: body.description || '',
        receiver_name: body.receiver_name,
        receiver_phone: body.receiver_phone,
        receiver_email: body.receiver_email || '',
        is_fragile: body.is_fragile || false
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || 'Failed to create shipment'
    })
  }
})