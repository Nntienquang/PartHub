import React from "react";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import JobList from "@/components/jobs/JobList";
import JobFilters from "@/components/jobs/JobFilters";
import PageHeader from "@/components/layout/PageHeader";

async function getAreas() {
  try {
    const areas = await prisma.area.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return areas;
  } catch (error) {
    console.error("Error fetching areas:", error);
    return [];
  }
}

interface JobsPageProps {
  searchParams: {
    keyword?: string;
    areaId?: string;
    shift?: string;
    salaryRange?: string;
    page?: string;
  };
}

export async function generateMetadata({ searchParams }: JobsPageProps) {
  const areaName = searchParams.areaId
    ? await prisma.area.findUnique({
        where: { id: searchParams.areaId },
        select: { name: true },
      })
    : null;

  const title = areaName
    ? `Việc làm Part-time tại ${areaName.name} – PartHub`
    : "Việc làm Part-time tại Nghệ An – PartHub";

  return {
    title,
    description: `Tìm việc làm part-time tại ${areaName?.name || "Nghệ An"}. Hàng trăm cơ hội việc làm thêm linh hoạt: phục vụ, bán hàng, gia sư, CTV sự kiện.`,
  };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const areas = await getAreas();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Tìm việc làm part-time"
        description="Hàng trăm cơ hội việc làm thêm linh hoạt tại Nghệ An"
      />

      <div className="mt-8">
        <JobFilters areas={areas} searchParams={searchParams} />
      </div>

      <div className="mt-8">
        <Suspense fallback={<div className="text-center py-12">Đang tải...</div>}>
          <JobList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
