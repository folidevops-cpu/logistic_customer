<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Create Shipment</h1>
          <NuxtLink
            to="/dashboard"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Shipment Form -->
      <div class="px-4 sm:px-0">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Shipment Details</h3>
            <p class="mt-1 text-sm text-gray-600">Fill in the details for your new shipment.</p>
          </div>
          
          <form @submit.prevent="createShipment" class="p-6 space-y-6">
            <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ error }}
            </div>

            <!-- Pickup Information -->
            <div class="space-y-6">
              <h4 class="text-lg font-medium text-gray-900 border-b pb-2">Pickup Information</h4>
              
              <div>
                <label for="pickup_point" class="block text-sm font-medium text-gray-700">Pickup Point</label>
                <select
                  id="pickup_point"
                  v-model="form.pickup_point_id"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a pickup point</option>
                  <option
                    v-for="point in pickupPoints"
                    :key="point.id"
                    :value="point.id"
                  >
                    {{ point.name }} - {{ point.address }}
                  </option>
                </select>
              </div>

              <div>
                <label for="dropoff_point" class="block text-sm font-medium text-gray-700">Dropoff Point</label>
                <select
                  id="dropoff_point"
                  v-model="form.dropoff_point_id"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a dropoff point</option>
                  <option
                    v-for="point in pickupPoints"
                    :key="point.id"
                    :value="point.id"
                  >
                    {{ point.name }} - {{ point.address }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Recipient Information -->
            <div class="space-y-6">
              <h4 class="text-lg font-medium text-gray-900 border-b pb-2">Recipient Information</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="receiver_name" class="block text-sm font-medium text-gray-700">Recipient Name</label>
                  <input
                    id="receiver_name"
                    v-model="form.receiver_name"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label for="receiver_phone" class="block text-sm font-medium text-gray-700">Recipient Phone</label>
                  <input
                    id="receiver_phone"
                    v-model="form.receiver_phone"
                    type="tel"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="receiver_email" class="block text-sm font-medium text-gray-700">Recipient Email (Optional)</label>
                <input
                  id="receiver_email"
                  v-model="form.receiver_email"
                  type="email"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Package Information -->
            <div class="space-y-6">
              <h4 class="text-lg font-medium text-gray-900 border-b pb-2">Package Information</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label for="weight" class="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <input
                    id="weight"
                    v-model.number="form.weight"
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
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
                    min="1"
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
                    min="1"
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
                    min="1"
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

            <!-- Pricing -->
            <div v-if="pricing" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-lg font-medium text-blue-900">Estimated Cost</h4>
              <div class="mt-2 space-y-1">
                <p class="font-medium text-blue-900">Total: ${{ pricing.price.toFixed(2) }}</p>
                <p v-if="pricing.distance" class="text-sm text-blue-800">Distance: {{ pricing.distance.toFixed(1) }} km</p>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-between">
              <button
                type="button"
                @click="calculatePricing"
                :disabled="!canCalculatePricing || calculatingPrice"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                <span v-if="calculatingPrice">Calculating...</span>
                <span v-else>Calculate Price</span>
              </button>
              
              <button
                type="submit"
                :disabled="loading || !pricing"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                <span v-if="loading">Creating...</span>
                <span v-else>Create Shipment</span>
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
  middleware: 'auth'
})

const form = reactive({
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

const pickupPoints = ref<any[]>([])
const pricing = ref<any>(null)
const loading = ref(false)
const calculatingPrice = ref(false)
const error = ref('')

// Computed properties
const canCalculatePricing = computed(() => {
  return form.weight > 0 && 
         form.pickup_point_id && 
         form.dropoff_point_id
})

// Fetch pickup points on mount
onMounted(async () => {
  await fetchPickupPoints()
})

const fetchPickupPoints = async () => {
  try {
    const response = await $fetch('/pickup-points/', {
      baseURL: config.public.apiBaseUrl
    }) as any[]
    pickupPoints.value = response || []
  } catch (err) {
    error.value = 'Failed to load pickup points'
    pickupPoints.value = []
  }
}

const calculatePricing = async () => {
  calculatingPrice.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/shipments/calculate-price', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.value?.access_token}`
      },
      body: {
        pickup_point_id: parseInt(form.pickup_point_id),
        dropoff_point_id: parseInt(form.dropoff_point_id),
        weight: form.weight,
        is_fragile: form.is_fragile || false
      }
    }) as any
    pricing.value = response
  } catch (err: any) {
    error.value = err.data?.detail || 'Failed to calculate pricing'
  } finally {
    calculatingPrice.value = false
  }
}

const createShipment = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/shipments/', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.value?.access_token}`
      },
      body: {
        pickup_point_id: parseInt(form.pickup_point_id),
        dropoff_point_id: parseInt(form.dropoff_point_id),
        weight: form.weight,
        dimensions_length: form.dimensions_length,
        dimensions_width: form.dimensions_width,
        dimensions_height: form.dimensions_height,
        description: form.description,
        receiver_name: form.receiver_name,
        receiver_phone: form.receiver_phone,
        receiver_email: form.receiver_email,
        is_fragile: form.is_fragile
      }
    }) as any
    
    // Redirect to shipment detail or dashboard
    await navigateTo(`/track/${response.tracking_number}`)
  } catch (err: any) {
    error.value = err.data?.detail || 'Failed to create shipment'
  } finally {
    loading.value = false
  }
}
</script>