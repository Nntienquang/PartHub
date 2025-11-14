import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployer, requireAdmin, getCurrentUser } from "@/lib/auth-guard";
import { Role } from "@prisma/client";

// GET: Get revenue list (EMPLOYER sees their own, ADMIN sees all)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let revenues;

    if (user.role === Role.ADMIN) {
      // Admin sees all revenues
      revenues = await prisma.revenue.findMany({
        include: {
          employer: {
            select: {
              id: true,
              companyName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (user.role === Role.EMPLOYER) {
      // Employer sees only their revenues
      revenues = await prisma.revenue.findMany({
        where: {
          employerId: user.id,
        },
        include: {
          employer: {
            select: {
              id: true,
              companyName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: revenues,
    });
  } catch (error: any) {
    console.error("Get revenue error:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi lấy danh sách doanh thu" },
      { status: 500 }
    );
  }
}

// POST: Create revenue record (EMPLOYER purchases premium)
export async function POST(request: NextRequest) {
  try {
    const user = await requireEmployer();

    const body = await request.json();
    const { amount, description } = body;

    // Validation
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Số tiền phải là số dương" },
        { status: 400 }
      );
    }

    // Verify employer exists
    const employer = await prisma.employer.findUnique({
      where: { id: user.id },
    });

    if (!employer) {
      return NextResponse.json(
        { error: "Không tìm thấy doanh nghiệp" },
        { status: 404 }
      );
    }

    // Create revenue record
    const revenue = await prisma.revenue.create({
      data: {
        amount: Math.round(amount), // Ensure integer
        description: description || null,
        employerId: user.id,
      },
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            email: true,
          },
        },
      },
    });

    // Optionally update job premium status if this is a premium purchase
    // This logic can be extended based on business requirements

    return NextResponse.json(
      {
        success: true,
        data: revenue,
        message: "Tạo bản ghi doanh thu thành công",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create revenue error:", error);
    
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Bạn không có quyền tạo bản ghi doanh thu" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi tạo bản ghi doanh thu" },
      { status: 500 }
    );
  }
}

