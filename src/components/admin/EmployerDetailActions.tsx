"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface EmployerDetailActionsProps {
  employerId: string;
}

export default function EmployerDetailActions({ employerId }: EmployerDetailActionsProps) {
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
        alert("Đã khóa tài khoản thành công");
        router.push("/admin/companies");
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
      <Link href="/admin/companies">
        <Button variant="secondary" className="text-sm">
          Quay lại
        </Button>
      </Link>
      <Button
        variant="primary"
        className="text-sm bg-red-600 hover:bg-red-700"
        onClick={handleBan}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Ban Employer"}
      </Button>
    </div>
  );
}

