import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

async function getAllRevenues() {
  try {
    const revenues = await prisma.revenue.findMany({
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return revenues;
  } catch (error) {
    console.error("Error fetching revenues:", error);
    return [];
  }
}

async function getTotalRevenue() {
  try {
    const result = await prisma.revenue.aggregate({
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    return 0;
  }
}

export default async function AdminRevenuePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const [revenues, totalRevenue] = await Promise.all([getAllRevenues(), getTotalRevenue()]);

  const formatDate = (dateString: Date) => {
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Quản lý doanh thu</h1>

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
                  Nhà tuyển dụng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Gói
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Ngày thanh toán
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {revenues.length > 0 ? (
                revenues.map((revenue) => (
                  <tr key={revenue.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {revenue.employer.companyName}
                      </div>
                      <div className="text-sm text-slate-500">{revenue.employer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {formatCurrency(revenue.amount)}
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
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {revenue.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(revenue.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Chưa có giao dịch nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
