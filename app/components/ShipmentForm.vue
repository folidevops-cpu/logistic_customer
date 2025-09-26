<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Pickup Information -->
    <div class="space-y-4">
      <h4 class="text-lg font-medium text-gray-900 border-b pb-2">Pickup Information</h4>
      
      <PickupPointSelector
        v-model="form.pickup_point_id"
        label="Pickup Point"
        placeholder="Select pickup location..."
        required
        input-id="pickup-point"
      />
    </div>

    <!-- Dropoff Information -->
    <div class="space-y-4">
      <h4 class="text-lg font-medium text-gray-900 border-b pb-2">Dropoff Information</h4>
      
      <PickupPointSelector
        v-model="form.dropoff_point_id"
        label="Dropoff Point"
        placeholder="Select dropoff location..."
        required
        input-id="dropoff-point"
      />
    </div>

    <!-- Receiver Information -->
    <div class="space-y-4">
      <h4 class="text-lg font-medium text-gray-900 border-b pb-2">Receiver Information</h4>
      
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="receiver_name" class="block text-sm font-medium text-gray-700">Receiver Name</label>
          <input
            id="receiver_name"
            v-model="form.receiver_name"
            type="text"
            required
            placeholder="Full name of receiver"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="receiver_phone" class="block text-sm font-medium text-gray-700">Receiver Phone</label>
          <input
            id="receiver_phone"
            v-model="form.receiver_phone"
            type="tel"
            required
            placeholder="+1234567890"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div class="sm:col-span-2">
          <label for="receiver_email" class="block text-sm font-medium text-gray-700">Receiver Email (Optional)</label>
          <input
            id="receiver_email"
            v-model="form.receiver_email"
            type="email"
            placeholder="receiver@example.com"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Package Information -->
    <div class="space-y-4">
      <h4 class="text-lg font-medium text-gray-900 border-b pb-2">Package Information</h4>
      
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="weight" class="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            id="weight"
            v-model.number="form.weight"
            type="number"
            step="0.1"
            min="0.1"
            required
            placeholder="1.0"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="dimensions_length" class="block text-sm font-medium text-gray-700">Length (cm)</label>
          <input
            id="dimensions_length"
            v-model.number="form.dimensions_length"
            type="number"
            step="0.1"
            min="0"
            placeholder="30"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="dimensions_width" class="block text-sm font-medium text-gray-700">Width (cm)</label>
          <input
            id="dimensions_width"
            v-model.number="form.dimensions_width"
            type="number"
            step="0.1"
            min="0"
            placeholder="20"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="dimensions_height" class="block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            id="dimensions_height"
            v-model.number="form.dimensions_height" 
            type="number"
            step="0.1"
            min="0"
            placeholder="10"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <div class="flex items-center">
          <input
            id="is_fragile"
            v-model="form.is_fragile"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="is_fragile" class="ml-2 block text-sm text-gray-900">
            Fragile item (requires special handling)
          </label>
        </div>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Package Description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          placeholder="Describe the contents of your package"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between items-center">
      <button
        type="button"
        @click="calculatePricing"
        :disabled="!canCalculatePricing || calculatingPrice"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        {{ calculatingPrice ? 'Calculating...' : 'Calculate Price' }}
      </button>

      <button
        type="submit"
        :disabled="loading || !pricing"
        class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        {{ loading ? 'Creating...' : 'Create Shipment' }}
      </button>
    </div>

    <!-- Pricing Display -->
    <div v-if="pricing" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 class="text-lg font-medium text-blue-900">Estimated Cost</h4>
      <p class="font-medium text-blue-900">Total: ${{ pricing.price?.toFixed(2) || '0.00' }}</p>
      <p v-if="pricing.distance" class="text-sm text-blue-800">Distance: {{ pricing.distance.toFixed(1) }} km</p>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
interface ShipmentForm {
  pickup_point_id: string
  dropoff_point_id: string
  receiver_name: string
  receiver_phone: string
  receiver_email: string
  weight: number
  dimensions_length: number
  dimensions_width: number
  dimensions_height: number
  description: string
  is_fragile: boolean
}

interface Props {
  loading?: boolean
  calculatingPrice?: boolean
  pricing?: any
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  calculatingPrice: false,
  pricing: null,
  error: ''
})

const emit = defineEmits<{
  submit: [form: ShipmentForm]
  calculatePrice: [form: ShipmentForm]
}>()

// Form data
const form = reactive<ShipmentForm>({
  pickup_point_id: '',
  dropoff_point_id: '',
  receiver_name: '',
  receiver_phone: '',
  receiver_email: '',
  weight: 0,
  dimensions_length: 0,
  dimensions_width: 0,
  dimensions_height: 0,
  description: '',
  is_fragile: false
})

// Computed properties
const canCalculatePricing = computed(() => {
  return form.weight > 0 && 
    form.pickup_point_id && 
    form.dropoff_point_id
})

// Methods
const handleSubmit = () => {
  emit('submit', { ...form })
}

const calculatePricing = () => {
  if (canCalculatePricing.value) {
    emit('calculatePrice', { ...form })
  }
}

// Expose form data
defineExpose({
  form,
  reset: () => {
    Object.assign(form, {
      pickup_point_id: '',
      dropoff_point_id: '',
      receiver_name: '',
      receiver_phone: '',
      receiver_email: '',
      weight: 0,
      dimensions_length: 0,
      dimensions_width: 0,
      dimensions_height: 0,
      description: '',
      is_fragile: false
    })
  }
})
</script>