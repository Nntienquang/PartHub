import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import JobCard from "@/components/jobs/JobCard";
import PageHeader from "@/components/layout/PageHeader";

async function getCompanyJobs(employerId: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    // Note: API doesn't support employerId filter yet, so we'll fetch all and filter client-side
    // Or create a new endpoint. For now, return empty array
    const res = await fetch(`${baseUrl}/api/jobs?jobType=PART_TIME`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Filter by employerId if we had that data
    return data.data || [];
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    return [];
  }
}

interface CompanyDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  // TODO: Create API endpoint to fetch employer details
  // For now, using placeholder data
  const companyData: Record<string, any> = {
    "1": {
      name: "Quán cà phê A",
      location: "TP Vinh, Nghệ An",
      description: "Quán cà phê hiện đại, thân thiện, tìm kiếm nhân viên phục vụ part-time.",
      jobs: await getCompanyJobs(params.id),
    },
    "2": {
      name: "Shop quần áo B",
      location: "Cửa Lò, Nghệ An",
      description: "Cửa hàng thời trang trẻ trung, cần nhân viên bán hàng part-time.",
      jobs: [],
    },
  };

  const company = companyData[params.id];

  if (!company) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title={company.name} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Giới thiệu công ty
            </h2>
            <p className="text-slate-600 mb-4">📍 {company.location}</p>
            <p className="text-slate-700 whitespace-pre-wrap">{company.description}</p>
          </div>

          {/* Company Jobs */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Việc làm đang tuyển ({company.jobs.length})
            </h2>
            {company.jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.jobs.map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-slate-600">Chưa có việc làm nào.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Thông tin công ty
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-slate-500 text-sm">Địa chỉ</p>
                <p className="text-slate-900 font-medium">{company.location}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Việc làm đang tuyển</p>
                <p className="text-slate-900 font-medium">{company.jobs.length} vị trí</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
