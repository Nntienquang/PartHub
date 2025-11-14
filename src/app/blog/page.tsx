import React from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Blog – Kinh nghiệm làm thêm | PartHub",
  description: "Chia sẻ kinh nghiệm và mẹo vặt khi tìm việc làm thêm tại Nghệ An",
};

const blogPosts = [
  {
    slug: "5-luu-y-khi-di-lam-part-time-ca-toi",
    title: "5 lưu ý khi đi làm part-time ca tối",
    excerpt: "Những điều cần biết để làm việc an toàn và hiệu quả vào buổi tối. Bảo vệ sức khỏe và an toàn cá nhân khi làm việc ca đêm.",
    date: "2024-11-10",
  },
  {
    slug: "kinh-nghiem-phong-van-viec-lam-them",
    title: "Kinh nghiệm phỏng vấn việc làm thêm cho sinh viên Vinh",
    excerpt: "Chia sẻ bí quyết để vượt qua vòng phỏng vấn thành công. Cách chuẩn bị CV, trả lời câu hỏi và tạo ấn tượng tốt với nhà tuyển dụng.",
    date: "2024-11-08",
  },
  {
    slug: "cach-nhan-dien-viec-lam-lua-dao",
    title: "Cách nhận diện việc làm lừa đảo",
    excerpt: "Cảnh giác với những dấu hiệu đáng ngờ khi tìm việc làm thêm. Bảo vệ bản thân khỏi các chiêu trò lừa đảo phổ biến.",
    date: "2024-11-05",
  },
  {
    slug: "lam-them-gi-de-kiem-tien-cho-sinh-vien",
    title: "Làm thêm gì để kiếm tiền cho sinh viên?",
    excerpt: "Gợi ý các công việc part-time phù hợp với sinh viên, cân bằng giữa học tập và làm việc.",
    date: "2024-11-01",
  },
];

export default function BlogPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Blog"
        description="Chia sẻ kinh nghiệm và mẹo vặt khi tìm việc làm thêm"
      />

      <div className="mt-8">
        {blogPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-slate-600 text-lg mb-4">Chưa có bài viết nào</p>
            <p className="text-slate-500 text-sm">Các bài viết sẽ được cập nhật sớm nhất.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-brand-primary"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">
                    {formatDate(post.date)}
                  </span>
                  <span className="text-brand-primary text-sm font-medium">
                    Đọc thêm →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
