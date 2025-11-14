import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployer, getCurrentUser } from "@/lib/auth-guard";
import { JobType, Shift, PremiumType, Role } from "@prisma/client";

// Helper function to extract salary number from string
function extractSalaryNumber(salary: string): number | null {
  const match = salary.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// GET: List all jobs with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const jobType = searchParams.get("jobType") as JobType | null;
    const keyword = searchParams.get("keyword");
    const areaId = searchParams.get("areaId");
    const shift = searchParams.get("shift") as Shift | null;
    const salaryRange = searchParams.get("salaryRange");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      isActive: true,
    };

    // Filter by jobType (default to PART_TIME if not specified)
    if (jobType) {
      where.jobType = jobType;
    } else {
      where.jobType = JobType.PART_TIME;
    }

    // Filter by areaId
    if (areaId) {
      where.areaId = areaId;
    }

    // Filter by area name (if areaId not provided)
    if (area && !areaId) {
      const areaRecord = await prisma.area.findFirst({
        where: { name: { contains: area } },
      });
      if (areaRecord) {
        where.areaId = areaRecord.id;
      }
    }

    // Filter by shift
    if (shift) {
      where.shift = shift;
    }

    // Filter by keyword (search in title, description, location)
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
        { location: { contains: keyword } },
      ];
    }

    // Get all jobs first to filter by salary (since salary is string)
    let jobs = await prisma.job.findMany({
      where,
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
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    // Filter by salary range if provided
    if (salaryRange) {
      jobs = jobs.filter((job) => {
        const salaryNum = extractSalaryNumber(job.salary);
        if (!salaryNum) return false;

        switch (salaryRange) {
          case "<20":
            return salaryNum < 20;
          case "20-25":
            return salaryNum >= 20 && salaryNum <= 25;
          case "25-30":
            return salaryNum >= 25 && salaryNum <= 30;
          case ">30":
            return salaryNum > 30;
          default:
            return true;
        }
      });
    }

    // Sort: Premium first, then by createdAt
    jobs.sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Apply pagination
    const total = jobs.length;
    const paginatedJobs = jobs.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedJobs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error("Get jobs error:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi lấy danh sách việc làm" },
      { status: 500 }
    );
  }
}

// POST: Create a new job (EMPLOYER only)
export async function POST(request: NextRequest) {
  try {
    const user = await requireEmployer();

    const body = await request.json();
    const {
      title,
      description,
      salary,
      jobType = JobType.PART_TIME,
      areaId,
      location,
      shift = Shift.FLEXIBLE,
      isPremium = false,
      premiumType = PremiumType.NONE,
    } = body;

    // Validation
    if (!title || !description || !salary || !location) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin (title, description, salary, location)" },
        { status: 400 }
      );
    }

    // Get employer ID from session
    let employerId = user.id;

    // If user is ADMIN, they might be creating for another employer (not in this case)
    // For now, only allow employer to create their own jobs
    if (user.role === Role.EMPLOYER) {
      // Verify employer exists
      const employer = await prisma.employer.findUnique({
        where: { id: user.id },
      });

      if (!employer) {
        return NextResponse.json(
          { error: "Employer not found" },
          { status: 404 }
        );
      }

      employerId = employer.id;
    }

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

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        salary,
        jobType: jobType || JobType.PART_TIME,
        location,
        areaId: areaId || null,
        shift: shift || Shift.FLEXIBLE,
        isPremium: isPremium || false,
        premiumType: premiumType || PremiumType.NONE,
        employerId,
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

    return NextResponse.json(
      {
        success: true,
        data: job,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create job error:", error);
    
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Bạn không có quyền tạo việc làm" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi tạo việc làm" },
      { status: 500 }
    );
  }
}
