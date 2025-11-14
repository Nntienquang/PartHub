"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import LogoUploader from "@/components/upload/LogoUploader";

interface Employer {
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  description: string | null;
}

export default function EmployerCompanyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    address: "",
    logoUrl: "",
    description: "",
  });

  useEffect(() => {
    fetch("/api/employer")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const employer = data.data;
          setFormData({
            companyName: employer.companyName || "",
            phone: employer.phone || "",
            address: employer.address || "",
            logoUrl: employer.logoUrl || "",
            description: employer.description || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching employer:", error);
        setMessage({
          type: "error",
          text: "Không thể tải thông tin công ty",
        });
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/employer", {
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
          text: "Cập nhật thông tin công ty thành công!",
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

  if (fetching) {
    return (
      <div>
        <div className="text-center py-12">
          <p className="text-slate-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Thông tin công ty</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tên công ty <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Logo Upload */}
        <LogoUploader
          value={formData.logoUrl}
          onChange={(url) => setFormData({ ...formData, logoUrl: url })}
          employerId={session?.user?.id || ""}
        />

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

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Địa chỉ
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="VD: 123 Đường ABC, TP Vinh, Nghệ An"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mô tả công ty
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            placeholder="Mô tả về công ty, lĩnh vực hoạt động, văn hóa công ty..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

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
            {loading ? "Đang lưu..." : "Cập nhật thông tin"}
          </Button>
        </div>
      </form>
    </div>
  );
}
