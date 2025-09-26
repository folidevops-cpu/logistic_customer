<template>
  <div>
    <label :for="inputId" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <select
      :id="inputId"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :required="required"
      :disabled="disabled || loading"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      :class="{ 'opacity-50 cursor-not-allowed': disabled || loading }"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="point in pickupPoints"
        :key="point.id"
        :value="point.id"
      >
        {{ point.name }} - {{ point.address }}
      </option>
    </select>
    <div v-if="loading" class="mt-1 text-sm text-gray-500">
      Loading pickup points...
    </div>
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface PickupPoint {
  id: number
  name: string
  address: string
  city: string
  postal_code: string
  latitude?: number
  longitude?: number
}

interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  inputId?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Select Pickup Point',
  placeholder: 'Choose a pickup point...',
  required: false,
  disabled: false,
  inputId: 'pickup-point-selector'
})

defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const config = useRuntimeConfig()

// State
const pickupPoints = ref<PickupPoint[]>([])
const loading = ref(false)
const error = ref('')

// Fetch pickup points on mount
const fetchPickupPoints = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/pickup-points/', {
      baseURL: config.public.apiBaseUrl
    }) as PickupPoint[]
    
    pickupPoints.value = response || []
  } catch (err: any) {
    error.value = 'Failed to load pickup points'
    pickupPoints.value = []
  } finally {
    loading.value = false
  }
}

// Fetch on mount
onMounted(() => {
  fetchPickupPoints()
})

// Expose refresh method
defineExpose({
  refresh: fetchPickupPoints
})
</script>