"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/companies", label: "Employers", icon: "🏢" },
    { href: "/admin/jobs", label: "Jobs", icon: "💼" },
    { href: "/admin/applications", label: "Applications", icon: "📝" },
    { href: "/admin/revenue", label: "Revenue", icon: "💰" },
    { href: "/admin/reports", label: "Reports", icon: "📈" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-brand-primary text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

