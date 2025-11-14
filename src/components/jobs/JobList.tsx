import React from "react";
import Link from "next/link";
import JobCard from "./JobCard";
import Button from "@/components/ui/Button";

interface JobListProps {
  searchParams: {
    keyword?: string;
    areaId?: string;
    shift?: string;
    salaryRange?: string;
    page?: string;
  };
}

async function getJobs(searchParams: JobListProps["searchParams"]) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    params.set("jobType", "PART_TIME");
    if (searchParams.keyword) params.set("keyword", searchParams.keyword);
    if (searchParams.areaId) params.set("areaId", searchParams.areaId);
    if (searchParams.shift) params.set("shift", searchParams.shift);
    if (searchParams.salaryRange) params.set("salaryRange", searchParams.salaryRange);
    
    const page = parseInt(searchParams.page || "1");
    const limit = 12;
    const offset = (page - 1) * limit;
    params.set("limit", limit.toString());
    params.set("offset", offset.toString());

    const res = await fetch(`${baseUrl}/api/jobs?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return { jobs: [], pagination: null };
    const data = await res.json();
    return {
      jobs: data.data || [],
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], pagination: null };
  }
}

export default async function JobList({ searchParams }: JobListProps) {
  const { jobs, pagination } = await getJobs(searchParams);
  const currentPage = parseInt(searchParams.page || "1");

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-slate-600 text-lg mb-4">
          Chưa có việc phù hợp, hãy thử từ khóa khác.
        </p>
        <p className="text-slate-500 text-sm">
          Hoặc thử điều chỉnh bộ lọc để tìm thêm nhiều cơ hội việc làm.
        </p>
      </div>
    );
  }

  const buildPaginationUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams.keyword) params.set("keyword", searchParams.keyword);
    if (searchParams.areaId) params.set("areaId", searchParams.areaId);
    if (searchParams.shift) params.set("shift", searchParams.shift);
    if (searchParams.salaryRange) params.set("salaryRange", searchParams.salaryRange);
    params.set("page", page.toString());
    return `/jobs?${params.toString()}`;
  };

  return (
    <div>
      <div className="mb-4 text-slate-600">
        Tìm thấy <span className="font-semibold text-slate-900">{pagination?.total || jobs.length}</span> việc làm
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {jobs.map((job: any) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {currentPage > 1 && (
            <Link href={buildPaginationUrl(currentPage - 1)}>
              <Button variant="secondary">← Trước</Button>
            </Link>
          )}
          <span className="text-slate-600">
            Trang {currentPage} / {Math.ceil(pagination.total / pagination.limit)}
          </span>
          {pagination.hasMore && (
            <Link href={buildPaginationUrl(currentPage + 1)}>
              <Button variant="secondary">Sau →</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
