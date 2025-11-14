import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ReportActions from "@/components/admin/ReportActions";

async function getAllReports() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
    });
    return reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const reports = await getAllReports();

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Quản lý báo cáo</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Người báo cáo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Việc làm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Nhà tuyển dụng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Ngày báo cáo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.user ? (
                        <>
                          <div className="text-sm font-medium text-slate-900">
                            {report.user.name}
                          </div>
                          <div className="text-sm text-slate-500">{report.user.email}</div>
                        </>
                      ) : (
                        <span className="text-slate-400 text-sm">Ẩn danh</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.job ? (
                        <div className="text-sm font-medium text-slate-900">{report.job.title}</div>
                      ) : (
                        <span className="text-slate-400 text-sm">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {report.job?.employer.companyName || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 max-w-md truncate">
                        {report.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <ReportActions
                        reportId={report.id}
                        jobId={report.jobId}
                        employerId={report.job?.employerId}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Chưa có báo cáo nào.
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
