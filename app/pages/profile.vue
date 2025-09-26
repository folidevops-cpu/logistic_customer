<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
          <NuxtLink
            to="/dashboard"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="px-4 sm:px-0">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
            <p class="mt-1 text-sm text-gray-600">Update your account information and preferences.</p>
          </div>
          
          <form @submit.prevent="updateProfile" class="p-6 space-y-6">
            <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {{ success }}
            </div>
            <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ error }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  id="first_name"
                  v-model="form.first_name"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  id="last_name"
                  v-model="form.last_name"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label for="phone_number" class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="phone_number"
                  v-model="form.phone_number"
                  type="tel"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                <span v-if="loading">Updating...</span>
                <span v-else>Update Profile</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Section -->
        <div class="bg-white shadow rounded-lg mt-8">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Change Password</h3>
            <p class="mt-1 text-sm text-gray-600">Update your password to keep your account secure.</p>
          </div>
          
          <form @submit.prevent="changePassword" class="p-6 space-y-6">
            <div v-if="passwordSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {{ passwordSuccess }}
            </div>
            <div v-if="passwordError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ passwordError }}
            </div>

            <div>
              <label for="current_password" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                id="current_password"
                v-model="passwordForm.current_password"
                type="password"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="new_password" class="block text-sm font-medium text-gray-700">New Password</label>
              <input
                id="new_password"
                v-model="passwordForm.new_password"
                type="password"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                id="confirm_password"
                v-model="passwordForm.confirm_password"
                type="password"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="passwordLoading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                <span v-if="passwordLoading">Changing...</span>
                <span v-else>Change Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, setUser } = useUserSession()
const config = useRuntimeConfig()

// Protect this page
definePageMeta({
  auth: true
})

const form = reactive({
  first_name: user.value?.first_name || '',
  last_name: user.value?.last_name || '',
  email: user.value?.email || '',
  phone_number: user.value?.phone_number || ''
})

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

// Fetch current user profile on mount
onMounted(async () => {
  await fetchProfile()
})

const fetchProfile = async () => {
  try {
    const response = await $fetch('/users/me', {
      baseURL: config.public.apiBaseUrl,
      headers: {
        Authorization: `Bearer ${user.value?.access_token}`
      }
    }) as any
    
    form.first_name = response.first_name
    form.last_name = response.last_name
    form.email = response.email
    form.phone_number = response.phone_number || ''
  } catch (err) {
    error.value = 'Failed to load profile information'
  }
}

const updateProfile = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const response = await $fetch('/users/me', {
      baseURL: config.public.apiBaseUrl,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.value?.access_token}`
      },
      body: {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_number: form.phone_number
      }
    }) as any
    
    // Update user session with new information
    await setUser({
      ...user.value,
      first_name: response.first_name,
      last_name: response.last_name,
      email: response.email,
      phone_number: response.phone_number
    })
    
    success.value = 'Profile updated successfully!'
  } catch (err: any) {
    error.value = err.data?.detail || 'Failed to update profile'
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  passwordLoading.value = true
  passwordError.value = ''
  passwordSuccess.value = ''
  
  if (passwordForm.new_password !== passwordForm.confirm_password) {
    passwordError.value = 'New passwords do not match'
    passwordLoading.value = false
    return
  }
  
  try {
    await $fetch('/auth/change-password', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.value?.access_token}`
      },
      body: {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      }
    })
    
    passwordSuccess.value = 'Password changed successfully!'
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.confirm_password = ''
  } catch (err: any) {
    passwordError.value = err.data?.detail || 'Failed to change password'
  } finally {
    passwordLoading.value = false
  }
}
</script>