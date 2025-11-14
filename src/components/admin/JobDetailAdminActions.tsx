"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface JobDetailAdminActionsProps {
  jobId: string;
  isActive: boolean;
}

export default function JobDetailAdminActions({
  jobId,
  isActive,
}: JobDetailAdminActionsProps) {
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
        router.push("/admin/jobs");
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
      <Link href="/admin/jobs">
        <Button variant="secondary" className="text-sm">
          Quay lại
        </Button>
      </Link>
      <Button
        variant="primary"
        className={`text-sm ${isActive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}`}
        onClick={handleToggleActive}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : isActive ? "Vô hiệu hóa" : "Kích hoạt"}
      </Button>
      <Button
        variant="primary"
        className="text-sm bg-red-600 hover:bg-red-700"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Xóa"}
      </Button>
    </div>
  );
}

