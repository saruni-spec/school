import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { DefaultSession, DefaultUser } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { record } from "@/app/types/types";

// Extend the default session with custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      school: record;
      role_type: string;
      permissions: record[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    school: record;
    role: string;
    role_type: string;
    permissions: record[];
  }
}

export const authOptions: NextAuthOptions = {
  // Prisma adapter
  adapter: PrismaAdapter(prisma),

  // Credentials provider
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          // Find user
          const user = await prisma.users.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              school: { select: { name: true, id: true } },
              role: {
                select: {
                  name: true,
                  type: true,
                  permissions: true,
                },
              },
            },
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          // Verify password
          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Return user info
          return {
            id: user.id.toString(),
            school: user.school,
            name: user.name,
            email: user.email,
            role_type: user.role?.type ?? "",
            permissions: user.role?.permissions ?? [],
          };
        } catch (error) {
          throw new Error(`Authorization error: ${error}`);
        }
      },
    }),
  ],

  // Session strategy
  session: {
    strategy: "jwt",
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.school = user.school;
        token.role = user.role;
        token.role_type = user.role_type;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.school = token.school as record;
        session.user.role = token.role as string;
        session.user.role_type = token.role_type as string;
        session.user.permissions = token.permissions as record[];
      }
      return session;
    },
  },

  // Error handling
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Secret from environment
  secret: process.env.NEXTAUTH_SECRET,
};
