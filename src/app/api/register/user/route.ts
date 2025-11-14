import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { Role } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
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

    // Check if email already exists in User table
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Check if email exists in Employer table
    const existingEmployer = await prisma.employer.findUnique({
      where: { email },
    });

    if (existingEmployer) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký thành công",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
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


