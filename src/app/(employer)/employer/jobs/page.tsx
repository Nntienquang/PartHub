import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import Button from "@/components/ui/Button";
import JobActions from "@/components/employer/JobActions";

async function getEmployerJobs(employerId: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/jobs?jobType=PART_TIME`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Filter jobs by employerId
    return (data.data || []).filter((job: any) => job.employerId === employerId);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export default async function EmployerJobsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== Role.EMPLOYER && session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const jobs = await getEmployerJobs(session.user.id);

  const shiftLabels: Record<string, string> = {
    MORNING: "Ca sáng",
    AFTERNOON: "Ca chiều",
    EVENING: "Ca tối",
    FLEXIBLE: "Linh hoạt",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tin tuyển dụng</h1>
        <Link href="/employer/jobs/create">
          <Button variant="primary">+ Đăng tin mới</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{job.title}</div>
                      <div className="text-sm text-slate-500">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.shift ? shiftLabels[job.shift] || job.shift : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.area?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {job.isPremium ? (
                        <span className="px-2 py-1 bg-brand-secondary text-white text-xs font-semibold rounded">
                          Premium
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <JobActions jobId={job.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
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
