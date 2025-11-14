import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import JobDetailAdminActions from "@/components/admin/JobDetailAdminActions";
import ApplicationAdminActions from "@/components/admin/ApplicationAdminActions";

async function getJobDetail(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
          },
        },
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                cvUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return job;
  } catch (error) {
    console.error("Error fetching job detail:", error);
    return null;
  }
}

interface JobDetailPageProps {
  params: {
    id: string;
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const job = await getJobDetail(params.id);

  if (!job) {
    notFound();
  }

  const shiftLabels: Record<string, string> = {
    MORNING: "Ca sáng",
    AFTERNOON: "Ca chiều",
    EVENING: "Ca tối",
    FLEXIBLE: "Linh hoạt",
  };

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
        <h1 className="text-2xl font-bold text-slate-900">Chi tiết tin tuyển dụng</h1>
        <JobDetailAdminActions jobId={job.id} isActive={job.isActive} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Job Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông tin công việc</h2>
          <div className="space-y-3">
            <div>
              <p className="text-slate-500 text-sm mb-1">Tiêu đề</p>
              <p className="text-slate-900 font-medium">{job.title}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Mô tả</p>
              <p className="text-slate-900 whitespace-pre-wrap">{job.description}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Mức lương</p>
              <p className="text-slate-900 font-medium">{job.salary}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Ca làm</p>
              <p className="text-slate-900 font-medium">
                {job.shift ? shiftLabels[job.shift] || job.shift : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Địa điểm</p>
              <p className="text-slate-900 font-medium">{job.location}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Khu vực</p>
              <p className="text-slate-900 font-medium">{job.area?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Premium</p>
              <p className="text-slate-900 font-medium">
                {job.isPremium ? "Có" : "Không"}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Ngày đăng</p>
              <p className="text-slate-900 font-medium">{formatDate(job.createdAt)}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-md font-semibold text-slate-900 mb-3">Nhà tuyển dụng</h3>
            <div className="space-y-2">
              <p className="text-slate-900">
                <span className="font-medium">Công ty:</span> {job.employer.companyName}
              </p>
              <p className="text-slate-900">
                <span className="font-medium">Email:</span> {job.employer.email}
              </p>
              {job.employer.phone && (
                <p className="text-slate-900">
                  <span className="font-medium">Điện thoại:</span> {job.employer.phone}
                </p>
              )}
              {job.employer.address && (
                <p className="text-slate-900">
                  <span className="font-medium">Địa chỉ:</span> {job.employer.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold text-slate-900 mb-4">Hành động</h3>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Trạng thái:{" "}
              {job.isActive ? (
                <span className="text-green-600 font-medium">Active</span>
              ) : (
                <span className="text-yellow-600 font-medium">Pending</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Ứng viên ({job.applications.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Ứng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  CV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {job.applications.length > 0 ? (
                job.applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{app.user.name}</div>
                      {app.user.phone && (
                        <div className="text-sm text-slate-500">{app.user.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {app.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.user.cvUrl ? (
                        <a
                          href={app.user.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-primary hover:underline text-sm"
                        >
                          Xem CV
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">Chưa có CV</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status]}`}
                      >
                        {statusLabels[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <ApplicationAdminActions application={app} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Chưa có ứng viên nào ứng tuyển.
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

