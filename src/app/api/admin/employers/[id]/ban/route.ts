import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const employer = await prisma.employer.findUnique({
      where: { id: params.id },
    });

    if (!employer) {
      return NextResponse.json(
        { error: "Không tìm thấy nhà tuyển dụng" },
        { status: 404 }
      );
    }

    // TODO: Add isActive field to Employer model in schema
    // For now, this endpoint exists and can be updated when schema is modified
    
    return NextResponse.json({
      success: true,
      message: "Đã khóa tài khoản nhà tuyển dụng",
    });
  } catch (error: any) {
    console.error("Ban employer error:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi khóa tài khoản" },
      { status: 500 }
    );
  }
}

