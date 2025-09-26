export const useShipments = () => {
  const config = useRuntimeConfig()
  const token = useCookie('auth-token')

  // State
  const shipments = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  // Get all shipments for the current user
  const fetchShipments = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/shipments/', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }) as any[]
      
      shipments.value = response || []
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch shipments'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get a single shipment by ID
  const getShipment = async (id: number) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch(`/shipments/${id}`, {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch shipment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create a new shipment
  const createShipment = async (shipmentData: any) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/shipments/', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: {
          pickup_point_id: parseInt(shipmentData.pickup_point_id),
          dropoff_point_id: parseInt(shipmentData.dropoff_point_id),
          weight: shipmentData.weight,
          dimensions_length: shipmentData.dimensions_length,
          dimensions_width: shipmentData.dimensions_width,
          dimensions_height: shipmentData.dimensions_height,
          description: shipmentData.description,
          receiver_name: shipmentData.receiver_name,
          receiver_phone: shipmentData.receiver_phone,
          receiver_email: shipmentData.receiver_email,
          is_fragile: shipmentData.is_fragile
        }
      }) as any
      
      // Refresh shipments list
      await fetchShipments()
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to create shipment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Calculate shipment pricing
  const calculatePrice = async (shipmentData: any) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/shipments/calculate-price', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: {
          pickup_point_id: parseInt(shipmentData.pickup_point_id),
          dropoff_point_id: parseInt(shipmentData.dropoff_point_id),
          weight: shipmentData.weight,
          is_fragile: shipmentData.is_fragile || false
        }
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to calculate price'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update shipment status (admin only, but kept for completeness)
  const updateShipmentStatus = async (id: number, status: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch(`/shipments/${id}/status`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: { status }
      }) as any
      
      // Refresh shipments list
      await fetchShipments()
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to update shipment status'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Track shipment by tracking number
  const trackShipment = async (trackingNumber: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch(`/tracking/${trackingNumber}`, {
        baseURL: config.public.apiBaseUrl
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Shipment not found'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    shipments: readonly(shipments),
    loading: readonly(loading),
    error: readonly(error),
    
    // Methods
    fetchShipments,
    getShipment,
    createShipment,
    calculatePrice,
    updateShipmentStatus,
    trackShipment,
    
    // Utilities
    clearError: () => { error.value = '' },
    refresh: fetchShipments
  }
}