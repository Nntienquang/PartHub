import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role } from "@prisma/client";
import ProfileForm from "@/components/profile/ProfileForm";
import PageHeader from "@/components/layout/PageHeader";

async function getUserProfile(userId: string) {
  try {
    // For server-side, we'll use Prisma directly instead of API
    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        cvUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            applications: true,
            savedJobs: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/profile");
  }

  if (session.user.role !== Role.USER) {
    redirect("/");
  }

  const user = await getUserProfile(session.user.id);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Không thể tải thông tin người dùng.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Hồ sơ của tôi"
        description="Quản lý thông tin cá nhân và CV"
      />

      <div className="mt-8">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}

