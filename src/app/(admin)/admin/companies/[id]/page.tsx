import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect, notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import EmployerDetailActions from "@/components/admin/EmployerDetailActions";

async function getEmployerDetail(employerId: string) {
  try {
    const employer = await prisma.employer.findUnique({
      where: { id: employerId },
      include: {
        jobs: {
          include: {
            area: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                applications: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        revenues: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            jobs: true,
            revenues: true,
          },
        },
      },
    });
    return employer;
  } catch (error) {
    console.error("Error fetching employer detail:", error);
    return null;
  }
}

interface EmployerDetailPageProps {
  params: {
    id: string;
  };
}

export default async function EmployerDetailPage({ params }: EmployerDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const employer = await getEmployerDetail(params.id);

  if (!employer) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const totalRevenue = employer.revenues.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Chi tiết công ty</h1>
        <EmployerDetailActions employerId={employer.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Employer Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông tin công ty</h2>
          <div className="space-y-3">
            <div>
              <p className="text-slate-500 text-sm mb-1">Tên công ty</p>
              <p className="text-slate-900 font-medium">{employer.companyName}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Email</p>
              <p className="text-slate-900 font-medium">{employer.email}</p>
            </div>
            {employer.phone && (
              <div>
                <p className="text-slate-500 text-sm mb-1">Số điện thoại</p>
                <p className="text-slate-900 font-medium">{employer.phone}</p>
              </div>
            )}
            {employer.address && (
              <div>
                <p className="text-slate-500 text-sm mb-1">Địa chỉ</p>
                <p className="text-slate-900 font-medium">{employer.address}</p>
              </div>
            )}
            {employer.description && (
              <div>
                <p className="text-slate-500 text-sm mb-1">Mô tả</p>
                <p className="text-slate-900 font-medium">{employer.description}</p>
              </div>
            )}
            <div>
              <p className="text-slate-500 text-sm mb-1">Ngày tạo</p>
              <p className="text-slate-900 font-medium">{formatDate(employer.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Thống kê</h2>
          <div className="space-y-4">
            <div>
              <p className="text-slate-500 text-sm mb-1">Tổng việc làm</p>
              <p className="text-2xl font-bold text-slate-900">{employer._count.jobs}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Giao dịch</p>
              <p className="text-2xl font-bold text-slate-900">{employer._count.revenues}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Danh sách việc làm</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Mức lương
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Khu vực
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Ứng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {employer.jobs.length > 0 ? (
                employer.jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.area?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job._count.applications}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {job.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Chưa có việc làm nào.
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

