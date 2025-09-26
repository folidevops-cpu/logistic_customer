<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Payment Information</h3>
      <p class="mt-1 text-sm text-gray-600">Complete your shipment payment securely.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
      <!-- Payment Method Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
        <div class="space-y-3">
          <div class="flex items-center">
            <input
              id="credit_card"
              v-model="form.payment_method"
              value="credit_card"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="credit_card" class="ml-3 block text-sm font-medium text-gray-700">
              Credit/Debit Card
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="paypal"
              v-model="form.payment_method"
              value="paypal"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="paypal" class="ml-3 block text-sm font-medium text-gray-700">
              PayPal
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="bank_transfer"
              v-model="form.payment_method"
              value="bank_transfer"
              type="radio"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label for="bank_transfer" class="ml-3 block text-sm font-medium text-gray-700">
              Bank Transfer
            </label>
          </div>
        </div>
      </div>

      <!-- Credit Card Details (shown when credit card is selected) -->
      <div v-if="form.payment_method === 'credit_card'" class="space-y-4">
        <div>
          <label for="card_number" class="block text-sm font-medium text-gray-700">Card Number</label>
          <input
            id="card_number"
            v-model="form.card_number"
            type="text"
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @input="formatCardNumber"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="expiry_date" class="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              id="expiry_date"
              v-model="form.expiry_date"
              type="text"
              placeholder="MM/YY"
              maxlength="5"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @input="formatExpiryDate"
            />
          </div>

          <div>
            <label for="cvv" class="block text-sm font-medium text-gray-700">CVV</label>
            <input
              id="cvv"
              v-model="form.cvv"
              type="text"
              placeholder="123"
              maxlength="4"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label for="card_name" class="block text-sm font-medium text-gray-700">Name on Card</label>
          <input
            id="card_name"
            v-model="form.card_name"
            type="text"
            placeholder="John Doe"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <!-- Payment Summary -->
      <div v-if="amount" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 class="text-lg font-medium text-gray-900">Payment Summary</h4>
        <div class="mt-2 space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Shipment Cost:</span>
            <span class="text-gray-900">${{ amount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Processing Fee:</span>
            <span class="text-gray-900">${{ (amount * 0.03).toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-200 pt-1">
            <div class="flex justify-between text-base font-medium">
              <span class="text-gray-900">Total:</span>
              <span class="text-gray-900">${{ (amount * 1.03).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-green-700">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center pt-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm font-medium"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-sm font-medium"
        >
          {{ loading ? 'Processing...' : `Pay $${amount ? (amount * 1.03).toFixed(2) : '0.00'}` }}
        </button>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Payment Error</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface PaymentForm {
  payment_method: string
  card_number: string
  expiry_date: string
  cvv: string
  card_name: string
}

interface Props {
  amount?: number
  loading?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  amount: 0,
  loading: false,
  error: ''
})

const emit = defineEmits<{
  submit: [form: PaymentForm]
  cancel: []
}>()

// Form data
const form = reactive<PaymentForm>({
  payment_method: '',
  card_number: '',
  expiry_date: '',
  cvv: '',
  card_name: ''
})

// Computed properties
const isFormValid = computed(() => {
  if (!form.payment_method) return false
  
  if (form.payment_method === 'credit_card') {
    return form.card_number.replace(/\s/g, '').length >= 13 &&
      form.expiry_date.length === 5 &&
      form.cvv.length >= 3 &&
      form.card_name.trim()
  }
  
  return true // For other payment methods
})

// Methods
const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...form })
  }
}

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  const matches = value.match(/\d{4,16}/g)
  const match = matches && matches[0] || ''
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    form.card_number = parts.join(' ')
  } else {
    form.card_number = value
  }
}

const formatExpiryDate = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  
  form.expiry_date = value
}

// Expose form methods
defineExpose({
  form,
  reset: () => {
    Object.assign(form, {
      payment_method: '',
      card_number: '',
      expiry_date: '',
      cvv: '',
      card_name: ''
    })
  }
})
</script>