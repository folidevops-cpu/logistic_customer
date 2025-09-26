<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div class="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Ship with confidence</span>
                <span class="block text-blue-600 xl:inline">nationwide</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Fast, reliable, and affordable shipping solutions for individuals and businesses. 
                Track your packages in real-time and get support when you need it.
              </p>
              <div class="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <NuxtLink
                    v-if="!isAuthenticated"
                    to="/register"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get started
                  </NuxtLink>
                  <NuxtLink
                    v-else
                    to="/dashboard"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Go to Dashboard
                  </NuxtLink>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <NuxtLink
                    v-if="!isAuthenticated"
                    to="/login"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    Sign in
                  </NuxtLink>
                  <NuxtLink
                    v-else
                    to="/shipments/create"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    Create Shipment
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div class="h-56 w-full bg-blue-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
          <div class="text-white text-6xl">📦</div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to ship
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform provides all the tools you need for efficient shipping and logistics management.
          </p>
        </div>

        <div class="mt-10">
          <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl">
                  🚚
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Fast Delivery</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Quick and reliable delivery to pickup points nationwide with real-time tracking.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl">
                  📍
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time Tracking</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Track your shipments in real-time from pickup to delivery with detailed status updates.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl">
                  💬
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">24/7 Support</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Get help when you need it with our responsive customer support system.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl">
                  💰
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Competitive Pricing</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Transparent pricing with no hidden fees. Calculate costs before you ship.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()

const isAuthenticated = computed(() => loggedIn.value)

definePageMeta({
  auth: false
})
</script>