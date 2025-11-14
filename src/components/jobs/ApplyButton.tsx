"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface ApplyButtonProps {
  jobId: string;
}

export default function ApplyButton({ jobId }: ApplyButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApply = async () => {
    if (status === "loading") return;

    // Not logged in
    if (!session) {
      router.push(`/auth/login?callbackUrl=/jobs/${jobId}`);
      return;
    }

    // Not USER role
    if (session.user.role !== "USER") {
      setMessage({
        type: "error",
        text: "Chỉ tài khoản tìm việc mới có thể ứng tuyển.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          type: "success",
          text: "Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ với bạn sớm.",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="primary"
        onClick={handleApply}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Đang xử lý..." : "Ứng tuyển ngay"}
      </Button>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

