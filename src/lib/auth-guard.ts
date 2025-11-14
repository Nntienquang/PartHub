import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== Role.USER) {
    throw new Error("Forbidden: User access required");
  }

  return session.user;
}

export async function requireEmployer() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== Role.EMPLOYER && session.user.role !== Role.ADMIN) {
    throw new Error("Forbidden: Employer access required");
  }

  return session.user;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== Role.ADMIN) {
    throw new Error("Forbidden: Admin access required");
  }

  return session.user;
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

