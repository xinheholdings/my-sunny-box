import { getCurrentUser, publicUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "未登录。" }, { status: 401 });
    }
    return Response.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Current user error", error);
    return Response.json({ error: "无法读取账户信息。" }, { status: 500 });
  }
}
