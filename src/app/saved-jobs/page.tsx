import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@prisma/client";
import PageHeader from "@/components/layout/PageHeader";

export default async function SavedJobsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/saved-jobs");
  }

  if (session.user.role !== Role.USER) {
    redirect("/");
  }

  // TODO: Implement SavedJob API endpoints
  // For now, this is a placeholder page

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Công việc đã lưu"
        description="Danh sách các việc làm bạn đã lưu lại"
      />

      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-slate-600 text-lg mb-4">
            Tính năng đang được phát triển.
          </p>
          <p className="text-slate-500 text-sm">
            API endpoints cho SavedJob sẽ được triển khai trong các prompt tiếp theo.
          </p>
        </div>
      </div>
    </div>
  );
}

