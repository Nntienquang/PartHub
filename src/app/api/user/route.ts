import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET: Get current user profile
export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        cvUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            applications: true,
            savedJobs: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi lấy thông tin người dùng" },
      { status: 500 }
    );
  }
}

// PUT: Update user profile
export async function PUT(request: NextRequest) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const { name, phone, avatar, cvUrl } = body;

    // Build update data object
    const updateData: any = {};

    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Tên không được để trống" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      updateData.phone = phone || null;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar || null;
    }

    if (cvUrl !== undefined) {
      updateData.cvUrl = cvUrl || null;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        cvUrl: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Cập nhật thông tin thành công",
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    
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

