import React from "react";
import Link from "next/link";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    salary: string;
    location: string;
    shift?: string | null;
    isPremium?: boolean;
    employer?: {
      companyName?: string;
      logoUrl?: string | null;
    } | null;
    area?: {
      name?: string;
    } | null;
  };
}

export default function JobCard({ job }: JobCardProps) {
  const shiftLabels: Record<string, string> = {
    MORNING: "Ca sáng",
    AFTERNOON: "Ca chiều",
    EVENING: "Ca tối",
    FLEXIBLE: "Linh hoạt",
  };

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={`block rounded-lg p-6 hover:shadow-lg transition-all ${
        job.isPremium
          ? "bg-gradient-to-br from-white to-brand-secondary/5 border-2 border-brand-secondary"
          : "bg-white border border-slate-200 hover:border-brand-primary"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-slate-900 flex-1">
          {job.title}
        </h3>
        {job.isPremium && (
          <span className="ml-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
            ⭐ PREMIUM
          </span>
        )}
      </div>
      
      {job.employer?.companyName && (
        <p className="text-slate-600 mb-2 text-sm">{job.employer.companyName}</p>
      )}
      
      <div className="flex flex-wrap gap-3 mb-3 text-sm text-slate-600">
        <span className="flex items-center">
          💰 {job.salary}
        </span>
        {job.area?.name && (
          <span className="flex items-center">
            📍 {job.area.name}
          </span>
        )}
        {job.shift && (
          <span className="flex items-center">
            ⏰ {shiftLabels[job.shift] || job.shift}
          </span>
        )}
      </div>
      
      <div className="text-brand-primary font-medium text-sm mt-4">
        Xem chi tiết →
      </div>
    </Link>
  );
}
