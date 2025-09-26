<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div 
      class="animate-spin rounded-full border-b-2"
      :class="[sizeClass, colorClass]"
    ></div>
    <p v-if="message" class="ml-3 text-sm" :class="textColorClass">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large'
  color?: 'blue' | 'gray' | 'green' | 'red'
  message?: string
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: 'blue',
  message: '',
  center: false
})

// Computed classes
const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'h-4 w-4'
    case 'large':
      return 'h-12 w-12'
    default:
      return 'h-8 w-8'
  }
})

const colorClass = computed(() => {
  switch (props.color) {
    case 'gray':
      return 'border-gray-600'
    case 'green':
      return 'border-green-600'
    case 'red':
      return 'border-red-600'
    default:
      return 'border-blue-600'
  }
})

const textColorClass = computed(() => {
  switch (props.color) {
    case 'gray':
      return 'text-gray-600'
    case 'green':
      return 'text-green-600'
    case 'red':
      return 'text-red-600'
    default:
      return 'text-blue-600'
  }
})

const containerClass = computed(() => {
  return props.center ? 'py-8' : ''
})
</script>