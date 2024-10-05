# Nuxt-Auth-Lucia

This repo is based on [Pilcrow](https://github.com/pilcrowOnPaper/astro-email-password-webauthn) example but with Nuxt and Prisma. (WIP)

The goal is to implement the following:

- Password checks with HaveIBeenPwned ✅
- Frontend password strength check with zxcvbn
- Sign in with passkeys
- Email verification ✅
- Email verification rate limit ✅
- 2FA with TOTP
- 2FA recovery codes
- 2FA with passkeys and security keys
- Password reset without 2FA 🚧
- Password reset with 2FA
- Password reset rate limit

## Initialize project

```
pnpm i
npx prisma migrate dev --name init
npm run dev
```

### Nuxt 4?

I'm waiting for the mighty release to drop :D

### Password reset without 2FA

TODO: Rate-limit
TODO: Lucia cannot provide a session with custom lifetime session. Based on the copenhagen book, the session for a password reset should be about an hour.

