<template>
  <div class="flow-root">
    <ul role="list" class="-mb-8">
      <li v-for="(event, eventIdx) in events" :key="event.id" class="relative pb-8">
        <div v-if="eventIdx !== events.length - 1" class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
        
        <div class="relative flex space-x-3">
          <div>
            <span 
              class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
              :class="getStatusIconClass(event.status)"
            >
              <component :is="getStatusIcon(event.status)" class="h-5 w-5 text-white" aria-hidden="true" />
            </span>
          </div>
          
          <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
            <div>
              <p class="text-sm text-gray-900">
                {{ getStatusText(event.status) }}
                <span v-if="event.location" class="font-medium text-gray-900">at {{ event.location }}</span>
              </p>
              <p v-if="event.description" class="mt-0.5 text-sm text-gray-500">
                {{ event.description }}
              </p>
            </div>
            <div class="whitespace-nowrap text-right text-sm text-gray-500">
              <time :datetime="event.timestamp">
                {{ formatDate(event.timestamp) }}
              </time>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { 
  CheckCircleIcon, 
  TruckIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/vue/24/solid'

interface TrackingEvent {
  id: number
  status: string
  timestamp: string
  location?: string
  description?: string
}

interface Props {
  events: TrackingEvent[]
}

defineProps<Props>()

// Status mappings
const statusConfig = {
  'pending': {
    icon: ClockIcon,
    class: 'bg-yellow-500',
    text: 'Shipment Created'
  },
  'picked_up': {
    icon: TruckIcon,
    class: 'bg-blue-500',
    text: 'Picked Up'
  },
  'in_transit': {
    icon: TruckIcon,
    class: 'bg-blue-600',
    text: 'In Transit'
  },
  'out_for_delivery': {
    icon: TruckIcon,
    class: 'bg-indigo-600',
    text: 'Out for Delivery'
  },
  'delivered': {
    icon: CheckCircleIcon,
    class: 'bg-green-500',
    text: 'Delivered'
  },
  'cancelled': {
    icon: XCircleIcon,
    class: 'bg-red-500',
    text: 'Cancelled'
  },
  'delayed': {
    icon: ExclamationTriangleIcon,
    class: 'bg-orange-500',
    text: 'Delayed'
  }
}

const getStatusIcon = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig]?.icon || ClockIcon
}

const getStatusIconClass = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig]?.class || 'bg-gray-500'
}

const getStatusText = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig]?.text || status.replace('_', ' ').toUpperCase()
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>