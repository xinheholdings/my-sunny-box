import { createChatResponse, type ChatMessage } from "../../lib/openai";
import { getCurrentUser } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as Partial<ChatMessage>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求内容必须是有效的 JSON。" }, { status: 400 });
  }

  const messages =
    body && typeof body === "object" && "messages" in body
      ? (body as { messages?: unknown }).messages
      : null;

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES ||
    !messages.every(isChatMessage) ||
    messages.at(-1)?.role !== "user"
  ) {
    return Response.json(
      { error: "请提供 1–20 条有效消息，且最后一条必须来自用户。" },
      { status: 400 },
    );
  }

  try {
    const result = await createChatResponse(messages);

    const user = await getCurrentUser();
    if (user) {
      const latestUserMessage = messages.at(-1)!;
      await getPrismaClient().$transaction([
        getPrismaClient().chatMessage.create({
          data: {
            userId: user.id,
            role: "user",
            content: latestUserMessage.content,
          },
        }),
        getPrismaClient().chatMessage.create({
          data: {
            userId: user.id,
            role: "assistant",
            content: result.text,
          },
        }),
        getPrismaClient().user.update({
          where: { id: user.id },
          data: { usageCount: { increment: 1 } },
        }),
      ]);
    }

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "OPENAI_API_KEY_MISSING") {
      return Response.json(
        { error: "AI 服务尚未配置 OPENAI_API_KEY。" },
        { status: 503 },
      );
    }

    console.error("Chat API error:", message);
    return Response.json(
      { error: "AI 服务暂时无法响应，请稍后再试。" },
      { status: 502 },
    );
  }
}
