import { createSession } from "@/lib/auth";
import {
  normalizeEmail,
  validDisplayName,
  validEmail,
  validPassword,
} from "@/lib/auth-validation";
import { hashPassword } from "@/lib/password";
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
    return Response.json({ error: "请填写完整的注册信息。" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const email = normalizeEmail(input.email);
  const displayName =
    typeof input.displayName === "string" ? input.displayName.trim() : "";

  if (!validDisplayName(displayName)) {
    return Response.json({ error: "显示名称应为 2–50 个字符。" }, { status: 400 });
  }
  if (!validEmail(email)) {
    return Response.json({ error: "请输入有效的邮箱地址。" }, { status: 400 });
  }
  if (!validPassword(input.password)) {
    return Response.json({ error: "密码必须为 10–128 个字符。" }, { status: 400 });
  }

  try {
    const prisma = getPrismaClient();
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return Response.json({ error: "该邮箱已注册。" }, { status: 409 });
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: { displayName, email, passwordHash },
      select: { id: true, displayName: true, email: true, createdAt: true },
    });

    await createSession(user.id);
    return Response.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error", error);
    return Response.json({ error: "注册服务暂时不可用。" }, { status: 500 });
  }
}
