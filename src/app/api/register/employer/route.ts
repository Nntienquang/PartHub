import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { Role } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, email, password } = body;

    // Validation
    if (!companyName || !email || !password) {
      return NextResponse.json(
        { error: "Tất cả các trường là bắt buộc" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Check if email already exists in Employer table
    const existingEmployer = await prisma.employer.findUnique({
      where: { email },
    });

    if (existingEmployer) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Check if email exists in User table
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create employer
    const employer = await prisma.employer.create({
      data: {
        companyName,
        email,
        password: hashedPassword,
        role: Role.EMPLOYER,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký thành công",
        employer: {
          id: employer.id,
          companyName: employer.companyName,
          email: employer.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    // Return more detailed error message
    const errorMessage = error?.message || "Đã xảy ra lỗi khi đăng ký";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


