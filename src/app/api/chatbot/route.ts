import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// System prompt for the chatbot
const SYSTEM_PROMPT = `Bạn là Chatbot PartHub - trợ lý thông minh cho website tìm việc làm Part-time tại Nghệ An. 

Nhiệm vụ của bạn:
- Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp
- Ưu tiên sử dụng dữ liệu nội bộ website về việc làm Part-time Nghệ An khi có
- Nếu câu hỏi nằm ngoài phạm vi website, hãy trả lời theo kiến thức LLM và nói rõ: "Thông tin từ kiến thức tổng quát, không có trong hệ thống PartHub."
- Giúp người dùng tìm việc làm phù hợp, giải đáp thắc mắc về website

Khi có dữ liệu nội bộ, hãy sử dụng chúng để trả lời chính xác và chi tiết.`;

// Detect intent from user message
function detectIntent(message: string): {
  needsJobs: boolean;
  needsAreas: boolean;
  needsBlog: boolean;
  needsEmployer: boolean;
  needsApplications: boolean;
} {
  const lowerMessage = message.toLowerCase();
  
  return {
    needsJobs: /(vinh|nghệ an|part time|part-time|lương|ca tối|ca sáng|ca chiều|việc làm|tuyển dụng|job|việc)/.test(lowerMessage),
    needsAreas: /(khu vực|địa điểm|vị trí|area|vinh|cửa lò|diễn châu)/.test(lowerMessage),
    needsBlog: /(blog|kinh nghiệm|hướng dẫn|tips|mẹo)/.test(lowerMessage),
    needsEmployer: /(công ty|employer|nhà tuyển dụng|company)/.test(lowerMessage),
    needsApplications: /(hồ sơ của tôi|ứng tuyển của tôi|đơn ứng tuyển|application)/.test(lowerMessage),
  };
}

// Fetch internal data based on intent
async function fetchInternalData(intent: ReturnType<typeof detectIntent>, session: any) {
  const context: string[] = [];

  try {
    // Fetch jobs if needed
    if (intent.needsJobs || intent.needsAreas) {
      const jobs = await prisma.job.findMany({
        where: {
          isActive: true,
        },
        include: {
          employer: {
            select: {
              companyName: true,
            },
          },
          area: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [
          { isPremium: "desc" },
          { createdAt: "desc" },
        ],
        take: 5,
      });

      if (jobs.length > 0) {
        const jobsText = jobs
          .map((job) => 
            `- ${job.title} tại ${job.area?.name || "Nghệ An"}: ${job.salary}, ca ${job.shift}, ${job.employer?.companyName || "Công ty"}`
          )
          .join("\n");
        context.push(`DANH SÁCH VIỆC LÀM PART-TIME:\n${jobsText}`);
      }

      // Fetch areas
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

      if (areas.length > 0) {
        const areasText = areas
          .map((area) => `- ${area.name} (${area._count?.jobs || 0} việc làm)`)
          .join("\n");
        context.push(`KHU VỰC TUYỂN DỤNG:\n${areasText}`);
      }
    }

    // Fetch blog if needed (if blog table exists)
    if (intent.needsBlog) {
      try {
        // Check if blog posts exist in database
        // Note: Adjust based on your actual blog schema
        const blogPosts = await prisma.$queryRaw`
          SELECT * FROM Blog LIMIT 3
        `.catch(() => null);
        
        if (blogPosts && Array.isArray(blogPosts) && blogPosts.length > 0) {
          const blogText = blogPosts
            .map((post: any) => `- ${post.title || post.name}: ${post.excerpt || post.description || ""}`)
            .join("\n");
          context.push(`BÀI VIẾT BLOG:\n${blogText}`);
        }
      } catch (e) {
        // Blog table might not exist, skip
      }
    }

    // Fetch applications if user is logged in
    if (intent.needsApplications && session?.user?.id) {
      try {
        const applications = await prisma.application.findMany({
          where: {
            userId: session.user.id,
          },
          include: {
            job: {
              select: {
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });

        if (applications.length > 0) {
          const appsText = applications
            .map((app) => `- ${app.job.title}: ${app.status}`)
            .join("\n");
          context.push(`ĐƠN ỨNG TUYỂN CỦA BẠN:\n${appsText}`);
        }
      } catch (e) {
        // Skip if fails
      }
    }
  } catch (error) {
    console.error("Error fetching internal data:", error);
  }

  return context.join("\n\n");
}

// Call OpenAI API
async function callOpenAI(messages: Array<{ role: string; content: string }>) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return "Xin lỗi, chatbot chưa được cấu hình API key. Vui lòng thêm OPENAI_API_KEY vào file .env.local và restart dev server. Xem hướng dẫn trong file HUONG_DAN_CAU_HINH_CHATBOT.md";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      
      // Handle specific error types
      if (error.error?.code === "insufficient_quota") {
        return "Xin lỗi, tài khoản OpenAI đã hết quota. Vui lòng kiểm tra billing và nạp thêm credits tại https://platform.openai.com/account/billing. Hoặc liên hệ admin để được hỗ trợ.";
      }
      
      if (error.error?.code === "invalid_api_key") {
        return "Xin lỗi, API key không hợp lệ. Vui lòng kiểm tra lại OPENAI_API_KEY trong file .env.local.";
      }
      
      return `Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi: ${error.error?.message || "Unknown error"}. Vui lòng thử lại sau hoặc liên hệ admin.`;
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Xin lỗi, không thể tạo phản hồi.";
  } catch (error) {
    console.error("OpenAI API call error:", error);
    return "Xin lỗi, có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get session
    const session = await getServerSession(authOptions);

    // Detect intent
    const intent = detectIntent(message);

    // Fetch internal data if needed
    const internalContext = await fetchInternalData(intent, session);

    // Build messages for LLM
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add context if available
    if (internalContext) {
      messages.push({
        role: "system",
        content: `DỮ LIỆU NỘI BỘ TỪ HỆ THỐNG PARTHUB:\n\n${internalContext}\n\nHãy sử dụng dữ liệu này để trả lời câu hỏi của người dùng một cách chính xác.`,
      });
    }

    // Add user message
    messages.push({ role: "user", content: message });

    // Call OpenAI
    const reply = await callOpenAI(messages);

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Đã xảy ra lỗi khi xử lý câu hỏi",
        reply: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}

