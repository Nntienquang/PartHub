"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface UserDetailActionsProps {
  userId: string;
}

export default function UserDetailActions({ userId }: UserDetailActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBan = async () => {
    if (!confirm("Bạn có chắc chắn muốn khóa tài khoản người dùng này?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PUT",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Đã khóa tài khoản thành công");
        router.push("/admin/users");
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
      <Link href="/admin/users">
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
        {loading ? "Đang xử lý..." : "Ban User"}
      </Button>
    </div>
  );
}

