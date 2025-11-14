"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";

export default function AdminHeader() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          {session?.user && (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{session.user.name}</p>
                <p className="text-xs text-slate-500">Quản trị viên</p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-slate-600 hover:text-slate-900 text-sm font-medium"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

