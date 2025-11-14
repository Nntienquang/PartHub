import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployer, requireAdmin, getCurrentUser } from "@/lib/auth-guard";
import { ApplicationStatus, Role } from "@prisma/client";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// PUT: Update application status (EMPLOYER approves/rejects, ADMIN can do anything)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireEmployer();

    // Get application
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        job: {
          select: {
            id: true,
            employerId: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn ứng tuyển" },
        { status: 404 }
      );
    }

    // Check if user is the job owner or ADMIN
    if (user.role !== Role.ADMIN && application.job.employerId !== user.id) {
      return NextResponse.json(
        { error: "Bạn không có quyền cập nhật đơn ứng tuyển này" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json(
        { error: "Status không hợp lệ. Phải là PENDING, APPROVED, hoặc REJECTED" },
        { status: 400 }
      );
    }

    // Update application
    const updatedApplication = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: status as ApplicationStatus,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            cvUrl: true,
          },
        },
        job: {
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
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      message: `Đã ${status === ApplicationStatus.APPROVED ? "duyệt" : status === ApplicationStatus.REJECTED ? "từ chối" : "cập nhật"} đơn ứng tuyển`,
    });
  } catch (error: any) {
    console.error("Update application error:", error);
    
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Bạn không có quyền cập nhật đơn ứng tuyển" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi cập nhật đơn ứng tuyển" },
      { status: 500 }
    );
  }
}

// DELETE: Delete application (EMPLOYER or ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireEmployer();

    // Get application
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        job: {
          select: {
            id: true,
            employerId: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn ứng tuyển" },
        { status: 404 }
      );
    }

    // Check if user is the job owner or ADMIN
    if (user.role !== Role.ADMIN && application.job.employerId !== user.id) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa đơn ứng tuyển này" },
        { status: 403 }
      );
    }

    // Delete application
    await prisma.application.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa đơn ứng tuyển thành công",
    });
  } catch (error: any) {
    console.error("Delete application error:", error);
    
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa đơn ứng tuyển" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi xóa đơn ứng tuyển" },
      { status: 500 }
    );
  }
}

