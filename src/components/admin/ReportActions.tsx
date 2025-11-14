"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ReportActionsProps {
  reportId: string;
  jobId: string | null;
  employerId: string | undefined;
}

export default function ReportActions({
  reportId,
  jobId,
  employerId,
}: ReportActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeleteReport = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.refresh();
      } else {
        alert(data.error || "Đã xảy ra lỗi");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!jobId) return;
    if (!confirm("Bạn có chắc chắn muốn xóa việc làm này?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.refresh();
      } else {
        alert(data.error || "Đã xảy ra lỗi");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleBanEmployer = async () => {
    if (!employerId) return;
    if (!confirm("Bạn có chắc chắn muốn khóa tài khoản nhà tuyển dụng này?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/employers/${employerId}/ban`, {
        method: "PUT",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.refresh();
      } else {
        alert(data.error || "Đã xảy ra lỗi");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleDeleteReport}
        disabled={loading}
        className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
      >
        {loading ? "..." : "Xóa báo cáo"}
      </button>
      {jobId && (
        <button
          onClick={handleDeleteJob}
          disabled={loading}
          className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
        >
          {loading ? "..." : "Xóa việc làm"}
        </button>
      )}
      {employerId && (
        <button
          onClick={handleBanEmployer}
          disabled={loading}
          className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
        >
          {loading ? "..." : "Ban Employer"}
        </button>
      )}
    </div>
  );
}

