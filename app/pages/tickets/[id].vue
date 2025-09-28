<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Ticket #{{ ticket?.id }}</h1>
            <p v-if="ticket" class="mt-1 text-gray-600">{{ ticket.subject }}</p>
          </div>
          <NuxtLink
            to="/tickets"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to Tickets
          </NuxtLink>
        </div>
      </div>

      <div v-if="pending" class="px-4 sm:px-0 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading ticket details...</p>
      </div>

      <div v-else-if="error" class="px-4 sm:px-0 text-center">
        <div class="bg-white shadow rounded-lg p-6">
          <div class="text-red-500">
            <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Failed to load ticket</h3>
            <p class="mt-2 text-gray-600">Please try refreshing the page.</p>
          </div>
        </div>
      </div>

      <div v-else-if="!ticket" class="px-4 sm:px-0 text-center">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900">Ticket not found</h3>
          <p class="mt-2 text-gray-600">The ticket you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>

      <div v-else class="px-4 sm:px-0 space-y-6">
        <!-- Ticket Information -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ ticket.subject }}</h3>
                <div class="mt-2 flex items-center space-x-4">
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
                  <span class="text-sm text-gray-500">{{ ticket.category.replace('_', ' ') }}</span>
                </div>
              </div>
              <div class="text-right text-sm text-gray-500">
                <p>Created: {{ formatDate(ticket.created_at) }}</p>
                <p v-if="ticket.updated_at !== ticket.created_at">Updated: {{ formatDate(ticket.updated_at) }}</p>
                <p v-if="ticket.assigned_to">Assigned to: {{ ticket.assigned_to.full_name }}</p>
              </div>
            </div>
          </div>
          
          <div class="px-6 py-4">
            <div class="prose max-w-none text-gray-900">
              <p class="whitespace-pre-wrap">{{ ticket.description }}</p>
            </div>
            
            <div v-if="ticket.shipment_reference" class="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 class="text-sm font-medium text-blue-900">Related Shipment</h4>
              <p class="text-sm text-blue-800">{{ ticket.shipment_reference }}</p>
              <NuxtLink
                :to="`/track/${ticket.shipment_reference}`"
                class="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Track this shipment →
              </NuxtLink>
            </div>

            <!-- Attachments -->
            <div v-if="ticket.attachments && ticket.attachments.length > 0" class="mt-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
              <div class="space-y-2">
                <div
                  v-for="attachment in ticket.attachments"
                  :key="attachment.id"
                  class="flex items-center space-x-2 text-sm"
                >
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                  <a
                    :href="attachment.url"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-500"
                  >
                    {{ attachment.filename }}
                  </a>
                  <span class="text-gray-500">({{ formatFileSize(attachment.size) }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments/Updates -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Updates & Comments</h3>
          </div>
          
          <div class="divide-y divide-gray-200">
            <div v-if="!ticket.comments || ticket.comments.length === 0" class="p-6 text-center text-gray-500">
              No updates yet. We'll post updates here as we work on your ticket.
            </div>
            
            <div
              v-for="comment in ticket.comments"
              :key="comment.id"
              class="p-6"
            >
              <div class="flex space-x-3">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-600">
                      {{ comment.author.full_name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h4 class="text-sm font-medium text-gray-900">{{ comment.author.full_name }}</h4>
                    <span v-if="comment.author.role === 'admin'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Support Team
                    </span>
                    <span class="text-sm text-gray-500">{{ formatDate(comment.created_at) }}</span>
                  </div>
                  <div class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ comment.content }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Comment (if ticket is not closed) -->
        <div v-if="ticket.status !== 'closed'" class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Add Comment</h3>
          </div>
          
          <form @submit.prevent="addComment" class="p-6">
            <div v-if="commentError" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ commentError }}
            </div>
            
            <div>
              <label for="comment" class="block text-sm font-medium text-gray-700">Your comment</label>
              <textarea
                id="comment"
                v-model="newComment"
                rows="4"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add additional information or ask a question..."
              />
            </div>
            
            <div class="mt-4 flex justify-end">
              <button
                type="submit"
                :disabled="commentLoading || !newComment.trim()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                <span v-if="commentLoading">Adding...</span>
                <span v-else>Add Comment</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Closed ticket notice -->
        <div v-else class="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-gray-800">This ticket is closed</h3>
              <p class="mt-1 text-sm text-gray-600">
                This support ticket has been resolved and closed. If you need further assistance, please create a new ticket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user } = useUserSession()
const config = useRuntimeConfig()
const route = useRoute()

// Fetch ticket details with useFetch
const { data: ticket, pending, error, refresh } = await useFetch(`/api/tickets/${route.params.id}`, {
  default: () => null
})

const newComment = ref('')
const commentLoading = ref(false)
const commentError = ref('')

const addComment = async () => {
  commentLoading.value = true
  commentError.value = ''
  
  try {
    await $fetch(`/api/tickets/${ticket.value.id}/comments`, {
      method: 'POST',
      body: {
        content: newComment.value.trim()
      }
    })
    
    // Refresh ticket to show new comment
    await refresh()
    newComment.value = ''
  } catch (err: any) {
    commentError.value = err.data?.detail || 'Failed to add comment'
  } finally {
    commentLoading.value = false
  }
}

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

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>