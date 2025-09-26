export const useAuth = () => {
  const config = useRuntimeConfig()
  const { loggedIn, user, fetch: fetchUserSession } = useUserSession()
  const token = useCookie('auth-token')

  // State
  const loading = ref(false)
  const error = ref('')

  // Login
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = ''
    
    try {
      // Login to get token
      const loginResponse = await $fetch('/auth/login', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: {
          username: email, // FastAPI uses 'username' field for email
          password
        }
      }) as any

      // Store token
      token.value = loginResponse.access_token

      // Fetch user info and set session
      const userResponse = await $fetch('/users/me', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${loginResponse.access_token}`
        }
      }) as any

      // Set user session
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: userResponse
      })

      return { user: userResponse, token: loginResponse.access_token }
    } catch (err: any) {
      error.value = err.data?.detail || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Register
  const register = async (userData: {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    password: string
  }) => {
    loading.value = true
    error.value = ''
    
    try {
      // Register user
      const registerResponse = await $fetch('/auth/register', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: userData
      }) as any

      // Auto-login after registration
      const loginResult = await login(userData.email, userData.password)
      
      return { user: registerResponse, loginResult }
    } catch (err: any) {
      error.value = err.data?.detail || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    loading.value = true
    error.value = ''
    
    try {
      // Clear token
      token.value = null

      // Clear user session
      await $fetch('/api/auth/logout', { method: 'POST' })
      
      // Redirect to login
      await navigateTo('/login')
    } catch (err: any) {
      error.value = err.data?.detail || 'Logout failed'
      // Even if logout fails on server, clear local state
      token.value = null
      await navigateTo('/login')
    } finally {
      loading.value = false
    }
  }

  // Refresh token (if needed)
  const refreshToken = async () => {
    if (!token.value) return false
    
    loading.value = true
    error.value = ''
    
    try {
      // Try to fetch user info with current token to validate it
      await $fetch('/users/me', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      return true
    } catch (err: any) {
      // Token is invalid, clear it
      token.value = null
      error.value = 'Session expired'
      await navigateTo('/login')
      return false
    } finally {
      loading.value = false
    }
  }

  // Forgot password
  const forgotPassword = async (email: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/auth/forgot-password', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: { email }
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to send reset email'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Reset password
  const resetPassword = async (token: string, newPassword: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/auth/reset-password', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: {
          token,
          new_password: newPassword
        }
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to reset password'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Verify email (if email verification is implemented)
  const verifyEmail = async (verificationToken: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/auth/verify-email', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: { token: verificationToken }
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Email verification failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => {
    return loggedIn.value && !!token.value
  })

  // Require authentication (redirect to login if not authenticated)
  const requireAuth = async () => {
    if (!isAuthenticated.value) {
      await navigateTo('/login')
      return false
    }
    return true
  }

  // Utility functions
  const validatePassword = (password: string) => {
    // Password strength validation
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    const errors = []
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`)
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number')
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      strength: Math.min(100, (password.length / minLength) * 20 + 
        (hasUpperCase ? 20 : 0) + 
        (hasLowerCase ? 20 : 0) + 
        (hasNumbers ? 20 : 0) + 
        (hasSpecialChar ? 20 : 0))
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return {
    // State
    loading: readonly(loading),
    error: readonly(error),
    user: readonly(user),
    loggedIn: readonly(loggedIn),
    isAuthenticated,
    
    // Methods
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    requireAuth,
    
    // Utilities
    validatePassword,
    validateEmail,
    clearError: () => { error.value = '' }
  }
}