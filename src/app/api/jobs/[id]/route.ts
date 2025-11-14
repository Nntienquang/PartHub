import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployer, requireAdmin, getCurrentUser } from "@/lib/auth-guard";
import { JobType, Shift, PremiumType, Role } from "@prisma/client";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET: Get job details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
            description: true,
            address: true,
            phone: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Không tìm thấy việc làm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    console.error("Get job error:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi lấy thông tin việc làm" },
      { status: 500 }
    );
  }
}

// PUT: Update job (only job owner or ADMIN)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireEmployer();

    // Get job
    const job = await prisma.job.findUnique({
      where: { id: params.id },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Không tìm thấy việc làm" },
        { status: 404 }
      );
    }

    // Check if user is the job owner or ADMIN
    if (user.role !== Role.ADMIN && job.employerId !== user.id) {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa việc làm này" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      salary,
      jobType,
      areaId,
      location,
      shift,
      isPremium,
      premiumType,
      isActive,
    } = body;

    // Validate areaId if provided
    if (areaId) {
      const area = await prisma.area.findUnique({
        where: { id: areaId },
      });

      if (!area) {
        return NextResponse.json(
          { error: "Khu vực không tồn tại" },
          { status: 400 }
        );
      }
    }

    // Update job
    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(salary && { salary }),
        ...(jobType && { jobType }),
        ...(areaId !== undefined && { areaId: areaId || null }),
        ...(location && { location }),
        ...(shift && { shift }),
        ...(isPremium !== undefined && { isPremium }),
        ...(premiumType && { premiumType }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedJob,
    });
  } catch (error: any) {
    console.error("Update job error:", error);
    
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa việc làm" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi cập nhật việc làm" },
      { status: 500 }
    );
  }
}

// DELETE: Delete job (only job owner or ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireEmployer();

    // Get job
    const job = await prisma.job.findUnique({
      where: { id: params.id },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Không tìm thấy việc làm" },
        { status: 404 }
      );
    }

    // Check if user is the job owner or ADMIN
    if (user.role !== Role.ADMIN && job.employerId !== user.id) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa việc làm này" },
        { status: 403 }
      );
    }

    // Delete job (cascade will handle related records)
    await prisma.job.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa việc làm thành công",
    });
  } catch (error: any) {
    console.error("Delete job error:", error);
    
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa việc làm" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi xóa việc làm" },
      { status: 500 }
    );
  }
}

