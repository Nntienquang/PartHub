import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Button from "@/components/ui/Button";

async function getEmployerJobs(employerId: string) {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        employerId: employerId,
      },
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
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

async function getEmployerApplications(employerId: string) {
  try {
    // Get all jobs for this employer
    const employerJobs = await prisma.job.findMany({
      where: {
        employerId: employerId,
      },
      select: {
        id: true,
      },
    });

    const jobIds = employerJobs.map((job) => job.id);

    if (jobIds.length === 0) {
      return [];
    }

    // Fetch applications
    const applications = await prisma.application.findMany({
      where: {
        jobId: { in: jobIds },
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

export default async function EmployerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== Role.EMPLOYER && session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const [jobs, applications] = await Promise.all([
    getEmployerJobs(session.user.id),
    getEmployerApplications(session.user.id),
  ]);

  const stats = {
    totalJobs: jobs.length,
    pendingApplications: applications.filter((app) => app.status === "PENDING").length,
    premiumJobs: jobs.filter((job) => job.isPremium).length,
    activeJobs: jobs.filter((job) => job.isActive).length,
  };

  const recentJobs = jobs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Tổng số tin tuyển dụng</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalJobs}</p>
            </div>
            <span className="text-4xl">💼</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Ứng viên chờ duyệt</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingApplications}</p>
            </div>
            <span className="text-4xl">👥</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Số tin premium</p>
              <p className="text-3xl font-bold text-brand-secondary">{stats.premiumJobs}</p>
            </div>
            <span className="text-4xl">⭐</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Số tin đang bật</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
      </div>

      {/* Recent Jobs Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Tin tuyển dụng gần đây</h2>
          <Link href="/employer/jobs">
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
                  Mức lương
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Ca làm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Khu vực
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Ngày đăng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-900">{job.title}</span>
                        {job.isPremium && (
                          <span className="ml-2 px-2 py-1 bg-brand-secondary text-white text-xs font-semibold rounded">
                            Premium
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.shift ? shiftLabels[job.shift] || job.shift : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.area?.name || job.location || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(job.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Chưa có tin tuyển dụng nào.{" "}
                    <Link href="/employer/jobs/create" className="text-brand-primary hover:underline">
                      Đăng tin ngay
                    </Link>
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
