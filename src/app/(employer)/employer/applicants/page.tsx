import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ApplicationActions from "@/components/employer/ApplicationActions";

async function getEmployerApplications(employerId: string, jobId?: string) {
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

    // Build where clause
    const where: any = {
      jobId: { in: jobIds },
    };

    if (jobId) {
      // Verify job belongs to employer
      if (jobIds.includes(jobId)) {
        where.jobId = jobId;
      } else {
        return [];
      }
    }

    // Fetch applications
    const applications = await prisma.application.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            cvUrl: true,
          },
        },
        job: {
          include: {
            employer: {
              select: {
                id: true,
                companyName: true,
                logoUrl: true,
              },
            },
            area: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

interface ApplicantsPageProps {
  searchParams: {
    jobId?: string;
  };
}

export default async function ApplicantsPage({ searchParams }: ApplicantsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== Role.EMPLOYER && session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const applications = await getEmployerApplications(session.user.id, searchParams.jobId);

  const statusLabels: Record<string, string> = {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    REJECTED: "Đã từ chối",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
  };

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
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Quản lý ứng viên</h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-slate-500 mb-4">Chưa có ứng viên nào ứng tuyển.</p>
          <p className="text-slate-400 text-sm">
            Ứng viên sẽ xuất hiện ở đây sau khi họ ứng tuyển vào các tin tuyển dụng của bạn.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-600">
              Tổng số ứng viên: <span className="font-semibold text-slate-900">{applications.length}</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Việc làm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Ứng viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Ngày ứng tuyển
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
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {app.job?.title || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{app.user?.name || "N/A"}</div>
                      <div className="text-sm text-slate-500">{app.user?.email || ""}</div>
                      {app.user?.phone && (
                        <div className="text-sm text-slate-500">{app.user.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.user?.cvUrl ? (
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
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[app.status]}`}
                      >
                        {statusLabels[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <ApplicationActions application={app} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
