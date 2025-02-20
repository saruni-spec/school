import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { DefaultSession, DefaultUser } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { MyRecord } from "@/app/types/types";
import { privilege_category, role_type } from "@prisma/client";

// Extend the default session with custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      id_code: string | undefined;
      role: role_type;
      school: MyRecord;
      role_type: privilege_category;
      permissions: MyRecord[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    id_code: string | undefined;
    school: MyRecord | undefined;
    role: role_type | undefined;
    role_type: privilege_category | undefined;
    permissions: MyRecord[] | undefined;
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
        id_code: { label: "id_code", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.id_code || !credentials?.password) {
          throw new Error("Missing id_code or password");
        }

        try {
          // Find user
          const user = await prisma.users.findUnique({
            where: { id_code: credentials.id_code },
            select: {
              id: true,
              id_code: true,
              name: true,
              email: true,
              password: true,
              school: { select: { name: true, id: true } },
              role: {
                select: {
                  category: true,
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
            id: user.id,
            id_code: user.id_code ?? undefined,
            school: user.school ?? undefined,
            name: user.name ?? undefined,
            email: user.email,
            role: user.role?.type,
            role_type: user.role?.category ?? undefined,
            permissions: user.role?.permissions,
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
    maxAge: 30 * 24 * 60 * 60,
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.school = user.school;
        token.id_code = user.id_code;
        token.role = user.role;
        token.role_type = user.role_type;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.id_code = token.id_code as string;
        session.user.email = token.email as string;
        session.user.school = token.school as MyRecord;
        session.user.role = token.role as role_type;
        session.user.role_type = token.role_type as privilege_category;
        session.user.permissions = token.permissions as MyRecord[];
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
