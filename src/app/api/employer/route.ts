import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployer } from "@/lib/auth-guard";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET: Get current employer profile
export async function GET(request: NextRequest) {
  try {
    const user = await requireEmployer();

    const employer = await prisma.employer.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        companyName: true,
        email: true,
        phone: true,
        address: true,
        logoUrl: true,
        description: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            jobs: true,
            revenues: true,
          },
        },
      },
    });

    if (!employer) {
      return NextResponse.json(
        { error: "Không tìm thấy doanh nghiệp" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: employer,
    });
  } catch (error: any) {
    console.error("Get employer error:", error);
    
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi lấy thông tin doanh nghiệp" },
      { status: 500 }
    );
  }
}

// PUT: Update employer profile
export async function PUT(request: NextRequest) {
  try {
    const user = await requireEmployer();

    const body = await request.json();
    const { companyName, phone, address, logoUrl, description } = body;

    // Build update data object
    const updateData: any = {};

    if (companyName !== undefined) {
      if (!companyName || companyName.trim().length === 0) {
        return NextResponse.json(
          { error: "Tên công ty không được để trống" },
          { status: 400 }
        );
      }
      updateData.companyName = companyName.trim();
    }

    if (phone !== undefined) {
      updateData.phone = phone || null;
    }

    if (address !== undefined) {
      updateData.address = address || null;
    }

    if (logoUrl !== undefined) {
      updateData.logoUrl = logoUrl || null;
    }

    if (description !== undefined) {
      updateData.description = description || null;
    }

    // Update employer
    const updatedEmployer = await prisma.employer.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        companyName: true,
        email: true,
        phone: true,
        address: true,
        logoUrl: true,
        description: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedEmployer,
      message: "Cập nhật thông tin thành công",
    });
  } catch (error: any) {
    console.error("Update employer error:", error);
    
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Bạn không có quyền cập nhật thông tin" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi cập nhật thông tin" },
      { status: 500 }
    );
  }
}

