"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";

interface PremiumPurchaseModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function PremiumPurchaseModal({
  onClose,
  onSuccess,
}: PremiumPurchaseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    premiumType: "BASIC",
    amount: 100000,
    description: "Mua gói Premium BASIC",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formData.amount,
          description: formData.description,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess();
      } else {
        alert(data.error || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handlePremiumTypeChange = (type: string) => {
    const amounts: Record<string, number> = {
      BASIC: 100000,
      PRO: 200000,
    };
    setFormData({
      premiumType: type,
      amount: amounts[type] || 100000,
      description: `Mua gói Premium ${type}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Mua gói Premium</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Chọn gói Premium
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handlePremiumTypeChange("BASIC")}
                className={`p-4 border-2 rounded-lg text-center ${
                  formData.premiumType === "BASIC"
                    ? "border-brand-primary bg-blue-50"
                    : "border-slate-300"
                }`}
              >
                <div className="font-semibold text-slate-900">BASIC</div>
                <div className="text-sm text-slate-600 mt-1">100,000 VNĐ</div>
              </button>
              <button
                type="button"
                onClick={() => handlePremiumTypeChange("PRO")}
                className={`p-4 border-2 rounded-lg text-center ${
                  formData.premiumType === "PRO"
                    ? "border-brand-primary bg-blue-50"
                    : "border-slate-300"
                }`}
              >
                <div className="font-semibold text-slate-900">PRO</div>
                <div className="text-sm text-slate-600 mt-1">200,000 VNĐ</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Số tiền
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: parseInt(e.target.value) || 0,
                })
              }
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mô tả
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận mua"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

