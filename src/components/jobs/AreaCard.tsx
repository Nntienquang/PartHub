import React from "react";
import Link from "next/link";

interface AreaCardProps {
  area: {
    id: string;
    name: string;
    _count?: {
      jobs?: number;
    };
  };
}

export default function AreaCard({ area }: AreaCardProps) {
  const jobCount = area._count?.jobs || 0;

  return (
    <Link
      href={`/jobs?areaId=${area.id}`}
      className="block bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-brand-primary hover:shadow-md transition-all"
    >
      {/* Area Image */}
      <div className="relative h-32 bg-gradient-to-br from-sky-50 to-blue-100">
        <img
          src="/images/area-placeholder.svg"
          alt={area.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {area.name}
        </h3>
        {jobCount > 0 && (
          <p className="text-slate-500 text-sm mb-2">
            {jobCount} việc làm
          </p>
        )}
        <p className="text-brand-primary text-sm font-medium mt-2">
          Xem việc →
        </p>
      </div>
    </Link>
  );
}

