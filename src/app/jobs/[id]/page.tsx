import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ApplyButton from "@/components/jobs/ApplyButton";
import PageHeader from "@/components/layout/PageHeader";

async function getJob(id: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return job;
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
}

interface JobDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const job = await getJob(params.id);

  if (!job) {
    return {
      title: "Không tìm thấy việc làm – PartHub",
    };
  }

  return {
    title: `${job.title} – ${job.employer.companyName} | PartHub`,
    description: `${job.title} tại ${job.location}. ${job.description.substring(0, 150)}...`,
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const job = await getJob(params.id);

  if (!job) {
    notFound();
  }

  const shiftLabels: Record<string, string> = {
    MORNING: "Ca sáng",
    AFTERNOON: "Ca chiều",
    EVENING: "Ca tối",
    FLEXIBLE: "Linh hoạt",
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Job Header Image */}
            <div className="relative h-48 overflow-hidden">
              {job.employer?.logoUrl ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <img
                    src={job.employer.logoUrl}
                    alt={job.employer.companyName || "Company logo"}
                    className="max-w-xs max-h-32 object-contain p-4 z-10"
                  />
                </div>
              ) : (
                <>
                  <Image
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=400&fit=crop"
                    alt={job.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-indigo-600/40" />
                </>
              )}
              {job.isPremium && (
                <span className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1 z-10">
                  ⭐ PREMIUM
                </span>
              )}
            </div>

            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                      {job.title}
                    </h1>
                    {job.employer?.companyName && (
                      <Link
                        href={`/companies/${job.employer.id}`}
                        className="text-brand-primary hover:underline text-lg flex items-center gap-2"
                      >
                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">🏢</span>
                        {job.employer.companyName}
                      </Link>
                    )}
                  </div>
                </div>

              {/* Job Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-slate-500 text-sm mb-1">Mức lương</p>
                  <p className="text-brand-primary font-semibold">{job.salary}</p>
                </div>
                {job.area?.name && (
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Khu vực</p>
                    <p className="text-slate-900 font-medium">{job.area.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-500 text-sm mb-1">Địa điểm</p>
                  <p className="text-slate-900 font-medium">{job.location}</p>
                </div>
                {job.shift && (
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Ca làm</p>
                    <p className="text-slate-900 font-medium">
                      {shiftLabels[job.shift] || job.shift}
                    </p>
                  </div>
                )}
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                  {job.jobType === "PART_TIME" ? "Part-time" : job.jobType}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Mô tả công việc
              </h2>
              <div
                className="text-slate-700 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, "<br />") }}
              />
            </div>

            {/* Posted Date */}
            <div className="text-slate-500 text-sm">
              Đăng ngày: {formatDate(job.createdAt)}
            </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <ApplyButton jobId={job.id} />
            <p className="text-slate-600 text-sm mt-4 text-center">
              CV của bạn sẽ gửi trực tiếp tới nhà tuyển dụng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
