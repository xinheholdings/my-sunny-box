import { requireAdminApi } from "@/lib/admin";
import { getAdminDashboardData } from "@/lib/admin-data";

export const runtime = "nodejs";

export async function GET() {
  const authorization = await requireAdminApi();
  if (authorization.response) return authorization.response;

  try {
    return Response.json(await getAdminDashboardData());
  } catch (error) {
    console.error("Admin users API error", error);
    return Response.json({ error: "无法读取用户列表。" }, { status: 500 });
  }
}
