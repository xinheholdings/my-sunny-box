import { createSession } from "@/lib/auth";
import { normalizeEmail, validEmail } from "@/lib/auth-validation";
import { verifyPassword } from "@/lib/password";
import { getPrismaClient } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求内容必须是有效的 JSON。" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "请输入邮箱和密码。" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const email = normalizeEmail(input.email);
  const password = typeof input.password === "string" ? input.password : "";
  if (!validEmail(email) || !password || password.length > 128) {
    return Response.json({ error: "请输入有效的邮箱和密码。" }, { status: 400 });
  }

  try {
    const user = await getPrismaClient().user.findUnique({
      where: { email },
      select: { id: true, email: true, displayName: true, passwordHash: true },
    });

    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return Response.json({ error: "邮箱或密码错误。" }, { status: 401 });
    }

    await createSession(user.id);
    return Response.json({
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });
  } catch (error) {
    console.error("Login error", error);
    return Response.json({ error: "登录服务暂时不可用。" }, { status: 500 });
  }
}
