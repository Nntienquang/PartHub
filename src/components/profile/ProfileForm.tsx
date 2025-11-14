"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import AvatarUploader from "@/components/upload/AvatarUploader";
import CVUploader from "@/components/upload/CVUploader";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  cvUrl: string | null;
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user: initialUser }: ProfileFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: initialUser.name || "",
    phone: initialUser.phone || "",
    avatar: initialUser.avatar || "",
    cvUrl: initialUser.cvUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          type: "success",
          text: "Cập nhật thông tin thành công!",
        });
        router.refresh();
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
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <AvatarUploader
          value={formData.avatar}
          onChange={(url) => setFormData({ ...formData, avatar: url })}
          userId={session?.user?.id || initialUser.id}
        />

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Họ tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={initialUser.email}
            disabled
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
          />
          <p className="text-slate-500 text-sm mt-1">Email không thể thay đổi</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0123456789"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* CV Upload */}
        <CVUploader
          value={formData.cvUrl}
          onChange={(url) => setFormData({ ...formData, cvUrl: url })}
          userId={session?.user?.id || initialUser.id}
        />

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
