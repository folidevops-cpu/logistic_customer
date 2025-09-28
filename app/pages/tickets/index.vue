<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <div class="flex space-x-4">
            <NuxtLink
              to="/tickets/create"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create Ticket
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Tickets List -->
      <div class="px-4 sm:px-0">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Your Support Tickets</h3>
            <p class="mt-1 text-sm text-gray-600">View and manage your support requests.</p>
          </div>
          
          <div v-if="pending" class="p-6 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading tickets...</p>
          </div>

          <div v-else-if="error" class="p-6 text-center">
            <div class="text-red-500">
              <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Failed to load tickets</h3>
              <p class="mt-2 text-gray-600">Please try refreshing the page.</p>
            </div>
          </div>

          <div v-else-if="!tickets || tickets.length === 0" class="p-6 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No tickets yet</h3>
            <p class="mt-2 text-gray-600">You haven't created any support tickets yet.</p>
            <div class="mt-6">
              <NuxtLink
                to="/tickets/create"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create your first ticket
              </NuxtLink>
            </div>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="ticket in tickets"
              :key="ticket.id"
              class="p-6 hover:bg-gray-50 cursor-pointer"
              @click="navigateTo(`/tickets/${ticket.id}`)"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <h4 class="text-lg font-medium text-gray-900">{{ ticket.subject }}</h4>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(ticket.status)"
                    >
                      {{ ticket.status }}
                    </span>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getPriorityClass(ticket.priority)"
                    >
                      {{ ticket.priority }}
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 line-clamp-2">{{ ticket.description }}</p>
                  <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {{ formatDate(ticket.created_at) }}</span>
                    <span v-if="ticket.updated_at !== ticket.created_at">
                      Updated: {{ formatDate(ticket.updated_at) }}
                    </span>
                    <span v-if="ticket.assigned_to">
                      Assigned to: {{ ticket.assigned_to.full_name }}
                    </span>
                  </div>
                </div>
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="currentPage <= 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage >= totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalItems) }} of {{ totalItems }} results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="previousPage"
                    :disabled="currentPage <= 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage >= totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession()
const config = useRuntimeConfig()

// Protect this page
definePageMeta({
  middleware: 'auth'
})

const currentPage = ref(1)
const pageSize = ref(10)

// Fetch tickets with reactive pagination using useFetch
const { data: ticketsData, pending, error, refresh } = await useFetch('/api/tickets', {
  query: computed(() => ({
    page: currentPage.value,
    limit: pageSize.value
  })),
  default: () => ({ items: [], total: 0 })
})

// Computed properties
const tickets = computed(() => ticketsData.value?.items || [])
const totalItems = computed(() => ticketsData.value?.total || 0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const getStatusClass = (status: string) => {
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

const getPriorityClass = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'low':
      return 'bg-gray-100 text-gray-800'
    case 'medium':
      return 'bg-blue-100 text-blue-800'
    case 'high':
      return 'bg-orange-100 text-orange-800'
    case 'urgent':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}
</script>