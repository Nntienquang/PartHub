import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth(requiredRole?: Role) {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (requiredRole && session.user.role !== requiredRole) {
    throw new Error("Forbidden");
  }

  return session.user;
}


