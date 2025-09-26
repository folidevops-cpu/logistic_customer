<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="text-6xl">😵</div>
      </div>
      <div class="mt-6 text-center">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ error.statusCode || 'Error' }}
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          {{ error.statusMessage || 'Something went wrong' }}
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          What can you do?
        </h2>
        <div class="space-y-3">
          <button
            @click="handleError"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Try Again
          </button>
          <NuxtLink
            to="/"
            class="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md block"
          >
            Go Home
          </NuxtLink>
          <NuxtLink
            to="/dashboard"
            class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md block"
          >
            Dashboard
          </NuxtLink>
        </div>
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          If the problem persists, please
          <a href="mailto:support@logisticapp.com" class="text-blue-600 hover:text-blue-500">
            contact support
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}

const props = defineProps<Props>()

const handleError = async () => {
  // Clear the error and try to navigate back
  await clearError({ redirect: '/' })
}

// Set page meta
definePageMeta({
  layout: false
})
</script>