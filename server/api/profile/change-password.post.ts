/**
 * POST /api/profile/change-password - Change user password
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
  const required = ['current_password', 'new_password']
  const missing = required.filter(field => !body[field])
  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missing.join(', ')}`
    })
  }

  const config = useRuntimeConfig()

  try {
    const response = await $fetch('/users/change-password', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.access_token}`,
        'Content-Type': 'application/json'
      },
      body: {
        current_password: body.current_password,
        new_password: body.new_password
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || 'Failed to change password'
    })
  }
})