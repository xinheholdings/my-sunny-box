"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./pricing.module.css";

export default function UpgradeButton({ isPro }: { isPro: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function upgrade() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (!response.ok || !data.url) {
        throw new Error(data.error || "无法创建支付页面。");
      }

      window.location.assign(data.url);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "支付服务暂时不可用。",
      );
      setLoading(false);
    }
  }

  return (
    <div className={styles.upgradeArea}>
      <button
        className={styles.upgradeButton}
        disabled={isPro || loading}
        onClick={upgrade}
        type="button"
      >
        {isPro ? "当前套餐" : loading ? "正在连接 Stripe…" : "Upgrade"}
      </button>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
