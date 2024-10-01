<script setup lang="ts">

async function resetpassword(e: Event) {
  console.log(e)
	await $fetch("/api/auth/reset-password", {
		method: "POST",
		body: e
	});
}

</script>

<template>
  <div class="flex flex-col items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Password Reset</h2>
      <p class="text-center mb-6">Enter your email and we'll send you a link to reset your password.</p>

      <!-- FormKit form for email input -->
      <FormKit type="form" @submit="resetpassword" class="space-y-4" :actions=false>
        <FormKit
          type="email"
          name="email"
          label="Email address"
          placeholder="Enter your email"
          validation="required|email"
          validation-label="Email address"
          input-class="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          label-class="block mb-2 font-semibold text-gray-700"
          help-class="text-sm text-gray-500"
          message-class="text-red-500 text-sm mt-1"
        />
        <FormKit
          type="submit"
          label="Send link to email"
          input-class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        />
      </FormKit>
    </div>
  </div>
</template>
<style scoped></style>
