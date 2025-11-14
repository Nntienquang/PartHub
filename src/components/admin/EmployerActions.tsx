"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EmployerActionsProps {
  employerId: string;
}

export default function EmployerActions({ employerId }: EmployerActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBan = async () => {
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
    <div className="flex gap-3">
      <Link
        href={`/admin/companies/${employerId}`}
        className="text-brand-primary hover:underline text-sm font-medium"
      >
        View
      </Link>
      <button
        onClick={handleBan}
        disabled={loading}
        className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Đang xử lý..." : "Ban"}
      </button>
    </div>
  );
}

