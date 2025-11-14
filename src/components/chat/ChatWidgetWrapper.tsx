"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "./ChatWidget";

export default function ChatWidgetWrapper() {
  const pathname = usePathname();

  // Don't show chatbot on admin or employer pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/employer")) {
    return null;
  }

  return <ChatWidget />;
}

