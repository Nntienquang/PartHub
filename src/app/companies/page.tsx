import React from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";

// TODO: Create API endpoint to fetch list of employers
// For now, using placeholder data

const placeholderCompanies = [
  { id: "1", name: "Quán cà phê A", location: "TP Vinh", jobs: 5 },
  { id: "2", name: "Shop quần áo B", location: "Cửa Lò", jobs: 3 },
  { id: "3", name: "Nhà hàng C", location: "TP Vinh", jobs: 8 },
  { id: "4", name: "Cửa hàng tiện lợi D", location: "Diễn Châu", jobs: 2 },
];

export default function CompaniesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Danh sách công ty"
        description="Khám phá các công ty đang tuyển dụng tại Nghệ An"
      />

      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-brand-primary"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {company.name}
              </h3>
              <p className="text-slate-600 mb-2">📍 {company.location}</p>
              <p className="text-slate-500 text-sm">
                {company.jobs} việc làm đang tuyển
              </p>
              <span className="text-brand-primary text-sm font-medium mt-4 inline-block">
                Xem chi tiết →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
