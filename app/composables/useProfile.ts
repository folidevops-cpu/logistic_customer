export const useProfile = () => {export const useProfile = () => {export const useProfile = () => {export const useProfile = () => {

  const config = useRuntimeConfig()

  const { user, fetch: fetchUserSession } = useUserSession()  const config = useRuntimeConfig()



  // State  const { user, fetch: fetchUserSession } = useUserSession()  const config = useRuntimeConfig()  const config = useRuntimeConfig()

  const loading = ref(false)

  const error = ref('')

  const updateLoading = ref(false)

  // State  const { user, fetch: fetchUserSession } = useUserSession()  co  // Change password

  // Get current user profile

  const fetchProfile = async () => {  const loading = ref(false)

    loading.value = true

    error.value = ''  const error = ref('')  const changePassword = async (currentPassword: string, newPassword: string) => {

    

    try {  const updateLoading = ref(false)

      if (!user.value?.access_token) {

        throw new Error('No access token available')  // State    loading.value = true

      }

  // Get current user profile

      const response = await $fetch('/users/me', {

        baseURL: config.public.apiBaseUrl,  const fetchProfile = async () => {  const loading = ref(false)    error.value = ''

        headers: {

          Authorization: `Bearer ${user.value.access_token}`    loading.value = true

        }

      }) as any    error.value = ''  const error = ref('')    

      

      // Update the user session with fresh data    

      await fetchUserSession()

          try {  const updateLoading = ref(false)    try {

      return response

    } catch (err: any) {      if (!user.value?.access_token) {

      error.value = err.data?.detail || 'Failed to fetch profile'

      throw err        throw new Error('No access token available')      if (!user.value?.access_token) {

    } finally {

      loading.value = false      }

    }

  }  // Get current user profile        throw new Error('No access token available')



  // Update user profile      const response = await $fetch('/users/me', {

  const updateProfile = async (profileData: any) => {

    updateLoading.value = true        baseURL: config.public.apiBaseUrl,  const fetchProfile = async () => {      }

    error.value = ''

            headers: {

    try {

      if (!user.value?.access_token) {          Authorization: `Bearer ${user.value.access_token}`    loading.value = true

        throw new Error('No access token available')

      }        }



      const response = await $fetch('/users/me', {      }) as any    error.value = ''      const response = await $fetch('/users/change-password', {

        method: 'PUT',

        baseURL: config.public.apiBaseUrl,      

        headers: {

          Authorization: `Bearer ${user.value.access_token}`      // Update the user session with fresh data            method: 'PUT',

        },

        body: {      await fetchUserSession()

          first_name: profileData.first_name,

          last_name: profileData.last_name,          try {        baseURL: config.public.apiBaseUrl,

          phone_number: profileData.phone_number,

          email: profileData.email      return response

        }

      }) as any    } catch (err: any) {      if (!user.value?.access_token) {        headers: {

      

      // Update the user session with fresh data      error.value = err.data?.detail || 'Failed to fetch profile'

      await fetchUserSession()

            throw err        throw new Error('No access token available')          Authorization: `Bearer ${user.value.access_token}`

      return response

    } catch (err: any) {    } finally {

      error.value = err.data?.detail || 'Failed to update profile'

      throw err      loading.value = false      }        },fetch: fetchUserSession } = useUserSession()

    } finally {

      updateLoading.value = false    }

    }

  }  }



  // Change password

  const changePassword = async (passwordData: {

    current_password: string  // Update user profile      const response = await $fetch('/users/me', {  // State

    new_password: string

  }) => {  const updateProfile = async (profileData: any) => {

    updateLoading.value = true

    error.value = ''    updateLoading.value = true        baseURL: config.public.apiBaseUrl,  const loading = ref(false)

    

    try {    error.value = ''

      if (!user.value?.access_token) {

        throw new Error('No access token available')            headers: {  const error = ref('')

      }

    try {

      const response = await $fetch('/users/change-password', {

        method: 'POST',      if (!user.value?.access_token) {          Authorization: `Bearer ${user.value.access_token}`  const updateLoading = ref(false)

        baseURL: config.public.apiBaseUrl,

        headers: {        throw new Error('No access token available')

          Authorization: `Bearer ${user.value.access_token}`

        },      }        }

        body: passwordData

      }) as any

      

      return response      const response = await $fetch('/users/me', {      }) as any  // Get current user profile

    } catch (err: any) {

      error.value = err.data?.detail || 'Failed to change password'        method: 'PUT',

      throw err

    } finally {        baseURL: config.public.apiBaseUrl,        const fetchProfile = async () => {

      updateLoading.value = false

    }        headers: {

  }

          Authorization: `Bearer ${user.value.access_token}`      // Update the user session with fresh data    loading.value = true

  // Helper functions for user display

  const getFullName = (userObj?: any) => {        },

    const userToUse = userObj || user.value

    if (!userToUse) return ''        body: {      await fetchUserSession()    error.value = ''

    

    const { first_name = '', last_name = '' } = userToUse          first_name: profileData.first_name,

    const fullName = `${first_name} ${last_name}`.trim()

    return fullName || userToUse.email || 'Unknown User'          last_name: profileData.last_name,          

  }

          phone_number: profileData.phone_number,

  const getInitials = (userObj?: any) => {

    const userToUse = userObj || user.value          email: profileData.email      return response    try {

    if (!userToUse) return '?'

            }

    const { first_name = '', last_name = '' } = userToUse

    if (first_name || last_name) {      }) as any    } catch (err: any) {      if (!user.value?.access_token) {

      return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase()

    }      

    

    // Fallback to email initial      // Update the user session with fresh data      error.value = err.data?.detail || 'Failed to fetch profile'        throw new Error('No access token available')

    return userToUse.email?.charAt(0).toUpperCase() || '?'

  }      await fetchUserSession()



  // Get user's display email            throw err      }

  const getEmail = (userObj?: any) => {

    const userToUse = userObj || user.value      return response

    return userToUse?.email || ''

  }    } catch (err: any) {    } finally {



  // Get user's phone number      error.value = err.data?.detail || 'Failed to update profile'

  const getPhoneNumber = (userObj?: any) => {

    const userToUse = userObj || user.value      throw err      loading.value = false      const response = await $fetch('/users/me', {

    return userToUse?.phone_number || ''

  }    } finally {



  // Check if profile is complete      updateLoading.value = false    }        baseURL: config.public.apiBaseUrl,

  const isProfileComplete = computed(() => {

    if (!user.value) return false    }

    

    const { first_name, last_name, email, phone_number } = user.value  }  }        headers: {

    return !!(first_name && last_name && email && phone_number)

  })



  return {  // Change password          Authorization: `Bearer ${user.value.access_token}`

    // State

    loading: readonly(loading),  const changePassword = async (passwordData: {

    error: readonly(error),

    updateLoading: readonly(updateLoading),    current_password: string  // Helper functions        }

    

    // Computed    new_password: string

    isProfileComplete,

      }) => {  const getFullName = (userObj?: any) => {      }) as any

    // Methods

    fetchProfile,    updateLoading.value = true

    updateProfile,

    changePassword,    error.value = ''    const userData = userObj || user.value      

    

    // Helper functions    

    getFullName,

    getInitials,    try {    if (!userData) return ''      // Update the user session with fresh data

    getEmail,

    getPhoneNumber      if (!user.value?.access_token) {

  }

}        throw new Error('No access token available')          await fetchUserSession()

      }

    const { first_name = '', last_name = '' } = userData      

      const response = await $fetch('/users/change-password', {

        method: 'PUT',    return `${first_name} ${last_name}`.trim() || userData.email || ''      return response

        baseURL: config.public.apiBaseUrl,

        headers: {  }    } catch (err: any) {

          Authorization: `Bearer ${user.value.access_token}`

        },      error.value = err.data?.detail || 'Failed to fetch profile'

        body: passwordData

      }) as any  const getInitials = (userObj?: any) => {      throw err

      

      return response    const userData = userObj || user.value    } finally {

    } catch (err: any) {

      error.value = err.data?.detail || 'Failed to change password'    if (!userData) return ''      loading.value = false

      throw err

    } finally {        }

      updateLoading.value = false

    }    const { first_name = '', last_name = '' } = userData  }

  }

    if (first_name || last_name) {

  // Delete account

  const deleteAccount = async () => {      return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase()  // Update user profile

    updateLoading.value = true

    error.value = ''    }  const updateProfile = async (profileData: any) => {

    

    try {    return userData.email?.charAt(0).toUpperCase() || '?'    updateLoading.value = true

      if (!user.value?.access_token) {

        throw new Error('No access token available')  }    error.value = ''

      }

    

      const response = await $fetch('/users/me', {

        method: 'DELETE',  return {    try {

        baseURL: config.public.apiBaseUrl,

        headers: {    // State      if (!user.value?.access_token) {

          Authorization: `Bearer ${user.value.access_token}`

        }    user: readonly(user),        throw new Error('No access token available')

      }) as any

          loading: readonly(loading),      }

      // Clear session after account deletion

      const { clear } = useUserSession()    error: readonly(error),

      await clear()

          updateLoading: readonly(updateLoading),      const response = await $fetch('/users/me', {

      return response

    } catch (err: any) {            method: 'PUT',

      error.value = err.data?.detail || 'Failed to delete account'

      throw err    // Actions        baseURL: config.public.apiBaseUrl,

    } finally {

      updateLoading.value = false    fetchProfile,        headers: {

    }

  }              Authorization: `Bearer ${user.value.access_token}`



  // Upload avatar    // Helpers        },

  const uploadAvatar = async (file: File) => {

    updateLoading.value = true    getFullName,        body: {

    error.value = ''

        getInitials          first_name: profileData.first_name,

    try {

      if (!user.value?.access_token) {  }          last_name: profileData.last_name,

        throw new Error('No access token available')

      }}          phone_number: profileData.phone_number,

          email: profileData.email

      const formData = new FormData()        }

      formData.append('file', file)      }) as any

      

      const response = await $fetch('/users/avatar', {      // Update the user session with fresh data

        method: 'POST',      await fetchUserSession()

        baseURL: config.public.apiBaseUrl,      

        headers: {      return response

          Authorization: `Bearer ${user.value.access_token}`    } catch (err: any) {

        },      error.value = err.data?.detail || 'Failed to update profile'

        body: formData      throw err

      }) as any    } finally {

            updateLoading.value = false

      // Update the user session with fresh data    }

      await fetchUserSession()  }

      

      return response  // Change password

    } catch (err: any) {  const changePassword = async (currentPassword: string, newPassword: string) => {

      error.value = err.data?.detail || 'Failed to upload avatar'    updateLoading.value = true

      throw err    error.value = ''

    } finally {    

      updateLoading.value = false    try {

    }      const response = await $fetch('/users/change-password', {

  }        method: 'PUT',

        baseURL: config.public.apiBaseUrl,

  // Helper functions        headers: {

  const getFullName = (userObj?: any) => {          Authorization: `Bearer ${token.value}`

    const userData = userObj || user.value        },

    if (!userData) return ''        body: {

              current_password: currentPassword,

    const { first_name = '', last_name = '' } = userData          new_password: newPassword

    return `${first_name} ${last_name}`.trim() || userData.email || ''        }

  }      }) as any

      

  const getInitials = (userObj?: any) => {      return response

    const userData = userObj || user.value    } catch (err: any) {

    if (!userData) return ''      error.value = err.data?.detail || 'Failed to change password'

          throw err

    const { first_name = '', last_name = '' } = userData    } finally {

    if (first_name || last_name) {      updateLoading.value = false

      return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase()    }

    }  }

    return userData.email?.charAt(0).toUpperCase() || '?'

  }  // Delete account

  const deleteAccount = async (password: string) => {

  const getAvatarUrl = (userObj?: any) => {    updateLoading.value = true

    const userData = userObj || user.value    error.value = ''

    if (!userData?.avatar) return null    

        try {

    // If avatar is already a full URL, return it      if (!user.value?.access_token) {

    if (userData.avatar.startsWith('http')) {        throw new Error('No access token available')

      return userData.avatar      }

    }

          const response = await $fetch('/users/me', {

    // Otherwise, construct the full URL        method: 'DELETE',

    return `${config.public.apiBaseUrl}/static/avatars/${userData.avatar}`        baseURL: config.public.apiBaseUrl,

  }        headers: {

          Authorization: `Bearer ${user.value.access_token}`

  const isProfileComplete = (userObj?: any) => {        },

    const userData = userObj || user.value        body: { password }

    if (!userData) return false      }) as any

          

    return !!(      // Clear user session after account deletion

      userData.first_name &&      await $fetch('/api/auth/logout', { method: 'POST' })

      userData.last_name &&      await navigateTo('/login')

      userData.email &&      

      userData.phone_number      return response

    )    } catch (err: any) {

  }      error.value = err.data?.detail || 'Failed to delete account'

      throw err

  return {    } finally {

    // State      updateLoading.value = false

    loading: readonly(loading),    }

    updateLoading: readonly(updateLoading),  }

    error: readonly(error),

      // Upload profile picture (if supported)

    // Methods  const uploadProfilePicture = async (file: File) => {

    fetchProfile,    updateLoading.value = true

    updateProfile,    error.value = ''

    changePassword,    

    deleteAccount,    try {

    uploadAvatar,      const formData = new FormData()

          formData.append('file', file)

    // Helpers

    getFullName,      const response = await $fetch('/users/profile-picture', {

    getInitials,        method: 'POST',

    getAvatarUrl,        baseURL: config.public.apiBaseUrl,

    isProfileComplete        headers: {

  }          Authorization: `Bearer ${token.value}`

}        },
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