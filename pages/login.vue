<!--pages/login.vue-->
<script lang="ts" setup>
async function login(e: Event) {
	await $fetch("/api/auth/login", {
		method: "POST",
		body: new FormData(e.target as HTMLFormElement)
	});
	await navigateTo("/");
}
</script>

<template>
	<h1>Sign in</h1>
	<form method="post" action="/api/auth/login" @submit.prevent="login">
		<label htmlFor="username">Username</label>
		<input name="username" id="username" />
		<br />
		<label htmlFor="password">Password</label>
		<input type="password" name="password" id="password" />
		<br />
		<button>Continue</button>
	</form>
	<NuxtLink to="/forgot-password">Forgot password?</NuxtLink>
</template>