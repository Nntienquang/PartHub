import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireEmployer, getCurrentUser } from "@/lib/auth-guard";
import { ApplicationStatus, Role } from "@prisma/client";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET: Get applications (USER sees their own, EMPLOYER sees their job applications)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status") as ApplicationStatus | null;

    let applications;

    if (user.role === Role.USER) {
      // User sees their own applications
      const where: any = {
        userId: user.id,
      };

      if (jobId) {
        where.jobId = jobId;
      }

      if (status) {
        where.status = status;
      }

      applications = await prisma.application.findMany({
        where,
        include: {
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
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (user.role === Role.EMPLOYER || user.role === Role.ADMIN) {
      // Employer sees applications for their jobs
      const where: any = {};

      if (jobId) {
        // Verify job belongs to employer (if not ADMIN)
        const job = await prisma.job.findUnique({
          where: { id: jobId },
        });

        if (!job) {
          return NextResponse.json(
            { error: "Không tìm thấy việc làm" },
            { status: 404 }
          );
        }

        if (user.role !== Role.ADMIN && job.employerId !== user.id) {
          return NextResponse.json(
            { error: "Bạn không có quyền xem đơn ứng tuyển này" },
            { status: 403 }
          );
        }

        where.jobId = jobId;
      } else {
        // Get all jobs for this employer
        const employerJobs = await prisma.job.findMany({
          where: {
            employerId: user.id,
          },
          select: {
            id: true,
          },
        });

        const jobIds = employerJobs.map((job) => job.id);
        where.jobId = { in: jobIds };
      }

      if (status) {
        where.status = status;
      }

      applications = await prisma.application.findMany({
        where,
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
      data: applications,
    });
  } catch (error: any) {
    console.error("Get applications error:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi lấy danh sách đơn ứng tuyển" },
      { status: 500 }
    );
  }
}

// POST: User applies for a job
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp jobId" },
        { status: 400 }
      );
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Không tìm thấy việc làm" },
        { status: 404 }
      );
    }

    // Check if job is active
    if (!job.isActive) {
      return NextResponse.json(
        { error: "Việc làm này đã bị đóng" },
        { status: 400 }
      );
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId: jobId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "Bạn đã ứng tuyển việc làm này rồi" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        jobId: jobId,
        status: ApplicationStatus.PENDING,
      },
      include: {
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

    return NextResponse.json(
      {
        success: true,
        data: application,
        message: "Ứng tuyển thành công",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Apply job error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bạn đã ứng tuyển việc làm này rồi" },
        { status: 400 }
      );
    }

    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Bạn không có quyền ứng tuyển" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi ứng tuyển" },
      { status: 500 }
    );
  }
}

