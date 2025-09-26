<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and primary navigation -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="text-xl font-bold text-blue-600">
                LogisticApp
              </NuxtLink>
            </div>
            
            <!-- Desktop navigation -->
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <NuxtLink
                v-if="isAuthenticated"
                to="/dashboard"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-blue-500 text-gray-900': $route.path === '/dashboard' }"
              >
                Dashboard
              </NuxtLink>
              
              <NuxtLink
                v-if="isAuthenticated"
                to="/shipments/create"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-blue-500 text-gray-900': $route.path.includes('/shipments') }"
              >
                Create Shipment
              </NuxtLink>
              
              <NuxtLink
                v-if="isAuthenticated"
                to="/tickets"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-blue-500 text-gray-900': $route.path.includes('/tickets') }"
              >
                Support
              </NuxtLink>
            </div>
          </div>

          <!-- Right side navigation -->
          <div class="flex items-center">
            <div v-if="!isAuthenticated" class="hidden md:flex md:items-center md:space-x-4">
              <NuxtLink
                to="/login"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </NuxtLink>
            </div>

            <!-- User menu (when authenticated) -->
            <div v-if="isAuthenticated" class="relative ml-3">
              <div>
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  :class="{ 'ring-2 ring-blue-500': showUserMenu }"
                >
                  <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    {{ userInitials }}
                  </div>
                  <span class="ml-2 text-gray-700 text-sm font-medium hidden md:block">
                    {{ userName }}
                  </span>
                  <svg class="ml-1 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>

              <!-- User dropdown menu -->
              <div
                v-if="showUserMenu"
                v-click-outside="() => showUserMenu = false"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              >
                <div class="py-1">
                  <NuxtLink
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showUserMenu = false"
                  >
                    Your Profile
                  </NuxtLink>
                  <NuxtLink
                    to="/dashboard"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showUserMenu = false"
                  >
                    Dashboard
                  </NuxtLink>
                  <div class="border-t border-gray-100"></div>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden ml-3">
              <button
                @click="showMobileMenu = !showMobileMenu"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg class="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="md:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink
            v-if="isAuthenticated"
            to="/dashboard"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path === '/dashboard' 
              ? 'bg-blue-50 border-blue-500 text-blue-700' 
              : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'"
            @click="showMobileMenu = false"
          >
            Dashboard
          </NuxtLink>
          
          <NuxtLink
            v-if="isAuthenticated"
            to="/shipments/create"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path.includes('/shipments') 
              ? 'bg-blue-50 border-blue-500 text-blue-700' 
              : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'"
            @click="showMobileMenu = false"
          >
            Create Shipment
          </NuxtLink>
          
          <NuxtLink
            v-if="isAuthenticated"
            to="/tickets"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path.includes('/tickets') 
              ? 'bg-blue-50 border-blue-500 text-blue-700' 
              : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'"
            @click="showMobileMenu = false"
          >
            Support
          </NuxtLink>
        </div>
        
        <div v-if="isAuthenticated" class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {{ userInitials }}
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ userName }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              @click="showMobileMenu = false"
            >
              Your Profile
            </NuxtLink>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        <div v-if="!isAuthenticated" class="pt-4 pb-3 border-t border-gray-200">
          <NuxtLink
            to="/login"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            @click="showMobileMenu = false"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            @click="showMobileMenu = false"
          >
            Sign Up
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            © 2024 LogisticApp. All rights reserved.
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
            <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
            <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, loggedIn } = useUserSession()
const { getFullName, getInitials } = useProfile()
const { logout } = useAuth()

// State
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

// Computed
const isAuthenticated = computed(() => loggedIn.value)
const userName = computed(() => getFullName())
const userInitials = computed(() => getInitials())

// Methods
const handleLogout = async () => {
  showUserMenu.value = false
  showMobileMenu.value = false
  await logout()
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>