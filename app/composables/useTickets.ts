export const useTickets = () => {
  const config = useRuntimeConfig()
  const token = useCookie('auth-token')

  // State
  const tickets = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  // Get all tickets for the current user
  const fetchTickets = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/tickets/', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }) as any[]
      
      tickets.value = response || []
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch tickets'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get a single ticket by ID
  const getTicket = async (id: number) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch(`/tickets/${id}`, {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch ticket'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create a new ticket
  const createTicket = async (ticketData: any) => {
    loading.value = true
    error.value = ''
    
    try {
      const body: any = {
        category: ticketData.category,
        priority: ticketData.priority,
        subject: ticketData.subject,
        description: ticketData.description
      }

      // Add shipment_id if provided
      if (ticketData.shipment_id && ticketData.shipment_id !== '') {
        body.shipment_id = parseInt(ticketData.shipment_id)
      }

      const response = await $fetch('/tickets/', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body
      }) as any
      
      // Refresh tickets list
      await fetchTickets()
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to create ticket'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add a reply to a ticket
  const addReply = async (ticketId: number, message: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch(`/tickets/${ticketId}/replies`, {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: { message }
      }) as any
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to add reply'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update ticket status (close, reopen, etc.)
  const updateTicketStatus = async (id: number, status: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch(`/tickets/${id}/status`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: { status }
      }) as any
      
      // Refresh tickets list
      await fetchTickets()
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to update ticket status'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get ticket replies/conversation
  const getTicketReplies = async (ticketId: number) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch(`/tickets/${ticketId}/replies`, {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }) as any[]
      
      return response
    } catch (err: any) {
      error.value = err.data?.detail || 'Failed to fetch ticket replies'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utility functions
  const getTicketStatusClass = (status: string) => {
    const statusClasses = {
      'open': 'bg-green-100 text-green-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'waiting_for_customer': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-gray-100 text-gray-800',
      'closed': 'bg-gray-100 text-gray-800'
    }
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityClass = (priority: string) => {
    const priorityClasses = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    }
    return priorityClasses[priority as keyof typeof priorityClasses] || 'bg-gray-100 text-gray-800'
  }

  const formatTicketStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  return {
    // State
    tickets: readonly(tickets),
    loading: readonly(loading),
    error: readonly(error),
    
    // Methods
    fetchTickets,
    getTicket,
    createTicket,
    addReply,
    updateTicketStatus,
    getTicketReplies,
    
    // Utilities
    getTicketStatusClass,
    getPriorityClass,
    formatTicketStatus,
    formatPriority,
    clearError: () => { error.value = '' },
    refresh: fetchTickets
  }
}