import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";
import EmployerSidebar from "@/components/employer/EmployerSidebar";
import EmployerHeader from "@/components/employer/EmployerHeader";

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Check if user is EMPLOYER or ADMIN
  if (session.user.role !== Role.EMPLOYER && session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <EmployerSidebar />
      <div className="flex-1 flex flex-col">
        <EmployerHeader />
        <main className="flex-1 py-6 px-4">{children}</main>
      </div>
    </div>
  );
}
