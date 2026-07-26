import { handleApiError } from "@/lib/api-error";
import { getPrismaClient } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await getPrismaClient().product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ products });
  } catch (error) {
    return handleApiError(error, "Product");
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Request body must be an object" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";
  const image = typeof input.image === "string" ? input.image.trim() : "";
  const category =
    typeof input.category === "string" ? input.category.trim() : "";
  const price = normalizePrice(input.price);
  const stock = normalizeStock(input.stock);

  if (!name || name.length > 120) {
    return Response.json(
      { error: "Name is required and must not exceed 120 characters" },
      { status: 400 },
    );
  }

  if (!description || description.length > 2000) {
    return Response.json(
      { error: "Description is required and must not exceed 2000 characters" },
      { status: 400 },
    );
  }

  if (!price) {
    return Response.json(
      { error: "Price must be a positive number with no more than 2 decimal places" },
      { status: 400 },
    );
  }

  if (!image || image.length > 2048) {
    return Response.json(
      { error: "Image URL is required and must not exceed 2048 characters" },
      { status: 400 },
    );
  }

  if (!category || category.length > 80) {
    return Response.json(
      { error: "Category is required and must not exceed 80 characters" },
      { status: 400 },
    );
  }

  if (stock === null) {
    return Response.json(
      { error: "Stock must be a non-negative integer" },
      { status: 400 },
    );
  }

  try {
    const product = await getPrismaClient().product.create({
      data: { name, price, description, image, category, stock },
    });

    return Response.json({ product }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Product");
  }
}

function normalizePrice(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return null;

  const price = String(value).trim();
  if (!/^\d{1,8}(?:\.\d{1,2})?$/.test(price) || Number(price) <= 0) {
    return null;
  }

  return price;
}

function normalizeStock(value: unknown) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    return null;
  }

  return value;
}
