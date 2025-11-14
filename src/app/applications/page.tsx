import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";
import ApplicationsList from "@/components/applications/ApplicationsList";
import PageHeader from "@/components/layout/PageHeader";

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/applications");
  }

  if (session.user.role !== Role.USER) {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Đơn ứng tuyển của tôi"
        description="Theo dõi trạng thái các đơn ứng tuyển"
      />

      <div className="mt-8">
        <ApplicationsList />
      </div>
    </div>
  );
}

