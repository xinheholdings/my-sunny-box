import "server-only";

import { getCurrentAdmin } from "@/lib/auth";

export async function requireAdminApi() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      admin: null,
      response: Response.json({ error: "管理员权限不足。" }, { status: 403 }),
    } as const;
  }

  return { admin, response: null } as const;
}
