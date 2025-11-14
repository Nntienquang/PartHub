"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JobAdminActionsProps {
  jobId: string;
  isActive: boolean;
}

export default function JobAdminActions({ jobId, isActive }: JobAdminActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/toggle-active`, {
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

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này?")) {
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

  return (
    <div className="flex gap-3">
      <Link
        href={`/admin/jobs/${jobId}`}
        className="text-brand-primary hover:underline text-sm font-medium"
      >
        View
      </Link>
      <button
        onClick={handleToggleActive}
        disabled={loading}
        className={`text-sm font-medium disabled:opacity-50 ${
          isActive ? "text-yellow-600 hover:underline" : "text-green-600 hover:underline"
        }`}
      >
        {loading ? "..." : isActive ? "Deactivate" : "Activate"}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
      >
        {loading ? "..." : "Delete"}
      </button>
    </div>
  );
}

