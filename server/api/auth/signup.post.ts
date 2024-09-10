// server/api/auth/signup.post.ts
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import db from "~/server/utils/prisma";

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

	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
	const userId = generateIdFromEntropySize(10); // 16 characters long

	const existingUser = await prisma.user.findFirst({
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

	await db.user.create({
		data: {
			id: userId,
			username: username,
			password_hash: passwordHash,
			email: "test"
		}
	})

	const session = await lucia.createSession(userId, {});
	appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
});