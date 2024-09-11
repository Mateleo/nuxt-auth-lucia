<script lang="ts" setup>
const user = useUser();

async function logout() {
  await $fetch("/api/auth/logout", {
    method: "POST",
  });
  await navigateTo("/login");
}
</script>
<template>
  <h1>HomePage:</h1>
  <p>{{ user }}</p>
  <form @submit.prevent="logout">
    <button>Sign out</button>
  </form>
  <NuxtLink to="/signup">Register</NuxtLink>
  <NuxtLink to="/login">Login</NuxtLink>
</template>
