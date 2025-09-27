<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <NavBar />

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

