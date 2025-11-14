import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/hash";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check User table first
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        let userType: "user" | "employer" = "user";
        let role: Role = Role.USER;

        if (!user) {
          // Check Employer table
          const employer = await prisma.employer.findUnique({
            where: { email: credentials.email },
          });

          if (!employer) {
            return null; // User not found
          }

          // Verify password for employer
          const isValid = await verifyPassword(
            credentials.password,
            employer.password
          );

          if (!isValid) {
            return null; // Invalid password
          }

          // Return employer as user object
          return {
            id: employer.id,
            email: employer.email,
            name: employer.companyName,
            role: employer.role,
            userType: "employer",
          };
        }

        // Verify password for user
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null; // Invalid password
        }

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          userType: "user",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userType = (user as any).userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.userType = token.userType as "user" | "employer";
      }
      return session;
    },
    async redirect({ url, baseUrl, token }) {
      // If redirecting after login, check role
      if (url === `${baseUrl}/auth/login` || url === `${baseUrl}/api/auth/signin`) {
        const role = token?.role as string;
        if (role === "ADMIN") {
          return `${baseUrl}/admin`;
        } else if (role === "EMPLOYER") {
          return `${baseUrl}/employer`;
        } else {
          return `${baseUrl}/`;
        }
      }
      
      // Handle other redirects
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

