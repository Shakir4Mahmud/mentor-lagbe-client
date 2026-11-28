import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { passwordResetEmail, sendEmail, verificationEmail } from "./email";

export type AuthInstance = ReturnType<typeof createAuthInstance>;

type MongoTopologyLike = {
  isDestroyed?: () => boolean;
  isConnected?: () => boolean;
};

type AuthState = {
  client: MongoClient;
  auth: AuthInstance;
  used: boolean;
};

// Vercel e function instance freeze/unfreeze hoy. Sockets mara jay ar driver
// topology ke "destroyed" kore dey. Tai cached client ke check kore needy
// client baniye nite hobe — na hole proti auth request e 500 ashbe.
const globalForAuth = globalThis as unknown as {
  mentorLagbeAuth?: AuthState;
};

function createAuthInstance(client: MongoClient) {
  const db = client.db();

  const googleConfig =
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined;

  return betterAuth({
    database: mongodbAdapter(db, { client }),

    // Added only when both env vars exist, so a deploy before the keys are set
    // never breaks the rest of the auth endpoints.
    ...(googleConfig ? { socialProviders: { ...googleConfig } } : {}),

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      resetPasswordTokenExpiresIn: 15 * 60,
      revokeSessionsOnPasswordReset: true,
      // Email verification is enforced: sign-in is blocked until the address
      // is confirmed. Unverified users can always resend from /verify-email.
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Reset your GuruLagbe password",
          html: passwordResetEmail(user.name, url),
        });
      },
    },

    emailVerification: {
      sendOnSignUp: true,
      // If an unverified account tries to sign in, a fresh link is sent
      // automatically so the user is never stuck without an email.
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      expiresIn: 15 * 60,
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Verify your GuruLagbe email",
          html: verificationEmail(user.name, url),
        });
      },
    },

    // Built-in rules: sign-in/sign-up 3 per 10s, reset/resend 3 per 60s.
    rateLimit: { enabled: true },

    user: {
      modelName: "users",

      // Every role (student/tutor/admin) can delete their own account from
      // the profile page. Better Auth removes the user + sessions; the hook
      // cleans up everything that belongs to that email in our collections.
      deleteUser: {
        enabled: true,
        afterDelete: async (deletedUser) => {
          const email = deletedUser.email;
          const userId = deletedUser.id;

          if (!email) {
            return;
          }

          try {
            await Promise.all([
              db.collection("tuitions").deleteMany({ tutorEmail: email }),
              db.collection("applications").deleteMany({
                $or: [{ studentEmail: email }, { tutorEmail: email }],
              }),
              db.collection("payments").deleteMany({ userEmail: email }),
              db.collection("account").deleteMany({ userId }),
              db.collection("verification").deleteMany({ userId }),
              db.collection("session").deleteMany({ userId }),
            ]);
          } catch (error) {
            // Deletion already succeeded — never leave the user stuck because
            // of a cleanup failure. Log it for the server logs.
            console.error("Account cleanup failed", error);
          }
        },
      },

      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "student",
        },
        phone: {
          type: "string",
          required: false,
        },
        bio: {
          type: "string",
          required: false,
        },
        plan: {
          type: "string",
          required: false,
          defaultValue: "free",
          input: false,
        },
      },
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user, context) => {
            // sudhu student ba tutor role allow, admin hote dibo na
            let safeRole = "student";
            if (user.role === "tutor") {
              safeRole = "tutor";
            } else {
              // Google profile-e role thake na, ar Better Auth additionalFields
              // default (`student`) hook-er age-i borte dey. Tai `!user.role`
              // check kore kaj korlo na. Sign-up page-e tutor button chapar age
              // short-lived cookie-e choice rakhi — hook eta read kore.
              const isOAuthCallback =
                typeof context?.path === "string" &&
                context.path.startsWith("/callback/");
              const hasTutorRole =
                isOAuthCallback &&
                context?.getCookie?.("ml_google_role") === "tutor";

              if (hasTutorRole) {
                safeRole = "tutor";
              }
            }

            const newUser = {
              ...user,
              role: safeRole,
              plan: "free",
            };

            return { data: newUser };
          },
        },
        update: {
          before: async (userData) => {
            // profile update diye keu role ba plan bodlate parbe na
            const safeData = { ...userData };
            delete safeData.role;
            delete safeData.plan;

            return { data: safeData };
          },
        },
      },
    },
  });
}

function createAuthState(): AuthState {
  const client = new MongoClient(process.env.MONGODB_URI as string, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });

  return {
    client,
    auth: createAuthInstance(client),
    used: false,
  };
}

function clientIsUsable(state: AuthState): boolean {
  const topology = (state.client as unknown as { topology?: MongoTopologyLike })
    .topology;

  // Ekhono connect hoy nai — first request-e driver nije connect korbe.
  if (!topology) return true;

  if (typeof topology.isDestroyed === "function" && topology.isDestroyed()) {
    return false;
  }

  // Ekbar use hoye gese, kintu ekhon connected na — Vercel e socket mara jay.
  if (
    state.used &&
    typeof topology.isConnected === "function" &&
    !topology.isConnected()
  ) {
    return false;
  }

  return true;
}

function closeClient(client: MongoClient) {
  void client.close().catch(() => {});
}

export function getAuth(): AuthInstance {
  const current = globalForAuth.mentorLagbeAuth;

  if (!current || !clientIsUsable(current)) {
    if (current) closeClient(current.client);
    globalForAuth.mentorLagbeAuth = createAuthState();
  }

  const state = globalForAuth.mentorLagbeAuth as AuthState;
  state.used = true;

  return state.auth;
}

// Kono request-e mongo connection error hole porer request fresh client pabe.
export function resetAuth() {
  const state = globalForAuth.mentorLagbeAuth;
  globalForAuth.mentorLagbeAuth = undefined;
  if (state) closeClient(state.client);
}
