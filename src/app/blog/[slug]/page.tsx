import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";

const blogPosts: Record<string, any> = {
  "5-luu-y-khi-di-lam-part-time-ca-toi": {
    title: "5 lưu ý khi đi làm part-time ca tối",
    date: "2024-11-10",
    content: `
      <p>Làm việc part-time ca tối có thể mang lại thu nhập tốt, nhưng cũng có những thách thức riêng. Dưới đây là 5 lưu ý quan trọng:</p>
      
      <h2>1. An toàn cá nhân</h2>
      <p>Luôn đảm bảo bạn có phương tiện di chuyển an toàn về nhà sau ca làm. Nếu có thể, hãy đi cùng bạn bè hoặc sử dụng dịch vụ gọi xe.</p>
      
      <h2>2. Sức khỏe</h2>
      <p>Làm việc ca tối có thể ảnh hưởng đến giấc ngủ. Hãy đảm bảo bạn ngủ đủ giấc và duy trì chế độ ăn uống lành mạnh.</p>
      
      <h2>3. Giao tiếp với gia đình</h2>
      <p>Thông báo cho gia đình về lịch làm việc của bạn để họ yên tâm và có thể hỗ trợ khi cần.</p>
      
      <h2>4. Quản lý thời gian</h2>
      <p>Cân bằng giữa công việc, học tập và nghỉ ngơi. Đừng để công việc ảnh hưởng đến kết quả học tập.</p>
      
      <h2>5. Chọn nơi làm việc uy tín</h2>
      <p>Làm việc tại những địa điểm có uy tín, có hợp đồng rõ ràng và đảm bảo quyền lợi của bạn.</p>
    `,
  },
  "kinh-nghiem-phong-van-viec-lam-them": {
    title: "Kinh nghiệm phỏng vấn việc làm thêm cho sinh viên Vinh",
    date: "2024-11-08",
    content: `
      <p>Phỏng vấn việc làm thêm có thể khiến nhiều sinh viên lo lắng. Dưới đây là những kinh nghiệm hữu ích:</p>
      
      <h2>Chuẩn bị CV</h2>
      <p>CV của bạn nên ngắn gọn, rõ ràng và tập trung vào các kỹ năng liên quan đến công việc bạn đang ứng tuyển.</p>
      
      <h2>Nghiên cứu công ty</h2>
      <p>Tìm hiểu về công ty, sản phẩm/dịch vụ của họ trước khi phỏng vấn. Điều này cho thấy bạn quan tâm và nghiêm túc.</p>
      
      <h2>Trả lời câu hỏi</h2>
      <p>Hãy trung thực về lịch học và thời gian bạn có thể làm việc. Nhà tuyển dụng sẽ đánh giá cao sự trung thực của bạn.</p>
      
      <h2>Tạo ấn tượng tốt</h2>
      <p>Mặc trang phục phù hợp, đến đúng giờ và thể hiện thái độ tích cực, nhiệt tình.</p>
    `,
  },
  "cach-nhan-dien-viec-lam-lua-dao": {
    title: "Cách nhận diện việc làm lừa đảo",
    date: "2024-11-05",
    content: `
      <p>Khi tìm việc làm thêm, bạn cần cảnh giác với các chiêu trò lừa đảo. Dưới đây là những dấu hiệu đáng ngờ:</p>
      
      <h2>1. Yêu cầu đóng tiền trước</h2>
      <p>Không có công việc hợp pháp nào yêu cầu bạn đóng tiền trước để được nhận việc. Đây là dấu hiệu lừa đảo rõ ràng.</p>
      
      <h2>2. Lương quá cao so với công việc</h2>
      <p>Nếu mức lương được hứa quá cao so với tính chất công việc, hãy cảnh giác. Thường thì "quá tốt để là thật" thường không phải là thật.</p>
      
      <h2>3. Không có hợp đồng rõ ràng</h2>
      <p>Mọi công việc hợp pháp đều có hợp đồng lao động hoặc thỏa thuận rõ ràng. Nếu nhà tuyển dụng từ chối ký hợp đồng, hãy cẩn thận.</p>
      
      <h2>4. Yêu cầu thông tin cá nhân nhạy cảm</h2>
      <p>Không chia sẻ thông tin như số CMND, tài khoản ngân hàng trước khi chắc chắn về tính hợp pháp của công việc.</p>
      
      <h2>5. Liên hệ qua kênh không chính thức</h2>
      <p>Nếu nhà tuyển dụng chỉ liên hệ qua Facebook, Zalo mà không có thông tin công ty rõ ràng, hãy kiểm tra kỹ.</p>
    `,
  },
  "lam-them-gi-de-kiem-tien-cho-sinh-vien": {
    title: "Làm thêm gì để kiếm tiền cho sinh viên?",
    date: "2024-11-01",
    content: `
      <p>Có nhiều công việc part-time phù hợp với sinh viên. Dưới đây là một số gợi ý:</p>
      
      <h2>1. Phục vụ nhà hàng, quán cà phê</h2>
      <p>Linh hoạt về thời gian, phù hợp với lịch học. Giúp bạn phát triển kỹ năng giao tiếp.</p>
      
      <h2>2. Bán hàng</h2>
      <p>Cửa hàng thời trang, tiện lợi thường cần nhân viên part-time. Có thể làm theo ca.</p>
      
      <h2>3. Gia sư</h2>
      <p>Nếu bạn giỏi một môn học nào đó, có thể làm gia sư. Lương tốt và linh hoạt về thời gian.</p>
      
      <h2>4. CTV Marketing</h2>
      <p>Làm cộng tác viên marketing online, quản lý fanpage, content. Có thể làm tại nhà.</p>
      
      <h2>5. Giao hàng</h2>
      <p>Shipper part-time, làm theo ca. Thu nhập ổn định và linh hoạt.</p>
    `,
  },
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/blog"
        className="text-brand-primary hover:underline mb-4 inline-block"
      >
        ← Quay lại Blog
      </Link>

      <article className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {post.title}
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          {formatDate(post.date)}
        </p>
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
