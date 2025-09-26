<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Ticket Type Selection -->
    <div>
      <label for="category" class="block text-sm font-medium text-gray-700">Ticket Category</label>
      <select
        id="category"
        v-model="form.category"
        required
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Select a category...</option>
        <option value="general">General Inquiry</option>
        <option value="shipment_issue">Shipment Issue</option>
        <option value="billing">Billing Question</option>
        <option value="technical">Technical Support</option>
        <option value="complaint">Complaint</option>
        <option value="other">Other</option>
      </select>
    </div>

    <!-- Shipment Reference (Optional) -->
    <div>
      <label for="shipment_id" class="block text-sm font-medium text-gray-700">
        Related Shipment (Optional)
      </label>
      <select
        id="shipment_id"
        v-model="form.shipment_id"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">No related shipment</option>
        <option
          v-for="shipment in shipments"
          :key="shipment.id"
          :value="shipment.id"
        >
          {{ shipment.tracking_number }} - {{ shipment.description || 'Package' }}
        </option>
      </select>
    </div>

    <!-- Priority Level -->
    <div>
      <label for="priority" class="block text-sm font-medium text-gray-700">Priority Level</label>
      <select
        id="priority"
        v-model="form.priority"
        required
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Select priority...</option>
        <option value="low">Low - General question</option>
        <option value="medium">Medium - Issue affecting service</option>
        <option value="high">High - Urgent issue</option>
        <option value="critical">Critical - Service unavailable</option>
      </select>
    </div>

    <!-- Subject -->
    <div>
      <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
      <input
        id="subject"
        v-model="form.subject"
        type="text"
        required
        maxlength="200"
        placeholder="Brief description of your issue..."
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <p class="mt-1 text-xs text-gray-500">{{ form.subject.length }}/200 characters</p>
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">
        Detailed Description
      </label>
      <textarea
        id="description"
        v-model="form.description"
        rows="6"
        required
        maxlength="2000"
        placeholder="Please provide as much detail as possible about your issue..."
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <p class="mt-1 text-xs text-gray-500">{{ form.description.length }}/2000 characters</p>
    </div>

    <!-- File Upload (Future Enhancement) -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
        </svg>
        <span class="text-sm text-gray-600">File attachments coming soon</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between items-center pt-4">
      <button
        type="button"
        @click="resetForm"
        class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
      >
        Reset Form
      </button>

      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        {{ loading ? 'Creating Ticket...' : 'Create Ticket' }}
      </button>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error Creating Ticket</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
interface TicketForm {
  category: string
  shipment_id: string
  priority: string
  subject: string
  description: string
}

interface Shipment {
  id: number
  tracking_number: string
  description?: string
}

interface Props {
  loading?: boolean
  error?: string
  shipments?: Shipment[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
  shipments: () => []
})

const emit = defineEmits<{
  submit: [form: TicketForm]
}>()

// Form data
const form = reactive<TicketForm>({
  category: '',
  shipment_id: '',
  priority: '',
  subject: '',
  description: ''
})

// Computed properties
const isFormValid = computed(() => {
  return form.category && 
    form.priority && 
    form.subject.trim() && 
    form.description.trim()
})

// Methods
const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...form })
  }
}

const resetForm = () => {
  Object.assign(form, {
    category: '',
    shipment_id: '',
    priority: '',
    subject: '',
    description: ''
  })
}

// Expose form methods
defineExpose({
  form,
  reset: resetForm
})
</script>