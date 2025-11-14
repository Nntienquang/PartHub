import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import JobSearchForm from "@/components/jobs/JobSearchForm";
import JobCard from "@/components/jobs/JobCard";
import AreaCard from "@/components/jobs/AreaCard";
import { prisma } from "@/lib/prisma";

async function getFeaturedJobs() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        jobType: "PART_TIME",
        isActive: true,
      },
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { isPremium: "desc" },
        { createdAt: "desc" },
      ],
      take: 6,
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

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

export const metadata = {
  title: "PartHub – Việc làm Part-time Nghệ An",
  description: "Tìm việc làm thêm tại Nghệ An: phục vụ, bán hàng, gia sư, CTV sự kiện. Làm việc theo ca phù hợp với lịch học và cuộc sống của bạn.",
};

export default async function HomePage() {
  const [featuredJobs, areas] = await Promise.all([
    getFeaturedJobs(),
    getAreas(),
  ]);

  const blogPosts = [
    {
      slug: "5-luu-y-khi-di-lam-part-time-ca-toi",
      title: "5 lưu ý khi đi làm part-time ca tối",
      excerpt: "Những điều cần biết để làm việc an toàn và hiệu quả vào buổi tối",
    },
    {
      slug: "kinh-nghiem-phong-van-viec-lam-them",
      title: "Kinh nghiệm phỏng vấn việc làm thêm cho sinh viên Vinh",
      excerpt: "Chia sẻ bí quyết để vượt qua vòng phỏng vấn thành công",
    },
    {
      slug: "cach-nhan-dien-viec-lam-lua-dao",
      title: "Cách nhận diện việc làm lừa đảo",
      excerpt: "Cảnh giác với những dấu hiệu đáng ngờ khi tìm việc làm thêm",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-primary to-blue-600 text-white py-16 md:py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=600&fit=crop"
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Việc làm Part-time tại Nghệ An
              <br />
              <span className="text-brand-secondary">cho sinh viên & người đi làm thêm</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 md:mb-12 text-blue-100 max-w-3xl mx-auto">
              Tìm việc làm thêm linh hoạt, nhanh chóng: bán hàng, phục vụ, PG, gia sư, sự kiện, CTV...
              Làm việc theo ca phù hợp với lịch học và cuộc sống của bạn.
            </p>
            
            {/* Search Form */}
            <JobSearchForm areas={areas} />
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Việc làm part-time nổi bật
            </h2>
            <Link
              href="/jobs"
              className="text-brand-primary hover:underline font-medium"
            >
              Xem tất cả →
            </Link>
          </div>

          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job: any) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">Chưa có việc làm nào</p>
              <Link href="/jobs">
                <Button variant="primary">Tìm việc ngay</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Areas Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Việc theo khu vực Nghệ An
          </h2>
          {areas.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {areas.map((area: any) => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {["TP Vinh", "Cửa Lò", "Diễn Châu", "Quỳnh Lưu", "Hưng Nguyên", "Yên Thành", "Đô Lương", "Nghi Lộc"].map((name) => (
                <Link
                  key={name}
                  href={`/jobs?area=${encodeURIComponent(name)}`}
                  className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:border-brand-primary hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
                  <p className="text-slate-500 text-sm mt-2">Xem việc</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Kinh nghiệm làm thêm
            </h2>
            <Link
              href="/blog"
              className="text-brand-primary hover:underline font-medium"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => {
              // Different images for different blog posts
              const blogImages = [
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop", // Night work
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop", // Interview
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop", // Business
              ];
              return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Blog Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={blogImages[index] || blogImages[0]}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <span className="text-brand-primary text-sm font-medium inline-block">
                    Đọc thêm →
                  </span>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
