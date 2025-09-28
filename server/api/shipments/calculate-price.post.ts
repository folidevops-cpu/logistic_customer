/**
 * POST /api/shipments/calculate-price - Calculate shipment pricing
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
  const required = ['pickup_point_id', 'dropoff_point_id', 'weight']
  const missing = required.filter(field => !body[field])
  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missing.join(', ')}`
    })
  }

  const config = useRuntimeConfig()

  try {
    const response = await $fetch('/shipments/calculate-price', {
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
        is_fragile: body.is_fragile || false
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || 'Failed to calculate pricing'
    })
  }
})