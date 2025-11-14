"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Application {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface ApplicationAdminActionsProps {
  application: Application;
}

export default function ApplicationAdminActions({
  application,
}: ApplicationAdminActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "APPROVED" }),
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

  const handleReject = async () => {
    if (!confirm("Bạn có chắc chắn muốn từ chối ứng viên này?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
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

  if (application.status === "APPROVED") {
    return (
      <span className="text-green-600 text-sm font-medium">Đã duyệt</span>
    );
  }

  if (application.status === "REJECTED") {
    return (
      <span className="text-red-600 text-sm font-medium">Đã từ chối</span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={loading}
        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "..." : "Duyệt"}
      </button>
      <button
        onClick={handleReject}
        disabled={loading}
        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "..." : "Từ chối"}
      </button>
    </div>
  );
}

