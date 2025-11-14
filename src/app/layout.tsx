import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SessionProvider from "@/components/providers/SessionProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import ChatWidgetWrapper from "@/components/chat/ChatWidgetWrapper";

export const metadata: Metadata = {
  title: "PartHub - Việc làm Nghệ An",
  description: "Kết nối nhà tuyển dụng và ứng viên tại Nghệ An",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col">
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <SessionProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ChatWidgetWrapper />
        </SessionProvider>
      </body>
    </html>
  );
}

