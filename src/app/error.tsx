"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5 text-center text-ink">
      <div className="max-w-lg rounded-[32px] border border-ink/10 bg-white p-10 shadow-[0_24px_70px_rgba(23,33,27,.08)]">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-sunshine text-xl">
          ☀
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
          Something went wrong.
        </h1>
        <p className="mt-3 leading-7 text-ink/55">
          We could not load My Sunny Box. Please try again.
        </p>
        <button
          className="mt-7 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-leaf"
          onClick={() => unstable_retry()}
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
