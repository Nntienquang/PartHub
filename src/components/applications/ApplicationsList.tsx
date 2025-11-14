"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Application {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  job: {
    id: string;
    title: string;
    employer?: {
      companyName?: string;
    } | null;
  };
}

export default function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (data.success) {
        setApplications(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-slate-600">Đang tải...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-slate-600 text-lg mb-4">
          Bạn chưa có đơn ứng tuyển nào.
        </p>
        <Link href="/jobs">
          <span className="text-brand-primary hover:underline font-medium">
            Tìm việc ngay →
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                Ngày ứng tuyển
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/jobs/${app.job.id}`}
                    className="text-brand-primary hover:underline font-medium"
                  >
                    {app.job.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                  {app.job.employer?.companyName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                  {formatDate(app.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[app.status]}`}
                  >
                    {statusLabels[app.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

