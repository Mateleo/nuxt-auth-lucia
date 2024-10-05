// server/api/login.post.ts
import { hash, verify } from "@node-rs/argon2";
import { db } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
    const formData = await readFormData(event);
    const session = event.context.session

    console.log(formData)

    const existingUser = await db.user.findUnique({
        where: {
            id:session?.userId
        }
    });

    if (!existingUser) {
        throw createError({
            statusMessage: "User not found",
            statusCode: 400
        });
    }


    const password = formData.get("password");
    console.log(password)
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

    await db.user.update({
        where:{
            id:existingUser.id
        },
        data:{
            password_hash:passwordHash,
            verified:true,
        }
    })
    await db.passwordReset.deleteMany({
        where:{
            userId:existingUser.id
        }
    })
    await lucia.invalidateUserSessions(existingUser.id)
});