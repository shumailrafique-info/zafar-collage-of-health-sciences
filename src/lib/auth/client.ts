import { customSessionClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./server";

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        inferAdditionalFields<typeof auth>(),
        customSessionClient<typeof auth>(),
    ],
    fetchOptions: {
        credentials: "include",
    }
});