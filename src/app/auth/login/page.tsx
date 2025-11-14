"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Wait a bit for session to be set
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        // Get session to determine role-based redirect
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        // Redirect based on role
        if (session?.user?.role === "ADMIN") {
          window.location.href = "/admin";
        } else if (session?.user?.role === "EMPLOYER") {
          window.location.href = "/employer";
        } else {
          window.location.href = "/";
        }
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <PageHeader
        title="Đăng nhập"
        description="Đăng nhập vào tài khoản của bạn"
      />

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-slate-700 text-sm">Ghi nhớ đăng nhập</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-brand-primary hover:underline text-sm"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <div className="text-center text-slate-600 text-sm">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-brand-primary hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
