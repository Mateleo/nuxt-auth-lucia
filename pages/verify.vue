<!--pages/verify-email.vue-->
<script lang="ts" setup>

const user = useUser()

async function verifyEmail(e: Event) {
	await $fetch("/api/auth/verify", {
		method: "POST",
		body: new FormData(e.target as HTMLFormElement)
	});
	// await navigateTo("/dashboard");
}

async function resendCode() {
	await $fetch("/api/auth/resend-code", {
		method: "POST"
	});
}
</script>

<template>
	<h1>Verify your email address</h1>
	<p>We sent an 8-digit code to {{ user?.email }}.</p>
	<form id="form-verify" @submit.prevent="verifyEmail">
		<label for="code">Code</label>
		<input id="code" name="code" required />
		<button>Verify</button>
		<p id="form-verify-message"></p>
	</form>
	<button id="button-resend" @click="resendCode">Resend code</button>
	<p id="resend-message"></p>
	<a href="/settings">Change your email</a>
</template>
