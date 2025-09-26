<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Create Support Ticket</h1>
          <NuxtLink
            to="/tickets"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to Tickets
          </NuxtLink>
        </div>
      </div>

      <!-- Ticket Form -->
      <div class="px-4 sm:px-0">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">New Support Request</h3>
            <p class="mt-1 text-sm text-gray-600">Describe your issue and we'll help you resolve it.</p>
          </div>
          
          <form @submit.prevent="createTicket" class="p-6 space-y-6">
            <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {{ success }}
            </div>
            <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ error }}
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                v-model="form.category"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                <option value="shipment_issue">Shipment Issue</option>
                <option value="payment_issue">Payment Issue</option>
                <option value="account_issue">Account Issue</option>
                <option value="technical_issue">Technical Issue</option>
                <option value="general_inquiry">General Inquiry</option>
                <option value="feature_request">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
              <select
                id="priority"
                v-model="form.priority"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select priority level</option>
                <option value="low">Low - General question or minor issue</option>
                <option value="medium">Medium - Moderate impact on service</option>
                <option value="high">High - Significant service disruption</option>
                <option value="urgent">Urgent - Critical service failure</option>
              </select>
            </div>

            <div v-if="form.category === 'shipment_issue'">
              <label for="shipment_reference" class="block text-sm font-medium text-gray-700">Shipment Reference</label>
              <input
                id="shipment_reference"
                v-model="form.shipment_reference"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter tracking number or shipment ID"
              />
              <p class="mt-1 text-sm text-gray-500">If this is related to a specific shipment, please provide the tracking number.</p>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="6"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Please provide detailed information about your issue..."
              />
              <p class="mt-1 text-sm text-gray-500">
                The more details you provide, the better we can help you. Include steps to reproduce the issue, error messages, etc.
              </p>
            </div>

            <div>
              <label for="attachments" class="block text-sm font-medium text-gray-700">Attachments (Optional)</label>
              <input
                id="attachments"
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                @change="handleFileUpload"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p class="mt-1 text-sm text-gray-500">
                You can attach screenshots, documents, or other relevant files (max 10MB each).
              </p>
              <div v-if="selectedFiles.length > 0" class="mt-2 space-y-2">
                <div
                  v-for="(file, index) in selectedFiles"
                  :key="index"
                  class="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span class="text-sm text-gray-700">{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-blue-900">What happens next?</h4>
              <ul class="mt-2 text-sm text-blue-800 space-y-1">
                <li>• Your ticket will be reviewed by our support team</li>
                <li>• You'll receive an email confirmation with your ticket number</li>
                <li>• We'll respond within 24 hours (faster for urgent issues)</li>
                <li>• You can track the progress in your tickets dashboard</li>
              </ul>
            </div>

            <div class="flex justify-end space-x-4">
              <NuxtLink
                to="/tickets"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </NuxtLink>
              <button
                type="submit"
                :disabled="loading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                <span v-if="loading">Creating Ticket...</span>
                <span v-else>Create Ticket</span>
              </button>
            </div>
          </form>
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
  auth: true
})

const form = reactive({
  subject: '',
  category: '',
  priority: '',
  description: '',
  shipment_reference: ''
})

const selectedFiles = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleFileUpload = (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || [])
  selectedFiles.value = files.filter(file => file.size <= 10 * 1024 * 1024) // 10MB limit
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const createTicket = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // Create the ticket
    const ticketData = {
      subject: form.subject,
      category: form.category,
      priority: form.priority,
      description: form.description
    }

    // Add shipment reference if provided
    if (form.shipment_reference) {
      ticketData.shipment_reference = form.shipment_reference
    }

    const response = await $fetch('/tickets/', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.value?.access_token}`
      },
      body: ticketData
    })
    
    // Handle file uploads if any
    if (selectedFiles.value.length > 0) {
      const formData = new FormData()
      selectedFiles.value.forEach(file => {
        formData.append('files', file)
      })
      
      try {
        await $fetch(`/tickets/${response.id}/attachments`, {
          baseURL: config.public.apiBaseUrl,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.value?.access_token}`
          },
          body: formData
        })
      } catch (attachmentError) {
        console.warn('Failed to upload attachments:', attachmentError)
        // Continue anyway since ticket was created
      }
    }
    
    success.value = `Ticket #${response.id} created successfully! You will receive an email confirmation shortly.`
    
    // Reset form
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
    selectedFiles.value = []
    
    // Redirect to ticket detail page after a short delay
    setTimeout(() => {
      navigateTo(`/tickets/${response.id}`)
    }, 2000)
    
  } catch (err: any) {
    error.value = err.data?.detail || 'Failed to create ticket. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>