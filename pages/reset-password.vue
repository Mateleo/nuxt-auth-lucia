<script lang="ts" setup>
definePageMeta({
  middleware: ["reset-password"],
});

const user = useUser()

//change password function
async function changepassword(data: any) {
  console.log(data);
  const formData = new FormData();

  // Add form fields manually to FormData
  formData.append("password", data.password);
  formData.append("password_confirm", data.password_confirm);

  await $fetch("/api/auth/change-password", {
    method: "POST",
    body: formData,
  });
}



</script>
<template>
  <div class="flex flex-col items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Enter your new password</h2>

      <!-- FormKit form for email input -->
      <FormKit type="form" @submit="changepassword" class="" :actions="false">
        <FormKit
          type="password"
          name="password"
          label="Password"
          placeholder="Enter a new password"
          validation="required|length:8"
          outer-class="mt-6"
          input-class="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          label-class="block mb-2 font-semibold text-gray-700"
          help-class="text-sm text-gray-500"
          message-class="text-red-500 text-sm mt-1"
        />
        <FormKit
          type="password"
          name="password_confirm"
          label="Confirm password"
          placeholder="Confirm your new password"
          validation="required|confirm"
          outer-class="mt-6"
          validation-label="Password confirmation"
          input-class="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          label-class="block mb-2 font-semibold text-gray-700"
          help-class="text-sm text-gray-500"
          message-class="text-red-500 text-sm mt-1"
        />
        <FormKit
          type="submit"
          label="Reset password"
          outer-class="mt-6"
          input-class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        />
      </FormKit>
    </div>
  </div>
</template>
<style scoped></style>
