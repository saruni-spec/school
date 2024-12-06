import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions = {
  providers: [
    // Google OAuth provider configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Credentials provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("No user found with this email");
        }
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.fullname,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Callback for sign-in process
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          // Check if user exists in the database
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
            include: { buyer: true, shop: true },
          });

          if (!existingUser) {
            // Create a new user if not found
            const newUser = await prisma.user.create({
              data: {
                email: profile.email,
                fullname: profile.name,
                isAuthenticated: true,
                isLoggedIn: true,
                password: "", // Set a default or generate a random password
              },
            });
            user.id = newUser.id;
            user.isNewUser = true;
            user.needsOnboarding = true;
          } else {
            // Update user information if found
            user.id = existingUser.id;
            user.isNewUser = false;
            user.isBuyer = !!existingUser.buyer;
            user.isShop = !!existingUser.shop;
            user.isAuthenticated = existingUser.isAuthenticated;
            user.needsOnboarding = !existingUser.buyer && !existingUser.shop;
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    // Callback to add custom claims to the JWT token
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.isNewUser = user.isNewUser;
        token.isBuyer = user.isBuyer;
        token.isShop = user.isShop;
        token.isAuthenticated = user.isAuthenticated;
        token.needsOnboarding = user.needsOnboarding;
      }
      return token;
    },
    // Callback to add custom session data
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isNewUser = token.isNewUser;
        session.user.isBuyer = token.isBuyer;
        session.user.isShop = token.isShop;
        session.user.isAuthenticated = token.isAuthenticated;
        session.user.needsOnboarding = token.needsOnboarding;
      }
      return session;
    },
    // Custom redirect logic after sign-in
    async redirect({ url, baseUrl }) {
      // After sign in
      if (url.startsWith("/api/auth/callback")) {
        return `${baseUrl}/api/auth/check-onboarding-status`;
      }
      // Default case: redirect to the original requested URL
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  // Custom pages for authentication
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
