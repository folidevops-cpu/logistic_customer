/**
 * GET /api/tracking/[tracking_number] - Get tracking information (public)
 */
export default defineEventHandler(async (event) => {
  const trackingNumber = getRouterParam(event, 'tracking_number')
  
  if (!trackingNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tracking number is required'
    })
  }

  const config = useRuntimeConfig()

  try {
    const response = await $fetch(`/tracking/${trackingNumber}`, {
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 404,
      statusMessage: error.data?.detail || 'Shipment not found'
    })
  }
})