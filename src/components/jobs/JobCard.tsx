import React from "react";
import Link from "next/link";
import Image from "next/image";

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

  // Get job image based on job type or use default
  const getJobImage = () => {
    if (job.employer?.logoUrl) {
      return job.employer.logoUrl;
    }
    // Use Unsplash images based on job title keywords
    const title = job.title.toLowerCase();
    if (title.includes("phục vụ") || title.includes("nhà hàng") || title.includes("cafe")) {
      return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop";
    } else if (title.includes("bán hàng") || title.includes("shop") || title.includes("cửa hàng")) {
      return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop";
    } else if (title.includes("gia sư") || title.includes("dạy")) {
      return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop";
    } else if (title.includes("sự kiện") || title.includes("event")) {
      return "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop";
    }
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
          <div className="absolute inset-0">
            <Image
              src={getJobImage()}
              alt={job.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        {job.isPremium && (
          <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1 z-10">
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
