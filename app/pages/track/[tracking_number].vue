<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Track Shipment</h1>
          <NuxtLink
            to="/dashboard"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to Dashboard
          </NuxtLink>
        </div>
      </div>

      <div v-if="pending" class="px-4 sm:px-0 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading shipment details...</p>
      </div>

      <div v-else-if="error" class="px-4 sm:px-0">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Shipment not found</h3>
              <p class="mt-1 text-sm text-red-700">{{ error.data?.detail || 'Shipment not found. Please check the tracking number and try again.' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="shipment" class="px-4 sm:px-0 space-y-6">
        <!-- Shipment Overview -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Tracking: {{ shipment.tracking_number }}</h3>
                <p class="mt-1 text-sm text-gray-600">{{ shipment.description || 'Package' }}</p>
              </div>
              <div class="text-right">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusClass(shipment.status)"
                >
                  {{ formatStatus(shipment.status) }}
                </span>
                <p class="mt-1 text-sm text-gray-500">
                  Est. Delivery: {{ formatDate(shipment.estimated_delivery_date) }}
                </p>
              </div>
            </div>
          </div>
          
          <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">From</h4>
              <div class="text-sm text-gray-600">
                <p v-if="shipment.pickup_point">{{ shipment.pickup_point.name }}</p>
                <p v-if="shipment.pickup_point">{{ shipment.pickup_point.address }}</p>
                <p v-if="shipment.sender">Sender: {{ shipment.sender.full_name }}</p>
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">To</h4>
              <div class="text-sm text-gray-600">
                <p>{{ shipment.recipient_name }}</p>
                <p>{{ shipment.destination_address }}</p>
                <p>{{ shipment.recipient_phone }}</p>
              </div>
            </div>
          </div>

          <div v-if="shipment.weight || shipment.dimensions" class="px-6 py-4 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Package Details</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div v-if="shipment.weight">
                <span class="font-medium">Weight:</span> {{ shipment.weight }}kg
              </div>
              <div v-if="shipment.dimensions">
                <span class="font-medium">Dimensions:</span> 
                {{ shipment.dimensions.length }}×{{ shipment.dimensions.width }}×{{ shipment.dimensions.height }}cm
              </div>
              <div v-if="shipment.value">
                <span class="font-medium">Value:</span> ${{ shipment.value.toFixed(2) }}
              </div>
              <div v-if="shipment.express">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Express
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tracking Timeline -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Tracking History</h3>
          </div>
          
          <div class="px-6 py-4">
            <div class="flow-root">
              <ul class="-mb-8">
                <li v-for="(event, index) in trackingEvents" :key="event.id" class="relative pb-8">
                  <div v-if="index < trackingEvents.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
                  <div class="relative flex space-x-3">
                    <div>
                      <span 
                        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        :class="getEventIconClass(event.status, index === 0)"
                      >
                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path v-if="event.status === 'delivered'" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          <path v-else-if="event.status === 'in_transit'" fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                          <path v-else d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        </svg>
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ formatStatus(event.status) }}</p>
                        <p v-if="event.description" class="mt-0.5 text-sm text-gray-500">{{ event.description }}</p>
                        <p v-if="event.location" class="mt-0.5 text-sm text-gray-500">{{ event.location }}</p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        <p>{{ formatDateTime(event.timestamp) }}</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Delivery Information -->
        <div v-if="shipment.status === 'delivered'" class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex">
            <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Package Delivered</h3>
              <p class="mt-1 text-sm text-green-700">
                Your package has been successfully delivered on {{ formatDate(shipment.delivered_at) }}.
                <span v-if="shipment.delivered_to"> Delivered to: {{ shipment.delivered_to }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Need Help Section -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Need Help?</h3>
          </div>
          
          <div class="px-6 py-4 space-y-4">
            <p class="text-sm text-gray-600">
              If you have questions about your shipment or need assistance, we're here to help.
            </p>
            
            <div class="flex space-x-4">
              <NuxtLink
                :to="`/tickets/create?shipment=${shipment.tracking_number}`"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Report an Issue
              </NuxtLink>
              
              <button
                @click="refreshTracking"
                :disabled="refreshing"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span v-if="refreshing">Refreshing...</span>
                <span v-else>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

// This page can be accessed without authentication (public tracking)
// No middleware needed - public access

// Fetch tracking information with useFetch
const { data: trackingData, pending, error, refresh } = await useFetch(`/api/tracking/${route.params.tracking_number}`, {
  default: () => ({ shipment: null, events: [] })
})

// Computed properties for reactive data
const shipment = computed(() => trackingData.value?.shipment || trackingData.value)
const trackingEvents = computed(() => {
  const events = trackingData.value?.events || trackingData.value?.tracking_events || []
  // Sort events by timestamp (newest first)
  return events.length > 0 
    ? events.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : []
})

const refreshing = ref(false)

const refreshTracking = async () => {
  refreshing.value = true
  await refresh()
  refreshing.value = false
}

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'picked_up':
      return 'bg-blue-100 text-blue-800'
    case 'in_transit':
      return 'bg-purple-100 text-purple-800'
    case 'out_for_delivery':
      return 'bg-orange-100 text-orange-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'exception':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getEventIconClass = (status: string, isLatest: boolean) => {
  const baseClass = 'text-white'
  
  if (isLatest) {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return `${baseClass} bg-green-500`
      case 'in_transit':
      case 'out_for_delivery':
        return `${baseClass} bg-blue-500`
      case 'exception':
      case 'cancelled':
        return `${baseClass} bg-red-500`
      default:
        return `${baseClass} bg-purple-500`
    }
  }
  
  return `${baseClass} bg-gray-400`
}

const formatStatus = (status: string) => {
  return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>