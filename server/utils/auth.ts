// server/utils/auth.ts
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { DatabaseUser, Lucia } from "lucia";

const client = new PrismaClient();

const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        // IMPORTANT!
        attributes: {
            // set to `true` when using HTTPS
            secure: !import.meta.dev
        },

    },
    getUserAttributes: (attributes) => {
        return {
            // attributes has the type of DatabaseUserAttributes
            username: attributes.username
        };
    }
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
}