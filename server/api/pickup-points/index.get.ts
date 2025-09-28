/**
 * GET /api/pickup-points - Get all pickup points (public)
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const response = await $fetch('/pickup-points/', {
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || 'Failed to fetch pickup points'
    })
  }
})