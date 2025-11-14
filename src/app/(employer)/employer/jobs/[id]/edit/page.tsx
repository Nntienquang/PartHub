"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface Area {
  id: string;
  name: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  salary: string;
  jobType: string;
  shift: string | null;
  areaId: string | null;
  location: string;
  isPremium: boolean;
  premiumType: string;
}

interface EditJobPageProps {
  params: {
    id: string;
  };
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    jobType: "PART_TIME",
    shift: "FLEXIBLE",
    areaId: "",
    location: "",
    isPremium: false,
    premiumType: "NONE",
  });

  useEffect(() => {
    // Fetch job detail and areas
    Promise.all([
      fetch(`/api/jobs/${params.id}`).then((res) => res.json()),
      fetch("/api/areas").then((res) => res.json()),
    ])
      .then(([jobData, areasData]) => {
        if (jobData.success && jobData.data) {
          const job = jobData.data;
          setFormData({
            title: job.title || "",
            description: job.description || "",
            salary: job.salary || "",
            jobType: job.jobType || "PART_TIME",
            shift: job.shift || "FLEXIBLE",
            areaId: job.areaId || "",
            location: job.location || "",
            isPremium: job.isPremium || false,
            premiumType: job.premiumType || "NONE",
          });
        }
        if (areasData.success) {
          setAreas(areasData.data || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMessage({
          type: "error",
          text: "Không thể tải thông tin tin tuyển dụng",
        });
      })
      .finally(() => {
        setFetching(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validation
    if (!formData.title || !formData.description || !formData.salary || !formData.location) {
      setMessage({
        type: "error",
        text: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/jobs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          areaId: formData.areaId || null,
          premiumType: formData.isPremium ? formData.premiumType : "NONE",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          type: "success",
          text: "Cập nhật tin tuyển dụng thành công!",
        });
        setTimeout(() => {
          router.push("/employer/jobs");
        }, 1500);
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
      <div className="max-w-4xl">
        <div className="text-center py-12">
          <p className="text-slate-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link
          href="/employer/jobs"
          className="text-brand-primary hover:underline text-sm mb-4 inline-block"
        >
          ← Quay lại danh sách
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Chỉnh sửa tin tuyển dụng</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="VD: Nhân viên phục vụ part-time"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mô tả công việc <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={6}
            placeholder="Mô tả chi tiết về công việc, yêu cầu, quyền lợi..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mức lương <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              required
              placeholder="VD: 25k/h, 150k/ca"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Địa điểm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              placeholder="VD: TP Vinh, Nghệ An"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shift */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ca làm
            </label>
            <select
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            >
              <option value="FLEXIBLE">Linh hoạt</option>
              <option value="MORNING">Ca sáng</option>
              <option value="AFTERNOON">Ca chiều</option>
              <option value="EVENING">Ca tối</option>
            </select>
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Khu vực
            </label>
            <select
              value={formData.areaId}
              onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            >
              <option value="">Chọn khu vực</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Premium */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isPremium"
              checked={formData.isPremium}
              onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
              className="w-4 h-4 text-brand-primary border-slate-300 rounded focus:ring-brand-primary"
            />
            <label htmlFor="isPremium" className="ml-2 text-sm font-medium text-slate-700">
              Đăng tin Premium (tin nổi bật)
            </label>
          </div>

          {formData.isPremium && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Loại gói Premium
              </label>
              <select
                value={formData.premiumType}
                onChange={(e) => setFormData({ ...formData, premiumType: e.target.value })}
                className="w-full md:w-48 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
              >
                <option value="BASIC">BASIC</option>
                <option value="PRO">PRO</option>
              </select>
            </div>
          )}
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

        {/* Submit Buttons */}
        <div className="flex gap-3 justify-end">
          <Link href="/employer/jobs">
            <Button type="button" variant="secondary">
              Hủy
            </Button>
          </Link>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật tin tuyển dụng"}
          </Button>
        </div>
      </form>
    </div>
  );
}
