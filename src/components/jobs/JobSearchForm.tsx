"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface Area {
  id: string;
  name: string;
}

interface JobSearchFormProps {
  areas: Area[];
}

export default function JobSearchForm({ areas }: JobSearchFormProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [areaId, setAreaId] = useState("");
  const [shift, setShift] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (areaId) params.set("areaId", areaId);
    if (shift) params.set("shift", shift);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-4 md:p-6 shadow-xl"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm việc làm (VD: phục vụ quán cà phê)"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <select
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            className="w-full md:w-48 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
          >
            <option value="">Tất cả khu vực</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            className="w-full md:w-48 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
          >
            <option value="">Tất cả ca làm</option>
            <option value="MORNING">Ca sáng</option>
            <option value="AFTERNOON">Ca chiều</option>
            <option value="EVENING">Ca tối</option>
            <option value="FLEXIBLE">Linh hoạt</option>
          </select>
          <Button
            type="submit"
            variant="primary"
            className="px-6 md:px-8 whitespace-nowrap"
          >
            Tìm việc ngay
          </Button>
        </div>
      </form>
    </div>
  );
}

