// server/api/auth/signup.post.ts
import { hash } from "@node-rs/argon2";
import crypto from "crypto"; // To use SHA-1 for hashing
import { db } from "~/server/utils/prisma";

export default eventHandler(async (event) => {
	const formData = await readFormData(event);
	const username = formData.get("username");
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-zA-Z0-9_-]+$/.test(username)
	) {
		throw createError({
			statusMessage: "Invalid username",
			statusCode: 400
		});
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 8 || password.length > 255) {
		throw createError({
			statusMessage: "Invalid password",
			statusCode: 400
		});
	}

	const email = formData.get("email");
	const isValidEmail = typeof email === "string" && email.length <= 255 && /^.+@.+\..+$/.test(email);

	if (!isValidEmail) {
		throw createError({
			statusMessage: "Invalid email",
			statusCode: 400
		});
	}

	const existingEmail = await db.user.findFirst({
		where: {
			email: {
				contains: email,
			},
		},
	});
	if (existingEmail) {
		throw createError({
			statusMessage: "Email already in use",
			statusCode: 400
		});
	}

	const existingUser = await db.user.findFirst({
		where: {
			username: {
				contains: username,
			},
		},
	});
	if (existingUser) {
		throw createError({
			statusMessage: "Username already in use",
			statusCode: 400
		});
	}

	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});


	// Check if the password has been compromised
	const isCompromised = await checkPasswordCompromised(password);
	if (isCompromised) {
		throw createError({
			statusMessage: "Password has been compromised in a data breach. Please choose another one.",
			statusCode: 400
		});
	}

	const user = await db.user.create({
		data: {
			username: username,
			password_hash: passwordHash,
			email: email
		}
	})

	const session = await lucia.createSession(user.id, {});
	appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
});

async function checkPasswordCompromised(password: string): Promise<boolean> {
	// Hash the password using SHA-1
	const sha1Hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();

	// Get the first 5 characters of the hashed password
	const prefix = sha1Hash.substring(0, 5);
	const suffix = sha1Hash.substring(5);

	// Call the Have I Been Pwned API
	const response = await $fetch<string>(`https://api.pwnedpasswords.com/range/${prefix}`);

	// Check if the suffix is in the list of compromised passwords
	const matches = response.split("\n").map(line => line.split(":")[0]);
	return matches.includes(suffix);
}