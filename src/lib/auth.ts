import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Vercel e function instance reuse hoy, tai client ke global cache kori.
// family: 4 -> Vercel theke Atlas er IPv6 address e connect fail korle IPv4 force kore.
const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = new MongoClient(
    process.env.MONGODB_URI as string,
    {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    }
  );
}

const client = globalForMongo.mongoClient;
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  user: {
    modelName: "users",
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
        before: async (user) => {
          // sudhu student ba tutor role allow, admin hote dibo na
          let safeRole = "student";
          if (user.role === "tutor") {
            safeRole = "tutor";
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