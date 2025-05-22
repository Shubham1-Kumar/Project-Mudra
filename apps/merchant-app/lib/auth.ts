import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.MUDRA_MERCHANT_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.MUDRA_MERCHANT_GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user || !user.email || !account?.provider) {
        return false;
      }

      try {
        await db.merchant.upsert({
          where: {
            email: user.email,
          },
          create: {
            email: user.email,
            name: user.name || "",
            auth_type: account.provider === "google" ? "Google" : "Github", // assuming auth_type is an enum or string
          },
          update: {
            name: user.name || "",
            auth_type: account.provider === "google" ? "Google" : "Github",
          },
        });

        return true;
      } catch (err) {
        console.error("Error during upsert:", err);
        return false;
      }
    },
  },
  secret: process.env.MUDRA_MERCHANT_NEXTAUTH_SECRET || "secret",
};
