import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Button from "@/components/ui/Button";

async function getAdminStats() {
  try {
    const [userCount, employerCount, jobCount, applicationCount, revenueData] = await Promise.all([
      prisma.user.count({ where: { role: Role.USER } }),
      prisma.employer.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.revenue.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      userCount,
      employerCount,
      jobCount,
      applicationCount,
      totalRevenue: revenueData._sum.amount || 0,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      userCount: 0,
      employerCount: 0,
      jobCount: 0,
      applicationCount: 0,
      totalRevenue: 0,
    };
  }
}

async function getRecentJobs() {
  try {
    const jobs = await prisma.job.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching recent jobs:", error);
    return [];
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const [stats, recentJobs] = await Promise.all([getAdminStats(), getRecentJobs()]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Tổng quan</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Người dùng</p>
              <p className="text-3xl font-bold text-slate-900">{stats.userCount}</p>
            </div>
            <span className="text-4xl">👥</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Nhà tuyển dụng</p>
              <p className="text-3xl font-bold text-slate-900">{stats.employerCount}</p>
            </div>
            <span className="text-4xl">🏢</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Tin tuyển dụng</p>
              <p className="text-3xl font-bold text-slate-900">{stats.jobCount}</p>
            </div>
            <span className="text-4xl">💼</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Ứng viên</p>
              <p className="text-3xl font-bold text-slate-900">{stats.applicationCount}</p>
            </div>
            <span className="text-4xl">📝</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Doanh thu</p>
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
        </div>
      </div>

      {/* Recent Jobs Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Tin tuyển dụng mới</h2>
          <Link href="/admin/jobs">
            <Button variant="primary" className="text-sm">
              Xem tất cả
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Nhà tuyển dụng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Mức lương
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Ngày đăng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.employer.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(job.createdAt)}
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
                    Chưa có tin tuyển dụng nào.
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
