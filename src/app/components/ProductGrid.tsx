import { connection } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function ProductGrid() {
  await connection();
  const result = await loadProducts();

  if ("error" in result) {
    return (
      <div
        className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-16 text-center"
        role="alert"
      >
        <p className="text-lg font-semibold text-red-900">
          Products are temporarily unavailable.
        </p>
        <p className="mt-2 text-sm text-red-700">
          Please refresh the page or try again shortly.
        </p>
      </div>
    );
  }

  const products = result.products;

  if (products.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-ink/20 bg-cream px-6 py-20 text-center">
        <p className="text-lg font-medium text-ink/65">No products yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article
          className="group overflow-hidden rounded-[28px] border border-ink/10 bg-cream p-4 transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(23,33,27,.1)]"
          key={product.id}
        >
          <div
            aria-label={`${product.name} product image`}
            className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#e8f4ec] bg-cover bg-center"
            role="img"
            style={
              product.image
                ? {
                    backgroundImage: `linear-gradient(rgba(23,33,27,.03), rgba(23,33,27,.08)), url("${encodeURI(product.image)}")`,
                  }
                : undefined
            }
          >
            <span className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.14em] text-ink/65 backdrop-blur">
              {product.category}
            </span>
          </div>

          <div className="p-4 pb-3 pt-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold tracking-[-0.03em]">
                {product.name}
              </h3>
              <p className="whitespace-nowrap text-lg font-semibold text-leaf">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/55">
              {product.description}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-xs">
              <span className="uppercase tracking-[.14em] text-ink/45">
                {product.category}
              </span>
              <span
                className={
                  product.stock > 0
                    ? "font-semibold text-leaf"
                    : "font-semibold text-red-600"
                }
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

async function loadProducts() {
  try {
    const products = await getPrismaClient().product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { products };
  } catch (error) {
    console.error("Failed to load homepage products", error);
    return { error: true as const };
  }
}

export function ProductGridSkeleton() {
  return (
    <div aria-label="Loading products" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          className="animate-pulse rounded-[28px] border border-ink/5 bg-cream p-4"
          key={index}
        >
          <div className="aspect-[4/3] rounded-[20px] bg-ink/5" />
          <div className="space-y-3 p-4 pt-6">
            <div className="h-5 w-2/3 rounded bg-ink/10" />
            <div className="h-4 w-full rounded bg-ink/5" />
            <div className="h-4 w-1/2 rounded bg-ink/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
