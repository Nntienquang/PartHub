"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import PremiumPurchaseModal from "@/components/employer/PremiumPurchaseModal";

interface Revenue {
  id: string;
  amount: number;
  description: string | null;
  createdAt: string;
}

export default function EmployerRevenuePage() {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    try {
      const res = await fetch("/api/revenue");
      const data = await res.json();
      if (data.success) {
        setRevenues(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching revenues:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPremiumType = (description: string | null) => {
    if (!description) return "N/A";
    if (description.includes("BASIC")) return "BASIC";
    if (description.includes("PRO")) return "PRO";
    return description;
  };

  if (loading) {
    return (
      <div>
        <div className="text-center py-12">
          <p className="text-slate-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Doanh thu</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Mua gói Premium
        </Button>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm mb-1">Tổng doanh thu</p>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
          </div>
          <span className="text-4xl">💰</span>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Ngày thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Gói
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Mô tả
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {revenues.length > 0 ? (
                revenues.map((revenue) => (
                  <tr key={revenue.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(revenue.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          getPremiumType(revenue.description) === "PRO"
                            ? "bg-purple-100 text-purple-800"
                            : getPremiumType(revenue.description) === "BASIC"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {getPremiumType(revenue.description)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {formatCurrency(revenue.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {revenue.description || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Chưa có giao dịch nào.{" "}
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-brand-primary hover:underline"
                    >
                      Mua gói Premium ngay
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Purchase Modal */}
      {showModal && (
        <PremiumPurchaseModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchRevenues();
          }}
        />
      )}
    </div>
  );
}
