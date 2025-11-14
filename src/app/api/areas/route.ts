import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Get all areas (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const areas = await prisma.area.findMany({
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: areas,
    });
  } catch (error: any) {
    console.error("Get areas error:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi lấy danh sách khu vực" },
      { status: 500 }
    );
  }
}

