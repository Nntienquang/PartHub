import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const alt = "Job Detail";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      employer: {
        select: {
          companyName: true,
        },
      },
    },
  });

  if (!job) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          PartHub – Việc làm Part-time Nghệ An
        </div>
      ),
      {
        ...size,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: job.isPremium
            ? "linear-gradient(to right, #fbbf24, #f59e0b)"
            : "linear-gradient(to right, #3b82f6, #2563eb)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
          {job.title}
        </div>
        <div style={{ fontSize: 32, marginBottom: 20, opacity: 0.9 }}>
          {job.employer.companyName}
        </div>
        <div style={{ fontSize: 28, marginBottom: 10 }}>💰 {job.salary}</div>
        <div
          style={{
            fontSize: 24,
            background: "rgba(255,255,255,0.2)",
            padding: "10px 20px",
            borderRadius: "8px",
            marginTop: 20,
          }}
        >
          Part-time
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

