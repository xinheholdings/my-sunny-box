import { deleteCurrentSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await deleteCurrentSession();
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Logout error", error);
    return Response.json({ error: "退出登录失败。" }, { status: 500 });
  }
}
