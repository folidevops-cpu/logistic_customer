export const useProfile = () => {
  const config = useRuntimeConfig()
  const token = useCookie('auth-token')
  const { user, fetch: fetchUserSession } = useUserSession()

  // State
  const loading = ref(false)
  const error = ref('')
  const updateLoading = ref(false)

  // Get current user profile
  const fetchProfile = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/users/me', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }) as any
      
      // Update the user session with fresh data
      await fetchUserSession()
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update user profile
  const updateProfile = async (profileData: any) => {
    updateLoading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/users/me', {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone_number: profileData.phone_number,
          email: profileData.email
        }
      }) as any
      
      // Update the user session with fresh data
      await fetchUserSession()
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to update profile'
      throw err
    } finally {
      updateLoading.value = false
    }
  }

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    updateLoading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/users/change-password', {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: {
          current_password: currentPassword,
          new_password: newPassword
        }
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to change password'
      throw err
    } finally {
      updateLoading.value = false
    }
  }

  // Delete account
  const deleteAccount = async (password: string) => {
    updateLoading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/users/me', {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: { password }
      }) as any
      
      // Clear user session after account deletion
      await $fetch('/api/auth/logout', { method: 'POST' })
      await navigateTo('/login')
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to delete account'
      throw err
    } finally {
      updateLoading.value = false
    }
  }

  // Upload profile picture (if supported)
  const uploadProfilePicture = async (file: File) => {
    updateLoading.value = true
    error.value = ''
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await $fetch('/users/profile-picture', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: formData
      }) as any
      
      // Update the user session with fresh data
      await fetchUserSession()
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to upload profile picture'
      throw err
    } finally {
      updateLoading.value = false
    }
  }

  // Get user statistics (shipments, tickets, etc.)
  const getUserStats = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/users/stats', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch user statistics'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utility functions
  const getFullName = (userObj?: any) => {
    const userData = userObj || user.value
    if (!userData) return ''
    
    const firstName = userData.first_name || ''
    const lastName = userData.last_name || ''
    
    return [firstName, lastName].filter(Boolean).join(' ') || userData.email || 'User'
  }

  const getInitials = (userObj?: any) => {
    const userData = userObj || user.value
    if (!userData) return 'U'
    
    const firstName = userData.first_name || ''
    const lastName = userData.last_name || ''
    
    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase()
    } else if (userData.email) {
      return userData.email.charAt(0).toUpperCase()
    }
    
    return 'U'
  }

  const isProfileComplete = (userObj?: any) => {
    const userData = userObj || user.value
    if (!userData) return false
    
    return !!(userData.first_name && userData.last_name && userData.phone_number)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhoneNumber = (phone: string) => {
    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  return {
    // State
    loading: readonly(loading),
    updateLoading: readonly(updateLoading),
    error: readonly(error),
    user: readonly(user),
    
    // Methods
    fetchProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    uploadProfilePicture,
    getUserStats,
    
    // Utilities
    getFullName,
    getInitials,
    isProfileComplete,
    validateEmail,
    validatePhoneNumber,
    clearError: () => { error.value = '' },
    refresh: fetchProfile
  }
}