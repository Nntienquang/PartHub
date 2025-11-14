import React from "react";
import Link from "next/link";
import Image from "next/image";

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

  // Get area image based on area name
  const getAreaImage = () => {
    const name = area.name.toLowerCase();
    if (name.includes("vinh")) {
      return "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop";
    } else if (name.includes("cửa lò") || name.includes("biển")) {
      return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop";
    }
  };

  return (
    <Link
      href={`/jobs?areaId=${area.id}`}
      className="block bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-brand-primary hover:shadow-md transition-all"
    >
      {/* Area Image */}
      <div className="relative h-32 overflow-hidden">
        <Image
          src={getAreaImage()}
          alt={area.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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

