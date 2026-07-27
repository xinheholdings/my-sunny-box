import { requireAdminApi } from "@/lib/admin";
import { getAdminUserDetails } from "@/lib/admin-data";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorization = await requireAdminApi();
  if (authorization.response) return authorization.response;

  try {
    const { id } = await params;
    const user = await getAdminUserDetails(id);
    if (!user) {
      return Response.json({ error: "用户不存在。" }, { status: 404 });
    }
    return Response.json({ user });
  } catch (error) {
    console.error("Admin user detail API error", error);
    return Response.json({ error: "无法读取用户详情。" }, { status: 500 });
  }
}
