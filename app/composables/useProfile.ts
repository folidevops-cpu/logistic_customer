export const useProfile = () => {
  const { user, fetch: fetchUserSession } = useUserSession()
  const config = useRuntimeConfig()

  // State
  const loading = ref(false)
  const error = ref('')
  const updateLoading = ref(false)

  // Get current user profile
  const fetchProfile = async () => {
    loading.value = true
    error.value = ''
    
    try {
      if (!user.value?.access_token) {
        throw new Error('No access token available')
      }

      const response = await $fetch('/users/me', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${user.value.access_token}`
        }
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update user profile
  const updateProfile = async (profileData: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }) => {
    updateLoading.value = true
    error.value = ''
    
    try {
      if (!user.value?.access_token) {
        throw new Error('No access token available')
      }

      const response = await $fetch('/users/me', {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${user.value.access_token}`
        },
        body: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          phone: profileData.phone
        }
      }) as any

      // Refresh user session after profile update
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
      if (!user.value?.access_token) {
        throw new Error('No access token available')
      }

      const response = await $fetch('/users/change-password', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${user.value.access_token}`
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

  return {
    // State
    loading: readonly(loading),
    error: readonly(error),
    updateLoading: readonly(updateLoading),
    
    // Methods
    fetchProfile,
    updateProfile,
    changePassword
  }
}
