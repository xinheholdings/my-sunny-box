import { handleApiError } from "@/lib/api-error";
import { getPrismaClient } from "@/lib/prisma";

export const runtime = "nodejs";

type ProductRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: ProductRouteContext) {
  const { id } = await context.params;

  if (!id.trim()) {
    return Response.json({ error: "Product id is required" }, { status: 400 });
  }

  try {
    const product = await getPrismaClient().product.findUnique({
      where: { id },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ product });
  } catch (error) {
    return handleApiError(error, "Product");
  }
}

export async function DELETE(_request: Request, context: ProductRouteContext) {
  const { id } = await context.params;

  if (!id.trim()) {
    return Response.json({ error: "Product id is required" }, { status: 400 });
  }

  try {
    await getPrismaClient().product.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error, "Product");
  }
}
