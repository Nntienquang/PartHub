import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect, notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import UserDetailActions from "@/components/admin/UserDetailActions";

async function getUserDetail(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        applications: {
          include: {
            job: {
              include: {
                employer: {
                  select: {
                    id: true,
                    companyName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
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
    console.error("Error fetching user detail:", error);
    return null;
  }
}

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const user = await getUserDetail(params.id);

  if (!user) {
    notFound();
  }

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    REJECTED: "Đã từ chối",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Chi tiết người dùng</h1>
        <UserDetailActions userId={user.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông tin cá nhân</h2>
          <div className="space-y-3">
            <div>
              <p className="text-slate-500 text-sm mb-1">Tên</p>
              <p className="text-slate-900 font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Email</p>
              <p className="text-slate-900 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Vai trò</p>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                {user.role}
              </span>
            </div>
            {user.phone && (
              <div>
                <p className="text-slate-500 text-sm mb-1">Số điện thoại</p>
                <p className="text-slate-900 font-medium">{user.phone}</p>
              </div>
            )}
            {user.cvUrl && (
              <div>
                <p className="text-slate-500 text-sm mb-1">CV</p>
                <a
                  href={user.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:underline text-sm"
                >
                  Xem CV
                </a>
              </div>
            )}
            <div>
              <p className="text-slate-500 text-sm mb-1">Ngày tạo</p>
              <p className="text-slate-900 font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Thống kê</h2>
          <div className="space-y-4">
            <div>
              <p className="text-slate-500 text-sm mb-1">Tổng đơn ứng tuyển</p>
              <p className="text-2xl font-bold text-slate-900">{user._count.applications}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Việc làm đã lưu</p>
              <p className="text-2xl font-bold text-slate-900">{user._count.savedJobs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Danh sách ứng tuyển</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Việc làm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Công ty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Ngày ứng tuyển
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {user.applications.length > 0 ? (
                user.applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{app.job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {app.job.employer.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status]}`}
                      >
                        {statusLabels[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(app.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Chưa có đơn ứng tuyển nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
