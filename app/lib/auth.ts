import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { sendEmail } from "@/app/lib/actions";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.POSTGRES_URL as string }),

  // Add profile_code column to user table
  user: {
    additionalFields: {
      profile_code: {
        type: "string",
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail(user.email, url);
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  plugins: [nextCookies()],
});
