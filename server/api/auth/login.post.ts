export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const config = useRuntimeConfig()
  
  console.log('Login attempt for:', email)
  console.log('API Base URL:', config.apiBaseUrl)
  
  try {
    // Authenticate with your backend API
    // The /auth/login endpoint expects JSON with UserLogin schema
    const loginResponse = await $fetch('/auth/login', {
      method: 'POST',
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        email: email,
        password: password
      }
    }) as any

    console.log('Backend login response:', loginResponse)

    if (loginResponse.access_token) {
      // Get user information from backend
      const userResponse = await $fetch('/users/me', {
        baseURL: config.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${loginResponse.access_token}`
        }
      }) as any

      // Set user session using nuxt-auth-utils
      await setUserSession(event, {
        user: {
          id: userResponse.id,
          email: userResponse.email,
          first_name: userResponse.first_name,
          last_name: userResponse.last_name,
          phone_number: userResponse.phone_number,
          access_token: loginResponse.access_token
        },
        loggedInAt: new Date()
      })

      return { success: true, user: userResponse }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    let errorMessage = 'Invalid credentials'
    
    // Handle different error structures
    if (error?.data?.detail) {
      errorMessage = typeof error.data.detail === 'string' ? error.data.detail : JSON.stringify(error.data.detail)
    } else if (error?.message) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: errorMessage
    })
  }
})