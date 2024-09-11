# Nuxt-Auth-Lucia

This repo is based on [Pilcrow](https://github.com/pilcrowOnPaper/astro-email-password-webauthn) example but with Nuxt and Prisma. (WIP)

The goal is to implement the following:

- Password checks with HaveIBeenPwned ✅
- Sign in with passkeys
- Email verification
- 2FA with TOTP
- 2FA recovery codes
- 2FA with passkeys and security keys
- Password reset with 2FA
- Login throttling and rate limiting

## Initialize project

```
pnpm i
npx prisma migrate dev --name init
npm run dev
```

### Nuxt 4?

I'm waiting for the mighty release to drop :D