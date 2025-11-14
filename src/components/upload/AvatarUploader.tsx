"use client";

import { UploadButton } from "@uploadthing/react";
import { useState, useEffect } from "react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface AvatarUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  userId: string;
}

export default function AvatarUploader({ value, onChange, userId }: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        Avatar
      </label>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Preview Image */}
        <div className="flex-shrink-0">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-200 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="text-white text-sm">Đang tải...</div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center">
              <span className="text-slate-400 text-sm text-center px-2">Chưa có ảnh</span>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <UploadButton<OurFileRouter>
            endpoint="avatarUploader"
            onUploadBegin={() => setUploading(true)}
            onClientUploadComplete={(res) => {
              if (res && res[0]?.url) {
                const url = res[0].url;
                setPreviewUrl(url);
                onChange(url);
                setUploading(false);
              }
            }}
            onUploadError={(error: Error) => {
              console.error("Upload error:", error);
              setUploading(false);
              alert("Lỗi khi upload ảnh. Vui lòng thử lại.");
            }}
            content={{
              button: ({ ready }) => (ready ? "📷 Tải lên ảnh đại diện" : "Đang chuẩn bị..."),
              allowedContent: "Ảnh PNG, JPG, JPEG (tối đa 4MB)",
            }}
            appearance={{
              button: "ut-ready:bg-brand-primary ut-uploading:cursor-not-allowed rounded-lg px-4 py-2 text-white bg-slate-600 hover:bg-slate-700 transition-colors",
              allowedContent: "text-slate-500 text-xs mt-2",
            }}
          />
          {previewUrl && (
            <p className="text-green-600 text-sm mt-2">✅ Đã tải lên thành công!</p>
          )}
        </div>
      </div>
    </div>
  );
}

