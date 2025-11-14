import React from "react";
import PageHeader from "@/components/layout/PageHeader";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader
        title="Về chúng tôi"
        description="Giới thiệu về PartHub - Việc làm Nghệ An"
      />

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Sứ mệnh
          </h2>
          <p className="text-slate-700">
            PartHub là nền tảng kết nối nhà tuyển dụng và ứng viên tại Nghệ An,
            giúp tạo ra những cơ hội việc làm tốt nhất cho cả hai bên.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Tầm nhìn
          </h2>
          <p className="text-slate-700">
            Trở thành trang web tuyển dụng hàng đầu tại Nghệ An, được tin tưởng
            bởi hàng nghìn nhà tuyển dụng và ứng viên.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Giá trị cốt lõi
          </h2>
          <ul className="list-disc list-inside text-slate-700 space-y-2">
            <li>Uy tín và minh bạch</li>
            <li>Chất lượng dịch vụ cao</li>
            <li>Hỗ trợ tận tâm</li>
            <li>Đổi mới và phát triển</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

