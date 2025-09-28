/**
 * POST /api/auth/register - User registration
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  // Validate required fields
  const required = ['first_name', 'last_name', 'email', 'password']
  const missing = required.filter(field => !body[field])
  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missing.join(', ')}`
    })
  }

  console.log('Registration attempt for:', body.email)
  
  try {
    // Register with backend API
    const registerResponse = await $fetch('/auth/register', {
      method: 'POST',
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: body.password,
        phone_number: body.phone_number || null
      }
    }) as any

    console.log('Backend registration response:', registerResponse)

    // Auto-login after successful registration
    if (registerResponse.access_token) {
      // Get user information from backend
      const userResponse = await $fetch('/users/me', {
        baseURL: config.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${registerResponse.access_token}`
        }
      }) as any

      // Set user session
      await setUserSession(event, {
        user: {
          id: userResponse.id,
          email: userResponse.email,
          first_name: userResponse.first_name,
          last_name: userResponse.last_name,
          phone_number: userResponse.phone_number,
          access_token: registerResponse.access_token
        },
        loggedInAt: new Date()
      })

      return { success: true, user: userResponse }
    }

    return { success: true, message: 'Registration successful' }
  } catch (error: any) {
    console.error('Registration error:', error)
    
    let errorMessage = 'Registration failed'
    
    if (error?.data?.detail) {
      errorMessage = typeof error.data.detail === 'string' ? error.data.detail : JSON.stringify(error.data.detail)
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    throw createError({
      statusCode: 400,
      statusMessage: errorMessage
    })
  }
})