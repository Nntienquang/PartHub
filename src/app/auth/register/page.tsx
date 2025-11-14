"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Link from "next/link";

type AccountType = "user" | "employer";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        accountType === "user"
          ? "/api/register/user"
          : "/api/register/employer";

      const body =
        accountType === "user"
          ? { name, email, password }
          : { companyName: name, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        setError(text || "Đã xảy ra lỗi khi đăng ký");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Đã xảy ra lỗi khi đăng ký");
        setLoading(false);
        return;
      }

      // Registration successful, redirect to login
      router.push("/auth/login?registered=true");
    } catch (error: any) {
      console.error("Register error:", error);
      setError(error?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <PageHeader
        title="Đăng ký"
        description="Tạo tài khoản mới để bắt đầu"
      />

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Account Type Selection */}
        <div className="mb-6">
          <label className="block text-slate-700 mb-2 font-medium">
            Loại tài khoản
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAccountType("user")}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                accountType === "user"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              Ứng viên
            </button>
            <button
              type="button"
              onClick={() => setAccountType("employer")}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                accountType === "employer"
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              Doanh nghiệp
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-700 mb-2 font-medium">
              {accountType === "user" ? "Họ tên" : "Tên công ty"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder={
                accountType === "user" ? "Nguyễn Văn A" : "Công ty ABC"
              }
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" required />
              <span className="text-slate-700 text-sm">
                Tôi đồng ý với{" "}
                <Link href="/terms" className="text-brand-primary hover:underline">
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link href="/privacy" className="text-brand-primary hover:underline">
                  Chính sách bảo mật
                </Link>
              </span>
            </label>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>

          <div className="text-center text-slate-600 text-sm">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-brand-primary hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
