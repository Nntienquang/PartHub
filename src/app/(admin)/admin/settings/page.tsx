import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Cài đặt hệ thống"
        description="Quản lý cài đặt và cấu hình hệ thống"
      />

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Cài đặt chung
          </h3>
          <form className="space-y-6">
            <div>
              <label className="block text-slate-700 mb-2 font-medium">
                Tên website
              </label>
              <input
                type="text"
                defaultValue="PartHub - Việc làm Nghệ An"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 font-medium">
                Email liên hệ
              </label>
              <input
                type="email"
                defaultValue="contact@parthub.vn"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 font-medium">
                Số điện thoại
              </label>
              <input
                type="tel"
                defaultValue="0123 456 789"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <Button variant="primary">Lưu cài đặt</Button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Cài đặt thanh toán
          </h3>
          <form className="space-y-6">
            <div>
              <label className="block text-slate-700 mb-2 font-medium">
                Phí đăng tin cơ bản (VNĐ)
              </label>
              <input
                type="number"
                defaultValue="500000"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 font-medium">
                Phí đăng tin nổi bật (VNĐ)
              </label>
              <input
                type="number"
                defaultValue="1000000"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <Button variant="primary">Lưu cài đặt</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

