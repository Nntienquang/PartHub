"use client";

import { UploadButton } from "@uploadthing/react";
import { useState, useEffect } from "react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface CVUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  userId: string;
}

export default function CVUploader({ value, onChange, userId }: CVUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(value || null);

  useEffect(() => {
    if (value) {
      setCvUrl(value);
    }
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        CV (PDF)
      </label>
      <div className="space-y-3">
        {/* Upload Button */}
        <div>
          <UploadButton<OurFileRouter, "cvUploader">
            endpoint="cvUploader"
            onUploadBegin={() => setUploading(true)}
            onClientUploadComplete={(res) => {
              if (res && res[0]?.url) {
                const url = res[0].url;
                setCvUrl(url);
                onChange(url);
                setUploading(false);
              }
            }}
            onUploadError={(error: Error) => {
              console.error("Upload error:", error);
              setUploading(false);
              alert("Lỗi khi upload CV. Vui lòng thử lại.");
            }}
            content={{
              button: ({ ready }) => (ready ? "📄 Tải lên CV" : "Đang chuẩn bị..."),
              allowedContent: "File PDF (tối đa 8MB)",
            }}
            appearance={{
              button: "ut-ready:bg-brand-primary ut-uploading:cursor-not-allowed rounded-lg px-4 py-2 text-white bg-slate-600 hover:bg-slate-700 transition-colors",
              allowedContent: "text-slate-500 text-xs mt-2",
            }}
          />
        </div>

        {/* CV Preview Section */}
        {cvUrl ? (
          <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <p className="font-medium text-slate-700">CV đã được tải lên</p>
                  <p className="text-xs text-slate-500">{cvUrl.split("/").pop()}</p>
                </div>
              </div>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors text-sm font-medium inline-flex items-center gap-2"
              >
                <span>👁️ Xem CV</span>
              </a>
            </div>
            {uploading && (
              <p className="text-slate-500 text-sm mt-2">Đang tải lên...</p>
            )}
            {!uploading && (
              <p className="text-green-600 text-sm mt-2">✅ Upload thành công!</p>
            )}
          </div>
        ) : (
          <div className="border-2 border-slate-200 bg-slate-50 rounded-lg p-4">
            <p className="text-slate-500 text-sm">Chưa có CV. Vui lòng tải lên file PDF.</p>
            {uploading && (
              <p className="text-slate-500 text-sm mt-2">Đang tải lên...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

