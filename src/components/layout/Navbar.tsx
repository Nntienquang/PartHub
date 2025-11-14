"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="PartHub Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/jobs"
              className="text-slate-700 hover:text-brand-primary transition-colors"
            >
              Việc làm
            </Link>
            <Link
              href="/companies"
              className="text-slate-700 hover:text-brand-primary transition-colors"
            >
              Công ty
            </Link>
            <Link
              href="/blog"
              className="text-slate-700 hover:text-brand-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-slate-700 hover:text-brand-primary transition-colors"
            >
              Liên hệ
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <span className="text-slate-600 text-sm">Đang tải...</span>
            ) : session?.user ? (
              <>
                {/* User menu */}
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {session.user.role === "EMPLOYER"
                        ? "Doanh nghiệp"
                        : session.user.role === "ADMIN"
                        ? "Quản trị"
                        : "Ứng viên"}
                    </p>
                  </div>
                  {session.user.role === "USER" && (
                    <>
                      <Link href="/profile">
                        <span className="text-slate-700 hover:text-brand-primary transition-colors text-sm font-medium">
                          Hồ sơ
                        </span>
                      </Link>
                      <Link href="/applications">
                        <span className="text-slate-700 hover:text-brand-primary transition-colors text-sm font-medium">
                          Đơn ứng tuyển
                        </span>
                      </Link>
                    </>
                  )}
                  {session.user.role === "EMPLOYER" && (
                    <Link href="/employer">
                      <Button variant="primary" className="text-sm">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin">
                      <Button variant="primary" className="text-sm">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="secondary"
                    className="text-sm"
                    onClick={handleSignOut}
                  >
                    Đăng xuất
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="secondary" className="text-sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" className="text-sm">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
