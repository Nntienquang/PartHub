import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader
        title="Liên hệ"
        description="Chúng tôi luôn sẵn sàng hỗ trợ bạn"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Thông tin liên hệ
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Địa chỉ</h3>
              <p className="text-slate-600">123 Đường ABC, Vinh, Nghệ An</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
              <p className="text-slate-600">contact@parthub.vn</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Điện thoại</h3>
              <p className="text-slate-600">0123 456 789</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Gửi tin nhắn
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-2">Họ tên</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-2">Tin nhắn</label>
              <textarea
                rows={5}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              ></textarea>
            </div>
            <Button variant="primary" className="w-full">
              Gửi tin nhắn
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

