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
      className={`block rounded-lg overflow-hidden hover:shadow-lg transition-all ${
        job.isPremium
          ? "bg-gradient-to-br from-white to-brand-secondary/5 border-2 border-brand-secondary"
          : "bg-white border border-slate-200 hover:border-brand-primary"
      }`}
    >
      {/* Job Image/Logo */}
      <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {job.employer?.logoUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <img
              src={job.employer.logoUrl}
              alt={job.employer.companyName || "Company logo"}
              className="max-w-full max-h-full object-contain p-4"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/images/job-placeholder.svg"
              alt="Job placeholder"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        )}
        {job.isPremium && (
          <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
            ⭐ PREMIUM
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
            {job.title}
          </h3>
          {job.employer?.companyName && (
            <p className="text-slate-600 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">🏢</span>
              {job.employer.companyName}
            </p>
          )}
        </div>
      
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
