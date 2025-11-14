"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JobActionsProps {
  jobId: string;
}

export default function JobActions({ jobId }: JobActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        alert(data.error || "Đã xảy ra lỗi khi xóa tin tuyển dụng");
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
        href={`/employer/jobs/${jobId}/edit`}
        className="text-brand-primary hover:underline text-sm font-medium"
      >
        Edit
      </Link>
      <Link
        href={`/employer/applicants?jobId=${jobId}`}
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        View applicants
      </Link>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Đang xóa..." : "Delete"}
      </button>
    </div>
  );
}

