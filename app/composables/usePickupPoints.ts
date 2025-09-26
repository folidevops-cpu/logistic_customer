export const usePickupPoints = () => {
  const config = useRuntimeConfig()

  // State
  const pickupPoints = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  // Get all pickup points
  const fetchPickupPoints = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/pickup-points/', {
        baseURL: config.public.apiBaseUrl
      }) as any[]
      
      pickupPoints.value = response || []
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch pickup points'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get a single pickup point by ID
  const getPickupPoint = async (id: number) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch(`/pickup-points/${id}`, {
        baseURL: config.public.apiBaseUrl
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch pickup point'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search pickup points by city or address
  const searchPickupPoints = async (query: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/pickup-points/', {
        baseURL: config.public.apiBaseUrl,
        query: { search: query }
      }) as any[]
      
      return response || []
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to search pickup points'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get pickup points by city
  const getPickupPointsByCity = async (city: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/pickup-points/', {
        baseURL: config.public.apiBaseUrl,
        query: { city }
      }) as any[]
      
      return response || []
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch pickup points by city'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get nearby pickup points (if geolocation is available)
  const getNearbyPickupPoints = async (latitude: number, longitude: number, radius: number = 10) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/pickup-points/nearby', {
        baseURL: config.public.apiBaseUrl,
        query: { 
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          radius: radius.toString()
        }
      }) as any[]
      
      return response || []
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch nearby pickup points'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get available cities (for filtering)
  const getAvailableCities = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/pickup-points/cities', {
        baseURL: config.public.apiBaseUrl
      }) as string[]
      
      return response || []
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch available cities'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utility functions
  const formatPickupPointAddress = (pickupPoint: any) => {
    if (!pickupPoint) return ''
    
    const parts = [
      pickupPoint.address,
      pickupPoint.city,
      pickupPoint.postal_code
    ].filter(Boolean)
    
    return parts.join(', ')
  }

  const getPickupPointDistance = (pickupPoint: any, userLat?: number, userLng?: number) => {
    if (!pickupPoint.latitude || !pickupPoint.longitude || !userLat || !userLng) {
      return null
    }

    // Haversine formula to calculate distance
    const R = 6371 // Earth's radius in kilometers
    const dLat = (pickupPoint.latitude - userLat) * Math.PI / 180
    const dLng = (pickupPoint.longitude - userLng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLat * Math.PI / 180) * Math.cos(pickupPoint.latitude * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c

    return Math.round(distance * 100) / 100 // Round to 2 decimal places
  }

  const sortPickupPointsByDistance = (points: any[], userLat?: number, userLng?: number) => {
    if (!userLat || !userLng) return points

    return [...points].sort((a, b) => {
      const distA = getPickupPointDistance(a, userLat, userLng) || Infinity
      const distB = getPickupPointDistance(b, userLat, userLng) || Infinity
      return distA - distB
    })
  }

  return {
    // State
    pickupPoints: readonly(pickupPoints),
    loading: readonly(loading),
    error: readonly(error),
    
    // Methods
    fetchPickupPoints,
    getPickupPoint,
    searchPickupPoints,
    getPickupPointsByCity,
    getNearbyPickupPoints,
    getAvailableCities,
    
    // Utilities
    formatPickupPointAddress,
    getPickupPointDistance,
    sortPickupPointsByDistance,
    clearError: () => { error.value = '' },
    refresh: fetchPickupPoints
  }
}