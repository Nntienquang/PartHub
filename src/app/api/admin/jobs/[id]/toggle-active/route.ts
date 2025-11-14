import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const job = await prisma.job.findUnique({
      where: { id: params.id },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Không tìm thấy tin tuyển dụng" },
        { status: 404 }
      );
    }

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: {
        isActive: !job.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: updatedJob.isActive ? "Đã kích hoạt tin tuyển dụng" : "Đã vô hiệu hóa tin tuyển dụng",
    });
  } catch (error: any) {
    console.error("Toggle job active error:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi" },
      { status: 500 }
    );
  }
}

