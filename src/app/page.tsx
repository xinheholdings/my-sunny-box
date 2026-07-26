import { Suspense } from "react";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/app/components/ProductGrid";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream text-ink">
      <header className="relative z-20 mx-auto flex h-20 w-[min(1120px,calc(100%-40px))] items-center justify-between border-b border-ink/10">
        <a className="flex items-center gap-3 text-lg font-semibold tracking-[-0.03em]" href="#home">
          <span className="grid size-9 place-items-center rounded-xl bg-sunshine shadow-[0_8px_24px_rgba(255,217,90,.35)]">☀</span>
          My Sunny Box
        </a>
        <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm text-ink/65 sm:gap-8">
          <a className="transition-colors hover:text-ink" href="#home">Home</a>
          <a className="transition-colors hover:text-ink" href="#about">About</a>
          <a className="transition-colors hover:text-ink" href="#contact">Contact</a>
        </nav>
      </header>

      <section className="relative mx-auto grid min-h-[680px] w-[min(1120px,calc(100%-40px))] items-center gap-16 py-24 lg:grid-cols-[1.2fr_.8fr]" id="home">
        <div className="relative z-10">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-leaf">Little finds · Brighter days</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-0.065em] sm:text-7xl lg:text-[86px]">
            Brighten Your <span className="relative whitespace-nowrap">Everyday Life<span className="absolute -bottom-2 left-0 -z-10 h-4 w-full rounded-full bg-sunshine/80" /></span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-ink/60 sm:text-xl">
            A simple way to discover products that bring joy and convenience.
          </p>
          <a className="mt-10 inline-flex items-center gap-4 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(23,33,27,.18)] transition hover:-translate-y-1 hover:bg-leaf" href="#products">
            Explore <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[430px]" aria-hidden="true">
          <div className="absolute inset-[8%] rotate-6 rounded-[34%_66%_58%_42%/46%_38%_62%_54%] bg-sunshine" />
          <div className="absolute inset-[20%] -rotate-6 rounded-[32px] border border-white/60 bg-white/60 shadow-[0_30px_80px_rgba(46,107,79,.12)] backdrop-blur-xl" />
          <div className="absolute inset-[32%] grid place-items-center rounded-full bg-leaf text-6xl shadow-2xl">☀</div>
          <span className="absolute left-[4%] top-[24%] size-5 rounded-full bg-[#8ebca0]" />
          <span className="absolute bottom-[12%] right-[6%] size-8 rounded-full border-2 border-ink/20" />
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32" id="products">
        <div className="mx-auto w-[min(1120px,calc(100%-40px))]">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-leaf">Curated for you</p>
              <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Everyday favorites</h2>
            </div>
            <p className="max-w-sm leading-7 text-ink/55">A growing collection of simple products chosen for usefulness, beauty, and everyday delight.</p>
          </div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
          </Suspense>
        </div>
      </section>

      <section className="py-24 sm:py-32" id="about">
        <div className="mx-auto grid w-[min(1120px,calc(100%-40px))] gap-12 rounded-[36px] bg-leaf px-7 py-16 text-white sm:px-16 lg:grid-cols-2 lg:items-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sunshine">About My Sunny Box</p>
          <div>
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">Good things make good days.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              My Sunny Box is a platform for exploring thoughtful lifestyle products. We look for useful, delightful finds that make everyday routines easier and a little more joyful.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 text-center sm:py-32" id="contact">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">Say hello</p>
        <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Let&apos;s make everyday life brighter.</h2>
        <a className="mt-8 inline-block border-b border-ink/30 pb-1 text-lg font-medium transition hover:border-leaf hover:text-leaf" href="mailto:info@mysunnybox.com">
          info@mysunnybox.com
        </a>
      </section>

      <footer className="mx-auto flex w-[min(1120px,calc(100%-40px))] flex-col gap-3 border-t border-ink/10 py-8 text-sm text-ink/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 My Sunny Box</p>
        <p>Thoughtful finds for brighter days.</p>
      </footer>
    </main>
  );
}
