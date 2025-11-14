import React from "react";
import PageHeader from "@/components/layout/PageHeader";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader title="Điều khoản sử dụng" />

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            1. Chấp nhận điều khoản
          </h2>
          <p className="text-slate-700">
            Bằng việc truy cập và sử dụng website PartHub, bạn đồng ý tuân thủ
            các điều khoản và điều kiện được nêu trong tài liệu này.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            2. Sử dụng dịch vụ
          </h2>
          <p className="text-slate-700">
            Bạn có quyền sử dụng dịch vụ của chúng tôi để tìm kiếm việc làm và
            đăng tin tuyển dụng, với điều kiện tuân thủ các quy định pháp luật
            hiện hành.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            3. Trách nhiệm người dùng
          </h2>
          <p className="text-slate-700">
            Người dùng có trách nhiệm cung cấp thông tin chính xác, không được
            sử dụng dịch vụ cho mục đích bất hợp pháp hoặc gây hại cho người
            khác.
          </p>
        </div>
      </div>
    </div>
  );
}

