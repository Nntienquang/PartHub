import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">PartHub</h3>
            <p className="text-slate-400 text-sm">
              Việc làm Nghệ An - Kết nối nhà tuyển dụng và ứng viên
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Pháp lý</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/terms" className="hover:text-white">
                  Điều khoản
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/jobs" className="hover:text-white">
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-white">
                  Công ty
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2024 PartHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

