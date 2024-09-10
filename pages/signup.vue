<!--pages/signup.vue-->
<script lang="ts" setup>
async function signup(e: Event) {
	await $fetch("/api/auth/signup", {
		method: "POST",
		body: new FormData(e.target as HTMLFormElement)
	});
	await navigateTo("/");
}
</script>

<template>
	<h1>Create an account</h1>
	<form method="post" action="/api/auth/signup" @submit.prevent="signup">
		<label htmlFor="username">Username</label>
		<input name="username" id="username" />
		<br />
		<label htmlFor="password">Password</label>
		<input type="password" name="password" id="password" />
		<br />
		<button>Continue</button>
	</form>
</template>