export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession()
  
  if (!loggedIn.value) {
    // Show toast message for unauthenticated access attempt
    if (import.meta.client) {
      // Store the intended destination in sessionStorage so we can redirect after login
      sessionStorage.setItem('redirectTo', to.fullPath)
      
      // Create a simple toast notification
      showAuthenticationToast()
    }
    
    return navigateTo('/login')
  }
})

// Simple toast notification function
function showAuthenticationToast() {
  // Create toast element
  const toast = document.createElement('div')
  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    ">
      🔒 Please log in to access this page
    </div>
  `
  
  document.body.appendChild(toast)
  
  // Animate in
  setTimeout(() => {
    const toastElement = toast.querySelector('div') as HTMLElement
    if (toastElement) {
      toastElement.style.transform = 'translateX(0)'
    }
  }, 100)
  
  // Remove after 4 seconds
  setTimeout(() => {
    const toastElement = toast.querySelector('div') as HTMLElement
    if (toastElement) {
      toastElement.style.transform = 'translateX(100%)'
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }
  }, 4000)
}