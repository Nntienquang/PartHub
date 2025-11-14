import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const report = await prisma.report.findUnique({
      where: { id: params.id },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Không tìm thấy báo cáo" },
        { status: 404 }
      );
    }

    await prisma.report.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa báo cáo",
    });
  } catch (error: any) {
    console.error("Delete report error:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi xóa báo cáo" },
      { status: 500 }
    );
  }
}

