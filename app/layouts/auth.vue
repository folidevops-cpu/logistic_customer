<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <NuxtLink to="/" class="text-3xl font-bold text-blue-600">
          LogisticApp
        </NuxtLink>
      </div>
    </div>

    <!-- Main content -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <slot />
      </div>

      <!-- Additional links -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">
              Need help?
            </span>
          </div>
        </div>

        <div class="mt-6 flex justify-center space-x-4 text-sm">
          <a href="#" class="text-blue-600 hover:text-blue-500">
            Contact Support
          </a>
          <span class="text-gray-300">|</span>
          <a href="#" class="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-8">
      <div class="max-w-md mx-auto">
        <div class="text-center text-sm text-gray-500">
          © 2024 LogisticApp. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// This layout is for authentication pages (login, register, etc.)
// It provides a clean, centered design without navigation
</script>