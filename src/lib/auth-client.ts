import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { AuthInstance } from "./auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<AuthInstance>()],
});