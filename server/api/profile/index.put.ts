/**
 * PUT /api/profile - Update user profile
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
  const required = ['first_name', 'last_name', 'email']
  const missing = required.filter(field => !body[field])
  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missing.join(', ')}`
    })
  }

  const config = useRuntimeConfig()

  try {
    const response = await $fetch('/users/me', {
      baseURL: config.apiBaseUrl,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.user.access_token}`,
        'Content-Type': 'application/json'
      },
      body: {
        first_name: body.first_name,
        last_name: body.last_name,  
        email: body.email,
        phone_number: body.phone_number || null
      }
    })

    // Refresh user session after profile update
    await replaceUserSession(event, {
      ...session.user,
      first_name: response.first_name,
      last_name: response.last_name,
      email: response.email,
      phone_number: response.phone_number
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || 'Failed to update profile'
    })
  }
})