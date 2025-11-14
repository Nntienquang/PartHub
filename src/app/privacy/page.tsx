import React from "react";
import PageHeader from "@/components/layout/PageHeader";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader title="Chính sách bảo mật" />

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            1. Thu thập thông tin
          </h2>
          <p className="text-slate-700">
            Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài
            khoản, sử dụng dịch vụ hoặc liên hệ với chúng tôi. Thông tin này
            bao gồm tên, email, số điện thoại và các thông tin khác mà bạn cung
            cấp.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            2. Sử dụng thông tin
          </h2>
          <p className="text-slate-700">
            Thông tin của bạn được sử dụng để cung cấp dịch vụ, cải thiện trải
            nghiệm người dùng, và liên hệ với bạn khi cần thiết. Chúng tôi không
            bán hoặc chia sẻ thông tin của bạn với bên thứ ba mà không có sự đồng
            ý của bạn.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            3. Bảo mật thông tin
          </h2>
          <p className="text-slate-700">
            Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin
            cá nhân của bạn khỏi việc truy cập, sử dụng hoặc tiết lộ trái phép.
          </p>
        </div>
      </div>
    </div>
  );
}

