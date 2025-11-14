"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

interface Area {
  id: string;
  name: string;
}

interface JobFiltersProps {
  areas: Area[];
  searchParams: {
    keyword?: string;
    areaId?: string;
    shift?: string;
    salaryRange?: string;
  };
}

export default function JobFilters({ areas, searchParams }: JobFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.keyword || "");
  const [areaId, setAreaId] = useState(searchParams.areaId || "");
  const [shift, setShift] = useState(searchParams.shift || "");
  const [salaryRange, setSalaryRange] = useState(searchParams.salaryRange || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (keyword) newParams.set("keyword", keyword);
    if (areaId) newParams.set("areaId", areaId);
    if (shift) newParams.set("shift", shift);
    if (salaryRange) newParams.set("salaryRange", salaryRange);
    router.push(`/jobs?${newParams.toString()}`);
  };

  const handleReset = () => {
    setKeyword("");
    setAreaId("");
    setShift("");
    setSalaryRange("");
    router.push("/jobs");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Từ khóa
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="VD: phục vụ, bán hàng..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Khu vực
            </label>
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            >
              <option value="">Tất cả khu vực</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ca làm
            </label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            >
              <option value="">Tất cả ca làm</option>
              <option value="MORNING">Ca sáng</option>
              <option value="AFTERNOON">Ca chiều</option>
              <option value="EVENING">Ca tối</option>
              <option value="FLEXIBLE">Linh hoạt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mức lương
            </label>
            <select
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            >
              <option value="">Tất cả mức lương</option>
              <option value="<20">&lt;20k/h</option>
              <option value="20-25">20k-25k/h</option>
              <option value="25-30">25k-30k/h</option>
              <option value=">30">&gt;30k/h</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary">
            Áp dụng
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
          >
            Xóa bộ lọc
          </Button>
        </div>
      </form>
    </div>
  );
}
