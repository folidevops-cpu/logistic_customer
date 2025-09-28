<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="px-4 pb-6 sm:px-0">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <NuxtLink
            to="/shipments/create"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Create</dt>
                    <dd class="text-lg font-medium text-gray-900">New Shipment</dd>
                  </dl>
                </div>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/tickets/create"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Support</dt>
                    <dd class="text-lg font-medium text-gray-900">Create Ticket</dd>
                  </dl>
                </div>
              </div>
            </div>
          </NuxtLink>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <div>
                    <input
                      v-model="trackingNumber"
                      type="text"
                      placeholder="Enter tracking number"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      @keyup.enter="trackShipment"
                    />
                    <button
                      @click="trackShipment"
                      class="mt-2 w-full bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                    >
                      Track Shipment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Shipments and Tickets -->
      <div class="px-4 sm:px-0">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Recent Shipments -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Recent Shipments</h3>
                <NuxtLink to="/shipments" class="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  View all
                </NuxtLink>
              </div>
            </div>
            <div class="p-6">
              <div v-if="shipmentsLoading" class="text-gray-500 text-center py-4">
                Loading shipments...
              </div>
              <div v-else-if="shipmentsError" class="text-red-500 text-center py-4">
                Failed to load shipments
              </div>
              <div v-else-if="!recentShipments || recentShipments.length === 0" class="text-gray-500 text-center py-4">
                No shipments yet
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="shipment in recentShipments"
                  :key="shipment.id"
                  class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ shipment.tracking_number }}</p>
                    <p class="text-sm text-gray-500">{{ shipment.receiver_name || 'To dropoff point' }}</p>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusClass(shipment.status)">
                    {{ shipment.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Tickets -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Recent Support Tickets</h3>
                <NuxtLink to="/tickets" class="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  View all
                </NuxtLink>
              </div>
            </div>
            <div class="p-6">
              <div v-if="ticketsLoading" class="text-gray-500 text-center py-4">
                Loading tickets...
              </div>
              <div v-else-if="ticketsError" class="text-red-500 text-center py-4">
                Failed to load tickets
              </div>
              <div v-else-if="!recentTickets || recentTickets.length === 0" class="text-gray-500 text-center py-4">
                No tickets yet
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="ticket in recentTickets"
                  :key="ticket.id"
                  class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ ticket.subject }}</p>
                    <p class="text-sm text-gray-500">{{ formatDate(ticket.created_at) }}</p>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getTicketStatusClass(ticket.status)">
                    {{ ticket.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession()
const config = useRuntimeConfig()

// Protect this page
definePageMeta({
  middleware: 'auth'
})

const trackingNumber = ref('')

// Fetch recent shipments with useFetch
const { data: recentShipments, pending: shipmentsLoading, error: shipmentsError } = await useFetch('/api/shipments', {
  query: {
    limit: 5
  },
  default: () => []
})

// Fetch recent tickets with useFetch
const { data: recentTickets, pending: ticketsLoading, error: ticketsError } = await useFetch('/api/tickets', {
  query: {
    limit: 5
  },
  default: () => []
})

const trackShipment = () => {
  if (trackingNumber.value.trim()) {
    navigateTo(`/track/${trackingNumber.value.trim()}`)
  }
}

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'picked_up':
      return 'bg-blue-100 text-blue-800'
    case 'in_transit':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTicketStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'bg-blue-100 text-blue-800'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'resolved':
      return 'bg-green-100 text-green-800'
    case 'closed':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getFullName = (user: any) => {
  if (!user) return ''
  return `${user.first_name || ''} ${user.last_name || ''}`.trim()
}
</script>